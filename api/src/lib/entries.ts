import { db, getWeekStartDate, BulletItem } from './db';
import { Entry, EntryItemInput } from './types';

const USER_ID = 'test-user';

export function listEntries(): Entry[] {
  const rows = db.prepare(`SELECT * FROM BulletEntry WHERE user_id=? ORDER BY week_start_date DESC`).all(USER_ID);
  return rows.map((row: any) => getEntryById(row.id)!).filter(Boolean);
}

export function getEntryById(id: number): Entry | null {
  const entry: any = db.prepare(`SELECT * FROM BulletEntry WHERE id=? AND user_id=?`).get(id, USER_ID);
  if (!entry) return null;
  const items = db.prepare(`SELECT * FROM BulletItem WHERE bullet_entry_id=? ORDER BY "order" ASC`).all(id);
  return {
    id: entry.id,
    user_id: entry.user_id,
    week_start_date: entry.week_start_date,
    created_at: entry.created_at,
    items: items.map((i: any) => ({ id: i.id, order: i.order, emoji: i.emoji, text: i.text, category: i.category }))
  };
}

export function createEntryForWeek(week_start_date?: string, items?: EntryItemInput[]): { id: number; created: boolean } {
  const week = week_start_date || getWeekStartDate(new Date());

  const exists: any = db.prepare(`SELECT id FROM BulletEntry WHERE user_id=? AND week_start_date=?`).get(USER_ID, week);
  if (exists) {
    return { id: exists.id as number, created: false };
  }

  if (items && items.length > 5) {
    throw new Error('Cannot have more than 5 items');
  }

  const tx = db.transaction(() => {
    const info = db.prepare(`INSERT INTO BulletEntry (user_id, week_start_date) VALUES (?,?)`).run(USER_ID, week);
    const entryId = Number(info.lastInsertRowid);

    if (items && items.length) {
      items.forEach((it, idx) => {
        validateItem(it);
        db.prepare(`INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (?,?,?,?,?)`)
          .run(entryId, idx + 1, it.emoji, it.text, it.category ?? null);
      });
    }

    return entryId;
  });

  const entryId = tx();
  return { id: entryId, created: true };
}

export function updateEntry(id: number, items: EntryItemInput[]) {
  if (!getEntryById(id)) throw new Error('NotFound');
  if (!Array.isArray(items) || items.length > 5) throw new Error('BadItems');

  const tx = db.transaction(() => {
    db.prepare(`DELETE FROM BulletItem WHERE bullet_entry_id=?`).run(id);
    items.forEach((it, idx) => {
      validateItem(it);
      db.prepare(`INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (?,?,?,?,?)`)
        .run(id, idx + 1, it.emoji, it.text, it.category ?? null);
    });
  });
  tx();
}

export function deleteEntry(id: number) {
  db.prepare(`DELETE FROM BulletEntry WHERE id=? AND user_id=?`).run(id, USER_ID);
}

export function getStreak(): number {
  // Calculate consecutive weeks including current week if exists
  const rows = db.prepare(`SELECT week_start_date FROM BulletEntry WHERE user_id=? ORDER BY week_start_date DESC`).all(USER_ID) as Array<{week_start_date: string}>;
  if (!rows.length) return 0;
  const weekSet = new Set(rows.map(r => r.week_start_date));

  let streak = 0;
  // Start from current week's monday and go back by 7 days steps
  const today = new Date();
  let current = new Date(getWeekStartDate(today) + 'T00:00:00Z');

  while (true) {
    const iso = current.toISOString().slice(0,10);
    if (weekSet.has(iso)) {
      streak += 1;
      current.setUTCDate(current.getUTCDate() - 7);
    } else {
      break;
    }
  }

  return streak;
}

export function getOrCreateInsight(entryId: number): string {
  const existing = db.prepare(`SELECT insight_text FROM AIInsight WHERE bullet_entry_id=?`).get(entryId) as { insight_text: string } | undefined;
  if (existing) return existing.insight_text;
  const text = "You're staying balanced across life areas!";
  db.prepare(`INSERT INTO AIInsight (bullet_entry_id, insight_text) VALUES (?,?)`).run(entryId, text);
  return text;
}

function validateItem(it: EntryItemInput) {
  if (!it || typeof it.emoji !== 'string' || !it.emoji.trim() || typeof it.text !== 'string' || !it.text.trim()) {
    throw new Error('BadItems');
  }
}
