use rocket::{Data};
use rocket::request::{Request};
use rocket::data::{self, FromData};
use rocket::http::{Status, ContentType};
use rocket::serde::json::{Value, json, Json};
use rocket::outcome::Outcome::{Failure, Success, Forward};
use std::collections::HashMap;
use std::convert::TryFrom;
use crate::{models::article_models::{NewArticle, EditArticle}, config::{self, AppConfig}};

// Allow some punctiaon but not all
pub fn char_is_okay(c: &char) -> bool {
    matches!(c, '!'..='&' | '('..='.')
}

#[rocket::async_trait]
impl<'r> FromData<'r> for NewArticle {
    type Error = Value;
    async fn from_data(req: &'r Request<'_>, data: Data<'r>) -> data::Outcome<'r, Self> {
        // Ensure the content type is correct before opening the data.
        let content_type = ContentType::new("application", "json");
        if req.content_type() != Some(&content_type) {
            return Forward(data);
        }

        let article =
            Json::<NewArticle>::from_data(req, data).await.map_failure(|_| {
                (
                    Status::UnprocessableEntity,
                    json!({"_schema": "Error while parsing user login."}),
                )
            }).unwrap();


        let mut errors = HashMap::new();

        let tags = &req.rocket().state::<AppConfig>().unwrap().tags;

        // Check that the title and the description are alphanumeric
        if !(article.title.chars().all(|x| x.is_alphanumeric() || x.is_whitespace())) {
            errors
                .entry("title contents")
                .or_insert_with(|| vec![])
                .push("The contents of the title must be alphanumeric");
        }

        if !(article.description.chars().all(|x| x.is_alphanumeric() || char_is_okay(&x) || x.is_whitespace())) {
            errors
                .entry("title contents")
                .or_insert_with(|| vec![])
                .push("The contents of the description must be alphanumeric, or some of the limited special punctuation");
        }

        // Check the length of the title and the description to make sure they follow Open Graph
        // Protocol guidelines and so they arent large
        if article.title.len() > 50 {
            errors
                .entry("title")
                .or_insert_with(|| vec![])
                .push("Title must be less than 200 characters!");
        }
        if article.description.len() > 200 {
            errors
                .entry("description")
                .or_insert_with(|| vec![])
                .push("Description must be less than 200 characters!");
        }

        // Check if the submitted tags are included in the valid tags
        for submitted_tag in &article.tags {
            if !tags.contains(submitted_tag) {
                errors
                    .entry("description")
                    .or_insert_with(|| vec![])
                    .push("You must use the specified tags");
            }
        }

        if !errors.is_empty() {
            return Failure((Status::UnprocessableEntity, json!(errors)));
        }

        Success(NewArticle {
            title: article.title.clone(),
            description: article.description.clone(),
            tags: article.tags.clone(),
            body: Value::from(Value::try_from(article.body.clone()).unwrap()),
        })
    }
}

#[rocket::async_trait]
impl<'r> FromData<'r> for EditArticle {
    type Error = Value;

    async fn from_data(req: &'r Request<'_>, data: Data<'r>) -> data::Outcome<'r, Self> {
        // Ensure the content type is correct before opening the data.
        let content_type = ContentType::new("application", "json");
        if req.content_type() != Some(&content_type) {
            return Forward(data);
        }

        let article =
            Json::<EditArticle>::from_data(req, data).await.map_failure(|_| {
                (
                    Status::UnprocessableEntity,
                    json!({"_schema": "Error while parsing user login."}),
                )
            }).unwrap();

        
        let mut errors = HashMap::new();
        
        let tags = &req.rocket().state::<AppConfig>().unwrap().tags;

        if !(article.title.chars().all(|x| x.is_alphanumeric() || x.is_whitespace())) {
            errors
                .entry("title contents")
                .or_insert_with(|| vec![])
                .push("The contents of the title must be alphanumeric");
        }

        // Check that the title and the description are alphanumeric
        if !(article.description.chars().all(|x| x.is_alphanumeric() || char_is_okay(&x) || x.is_whitespace())) {
            errors
                .entry("title contents")
                .or_insert_with(|| vec![])
                .push("The contents of the description must be alphanumeric, or some of the limited special punctuation");
        }

        // Check the length of the title and the description to make sure they follow Open Graph
        // Protocol guidelines and so they arent large
        if article.title.len() > 50 {
            errors
                .entry("title")
                .or_insert_with(|| vec![])
                .push("Title must be less than 200 characters!");
        }

        if article.description.len() > 200 {
            errors
                .entry("description")
                .or_insert_with(|| vec![])
                .push("Description must be less than 200 characters!");
        }


        // Check if the submitted tags are included in the valid tags
        for submitted_tag in &article.tags {
            if !tags.contains(submitted_tag) {
                errors
                    .entry("description")
                    .or_insert_with(|| vec![])
                    .push("You must use the specified tags");
            }
        }

        if !errors.is_empty() {
            return Failure((Status::UnprocessableEntity, json!(errors)));
        }

        Success(EditArticle {
            title: article.title.clone(),
            description: article.description.clone(),
            tags: article.tags.clone(),
            edit_count: article.edit_count,
            message: article.message.clone(),
            body: article.body.clone(),
        })
    }
}