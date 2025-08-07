import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getEntryById, getOrCreateInsight } from '../lib/entries';
import { createSchemaIfNeeded } from '../lib/db';
import { withCors, ok } from '../lib/http';

createSchemaIfNeeded();

app.http('entry-insight', {
  methods: ['GET','OPTIONS'],
  authLevel: 'anonymous',
  route: 'entries/{id:int}/insight',
  handler: async (req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> => {
    if (req.method === 'OPTIONS') return ok(204);
    const idParam: any = (req as any).params;
    const id = Number(idParam?.id ?? idParam?.get?.('id'));
    const entry = getEntryById(id);
    if (!entry) return withCors({ error: 'Not found' }, 404);
    const text = getOrCreateInsight(id);
    return withCors({ insight: text }, 200);
  }
});
