-- 5BulletMethod Database Schema
-- SQLite database for storing weekly bullet journal entries

-- Table for main bullet entries (one per user per week)
CREATE TABLE bullet_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    week_start_date TEXT NOT NULL, -- ISO date format (YYYY-MM-DD), Monday of the week
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start_date)
);

-- Table for individual bullet items (up to 5 per entry)
CREATE TABLE bullet_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL, -- 0-4 for up to 5 items
    emoji TEXT NOT NULL,
    text TEXT NOT NULL,
    category TEXT,
    FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE,
    UNIQUE(bullet_entry_id, order_index)
);

-- Table for AI insights (stubbed for now)
CREATE TABLE ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    insight_text TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_bullet_entries_user_date ON bullet_entries(user_id, week_start_date DESC);
CREATE INDEX idx_bullet_items_entry ON bullet_items(bullet_entry_id, order_index);
CREATE INDEX idx_ai_insights_entry ON ai_insights(bullet_entry_id);
