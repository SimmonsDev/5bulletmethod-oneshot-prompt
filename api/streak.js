// Azure Function: /api/streak
const db = require('./db');

module.exports = async function (context, req) {
    const userId = 'test-user';
    // Get all weeks with entries
    const entries = db.prepare('SELECT week_start_date FROM BulletEntry WHERE user_id = ? ORDER BY week_start_date DESC').all(userId);
    let streak = 0;
    let lastWeek = null;
    for (const entry of entries) {
        const week = entry.week_start_date;
        if (!lastWeek) {
            lastWeek = week;
            streak = 1;
        } else {
            // Check if week is consecutive
            const prev = new Date(lastWeek);
            prev.setDate(prev.getDate() - 7);
            const prevStr = prev.toISOString().slice(0, 10);
            if (week === prevStr) {
                streak++;
                lastWeek = week;
            } else {
                break;
            }
        }
    }
    context.res = { status: 200, body: { streak } };
};
