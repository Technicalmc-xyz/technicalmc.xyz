use diesel::{
    self,
    prelude::*,
    RunQueryDsl,
    QueryDsl,
    pg::Pg,
    update,
    expression::dsl::not
};
use rocket::State;
use rocket::serde::json::{Value, json};
use serde::{Deserialize, Serialize};
use chrono::{NaiveDateTime};
use termion::color;

use std::fmt;
use std::fs::{File, OpenOptions, read_to_string};
use std::path::{Path};
use std::io::{Write, Error};

use crate::Cache;
use crate::schema::articles;
use crate::schema::articles::dsl::*;
use crate::schema::articles::dsl::id as article_id;
use crate::schema::redirects;
use crate::schema::redirects::dsl::*;
use crate::responses::{APIResponse, ok, internal_server_error};

#[derive(Serialize, Deserialize)]
pub struct Articles(pub Vec<ArticleModel>);

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, AsChangeset, Associations)]
#[table_name = "articles"]
pub struct ArticleModel {
    pub id: i32,
    pub urn_title: String,
    pub title: String,
    pub tags: Vec<String>,
    pub description: String,
    pub edit_count: i32,
    pub last_edited: NaiveDateTime,
    pub status: bool,
    pub publicized: bool,
    pub featured: bool,
}

type ArticleColumns = (
    articles::id,
    articles::urn_title,
    articles::title,
    articles::tags,
    articles::description,
    articles::edit_count,
    articles::last_edited,
    articles::status,
    articles::publicized,
    articles::featured
);

pub const ARTICLE_COLUMNS: ArticleColumns = (
    articles::id,
    articles::urn_title,
    articles::title,
    articles::tags,
    articles::description,
    articles::edit_count,
    articles::last_edited,
    articles::status,
    articles::publicized,
    articles::featured
);

// POST request struct that is made to the server
#[derive(Deserialize, Debug, Serialize)]
pub struct NewArticle {
    pub title: String,
    pub description: String,
    pub tags: Vec<String>,
    pub body: Value,
}

// Struct used to write to the database and file system
#[derive(Deserialize, Debug, Serialize)]
pub struct WriteArticle {
    #[serde(flatten)]
    pub db: NewDBArticle,
    pub body: Value,
}

// Struct that is inserted in the database
#[derive(Insertable, Debug, Deserialize, Serialize)]
#[table_name = "articles"]
pub struct NewDBArticle {
    pub urn_title: String,
    pub title: String,
    pub tags: Vec<String>,
    pub description: String,
}

// Edited article JSON struct that is POSTd
#[derive(Deserialize, Debug, Serialize)]
pub struct EditArticle {
    pub title: String,
    pub description: String,
    pub tags: Vec<String>,
    pub edit_count: i32,
    pub message: String,
    pub body: Value,
}

// Struct that is inserted in the database
#[derive(AsChangeset, Debug, Deserialize, Serialize)]
#[table_name = "articles"]
pub struct EditDBArticle {
    pub urn_title: String,
    pub title: String,
    pub description: String,
    pub tags: Vec<String>,
    pub edit_count: i32,
    pub last_edited: NaiveDateTime,
}

// Struct used to write to the database and file system
#[derive(Deserialize, Debug, Serialize)]
pub struct WriteEditArticle {
    #[serde(flatten)]
    pub db: EditDBArticle,
    pub body: Value,
}

