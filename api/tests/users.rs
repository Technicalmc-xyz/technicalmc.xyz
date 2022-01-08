use rocket::http::Status;
use rocket::local::asynchronous::Client;

use crate::rocket;

#[test]
fn test_health() {
    dotenv::dotenv().ok();
    let client = Client::tracked(rocket()).await.unwrap();
    let response = client.get("/status");
    assert_eq!(response.status(), Status::Ok);
    assert_eq!(response.body_string(), Some("OK".into()));
}