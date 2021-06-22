-- This file should undo anything in `up.sql`
ALTER TABLE articles DROP COLUMN text_searchable_article_col;

DROP TRIGGER tsvectorupdateproducts ON articles;