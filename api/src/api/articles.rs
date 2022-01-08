use std::convert::TryFrom;
use std::path::Path;

use chrono::Utc;
use diesel::QueryResult;
use rocket::{get, post, State};
use rocket::serde::json::json;
use serde_json::Value;

use crate::Cache;
use crate::config::AppConfig;
use crate::database::DbConn;
use crate::git;
use crate::models::article_models::*;
use crate::models::user_models::UserModel;
use crate::responses::{APIResponse, bad_request, conflict, created, internal_server_error, not_found, ok, unauthorized, unprocessable_entity};
use crate::webhooks::DiscordWebhook;
use crate::utils::print_error;
use crate::git::display_commit_by_oid;

#[get("/all-articles")]
pub async fn get_articles(_user: &UserModel, db: DbConn) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }
    let results = db.run(|c| ArticleModel::all(c)).await?;
    Ok(ok().data(json!(results)))
}

#[get("/public-articles")]
pub async fn public_articles(db: DbConn) -> Result<APIResponse, APIResponse> {
    let results = db.run(|c| ArticleModel::public_articles(c)).await?;
    Ok(ok().data(json!(results)))
}

#[get("/featured-articles")]
pub async fn featured_articles(db: DbConn) -> Result<APIResponse, APIResponse> {
    let results = db.run(|c| ArticleModel::featured_articles(c)).await?;
    Ok(ok().data(json!(&results)))
}

#[get("/article/<_urn_title>")]
pub async fn get_article(
    db: DbConn,
    _urn_title: String,
    cache: &State<Cache>,
    app_config: &State<AppConfig>
) -> Result<APIResponse, APIResponse> {
    let (article, _urn_title): (Result<ArticleModel, diesel::result::Error>, String) = db.run(move |c| {
        let article = ArticleModel::find_public(&_urn_title, c);
        (article, _urn_title)
    }).await;
    return match article {
        Ok(result) => {
            result.send_article(&_urn_title, &cache, &app_config.repo_path)
        }

        Err(diesel::result::Error::NotFound) => {
            //if can not find the article by the title in the database check the redirects
            let (article, _urn_title): (QueryResult<RedirectModel>, String) = db.run(move |c| {
                let article = RedirectModel::find(&_urn_title, c);
                (article, _urn_title)
            }).await;
            match article {
                Err(_) => return Ok(not_found().message("Could not find this article")),
                Ok(article) => {
                    let found_article: Result<ArticleModel, diesel::result::Error> = db.run(move |c| {
                        ArticleModel::find_by_id(&article.article_id, c)
                    }).await;
                    match found_article {
                        Ok(article) => article.send_article(&article.urn_title, cache, &app_config.repo_path),
                        Err(_) => Ok(not_found().message(&*format!("Sorry we could not find {}", _urn_title)))
                    }
                }
            }
        }
        Err(_) => Ok(internal_server_error().message("Something went wrong"))
    };
}

#[get("/search/<search_term>")]
pub async fn search(db: DbConn, search_term: String) -> Result<APIResponse, APIResponse> {
    let searched = db.run(move |c| Articles::search(c, &*search_term)).await;
    Ok(created().data(json!(searched)))
}

#[post("/new-article", data = "<body>", format = "application/json")]
pub async fn new_article(
    db: DbConn,
    body: Result<NewArticle, Value>,
    _user: &UserModel,
    cache: &State<Cache>,
    app_config: &State<AppConfig>,
) -> Result<APIResponse, APIResponse> {
    let repo = app_config.repo.clone();
    let article_data = body.map_err(unprocessable_entity)?;
    let new_article = WriteArticle::new(article_data);
    let (created_db_article, new_article): (Result<ArticleModel, diesel::result::Error>, WriteArticle) =
        db.run(move |c| {
            let created_db_article = new_article.db.create(c);
            (created_db_article, new_article)
        }).await;

    return match created_db_article {
        Ok(_) => {
            match new_article.write_file(&*app_config.repo_path, cache) {
                Ok(file_name) => {
                    match git::add_and_commit(repo, &*file_name, &*_user.username, "created article", &*new_article.db.title) {
                        Ok(oid) => display_commit_by_oid(app_config.repo.clone(), oid)?,
                        Err(_) => {
                            print_error(format!("Failed to add {:?} to the vcs", &*file_name));
                            return Ok(internal_server_error().message("Failed to add file to vcs"));
                        }
                    };
                    Ok(created().data(json!(new_article)))
                }
                Err(e) => Ok(bad_request().data(json!(e.to_string())))
            }
        }
        Err(diesel::result::Error::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _, )) => {
            return Ok(conflict().data(json!("This article already exists!")));
        }
        Err(_) => return Ok(internal_server_error().data(json!("Something has gone while editing the article"))),
    };
}

