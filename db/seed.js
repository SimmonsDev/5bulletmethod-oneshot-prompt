// Seed sample data
const path = require('path');
const Database = require('better-sqlite3');
const { randomUUID } = require('crypto');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '5bulletmethod.db');
const db = new Database(dbPath);

const userId = 'test-user';

function mondayOfWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // adjust to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

const nowMonday = mondayOfWeek();

const insertEntry = db.prepare('INSERT OR IGNORE INTO bullet_entries (id, user_id, week_start_date) VALUES (?, ?, ?)');
const insertItem = db.prepare('INSERT INTO bullet_items (id, bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?, ?)');

const entryId = randomUUID();
insertEntry.run(entryId, userId, nowMonday);

const items = [
  { order: 1, emoji: '⚖️', text: 'Lost 5 pounds', category: 'health' },
  { order: 2, emoji: '🚗', text: 'Got oil change', category: 'car' },
  { order: 3, emoji: '💅', text: 'Nails done', category: 'health' },
  { order: 4, emoji: '☎️', text: 'Called mom', category: 'relationships' },
  { order: 5, emoji: '🎶', text: 'Went to Karaoke', category: 'social' },
];

const insertMany = db.transaction((list) => {
  list.forEach((it) => {
    insertItem.run(randomUUID(), entryId, it.order, it.emoji, it.text, it.category || null);
  });
});
insertMany(items);

console.log('Seed complete.');
