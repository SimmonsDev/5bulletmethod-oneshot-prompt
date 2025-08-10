// Azure Function: /api/entries/:id
const db = require('./db');

module.exports = async function (context, req) {
    const userId = 'test-user';
    const entryId = context.bindingData.id;
    if (req.method === 'GET') {
        const entry = db.prepare('SELECT * FROM BulletEntry WHERE id = ? AND user_id = ?').get(entryId, userId);
        if (!entry) {
            context.res = { status: 404 };
            return;
        }
        entry.items = db.prepare('SELECT * FROM BulletItem WHERE bullet_entry_id = ? ORDER BY "order"').all(entryId);
        context.res = { status: 200, body: entry };
    } else if (req.method === 'PUT') {
        // Update entry
        // For brevity, only allow updating items
        const { items } = req.body;
        db.prepare('DELETE FROM BulletItem WHERE bullet_entry_id = ?').run(entryId);
        const itemStmt = db.prepare('INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?)');
        items.forEach((item, idx) => {
            itemStmt.run(entryId, idx + 1, item.emoji, item.text, item.category || null);
        });
        context.res = { status: 200 };
    } else if (req.method === 'DELETE') {
        db.prepare('DELETE FROM BulletItem WHERE bullet_entry_id = ?').run(entryId);
        db.prepare('DELETE FROM BulletEntry WHERE id = ? AND user_id = ?').run(entryId, userId);
        context.res = { status: 204 };
    } else {
        context.res = { status: 405 };
    }
};
