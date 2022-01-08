extern crate anyhow;
#[macro_use]
extern crate diesel;
extern crate diesel_full_text_search;
extern crate dotenv;

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use git2::Repository;
use rocket::{Build, catchers, Rocket, routes};
use rocket::serde::json::Value;

pub mod schema;
pub mod models;
pub mod config;
pub mod handlers;
pub mod api;
pub mod database;
pub mod responses;
pub mod validation;
pub mod git;
mod webhooks;
mod utils;

pub type Cache = Mutex<HashMap<String, Value>>;
pub type Repo = Arc<Mutex<Repository>>;

pub fn rocket_factory() -> Result<Rocket<Build>, String> {
    git::start_up();
    let (app_config, oauth_state) = config::get_rocket_config().map_err(|x| format!("{}", x))?;
    let cache: Cache = Mutex::new(HashMap::new());
    let rocket = rocket::build()
        .attach(database::DbConn::fairing())
        .manage(app_config)
        .manage(oauth_state)
        .manage(cache)
        .mount("/", routes![
            api::articles::get_articles,
            api::articles::public_articles,
            api::articles::featured_articles,
            api::articles::get_article,
            api::articles::new_article,
            api::articles::edit_article,
            api::articles::search,
            api::status::status
        ])
        .mount("/auth/", routes![
            api::auth::auth,
            api::auth::success,
            api::auth::logout,
        ])
        .mount("/user", routes![
            api::users::whoami,
            api::users::user_profile,
            api::users::all_users,
            api::users::change_userrank
        ])
        .mount("/admin/articles", routes![
            api::articles::publicize_article,
            api::articles::feature_article,
            api::articles::remove_article,
        ])

        .mount("/message/", routes![
            api::message_builder::new_message
        ])
        .register("/", catchers![
            handlers::bad_request_handler,
            handlers::unauthorized_handler,
            handlers::forbidden_handler,
            handlers::not_found_handler,
            handlers::internal_server_error_handler,
            handlers::service_unavailable_handler,
        ]);
    Ok(rocket)
}
