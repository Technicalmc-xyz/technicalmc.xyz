table! {
    use diesel::sql_types::*;
    use diesel_full_text_search::Tsvector;

    /// Representation of the `articles` table.
    ///
    /// (Automatically generated by Diesel.)
    articles (id) {
        /// The `id` column of the `articles` table.
        ///
        /// Its SQL type is `Int4`.
        ///
        /// (Automatically generated by Diesel.)
        id -> Int4,
        /// The `urn_title` column of the `articles` table.
        ///
        /// Its SQL type is `Varchar`.
        ///
        /// (Automatically generated by Diesel.)
        urn_title -> Varchar,
        /// The `title` column of the `articles` table.
        ///
        /// Its SQL type is `Varchar`.
        ///
        /// (Automatically generated by Diesel.)
        title -> Varchar,
        /// The `tags` column of the `articles` table.
        ///
        /// Its SQL type is `Array<Text>`.
        ///
        /// (Automatically generated by Diesel.)
        tags -> Array<Text>,
        /// The `description` column of the `articles` table.
        ///
        /// Its SQL type is `Varchar`.
        ///
        /// (Automatically generated by Diesel.)
        description -> Varchar,
        /// The `edit_count` column of the `articles` table.
        ///
        /// Its SQL type is `Int4`.
        ///
        /// (Automatically generated by Diesel.)
        edit_count -> Int4,
        /// The `last_edited` column of the `articles` table.
        ///
        /// Its SQL type is `Timestamp`.
        ///
        /// (Automatically generated by Diesel.)
        last_edited -> Timestamp,
        /// The `status` column of the `articles` table.
        ///
        /// Its SQL type is `Bool`.
        ///
        /// (Automatically generated by Diesel.)
        status -> Bool,
        /// The `publicized` column of the `articles` table.
        ///
        /// Its SQL type is `Bool`.
        ///
        /// (Automatically generated by Diesel.)
        publicized -> Bool,
        /// The `featured` column of the `articles` table.
        ///
        /// Its SQL type is `Bool`.
        ///
        /// (Automatically generated by Diesel.)
        featured -> Bool,
        /// The `text_searchable_article_col` column of the `articles` table.
        ///
        /// Its SQL type is `Tsvector`.
        ///
        /// (Automatically generated by Diesel.)
        text_searchable_article_col -> Tsvector,
    }
}

table! {
    use diesel::sql_types::*;

    /// Representation of the `redirects` table.
    ///
    /// (Automatically generated by Diesel.)
    redirects (id) {
        /// The `id` column of the `redirects` table.
        ///
        /// Its SQL type is `Int4`.
        ///
        /// (Automatically generated by Diesel.)
        id -> Int4,
        /// The `article_id` column of the `redirects` table.
        ///
        /// Its SQL type is `Int4`.
        ///
        /// (Automatically generated by Diesel.)
        article_id -> Int4,
        /// The `old_title` column of the `redirects` table.
        ///
        /// Its SQL type is `Varchar`.
        ///
        /// (Automatically generated by Diesel.)
        old_title -> Varchar,
    }
}

table! {
    use diesel::sql_types::*;
    /// Representation of the `users` table.
    ///
    /// (Automatically generated by Diesel.)
    users (id) {
        /// The `id` column of the `users` table.
        ///
        /// Its SQL type is `Text`.
        ///
        /// (Automatically generated by Diesel.)
        id -> Text,
        /// The `username` column of the `users` table.
        ///
        /// Its SQL type is `Text`.
        ///
        /// (Automatically generated by Diesel.)
        username -> Text,
        /// The `discriminator` column of the `users` table.
        ///
        /// Its SQL type is `Text`.
        ///
        /// (Automatically generated by Diesel.)
        discriminator -> Text,
        /// The `avatar` column of the `users` table.
        ///
        /// Its SQL type is `Text`.
        ///
        /// (Automatically generated by Diesel.)
        avatar -> Text,
        /// The `rank` column of the `users` table.
        ///
        /// Its SQL type is `Int4`.
        ///
        /// (Automatically generated by Diesel.)
        rank -> Int4,
    }
}

joinable!(redirects -> articles (article_id));

allow_tables_to_appear_in_same_query!(
    articles,
    redirects,
    users,
);
