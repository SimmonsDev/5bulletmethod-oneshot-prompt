import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { createSchemaIfNeeded } from '../lib/db';
import { withCors, ok } from '../lib/http';
import { listEntries, createEntryForWeek, getEntryById, updateEntry, deleteEntry } from '../lib/entries';

createSchemaIfNeeded();

app.http('entries-list-create', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'entries',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    try {
      if (req.method === 'OPTIONS') return ok(204);
      if (req.method === 'GET') {
        const data = listEntries();
        return withCors(data, 200);
      }
      if (req.method === 'POST') {
        const body = (await req.json().catch(() => null)) as { week_start_date?: string; items?: any[] } | null;
        const week_start_date = body?.week_start_date;
        const items = body?.items as any[] | undefined;
        if (items && (!Array.isArray(items) || items.length > 5)) {
          return withCors({ error: 'Up to 5 items allowed' }, 400);
        }
        try {
          const result = createEntryForWeek(week_start_date, items);
          return withCors({ id: result.id, created: result.created }, result.created ? 201 : 409);
        } catch (e: any) {
          if (e.message === 'Cannot have more than 5 items') return withCors({ error: 'Up to 5 items allowed' }, 400);
          if (e.message === 'BadItems') return withCors({ error: 'Invalid item fields' }, 400);
          throw e;
        }
      }
      return ok(405);
    } catch (err) {
      ctx.error(err);
      return withCors({ error: 'Server error' }, 500);
    }
  }
});

app.http('entries-detail', {
  methods: ['GET','PUT','DELETE','OPTIONS'],
  authLevel: 'anonymous',
  route: 'entries/{id:int}',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    try {
  const idParam: any = (req as any).params;
  const id = Number(idParam?.id ?? idParam?.get?.('id'));
      if (req.method === 'OPTIONS') return ok(204);
      if (req.method === 'GET') {
        const entry = getEntryById(id);
        if (!entry) return withCors({ error: 'Not found' }, 404);
        return withCors(entry, 200);
      }
      if (req.method === 'PUT') {
        const body = (await req.json().catch(() => null)) as { items?: any[] } | null;
        const items = body?.items ?? [];
        try {
          updateEntry(id, items);
          const entry = getEntryById(id);
          return withCors(entry, 200);
        } catch (e: any) {
          if (e.message === 'NotFound') return withCors({ error: 'Not found' }, 404);
          if (e.message === 'BadItems') return withCors({ error: 'Invalid or too many items' }, 400);
          throw e;
        }
      }
      if (req.method === 'DELETE') {
        deleteEntry(id);
        return ok(204);
      }
      return ok(405);
    } catch (err) {
      ctx.error(err);
      return withCors({ error: 'Server error' }, 500);
    }
  }
});
