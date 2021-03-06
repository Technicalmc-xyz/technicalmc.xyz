use crate::models::user_models::UserModel;
use crate::responses::{ok, unauthorized, APIResponse};
use crate::webhooks::{Author, DiscordWebhook, Embed, Field, Footer, Thumbnail};
use rocket::post;
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};
use std::env;
use reqwest::Url;

/// What the frontend sends
#[derive(Serialize, Deserialize)]
pub struct Message {
    title: String,
    description: String,
    fields: Vec<Field>,
    footer: String,
}

#[post("/new", data = "<body>", format = "application/json")]
pub async fn new_message(
    _user: &UserModel,
    body: Json<Message>,
) -> Result<APIResponse, APIResponse> {
    if _user.rank < 5 {
        return Ok(unauthorized().message("You are not authorized to perform this action!"));
    }

    let discord_url = Url::parse(&*env::var("DISCORD_ANNOUNCEMENT_WEBHOOK")?)?;
    let msg = body.0;
    let embed_message = DiscordWebhook {
        username: "technicalmc.xyz".to_string(),
        avatar_url: "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/50/height/50?cb=20190917030625".to_string(),
        embeds: vec![
            Embed {
                author: Author {
                    name: String::from(&_user.username),
                    icon_url: format!("https://cdn.discordapp.com/avatars/{}/{}.png", &_user.id, &_user.avatar),
                },
                url: "https://technicalmc.xyz".to_string(),
                title: msg.title,
                description: msg.description,
                thumbnail: Thumbnail {
                    url: "https://static.wikia.nocookie.net/minecraft/images/d/d3/KnowledgeBookNew.png/revision/latest/top-crop/width/50/height/50?cb=20190917030625".to_string()
                },
                color: 52224,
                fields: Some(msg.fields),
                image: None,
                footer: Footer {
                    text: msg.footer
                }
            }
        ]
    };
    let client = reqwest::Client::new();
    client.post(discord_url).json(&embed_message).send().await.unwrap();
    Ok(ok().message("ok"))
}
