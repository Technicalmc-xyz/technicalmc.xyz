#[macro_use]
extern crate diesel;

use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use std::fs::{File};
use std::io::{BufReader, Read, Write};
use std::path::Path;
use std::env;
use chrono::{NaiveDateTime, Utc};
use termion::{color};
use dotenv::dotenv;

use tmc_wiki_apiv2::schema::articles::dsl::*;
use tmc_wiki_apiv2::schema::articles;
use tmc_wiki_apiv2::models::article_models::ARTICLE_COLUMNS;

#[derive(Debug, Serialize, Deserialize, Insertable, Queryable)]
#[table_name = "articles"]
pub struct ArticleModel {
    pub id: i32,
    pub urn_title: String,
    pub title: String,
    pub tags: Vec<String>,
    pub description: String,
    pub edit_count: i32,
    pub last_edited: NaiveDateTime,
    pub status: bool,
    pub publicized: bool,
    pub featured: bool,
}

#[derive(Serialize, Deserialize, Debug)]
struct Article {
    id: i32,
    title: String,
    tags: String,
    description: String,
    edit_count: i32,
}

type Articles = Vec<Article>;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

fn read_and_write_from_file<P: AsRef<Path>>(path: P, conn: &PgConnection) {
    let file = File::open(path).expect("Cannot find the provided path!");
    let reader = BufReader::new(file);

    let u: Articles = serde_json::from_reader(reader).expect("Could not read json from file!");
    for article in &u {
        println!("{}Creating database record for {}", color::Fg(color::Blue), article.title.clone());
        let article = ArticleModel {
            id: article.id,
            urn_title: article.title.to_lowercase().replace(" ", "_"),
            title: article.title.clone(),
            tags: vec![article.tags.clone()],
            description: article.description.clone(),
            edit_count: article.edit_count,
            last_edited: Utc::now().naive_utc(),
            status: false,
            publicized: false,
            featured: false,
        };
        diesel::insert_into(articles)
            .values(article)
            .returning(ARTICLE_COLUMNS)
            .get_result::<ArticleModel>(conn).expect("Could not insert the articles in the database");
    }
    println!("{}Success! Created every article as row in the database", color::Fg(color::Green));
}

fn change_file_names(conn: &PgConnection) {
    let result: Vec<ArticleModel> = articles
        .select(ARTICLE_COLUMNS)
        .load::<ArticleModel>(conn).expect("Couldn't connect to the wiki database!");

    println!("{}The length of the articles is {}", color::Fg(color::Magenta), &result.len());
    println!("{}Changing article names!", color::Fg(color::Blue));

    for article in result {
        let file_path_string = format!("../../articles/{}.json", article.id);
        let file_path = Path::new(&file_path_string);
        let mut src = match File::open(&file_path) {
            Ok(file) => file,
            Err(_) => {
                println!("Could not open up file {}", file_path_string);
                continue;
            }
        };

        let mut data = String::new();
        src.read_to_string(&mut data).expect("Could not read the file to string");
        drop(src);  // Close the file early

        // Here replace all of the old types with the new types for the frontend
        let mut replaced = data.replace("heading-one", "h1");
        replaced = replaced.replace("heading-two", "h2");
        replaced = replaced.replace("heading-three", "h3");
        replaced = replaced.replace("bulleted-list", "ul");
        replaced = replaced.replace("numbered-list", "ol");
        replaced = replaced.replace("numbered-list", "ol");
        replaced = replaced.replace("list-item", "li");
        replaced = replaced.replace("image", "img");
        replaced = replaced.replace("link", "a");
        // Recreate the file and dump the processed contents to it
        let mut dst = File::create(file_path).expect("Could not create a file");
        dst.write(replaced.as_bytes()).expect("Could not write to the file");
        std::fs::rename(format!("../../articles/{}.json", article.id), format!("../../articles/{}.json", article.urn_title)).expect("Could not change the name of a file");
        println!("{}Successfully transferred the file for article number {} | {}{}", color::Fg(color::Green), article.id, article.title, color::Fg(color::Reset));
    }

    println!("\n{}Done! changed all of the names of the articles", color::Fg(color::Green));
}

fn main() {
    let connection = establish_connection();
    read_and_write_from_file("../../articles/metadata.json", &connection);
    change_file_names(&connection);
    println!("\n\n\n{}Success! Migration Complete, Welcome to APIv2!{}", color::Fg(color::Green), color::Fg(color::Reset));
    println!("
 ______        __        _          __  __  ____                       _____    _      ___ __    _
/_  __/__ ____/ /  ___  (_)______ _/ / /  |/  (_)__  ___ ___________ _/ _/ /_  | | /| / (_) /__ (_)
 / / / -_) __/ _ \\/ _ \\/ / __/ _ `/ / / /|_/ / / _ \\/ -_) __/ __/ _ `/ _/ __/  | |/ |/ / /  '_// /
/_/  \\__/\\__/_//_/_//_/_/\\__/\\_,_/_/ /_/  /_/_/_//_/\\__/\\__/_/  \\_,_/_/ \\__/   |__/|__/_/_/\\_\\/_/
");
}