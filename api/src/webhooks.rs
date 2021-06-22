use serde::{Deserialize, Serialize};
use reqwest;
use crate::models::user_models::UserModel;
use crate::models::article_models::{ArticleModel};
use std::env;
use reqwest::Url;

#[derive(Serialize, Deserialize)]
pub struct Author {
    pub name: String,
    pub icon_url: String,
}

#[derive(Serialize, Deserialize)]
pub struct Footer {
    pub text: String,
}

#[derive(Serialize, Deserialize)]
pub struct Thumbnail {
    pub url: String,
}

#[derive(Serialize, Deserialize)]
pub struct Image {
    pub url: String,
}

#[derive(Serialize, Deserialize)]
pub struct Color {
    pub color: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Field {
    name: String,
    value: String,
    inline: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Embed {
    pub author: Author,
    pub url: String,
    pub title: String,
    pub description: String,
    pub thumbnail: Thumbnail,
    pub color: i32,
    pub fields: Option<Vec<Field>>,
    pub image: Option<Image>,
    pub footer: Footer,
}

#[derive(Serialize, Deserialize)]
/// Webhook that is sent to a discord channel
pub struct DiscordWebhook {
    pub username: String,
    pub avatar_url: String,
    pub embeds: Vec<Embed>,
}


impl DiscordWebhook {
    /// Build the URL for a article to the wiki
    fn build_url(article_title: &String) -> String {
        format!("https://technicalmc.xyz/article/view/{}", article_title)
    }

    /// Build a discord webhook to be sent to the discord
    pub fn build_webhook(user: &UserModel, article: &ArticleModel, title: String, description: String, color: i32) -> DiscordWebhook {
        DiscordWebhook {
            username: user.username.clone(),
            avatar_url: ("https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/50/height/50?cb=20190917030625").to_string(),
            embeds: vec![Embed {
                author: Author {
                    name: String::from(&user.username),
                    icon_url: format!("https://cdn.discordapp.com/avatars/{}/{}", user.id, user.avatar),
                },
                url: self::DiscordWebhook::build_url(&article.urn_title),
                title,
                description,
                thumbnail: Thumbnail {
                    url: ("https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/50/height/50?cb=20190917030625").to_string()
                },
                color,
                fields: None,
                image: None,
                footer: Footer { text: "".to_string() },
            }],
        }
    }

    pub async fn featured_article(user: &UserModel, article: ArticleModel) {
        let discord_url = env::var("DISCORD_UPDATES_WEBHOOK")
            .expect("DATABASE_URL must be set");
        let discord_url = Url::parse(&*discord_url).unwrap();
        let client = reqwest::Client::new();
        let webhook = self::DiscordWebhook::build_webhook(
            user,
            &article,
            format!("{} was featured!", article.title),
            format!("{}", article.description),
            7473591,
        );
        client.post(discord_url)
            .json(&webhook)
            .send()
            .await.unwrap();
    }
}