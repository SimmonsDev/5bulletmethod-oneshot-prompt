// Azure Function: /api/entries
const db = require('./db');

module.exports = async function (context, req) {
    const userId = 'test-user';
    if (req.method === 'POST') {
        // Create new weekly entry
        const { week_start_date, items } = req.body;
        const entryStmt = db.prepare('INSERT INTO BulletEntry (user_id, week_start_date, created_at) VALUES (?, ?, datetime("now"))');
        const entryInfo = entryStmt.run(userId, week_start_date);
        const entryId = entryInfo.lastInsertRowid;
        const itemStmt = db.prepare('INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (?, ?, ?, ?, ?)');
        items.forEach((item, idx) => {
            itemStmt.run(entryId, idx + 1, item.emoji, item.text, item.category || null);
        });
        context.res = { status: 201, body: { id: entryId } };
    } else if (req.method === 'GET') {
        // Get all entries for user
        const entries = db.prepare('SELECT * FROM BulletEntry WHERE user_id = ? ORDER BY week_start_date DESC').all(userId);
        entries.forEach(entry => {
            entry.items = db.prepare('SELECT * FROM BulletItem WHERE bullet_entry_id = ? ORDER BY "order"').all(entry.id);
        });
        context.res = { status: 200, body: entries };
    } else {
        context.res = { status: 405 };
    }
};