#[derive(Identifiable, Queryable, Insertable, Deserialize, Serialize, Debug, Associations)]
#[belongs_to(ArticleModel foreign_key = "id")]
#[table_name = "redirects"]
pub struct RedirectModel {
    pub id: i32,
    pub article_id: i32,
    pub old_title: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[table_name = "redirects"]
pub struct NewRedirect {
    pub article_id: i32,
    pub old_title: String,
}

pub fn find_article_by_id(_id: i32, conn: &PgConnection) -> QueryResult<ArticleModel>{
    articles
        .find(_id)
        .select(ARTICLE_COLUMNS)
        .first(conn)
}
impl RedirectModel {
    pub fn find(_urn_title: &String, conn: &PgConnection) -> QueryResult<RedirectModel> {
        redirects
            .filter(old_title.eq(_urn_title))
            .first(conn)
    }
}

impl NewRedirect {
    pub fn create(&self, conn: &PgConnection) -> QueryResult<RedirectModel> {
        diesel::insert_into(redirects)
            .values(self)
            .get_result::<RedirectModel>(conn)
    }
}

impl ArticleModel {
    /// Find any article
    /// This should be a protected route
    pub fn find(_urn_title: &String, conn: &PgConnection) -> QueryResult<ArticleModel> {
        articles
            .select(ARTICLE_COLUMNS)
            .filter(urn_title.eq(_urn_title))
            .first(conn)
    }
    pub fn find_by_id(_id: &i32, conn: &PgConnection) -> Result<ArticleModel, diesel::result::Error> {
        articles
            .select(ARTICLE_COLUMNS)
            .filter(article_id.eq(_id))
            .first(conn)
    }
    /// Find a public article
    pub fn find_public(_urn_title: &String, conn: &PgConnection) -> Result<ArticleModel, diesel::result::Error> {
        articles
            .select(ARTICLE_COLUMNS)
            .filter(urn_title.eq(_urn_title))
            .filter(publicized.eq(true))
            .first(conn)
    }
    /// Get all articles
    /// This should be a protected route
    pub fn all(conn: &PgConnection) -> QueryResult<Vec<ArticleModel>> {
        articles
            .select(ARTICLE_COLUMNS)
            .order(ARTICLE_COLUMNS.0.asc())
            .load::<ArticleModel>(conn)
    }
    /// Find all public articles
    pub fn public_articles(conn: &PgConnection) -> QueryResult<Vec<ArticleModel>> {
        articles
            .filter(publicized.eq(true))
            .select(ARTICLE_COLUMNS)
            .load::<ArticleModel>(conn)
    }
    /// Find the first five featured articles
    pub fn featured_articles(conn: &PgConnection) -> QueryResult<Vec<ArticleModel>> {
        articles
            .filter(featured.eq(true))
            .limit(5)
            .select(ARTICLE_COLUMNS)
            .load::<ArticleModel>(conn)
    }
    /// Make an article the opposite featured status of what it is.
    pub fn feature(_id: i32, conn: &PgConnection) -> QueryResult<ArticleModel> {
        update(articles.find(_id))
            .set(featured.eq(not(featured)))
            .returning(ARTICLE_COLUMNS)
            .get_result::<ArticleModel>(conn)
    }
    /// Make an article the opposite public status of what it is.
    pub fn publicize(_id: i32, conn: &PgConnection) -> QueryResult<ArticleModel> {
        update(articles.find(_id))
            .set(publicized.eq(not(publicized)))
            .returning(ARTICLE_COLUMNS)
            .get_result::<ArticleModel>(conn)
    }
    /// Remove an article
    pub fn remove(_id: i32, conn: &PgConnection) -> QueryResult<()> {
        use crate::schema::articles::dsl;
        diesel::delete(dsl::articles.find(_id)).execute(conn)?;
        Ok(())
    }
    /// Send an article
    pub fn send_article(&self, _urn_title: &String, cache: &State<Cache>) -> Result<APIResponse, APIResponse>{
        let path_name = format!("articles/{}.json", &_urn_title);
        let contents: Option<Value>;
        let mut cached_articles = cache.lock().expect("Couldn't opened locked cache");
        // Try and get the cached article, if it doesnt exist read from the file and then add to cache
        if cached_articles.contains_key(&*_urn_title) {
            contents = match cached_articles.get(&*_urn_title) {
                Some(article) => Some(article.to_owned()),
                _ => None
            };
            println!("{}Read article from cache!", color::Fg(color::Blue));
        } else {
            contents = match serde_json::from_str(&*match read_to_string(path_name) {
                Ok(x) => x,
                Err(_) => return Ok(internal_server_error().message("Could not read the article from the file"))
            }) {
                Ok(x) => x,
                Err(_) => return Ok(internal_server_error().message("The body of the article may be corrupt"))
            };
            cached_articles.insert(String::from(_urn_title), contents.clone().unwrap());
            println!("{}Read article from file!", color::Fg(color::Yellow));
        }
        Ok(ok().data(json!({
                "urn_title": _urn_title,
                "id": self.id,
                "title": self.title,
                "tags": self.tags,
                "description": self.description,
                "last_edited": self.last_edited,
                "edit_count": self.edit_count,
                "publicized": self.publicized,
                "featured": self.featured,
                "body": contents,
            })))
    }
}

impl Articles {
    pub fn search(conn: &PgConnection, search: &str) -> Self {
        use diesel_full_text_search::{plainto_tsquery, TsVectorExtensions};

        let mut query = articles::table.into_boxed::<Pg>();

        if !search.is_empty() {
            query = query
                .filter(text_searchable_article_col.matches(plainto_tsquery(search)));
        }

        let result = query
            .select(ARTICLE_COLUMNS)
            .filter(publicized.eq(true))
            .limit(10)
            .load::<ArticleModel>(conn)
            .expect("Error loading articles");

        Articles(result)
    }
}

impl NewDBArticle {
    /// Create a new entry for a article in the database
    pub fn create(&self, conn: &PgConnection) -> QueryResult<ArticleModel> {
        diesel::insert_into(articles)
            .values(self)
            .returning(ARTICLE_COLUMNS)
            .get_result::<ArticleModel>(conn)
    }
}

impl WriteArticle {
    /// Write to a file for a new article
    pub fn write_file(&self, cache: &State<Cache>) -> Result<String, Error> {
        let file_name = format!("{}.json", self.db.urn_title.to_lowercase().replace(" ", "_"));
        let path_name = format!("articles/{}", &file_name);
        let path = Path::new(&path_name);
        let display = path.display();

        let mut file = match File::create(&path) {
            Err(why) => panic!("couldn't create {}: {}", display, why),
            Ok(file) => file,
        };

        let mut cached_articles = cache.lock().expect("Lock shared data");
        cached_articles.insert(self.db.urn_title.clone(), self.body.to_owned());
        match file.write_all(&serde_json::to_vec(&self.body).unwrap()) {
            Ok(_) => Ok(file_name),
            Err(e) => Err(e)
        }
    }
}

impl EditDBArticle {
    /// Update the contents of a database entry
    pub fn update(&self, _urn_title: &String, conn: &PgConnection) -> QueryResult<ArticleModel> {
        let row: QueryResult<ArticleModel> = diesel::update(articles.filter(urn_title.eq(_urn_title)))
            .set(self)
            .returning(ARTICLE_COLUMNS)
            .get_result::<ArticleModel>(conn);

        return row;
    }
}

impl WriteEditArticle {
    /// Update the body contents of a article
    pub fn write_edit_file(&self, default_urn_title: String, cache: &State<Cache>) -> Result<String, std::io::Error> {
        // Check if the title changed
        let path_name: String;
        let file_name: String;
        if default_urn_title.eq(&self.db.urn_title) {
            file_name = format!("{}.json", default_urn_title);
            path_name = format!("articles/{}", file_name);
        } else {
            file_name = format!("{}.json", &self.db.urn_title);
            std::fs::rename(format!("articles/{}.json", default_urn_title), format!("articles/{}", file_name))?;
            path_name = format!("articles/{}", file_name);
        }

        let mut file = OpenOptions::new()
            .read(true)
            .write(true)
            .open(Path::new(&path_name))
            .unwrap();

        let mut cached_articles = cache.lock().expect("Couldn't lock the cache");
        // Check if the article is in the cache and update it, otherwise add it to the cache. Then write file
        if cached_articles.contains_key(&*default_urn_title) {
            cached_articles.remove(&*default_urn_title);
            cached_articles.insert(String::from(self.db.urn_title.to_owned()), self.body.to_owned());
            file.write_all(&serde_json::to_vec(&self.body)?)?;
        } else {
            cached_articles.insert(String::from(self.db.urn_title.to_owned()), self.body.to_owned());
            file.write_all(&serde_json::to_vec(&self.body)?)?;
        }
        Ok(file_name)
    }
}

impl fmt::Display for ArticleModel {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Title {}\nDescription: {}", self.title, self.description)
    }
}

