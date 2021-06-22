use rocket::get;
use serde_json::json;
use crate::responses::{ok, APIResponse};

#[get("/status")]
pub fn status() -> APIResponse {
    ok().data(json!("Ok"))
}
