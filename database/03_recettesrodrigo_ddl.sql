DROP TABLE IF EXISTS ingredient;
DROP TABLE IF EXISTS step;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS recipe;
DROP TABLE IF EXISTS user_account;


CREATE TABLE recipe
(
    recipe_id          text PRIMARY KEY,
    name               text NOT NULL,
    description        text NOT NULL,
    preparation_time   integer,
    cooking_time       integer,
    servings           integer,
    image_content      bytea,
    image_content_type text
);

CREATE TABLE user_account
(
    user_account_id text PRIMARY KEY,
    password_hash   text,
    password_salt   text,
    full_name       text,
    is_admin        boolean NOT NULL DEFAULT false
);

CREATE TABLE ingredient
(
    ingredient_id serial PRIMARY KEY,
    index         integer NOT NULL,
    name          text    NOT NULL,
    quantity      numeric(10, 2),
    unit          text,
    recipe_id     text    NOT NULL REFERENCES recipe (recipe_id) ON DELETE CASCADE
--  A valider avec Charles. (Vaut-il mieux une transaction qui supprime manuellement les ingrédients de la recette ?)
);

CREATE INDEX idx_ingredient_recipe_id ON ingredient (recipe_id);

CREATE TABLE step
(
    step_id     serial PRIMARY KEY,
    index       integer NOT NULL,
    description text    NOT NULL,
    recipe_id   text    NOT NULL REFERENCES recipe (recipe_id) ON DELETE CASCADE
--  A valider avec Charles. (Vaut-il mieux une transaction qui supprime manuellement les étapes de la recette ?)
);

CREATE INDEX idx_step_recipe_id ON step (recipe_id);

CREATE TABLE comment
(
    comment_id       serial PRIMARY KEY,
    text             text                     NOT NULL,
    publication_date timestamp with time zone NOT NULL,
    recipe_id        text                     NOT NULL REFERENCES recipe (recipe_id) ON DELETE CASCADE,
    user_account_id  text                     NOT NULL REFERENCES user_account (user_account_id) ON DELETE NO ACTION
);

CREATE INDEX idx_comment_recipe_id ON comment (recipe_id);
CREATE INDEX idx_comment_user_account_id ON comment (user_account_id);
CREATE INDEX idx_comment_publication_date ON comment (publication_date);

CREATE TABLE rating
(
    recipe_id       text    NOT NULL REFERENCES recipe (recipe_id) ON DELETE CASCADE,
    user_account_id text    NOT NULL REFERENCES user_account (user_account_id) ON DELETE NO ACTION,
    note            integer NOT NULL
);

CREATE INDEX idx_rating_recipe_id ON rating (recipe_id);
CREATE INDEX idx_rating_user_account_id ON rating (user_account_id);