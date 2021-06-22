use rocket_sync_db_pools::{diesel, database};
#[database("postgres_db")]
pub struct DbConn(diesel::PgConnection);
