const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'platform.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=roblox',
    robux INTEGER DEFAULT 100,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    creator_id INTEGER,
    creator_name TEXT,
    thumbnail_url TEXT NOT NULL,
    embed_url TEXT NOT NULL,
    plays INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    max_players INTEGER DEFAULT 20,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS game_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
  );

  CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id INTEGER NOT NULL,
    to_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_id) REFERENCES users(id),
    FOREIGN KEY (to_id) REFERENCES users(id)
  );
`);

const CATEGORIES = ['Obby', 'RPG', 'Fighting', 'Simulator', 'Tycoon', 'Horror', 'Adventure', 'Strategy', 'Sports', 'Comedy'];
const ADJECTIVES = ['Epic', 'Mega', 'Super', 'Ultra', 'Crazy', 'Amazing', 'Cool', 'Wild', 'Fast', 'Dark', 'Neon', 'Cosmic'];
const NOUNS = ['Obby', 'World', 'Simulator', 'Tycoon', 'Arena', 'Island', 'City', 'Tower', 'Quest', 'Battle', 'Lab', 'Parkour'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function seedGames() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM games').get().c;
  if (count > 0) return;

  const insert = db.prepare(
    'INSERT INTO games (title, description, category, creator_name, thumbnail_url, embed_url, plays, likes, max_players, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  for (let i = 1; i <= 3000; i++) {
    const cat = randomItem(CATEGORIES);
    const title = `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)} #${i}`;
    const desc = `${title} - ${cat} kategorisinde bir macera. Arkadaşlarınla eğlen ve sıralarını çıkar!`;
    insert.run(title, desc, cat, 'Platform Ekibi', `https://picsum.photos/seed/game${i}/400/225`, `/games/${cat.toLowerCase()}.html`, randomInt(0, 50000), randomInt(0, 5000), randomInt(8, 50), i <= 20 ? 1 : 0);
  }
}

seedGames();

module.exports = db;