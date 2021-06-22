use rocket::{catch, request, Request};
use crate::responses::{
    bad_request, forbidden, internal_server_error, not_found, service_unavailable, unauthorized,
    APIResponse,
};
use rocket::request::FromRequest;
use rocket::outcome::*;
use crate::models::user_models::{UserModel};
use crate::database::DbConn;
use rocket::http::{Status, Cookie};

#[catch(400)]
pub fn bad_request_handler() -> APIResponse {
    bad_request()
}

#[catch(401)]
pub fn unauthorized_handler() -> APIResponse {
    unauthorized()
}

#[catch(403)]
pub fn forbidden_handler() -> APIResponse {
    forbidden()
}

#[catch(404)]
pub fn not_found_handler() -> APIResponse {
    not_found()
}

#[catch(500)]
pub fn internal_server_error_handler() -> APIResponse {
    internal_server_error()
}

#[catch(503)]
pub fn service_unavailable_handler() -> APIResponse {
    service_unavailable()
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for &'r UserModel {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> request::Outcome<&'r UserModel, ()> {
        let user_result= request.local_cache_async(async {
            let db = request.guard::<DbConn>().await.succeeded()?;
            let res: Option<String> = request.cookies()
                .get_private("user")
                .and_then(|cookie: Cookie| cookie.value().parse().ok());

            match res {
                Some(id) => db.run(|c|  UserModel::find_by_id(id, c)).await.ok(),
                None => None
            }
        }).await;
        match user_result {
            None => Outcome::Failure((Status::Unauthorized, ())),
            Some(user) => {
                if user.rank < 1 {
                    return Outcome::Failure((Status::Forbidden, ()))
                }
                Outcome::Success(user)
            }
        }
    }
}