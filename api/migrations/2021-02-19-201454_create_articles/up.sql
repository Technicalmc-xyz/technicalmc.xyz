CREATE TABLE articles
(
    id          SERIAL       NOT NULL UNIQUE PRIMARY KEY,
    urn_title   VARCHAR(50)  NOT NULL UNIQUE,
    title       VARCHAR(50)  NOT NULL UNIQUE,
    tags        TEXT[] NOT NULL,
    description VARCHAR(200) NOT NULL,
    edit_count  INTEGER      NOT NULL DEFAULT 0,
    last_edited TIMESTAMP             DEFAULT current_timestamp NOT NULL,
    status      BOOLEAN      NOT NULL DEFAULT true,
    publicized  BOOLEAN      NOT NULL DEFAULT false,
    featured    BOOLEAN      NOT NULL DEFAULT false
);

CREATE TABLE redirects
(
    id         SERIAL      NOT NULL UNIQUE PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles ON DELETE CASCADE,
    old_title  VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users
(
    id            TEXT    NOT NULL PRIMARY KEY,
    username      TEXT    NOT NULL,
    discriminator TEXT    NOT NULL,
    avatar        TEXT    NOT NULL,
    rank          INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE
UNIQUE INDEX article_id_unique ON articles (id);

-- CreateIndex
CREATE
UNIQUE INDEX user_id_unique ON users (id);