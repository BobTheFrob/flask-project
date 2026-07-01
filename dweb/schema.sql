CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  mal_id INT,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT,
  score INT,
  watching_status TEXT CHECK (watching_status IN ('completed', 'watching', 'dropped', 'planned')) NOT NULL DEFAULT 'watching',
  anime_type TEXT CHECK (anime_type IN ('tv', 'ova', 'movie', 'special', 'ona', 'music', 'cm', 'pv', 'tv special', 'misc')) NOT NULL DEFAULT 'misc',
  image_url TEXT,
  miruro_watch_link TEXT
);

CREATE TABLE IF NOT EXISTS api_cache (
  cache_key TEXT PRIMARY KEY,
  response_json TEXT NOT NULL,
  created INT NOT NULL
);