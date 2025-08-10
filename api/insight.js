// Azure Function: /api/entries/:id/insight
const db = require('./db');

module.exports = async function (context, req) {
    const entryId = context.bindingData.id;
    if (req.method === 'GET') {
        // Return stub insight
        const insight = db.prepare('SELECT * FROM AIInsight WHERE bullet_entry_id = ?').get(entryId);
        context.res = { status: 200, body: insight || { insight_text: "You're staying balanced across life areas!" } };
    } else {
        context.res = { status: 405 };
    }
};
