use dotenv::dotenv;
use std::env;

#[rocket::main]
async fn main() -> Result<(), String> {
    dotenv().ok();
    println!("
 ______        __        _          __  __  ____                       _____    _      ___ __    _
/_  __/__ ____/ /  ___  (_)______ _/ / /  |/  (_)__  ___ ___________ _/ _/ /_  | | /| / (_) /__ (_)
 / / / -_) __/ _ \\/ _ \\/ / __/ _ `/ / / /|_/ / / _ \\/ -_) __/ __/ _ `/ _/ __/  | |/ |/ / /  '_// /
/_/  \\__/\\__/_//_/_//_/_/\\__/\\_,_/_/ /_/  /_/_/_//_/\\__/\\__/_/  \\_,_/_/ \\__/   |__/|__/_/_/\\_\\/_/
");
    let config_name = env::var("CONFIG_ENV").expect("CONFIG must be set");
    let rocket = tmc_wiki_apiv2::rocket_factory(&config_name)?;
    rocket.launch().await.unwrap();
    Ok(())
}
