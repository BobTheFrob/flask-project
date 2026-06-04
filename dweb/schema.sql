CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT,
  score INT NOT NULL,
  watchingStatus TEXT CHECK( watchingStatus IN ('completed', 'watching', 'dropped', 'planned') ) NOT NULL DEFAULT 'watching',
  animeType TEXT CHECK( animeType IN ('anime', 'movie', 'ova') )   NOT NULL DEFAULT 'anime',

  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
