import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getStreak } from '../lib/entries';
import { createSchemaIfNeeded } from '../lib/db';
import { withCors, ok } from '../lib/http';

createSchemaIfNeeded();

app.http('streak', {
  methods: ['GET','OPTIONS'],
  authLevel: 'anonymous',
  route: 'streak',
  handler: async (req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> => {
    if (req.method === 'OPTIONS') return ok(204);
    const streak = getStreak();
    return withCors({ streak }, 200);
  }
});
