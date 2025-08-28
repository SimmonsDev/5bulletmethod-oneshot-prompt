-- SQLite schema for 5BulletMethod app

-- Users table (simplified for MVP)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Weekly bullet entries
CREATE TABLE IF NOT EXISTS bullet_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    week_start_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start_date)
);

-- Individual bullet items within entries
CREATE TABLE IF NOT EXISTS bullet_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    item_order INTEGER NOT NULL,
    emoji TEXT NOT NULL,
    text TEXT NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE,
    UNIQUE(bullet_entry_id, item_order)
);

-- AI insights for entries
CREATE TABLE IF NOT EXISTS ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    insight_text TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE,
    UNIQUE(bullet_entry_id)
);

-- Insert default test user
INSERT OR IGNORE INTO users (id) VALUES ('test-user');
