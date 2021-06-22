use rocket::{get, post};
use crate::models::user_models::UserModel;
use crate::responses::{APIResponse, internal_server_error, ok, unauthorized};
use diesel::QueryResult;
use crate::database::DbConn;
use diesel::result::Error;
use serde_json::json;
#[get("/@me")]
pub async fn whoami(user: &UserModel) -> Result<APIResponse, APIResponse> {
    Ok(ok().data(json!(user)))
}

#[get("/<user>")]
pub async fn user_profile(db: DbConn, user: String) -> Result<APIResponse, APIResponse> {
    let user_q: QueryResult<UserModel> = db.run(|c| UserModel::find_by_id(user, c)).await;
    match user_q {
        Ok(user) => Ok(ok().data(json!(user))),
        Err(_) => Ok(internal_server_error())
    }
}

#[get("/all")]
pub async fn all_users(_user: &UserModel, db: DbConn) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }
    let users: Result<Vec<UserModel>, Error> = db.run(|c| UserModel::all_users( c)).await;
    match users {
        Ok(users) => Ok(ok().data(json!(users))),
        Err(_) => Ok(internal_server_error())
    }
}

#[post("/modify/<_user_id>/<_rank>")]
pub async fn change_userrank(_user: &UserModel, db: DbConn, _user_id: String, _rank: i32) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }
    let rank_change: QueryResult<UserModel> = db.run(move |c| {
        UserModel::change_rank(_user_id, _rank, c)
    }).await;
    match rank_change {
        Ok(user) => Ok(ok().message(&*format!("Successfully changed the rank for {} to {}", user.username, user.rank))),
        Err(_) => Ok(internal_server_error())
    }

}