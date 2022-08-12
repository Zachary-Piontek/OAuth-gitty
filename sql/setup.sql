-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_user;
DROP TABLE IF EXISTS gitty_post;

CREATE TABLE github_user (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT,
  username TEXT NOT NULL,
  avatar TEXT
);

CREATE TABLE gitty_post (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post VARCHAR(255)
);

INSERT INTO gitty_post (post)
VALUES
('DRINK COFFEE: do stupid things faster with more energy');