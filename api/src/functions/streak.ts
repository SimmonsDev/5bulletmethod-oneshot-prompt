import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import db from "../db";

// GET /streak
async function getStreak(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user";
    
    const stmt = db.prepare(`
        SELECT week_start_date 
        FROM BulletEntry 
        WHERE user_id = ? 
        ORDER BY week_start_date DESC
    `);
    const entries = stmt.all(userId) as { week_start_date: string }[];

    if (entries.length === 0) {
        return { jsonBody: { streak: 0 } };
    }

    let streak = 0;
    let lastWeek = new Date(entries[0].week_start_date);

    // Check if the most recent entry is for the current or last week
    const today = new Date();
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastWeekStart = new Date(new Date().setDate(currentWeekStart.getDate() - 7));

    if (lastWeek.getTime() === currentWeekStart.getTime() || lastWeek.getTime() === lastWeekStart.getTime()) {
        streak = 1;
        for (let i = 1; i < entries.length; i++) {
            const currentEntryDate = new Date(entries[i].week_start_date);
            const expectedLastWeek = new Date(new Date(lastWeek).setDate(lastWeek.getDate() - 7));
            
            if (currentEntryDate.getTime() === expectedLastWeek.getTime()) {
                streak++;
                lastWeek = currentEntryDate;
            } else {
                break;
            }
        }
    }
    
    return { jsonBody: { streak } };
};

app.http("streak", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "streak",
    handler: getStreak,
});
