import express from 'express';
import cors from 'cors';
import { db } from './db';
import { getUserId, mondayOfWeek } from './util';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.get('/api/entries', (req, res) => {
  const userId = getUserId();
  const rows = db.prepare('SELECT * FROM bullet_entries WHERE user_id = ? ORDER BY week_start_date DESC').all(userId);
  res.json(rows);
});

app.post('/api/entries', (req, res) => {
  const userId = getUserId();
  const items = Array.isArray(req.body.items) ? (req.body.items as any[]) : [];
  if (items.length === 0 || items.length > 5) return res.status(400).json({ error: 'items must be 1..5' });
  const week = mondayOfWeek();
  const existing = db.prepare('SELECT id FROM bullet_entries WHERE user_id = ? AND week_start_date = ?').get(userId, week) as { id?: string } | undefined;
  if (existing?.id) return res.status(409).json({ id: existing.id });
  const entryId = randomUUID();
  const insertEntry = db.prepare('INSERT INTO bullet_entries (id, user_id, week_start_date) VALUES (?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO bullet_items (id, bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?, ?)');
  const tx = db.transaction(() => {
    insertEntry.run(entryId, userId, week);
    items.forEach((it: any, idx: number) => {
      insertItem.run(randomUUID(), entryId, idx + 1, String(it.emoji || ''), String(it.text || ''), it.category ? String(it.category) : null);
    });
  });
  tx();
  res.status(201).json({ id: entryId });
});

app.get('/api/entries/:id', (req, res) => {
  const id = req.params.id;
  const userId = getUserId();
  const row = db.prepare('SELECT * FROM bullet_entries WHERE id = ? AND user_id = ?').get(id, userId);
  if (!row) return res.sendStatus(404);
  const items = db.prepare('SELECT id, "order", emoji, text, category FROM bullet_items WHERE bullet_entry_id = ? ORDER BY "order" ASC').all(id);
  res.json({ ...row, items });
});

app.put('/api/entries/:id', (req, res) => {
  const id = req.params.id;
  const items = Array.isArray(req.body.items) ? (req.body.items as any[]) : [];
  if (items.length === 0 || items.length > 5) return res.status(400).json({ error: 'items must be 1..5' });
  const delItems = db.prepare('DELETE FROM bullet_items WHERE bullet_entry_id = ?');
  const insertItem = db.prepare('INSERT INTO bullet_items (id, bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?, ?)');
  const tx = db.transaction(() => {
    delItems.run(id);
    items.forEach((it: any, idx: number) => {
      insertItem.run(randomUUID(), id, idx + 1, String(it.emoji || ''), String(it.text || ''), it.category ? String(it.category) : null);
    });
  });
  tx();
  res.sendStatus(204);
});

app.delete('/api/entries/:id', (req, res) => {
  const id = req.params.id;
  db.prepare('DELETE FROM bullet_entries WHERE id = ?').run(id);
  res.sendStatus(204);
});

app.get('/api/streak', (_req, res) => {
  const userId = getUserId();
  const rows = db.prepare('SELECT week_start_date FROM bullet_entries WHERE user_id = ? ORDER BY week_start_date DESC').all(userId) as { week_start_date: string }[];
  const weeks = new Set(rows.map((r) => r.week_start_date));
  let streak = 0;
  let d = new Date();
  while (true) {
    const week = mondayOfWeek(d);
    if (weeks.has(week)) { streak += 1; d.setUTCDate(d.getUTCDate() - 7); } else { break; }
  }
  res.json({ streak });
});

app.get('/api/entries/:id/insight', (req, res) => {
  const id = req.params.id;
  const row = db.prepare('SELECT id FROM bullet_entries WHERE id = ?').get(id);
  if (!row) return res.sendStatus(404);
  res.json({ insight: "You're staying balanced across life areas!" });
});

const port = Number(process.env.API_PORT) || 7072;
app.listen(port, () => {
  console.log(`Local API server listening on http://localhost:${port}/api`);
});
