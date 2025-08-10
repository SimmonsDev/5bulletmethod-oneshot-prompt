import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { db } from '../db';
import { getUserId, mondayOfWeek } from '../util';

app.http('streak', {
  methods: ['GET'],
  route: 'streak',
  authLevel: 'anonymous',
  handler: async (_req: HttpRequest): Promise<HttpResponseInit> => {
    const userId = getUserId();
    const rows = db
      .prepare('SELECT week_start_date FROM bullet_entries WHERE user_id = ? ORDER BY week_start_date DESC')
      .all(userId) as { week_start_date: string }[];

    const weeks = new Set(rows.map((r) => r.week_start_date));
    let streak = 0;
    let d = new Date();
    while (true) {
      const week = mondayOfWeek(d);
      if (weeks.has(week)) {
        streak += 1;
        d.setUTCDate(d.getUTCDate() - 7);
      } else {
        break;
      }
    }

    return { jsonBody: { streak } };
  },
});
