use serde::{Deserialize, Serialize};
use diesel;
use diesel::prelude::*;
use crate::schema::users::dsl::*;
use crate::schema::users;
use diesel::result::Error;
use diesel::{insert_into, update};

// What a row of a user looks like in the database
#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable, Identifiable, AsChangeset, PartialEq, Associations)]
#[table_name = "users"]
pub struct UserModel {
    pub id: String,
    pub username: String,
    pub discriminator: String,
    pub avatar: String,
    pub rank: i32,
}

// User information given via discord oauth2
#[derive(Serialize, Deserialize, Debug)]
pub struct DiscordUser {
    pub id: String,
    pub username: String,
    pub discriminator: String,
    pub avatar: String,
}

impl DiscordUser {
    pub fn to_user(self, _rank: i32) -> UserModel {
        UserModel {
            id: self.id,
            username: self.username,
            discriminator: self.discriminator,
            avatar: self.avatar,
            rank: _rank,
        }
    }
}

impl UserModel {
    /// Find a user by a particular ID
    pub fn find(_id: String, conn: &PgConnection) -> Result<UserModel, Error> {
        users.find(_id).first(conn)
    }
    /// Find all users
    pub fn all_users(conn: &PgConnection) -> Result<Vec<UserModel>, Error> {
        users.load::<UserModel>(conn)
    }
    /// Find a user by their ID
    pub fn find_by_id(_id: String, conn: &PgConnection) -> Result<UserModel, Error> {
        users.find(_id).first(conn)
    }
    /// Create a new user
    pub fn create(self, conn: &PgConnection) -> Result<UserModel, Error> {
        insert_into(users)
            .values(self)
            .get_result::<UserModel>(conn)
    }

    pub fn update(&self, conn: &PgConnection) -> Result<UserModel, Error> {
        update(self)
            .set(self)
            .get_result::<UserModel>(conn)
    }

    pub fn change_rank(_id: String, _rank: i32, conn: &PgConnection) -> QueryResult<UserModel> {
        update(users.filter(id.eq(_id)))
            .set(rank.eq(_rank))
            .get_result::<UserModel>(conn)
    }
}

impl PartialEq<UserModel> for DiscordUser {
    fn eq(&self, other: &UserModel) -> bool {
        self.id == other.id
        && self.username == other.username
        && self.discriminator == other.discriminator
        && self.avatar == other.avatar
    }
}

impl PartialEq<DiscordUser> for UserModel {
    fn eq(&self, other: &DiscordUser) -> bool {
        self.id == other.id
        && self.username == other.username
        && self.discriminator == other.discriminator
        && self.avatar == other.avatar
    }
}