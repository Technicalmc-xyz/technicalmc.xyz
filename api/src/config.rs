use rocket::config::{Config};
use serde::Deserialize;

use std::env;
use std::collections::HashMap;

use rocket::figment::Figment;

use {
    anyhow::Result,
    oauth2::{basic::BasicClient, AuthUrl, ClientId, ClientSecret, RedirectUrl, TokenUrl},
};

#[derive(Debug, Deserialize)]
pub struct AppConfig {
    pub cors_allow_origin: String,
    pub cors_allow_methods: String,
    pub cors_allow_headers: String,
    pub environment_name: String,
    pub default_redirect: String,
}

impl Default for AppConfig {
    fn default() -> AppConfig {
        AppConfig {
            cors_allow_origin: String::from("*"),
            cors_allow_methods: String::from("*"),
            cors_allow_headers: String::from("*"),
            environment_name: String::from("unconfigured"),
            default_redirect: String::from("http://technicalmc.xyz")
        }
    }
}

pub struct DiscordAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_url: String,
}

fn make_client() -> Result<BasicClient> {
    Ok(BasicClient::new(
        ClientId::new(env::var("DISCORD_CLIENT_ID").expect("Cannot find the DISCORD_CLIENT_ID in the .env file!")),
        Some(ClientSecret::new(env::var("DISCORD_SECRET").expect("Cannot find the DISCORD_SECRET value in the .env file!"))),
        AuthUrl::new("https://discord.com/api/oauth2/authorize".to_string())?,
        Some(TokenUrl::new("https://discord.com/api/oauth2/token".to_string())?),
    )
        .set_redirect_url(RedirectUrl::new(env::var("AUTH_REDIRECT").expect("Cannot find AUTH_REDIRECT in the .env file!"))?))
}

/// Return a tuple of an app-specific config and a Rocket config.
pub fn get_rocket_config(config_name: &str) -> Result<(AppConfig, Figment, Result<BasicClient>), String> {
    fn production_config() -> Result<(AppConfig, Figment, Result<BasicClient>), String> {
        let app_config = AppConfig {
            cors_allow_origin: String::from("https://technicalmc.xyz"),
            default_redirect: String::from("https://technicalmc.xyz"),
            environment_name: String::from("production"),
            ..Default::default()
        };


        let mut database_config = HashMap::new();
        let mut databases = HashMap::new();

        database_config.insert("url", env::var("DATABASE_URL").unwrap());
        databases.insert("postgres_db", database_config);

        let rocket_config = Figment::from(Config::release_default())
            .merge(("databases", databases));

        Ok((app_config, rocket_config, make_client()))
    }

    fn local_config() -> Result<(AppConfig, Figment, Result<BasicClient>), String> {
        let app_config = AppConfig {
            environment_name: String::from("local"),
            default_redirect: String::from("http://localhost:3000"),
            ..Default::default()
        };

        let mut database_config = HashMap::new();
        let mut databases = HashMap::new();
        database_config.insert("url", env::var("DATABASE_URL").unwrap());
        databases.insert("postgres_db", database_config);

        let rocket_config = Figment::from(Config::default())
            .merge(("databases", databases));

        Ok((app_config, rocket_config, make_client()))
    }

    fn custom_config() -> Result<(AppConfig, Figment, Result<BasicClient>), String> {
        let app_config = AppConfig {
            environment_name: String::from("local"),
            default_redirect: String::from("http://localhost:3000"),
            ..Default::default()
        };


        let mut database_config = HashMap::new();
        let mut databases = HashMap::new();
        database_config.insert("url", env::var("DATABASE_URL").unwrap());
        databases.insert("postgres_db", database_config);

        let rocket_config = Config::figment()
            .merge(("address", "0.0.0.0"))
            .merge(("port", 1111))
            .merge(("databases", databases));

        Ok((app_config, rocket_config, make_client()))
    }

    match config_name {
        "local" => local_config(),
        "production" => production_config(),
        "custom" => custom_config(),
        _ => {
            Err(String::from(format!("No valid config chosen {}", config_name)))
        }
    }
}