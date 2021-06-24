use serde::Deserialize;
use std::env;
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
            default_redirect: String::from("http://technicalmc.xyz"),
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

/// Return a tuple of an app-specific config and a Rocket config.
pub fn get_rocket_config() -> Result<(AppConfig, Result<BasicClient>)> {
    let app_config = AppConfig {
        environment_name: String::from("local"),
        default_redirect: String::from("http://localhost:3000"),
        ..Default::default()
    };
    Ok((app_config, make_client()))
}
