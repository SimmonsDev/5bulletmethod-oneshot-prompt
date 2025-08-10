-- SQLite schema for 5BulletMethod
CREATE TABLE IF NOT EXISTS BulletEntry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    week_start_date TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS BulletItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    emoji TEXT NOT NULL,
    text TEXT NOT NULL,
    category TEXT,
    FOREIGN KEY (bullet_entry_id) REFERENCES BulletEntry(id)
);

CREATE TABLE IF NOT EXISTS AIInsight (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    insight_text TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    FOREIGN KEY (bullet_entry_id) REFERENCES BulletEntry(id)
);
