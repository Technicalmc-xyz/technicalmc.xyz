-- Your SQL goes here
ALTER TABLE articles ADD COLUMN text_searchable_article_col tsvector NOT NULL;

UPDATE articles SET text_searchable_article_col = to_tsvector('english', title || ' ' || description);

CREATE INDEX textsearch_idx ON articles USING GIN (text_searchable_article_col);

CREATE TRIGGER tsvectorupdateproducts BEFORE INSERT OR UPDATE
ON articles FOR EACH ROW EXECUTE PROCEDURE
tsvector_update_trigger(text_searchable_article_col,'pg_catalog.english', title, description);