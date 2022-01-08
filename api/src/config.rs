use std::env;
use std::fs::File;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use git2::Repository;

use {
    anyhow::Result,
    oauth2::{AuthUrl, basic::BasicClient, ClientId, ClientSecret, RedirectUrl, TokenUrl},
};
use crate::git;
use crate::git::{start_up, git_repo_path};

pub struct AppConfig {
    pub cors_allow_origin: String,
    pub cors_allow_methods: String,
    pub cors_allow_headers: String,
    pub environment_name: String,
    pub default_redirect: String,
    pub tags: Vec<String>,
    pub repo: Arc<Mutex<Repository>>,
    pub repo_path: PathBuf
}

pub struct UserConfig {
    pub article_directory: PathBuf,
    pub discord_client_id: String,
    pub discord_secret: String,
    pub discord_announcement_webhook: String,
    pub discord_updates_webhook: String,
}

impl Default for AppConfig {
    fn default() -> AppConfig {
        AppConfig {
            cors_allow_origin: String::from("*"),
            cors_allow_methods: String::from("*"),
            cors_allow_headers: String::from("*"),
            environment_name: String::from("unconfigured"),
            default_redirect: String::from("http://technicalmc.xyz"),
            tags: vec![String::from("")],
            repo: start_up(),
            repo_path: git_repo_path().expect("Could not get repo path")
        }
    }
}

impl Default for UserConfig {
    fn default() -> Self {
        UserConfig {
            article_directory: PathBuf::from("./wiki/articles"),
            discord_client_id: "".to_string(),
            discord_secret: "".to_string(),
            discord_announcement_webhook: "".to_string(),
            discord_updates_webhook: "".to_string(),
        }
    }
}

pub struct DiscordAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_url: String,
}

// Builds oauth client for making discord oauth requests
fn make_client() -> Result<BasicClient> {
    Ok(BasicClient::new(
        ClientId::new(
            env::var("DISCORD_CLIENT_ID")
                .expect("Cannot find the DISCORD_CLIENT_ID in the .env file!"),
        ),
        Some(ClientSecret::new(env::var("DISCORD_SECRET").expect(
            "Cannot find the DISCORD_SECRET value in the .env file!",
        ))),
        AuthUrl::new("https://discord.com/api/oauth2/authorize".to_string())?,
        Some(TokenUrl::new(
            "https://discord.com/api/oauth2/token".to_string(),
        )?),
    )
        .set_redirect_url(RedirectUrl::new(
            env::var("AUTH_REDIRECT").expect("Cannot find AUTH_REDIRECT in the .env file!"),
        )?))
}

// Read the tags from the tags.json file
pub fn read_tags_from_file() -> Vec<String> {
    let file = File::open("../tags.json")
        .expect("file should open read only");
    serde_json::from_reader(file)
        .expect("Tags config is not configured properly: please make sure it adheres to the JSON syntax")
}

/// Return an app-specific config and a Rocket config.
pub fn get_rocket_config() -> Result<(AppConfig, Result<BasicClient>)> {
    let app_config = AppConfig {
        environment_name: String::from("local"),
        default_redirect: String::from("http://localhost:3000"),
        tags: read_tags_from_file(),
        repo: git::start_up(),
        ..Default::default()
    };
    Ok((app_config, make_client()))
}
