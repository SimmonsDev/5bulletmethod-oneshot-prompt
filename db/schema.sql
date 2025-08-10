-- SQLite schema for 5BulletMethod
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS bullet_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_start_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, week_start_date),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bullet_items (
  id TEXT PRIMARY KEY,
  bullet_entry_id TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  emoji TEXT NOT NULL,
  text TEXT NOT NULL,
  category TEXT,
  FOREIGN KEY(bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id TEXT PRIMARY KEY,
  bullet_entry_id TEXT NOT NULL,
  insight_text TEXT NOT NULL,
  generated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE
);
