use diesel::{PgConnection, update, QueryResult, Connection, RunQueryDsl, ExpressionMethods, QueryDsl};
use tmc_wiki_apiv2::schema::users::dsl::*;
use std::env;
use tmc_wiki_apiv2::models::user_models::{UserModel};
use dotenv::dotenv;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url).expect(&format!("Error connecting to {}", database_url))
}

fn change_rank(_user_id: String, _rank: i32, conn: &PgConnection) -> QueryResult<UserModel> {
    update(users.filter(id.eq(_user_id)))
        .set(rank.eq(_rank))
        .get_result::<UserModel>(conn)
}

fn main() {
    let user_id = env::var("USER_ID").expect("You must set USER_ID");
    let user_rank: i32 = env::var("RANK").expect("You must set RANK to a number 0-5").parse().expect("You must set RANK to a number");

    match change_rank(user_id.clone(), user_rank, &establish_connection()){
        Ok(_) => println!("Changed {} to {}", user_id, user_rank),
        Err(_) => println!("Something has gone wrong!")
    }
}
