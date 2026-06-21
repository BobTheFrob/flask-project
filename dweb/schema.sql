CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mal_id INT,
  user_id INT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT,
  score INT,
  watching_status TEXT CHECK( watching_status IN ('completed', 'watching', 'dropped', 'planned') ) NOT NULL DEFAULT 'watching',
  anime_type TEXT CHECK( anime_type IN ('tv', 'ova', 'movie', 'special', 'ona', 'music', 'cm', 'pv', 'tv special', 'misc') )   NOT NULL DEFAULT 'misc',
  miruro_watch_link TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_cache (
  cache_key TEXT PRIMARY KEY,
  response_json TEXT NOT NULL,
  created INT NOT NULL
)