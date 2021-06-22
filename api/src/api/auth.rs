use rocket::{get, State};
use rocket::response::{Redirect};
use {
    anyhow::Result,
    oauth2::{basic::BasicClient},
};
use oauth2::{CsrfToken, Scope, AuthorizationCode, TokenResponse};
use oauth2::reqwest::http_client;
use crate::responses::{APIResponse};
use crate::models::user_models::{DiscordUser, UserModel};
use crate::database::DbConn;
use rocket::http::{Cookie, CookieJar};
use crate::config::AppConfig;
use diesel::result::Error;


#[get("/login")]
pub async fn auth(oauth_client: &State<Result<BasicClient>>) -> Result<Redirect, APIResponse> {
    let client = oauth_client.inner().as_ref().unwrap();
    let (authorize_url, _csrf_state) = client
        .authorize_url(CsrfToken::new_random)
        // .add_scope(Scope::new("user:email".to_string()))
        .add_scope(Scope::new("identify".to_string()))
        .url();
    Ok(Redirect::to(authorize_url.to_string()))
}

#[get("/logout")]
pub async fn logout(cookies: &CookieJar<'_>, app_config: &State<AppConfig>, _user: &UserModel) -> Redirect {
    cookies.remove_private(Cookie::named("user"));
    Redirect::to(app_config.default_redirect.clone())
}

#[get("/success?<code>")]
pub async fn success(
    db: DbConn,
    app_config: &State<AppConfig>,
    oauth_client: &State<Result<BasicClient>>,
    cookies: &CookieJar<'_>,
    code: &str,
) -> Result<Redirect, APIResponse> {
    let token_result = oauth_client.inner().as_ref().unwrap()
        .exchange_code(AuthorizationCode::new(code.to_string()))
        .request(http_client);

    let user_info = reqwest::Client::new()
        .get("https://discord.com/api/users/@me")
        .header(
            reqwest::header::AUTHORIZATION,
            format!("Bearer {}", token_result.unwrap().access_token().secret()),
        )
        .send().await.unwrap().json::<DiscordUser>().await.unwrap();

    cookies.add_private(Cookie::new("user", user_info.id.clone()));

    let (user_row, user_info): (Result<UserModel, Error>, DiscordUser) = db.run(move |c| {
        let user_row = UserModel::find(String::from(&user_info.id), c);
        (user_row, user_info)
    }).await;

    return match user_row {
        Ok(user) => {
            if user_info == user {
                Ok(Redirect::to(app_config.default_redirect.clone()))
            } else {
                db.run(move |c| user.update(c)).await?;
                Ok(Redirect::to(app_config.default_redirect.clone()))
            }
        }
        // Specify that it is a diesel::result::Error::NotFound
        Err(_) => {
            // Create a user of rank one and add them to the database
            db.run(move |c| user_info.to_user(1).create(c)).await?;
            Ok(Redirect::to(app_config.default_redirect.clone()))
        }
    }
}