#[post("/edit-article/<_urn_title>", data = "<body>", format = "application/json")]
pub async fn edit_article(
    db: DbConn,
    body: Result<EditArticle, Value>,
    _urn_title: String,
    _user: &UserModel,
    cache: &State<Cache>,
    app_config: &State<AppConfig>,
) -> Result<APIResponse, APIResponse> {
    let article_data = body.map_err(unprocessable_entity)?;

    // Checking to make sure that the article both exists and that the edit count is valid
    let (article_query, _urn_title): (Result<ArticleModel, diesel::result::Error>, String) = db.run(move |c| {
        let article = ArticleModel::find(&_urn_title, c);
        (article, _urn_title)
    }).await;

    match article_query {
        Ok(article) => {
            // Check if the edit count is outdated, else do nothing
            if article.edit_count != article_data.edit_count {
                return Ok(bad_request().data(json!("This article has been edited while you were editing it! Salvage your work and retry")));
            }
        }
        // If we can not find the article title in the database check the redirects,
        // encase someone changed the title while someone else was editing
        Err(diesel::NotFound) => {
            let redirect_query: QueryResult<RedirectModel> = db.run(move |c| {
                RedirectModel::find(&_urn_title, c)
            }).await;

            return match redirect_query {
                // Found the article in the redirect
                Ok(article) => {
                    let article: ArticleModel = (db.run(move |c| find_article_by_id(article.id, c)).await)?;
                    if article.edit_count != article_data.edit_count {
                        // Tell the user that the articles body was edited as well as the title was changed
                        Ok(bad_request().message(&*format!("This article has been edited while you were editing it! The name of this article also changed while you were editing it. The new name is {} or {}.", article.title, article.urn_title)))
                    } else {
                        // Tell the user that JUST the title of the article has changed while they were editing it
                        Ok(bad_request().message(&*format!("The title of this article has changed. The new name is {} or {}.", article.title, article.urn_title)))
                    }
                }
                // Cannot find the article in the redirect and the article database
                Err(_) => Ok(internal_server_error().data(json!("We could not find this article title anywhere."))),
            };
        }
        _ => return Ok(internal_server_error().message("Could not process this request"))
    };
    // Now we know the edit count and the name are good we can move on
    let valid_article = WriteEditArticle {
        db: EditDBArticle {
            urn_title: article_data.title.to_lowercase().replace(" ", "_"),
            title: article_data.title,
            description: article_data.description,
            tags: article_data.tags,
            edit_count: article_data.edit_count + 1,
            last_edited: Utc::now().naive_utc(),
        },
        body: Value::from(match Value::try_from(article_data.body.clone()) {
            Ok(body) => body,
            Err(_) => return Ok(internal_server_error().message("Something went wrong reading the article"))
        }),
    };

    // Handle title change
    if !(valid_article.db.urn_title.eq(&_urn_title)) {
        let title = _urn_title.clone();
        let (id, title, check_redirect): (i32, String, QueryResult<RedirectModel>) = db.run(move |c| {
            // Check if there are any redirects in the redirect table that have the same title as the new submitted one
            let check_redirect = RedirectModel::find(&title, c);
            // Find the id of the article that was changed so that we can link it in the redirect table
            let id = ArticleModel::find(&title, c).unwrap().id;
            (id, title, check_redirect)
        }).await;
        // Check if the redirect was a unique violation
        if let Err(diesel::result::Error::DatabaseError(diesel::result::DatabaseErrorKind::UniqueViolation, _, )) = check_redirect {
            return Ok(conflict().data(json!("This article already exists!")));
        }

        // Now that we know that the article title isn't already in the redirect table and we have the id
        // according to the old title we can create a new redirect and create it inside the table
        db.run(move |c| {
            NewRedirect {
                article_id: id,
                old_title: title,
            }.create(c).unwrap();
        }).await;
    }

    let (edited_row, valid_article, _urn_title): (QueryResult<ArticleModel>, WriteEditArticle, String) = db.run(move |c| {
        let updated_row = valid_article.db.update(&_urn_title, c);
        (updated_row, valid_article, _urn_title)
    }).await;


    let article = match edited_row {
        Ok(metadata) => metadata,
        Err(_) => return Ok(internal_server_error().data(json!("Something has gone while editing the article"))),
    };

    return match valid_article.write_edit_file(&*app_config.repo_path, _urn_title, cache) {
        Ok(file_name) => {
            match git::add_and_commit(app_config.repo.clone(), Path::new(&file_name), &*_user.username, &article_data.message, &valid_article.db.title) {
                Ok(c) => display_commit_by_oid(app_config.repo.clone(), c)?,
                Err(_) => {
                    print_error(format!("Failed to add {:?} to the vcs", file_name));
                    return Ok(internal_server_error().message("Failed to add file to vcs"));
                }
            };
            Ok(ok().data(json!(article)))
        }
        Err(e) => Ok(bad_request().data(json!(e.to_string())))
    };
}

#[post("/publicize/<_id>")]
pub async fn publicize_article(_user: &UserModel, db: DbConn, _id: i32) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }
    let publicized_row = (db.run(move |c| ArticleModel::publicize(_id, c)).await)?;
    Ok(ok().data(json!(publicized_row)))
}

#[post("/feature/<_id>")]
pub async fn feature_article(_user: &UserModel, db: DbConn, _id: i32) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }
    let featured_row: ArticleModel = (db.run(move |c| ArticleModel::feature(_id, c)).await)?;
    // Only send the webhook if the article was featured, not if it was being unfeatured
    if featured_row.featured {
        DiscordWebhook::featured_article(_user, featured_row).await;
        Ok(ok().message("Article was featured"))
    } else {
        Ok(ok().message("Article was removed from the featured articles"))
    }
}

#[post("/remove/<_id>")]
pub async fn remove_article(_user: &UserModel, db: DbConn, _id: i32) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }
    let removed_row = (db.run(move |c| ArticleModel::remove(_id, c)).await)?;
    Ok(ok().data(json!(removed_row)))
}
