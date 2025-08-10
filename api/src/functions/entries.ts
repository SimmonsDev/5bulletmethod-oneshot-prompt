import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { db } from '../db';
import { getUserId, mondayOfWeek } from '../util';
import { randomUUID } from 'node:crypto';

function mapEntry(row: any) {
  return {
    id: row.id,
    user_id: row.user_id,
    week_start_date: row.week_start_date,
    created_at: row.created_at,
  };
}

app.http('entriesListCreate', {
  methods: ['GET', 'POST'],
  route: 'entries',
  authLevel: 'anonymous',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    const userId = getUserId();
    if (req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM bullet_entries WHERE user_id = ? ORDER BY week_start_date DESC').all(userId);
      const entries = rows.map(mapEntry);
      return { jsonBody: entries };
    }

    // POST create weekly entry (max 5 items)
  const body = (await req.json().catch(() => ({}))) as any;
  const items = Array.isArray(body.items) ? (body.items as any[]) : [];
    if (items.length === 0 || items.length > 5) {
      return { status: 400, jsonBody: { error: 'items must be 1..5' } };
    }

    const week = mondayOfWeek();

    const existing = db
      .prepare('SELECT id FROM bullet_entries WHERE user_id = ? AND week_start_date = ?')
      .get(userId, week) as { id?: string } | undefined;
    if (existing?.id) {
      return { status: 409, jsonBody: { id: existing.id } };
    }

    const entryId = randomUUID();
    const insertEntry = db.prepare('INSERT INTO bullet_entries (id, user_id, week_start_date) VALUES (?, ?, ?)');
    const insertItem = db.prepare('INSERT INTO bullet_items (id, bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?, ?)');

    const tx = db.transaction(() => {
      insertEntry.run(entryId, userId, week);
      items.forEach((it: any, idx: number) => {
        const id = randomUUID();
        insertItem.run(id, entryId, idx + 1, String(it.emoji || ''), String(it.text || ''), it.category ? String(it.category) : null);
      });
    });

    try {
      tx();
      return { status: 201, jsonBody: { id: entryId } };
    } catch (e: any) {
      ctx.error(e);
      return { status: 500, jsonBody: { error: 'failed to create entry' } };
    }
  },
});

app.http('entryGetPutDelete', {
  methods: ['GET', 'PUT', 'DELETE'],
  route: 'entries/{id}',
  authLevel: 'anonymous',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    const id = (req.params as any).id as string;
    const userId = getUserId();

    const row = db.prepare('SELECT * FROM bullet_entries WHERE id = ? AND user_id = ?').get(id, userId);
    if (!row) return { status: 404 };

    if (req.method === 'GET') {
      const entry = mapEntry(row);
      const items = db
        .prepare('SELECT id, "order", emoji, text, category FROM bullet_items WHERE bullet_entry_id = ? ORDER BY "order" ASC')
        .all(id);
      (entry as any).items = items;
      return { jsonBody: entry };
    }

    if (req.method === 'DELETE') {
      db.prepare('DELETE FROM bullet_entries WHERE id = ?').run(id);
      return { status: 204 };
    }

    // PUT replace items
  const body = (await req.json().catch(() => ({}))) as any;
  const items = Array.isArray(body.items) ? (body.items as any[]) : [];
    if (items.length === 0 || items.length > 5) {
      return { status: 400, jsonBody: { error: 'items must be 1..5' } };
    }

    const delItems = db.prepare('DELETE FROM bullet_items WHERE bullet_entry_id = ?');
    const insertItem = db.prepare('INSERT INTO bullet_items (id, bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?, ?)');

    const tx = db.transaction(() => {
      delItems.run(id);
      items.forEach((it: any, idx: number) => {
        insertItem.run(randomUUID(), id, idx + 1, String(it.emoji || ''), String(it.text || ''), it.category ? String(it.category) : null);
      });
    });

    try {
      tx();
      return { status: 204 };
    } catch (e: any) {
      ctx.error(e);
      return { status: 500, jsonBody: { error: 'failed to update' } };
    }
  },
});
