import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BulletEntry {
  id: number;
  user_id: string;
  week_start_date: string;
  created_at: string;
}

export interface BulletItem {
  id: number;
  bullet_entry_id: number;
  item_order: number;
  emoji: string;
  text: string;
  category?: string;
  created_at: string;
}

export interface AIInsight {
  id: number;
  bullet_entry_id: number;
  insight_text: string;
  generated_at: string;
}

class DatabaseHelper {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../../db/bulletmethod.db');
    this.db = new Database(dbPath);

    // Initialize schema
    this.initSchema();
  }

  private initSchema() {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bullet_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        week_start_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, week_start_date)
      );

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

      CREATE TABLE IF NOT EXISTS ai_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bullet_entry_id INTEGER NOT NULL,
        insight_text TEXT NOT NULL,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE,
        UNIQUE(bullet_entry_id)
      );

      INSERT OR IGNORE INTO users (id) VALUES ('test-user');
    `;

    this.db.exec(schema);
  }

  // Bullet Entries
  createBulletEntry(userId: string, weekStartDate: string): BulletEntry {
    const stmt = this.db.prepare(`
      INSERT INTO bullet_entries (user_id, week_start_date)
      VALUES (?, ?)
    `);
    const result = stmt.run(userId, weekStartDate);
    return this.getBulletEntryById(result.lastInsertRowid as number)!;
  }

  getBulletEntries(userId: string): BulletEntry[] {
    const stmt = this.db.prepare(`
      SELECT * FROM bullet_entries
      WHERE user_id = ?
      ORDER BY week_start_date DESC
    `);
    return stmt.all(userId) as BulletEntry[];
  }

  getBulletEntryById(id: number): BulletEntry | null {
    const stmt = this.db.prepare('SELECT * FROM bullet_entries WHERE id = ?');
    return stmt.get(id) as BulletEntry | null;
  }

  updateBulletEntry(id: number, weekStartDate: string): BulletEntry | null {
    const stmt = this.db.prepare(`
      UPDATE bullet_entries
      SET week_start_date = ?
      WHERE id = ?
    `);
    stmt.run(weekStartDate, id);
    return this.getBulletEntryById(id);
  }

  deleteBulletEntry(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM bullet_entries WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Bullet Items
  createBulletItem(entryId: number, order: number, emoji: string, text: string, category?: string): BulletItem {
    const stmt = this.db.prepare(`
      INSERT INTO bullet_items (bullet_entry_id, item_order, emoji, text, category)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(entryId, order, emoji, text, category);
    return this.getBulletItemById(result.lastInsertRowid as number)!;
  }

  getBulletItemsByEntryId(entryId: number): BulletItem[] {
    const stmt = this.db.prepare(`
      SELECT * FROM bullet_items
      WHERE bullet_entry_id = ?
      ORDER BY item_order
    `);
    return stmt.all(entryId) as BulletItem[];
  }

  getBulletItemById(id: number): BulletItem | null {
    const stmt = this.db.prepare('SELECT * FROM bullet_items WHERE id = ?');
    return stmt.get(id) as BulletItem | null;
  }

  updateBulletItem(id: number, emoji: string, text: string, category?: string): BulletItem | null {
    const stmt = this.db.prepare(`
      UPDATE bullet_items
      SET emoji = ?, text = ?, category = ?
      WHERE id = ?
    `);
    stmt.run(emoji, text, category, id);
    return this.getBulletItemById(id);
  }

  deleteBulletItem(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM bullet_items WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // AI Insights
  createAIInsight(entryId: number, insightText: string): AIInsight {
    const stmt = this.db.prepare(`
      INSERT INTO ai_insights (bullet_entry_id, insight_text)
      VALUES (?, ?)
    `);
    const result = stmt.run(entryId, insightText);
    return this.getAIInsightById(result.lastInsertRowid as number)!;
  }

  getAIInsightByEntryId(entryId: number): AIInsight | null {
    const stmt = this.db.prepare(`
      SELECT * FROM ai_insights WHERE bullet_entry_id = ?
    `);
    return stmt.get(entryId) as AIInsight | null;
  }

  getAIInsightById(id: number): AIInsight | null {
    const stmt = this.db.prepare('SELECT * FROM ai_insights WHERE id = ?');
    return stmt.get(id) as AIInsight | null;
  }

  // Streak calculation
  getStreak(userId: string): number {
    const stmt = this.db.prepare(`
      SELECT week_start_date
      FROM bullet_entries
      WHERE user_id = ?
      ORDER BY week_start_date DESC
    `);
    const entries = stmt.all(userId) as { week_start_date: string }[];

    if (entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

    for (const entry of entries) {
      const entryDate = new Date(entry.week_start_date);
      const expectedDate = new Date(currentWeekStart);
      expectedDate.setDate(currentWeekStart.getDate() - (streak * 7));

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  close() {
    this.db.close();
  }
}

export const db = new DatabaseHelper();
