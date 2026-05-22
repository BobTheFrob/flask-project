CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT,
  score INT NOT NULL,
  watchingStatus TEXT CHECK( pType IN ('completed','watching','dropped', 'planned') ) NOT NULL DEFAULT 'watching',
  animeType TEXT CHECK( pType IN ('anime','movie','ova') )   NOT NULL DEFAULT 'anime'
);