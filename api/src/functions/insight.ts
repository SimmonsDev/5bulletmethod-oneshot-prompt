import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { db } from '../db';

app.http('insight', {
  methods: ['GET'],
  route: 'entries/{id}/insight',
  authLevel: 'anonymous',
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const id = (req.params as any).id as string;

    const row = db.prepare('SELECT id FROM bullet_entries WHERE id = ?').get(id);
    if (!row) return { status: 404 };

    const insight = 'You\'re staying balanced across life areas!';
    return { jsonBody: { insight } };
  },
});
