import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import db from "../db";

// GET /entries
async function getEntries(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user"; // Simulated auth
    const stmt = db.prepare("SELECT * FROM BulletEntry WHERE user_id = ? ORDER BY week_start_date DESC");
    const entries: any[] = stmt.all(userId);

    for (const entry of entries) {
        const itemStmt = db.prepare("SELECT * FROM BulletItem WHERE bullet_entry_id = ? ORDER BY \"order\"");
        entry.items = itemStmt.all(entry.id);
    }

    return { jsonBody: entries };
};

// GET /entries/:id
async function getEntryById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user";
    const entryId = request.params.id;
    
    const stmt = db.prepare("SELECT * FROM BulletEntry WHERE id = ? AND user_id = ?");
    const entry: any = stmt.get(entryId, userId);

    if (!entry) {
        return { status: 404, body: "Entry not found" };
    }

    const itemStmt = db.prepare("SELECT * FROM BulletItem WHERE bullet_entry_id = ? ORDER BY \"order\"");
    entry.items = itemStmt.all(entry.id);

    return { jsonBody: entry };
};

// POST /entries
async function createEntry(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user";
    const { week_start_date, items } = await request.json() as any;

    if (!week_start_date || !items || !Array.isArray(items) || items.length === 0 || items.length > 5) {
        return { status: 400, body: "Invalid request body" };
    }

    const entryStmt = db.prepare("INSERT INTO BulletEntry (user_id, week_start_date) VALUES (?, ?)");
    const info = entryStmt.run(userId, week_start_date);
    const entryId = info.lastInsertRowid;

    const itemStmt = db.prepare("INSERT INTO BulletItem (bullet_entry_id, \"order\", emoji, text, category) VALUES (?, ?, ?, ?, ?)");
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        itemStmt.run(entryId, i, item.emoji, item.text, item.category);
    }

    // Stub AI Insight
    const insightStmt = db.prepare("INSERT INTO AIInsight (bullet_entry_id, insight_text) VALUES (?, ?)");
    insightStmt.run(entryId, "You're staying balanced across life areas!");

    return { status: 201, jsonBody: { id: entryId } };
};

// PUT /entries/:id
async function updateEntry(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user";
    const entryId = request.params.id;
    const { items } = await request.json() as any;

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 5) {
        return { status: 400, body: "Invalid request body" };
    }
    
    const entryStmt = db.prepare("SELECT id FROM BulletEntry WHERE id = ? AND user_id = ?");
    const entry = entryStmt.get(entryId, userId);

    if (!entry) {
        return { status: 404, body: "Entry not found" };
    }

    const deleteStmt = db.prepare("DELETE FROM BulletItem WHERE bullet_entry_id = ?");
    deleteStmt.run(entryId);

    const itemStmt = db.prepare("INSERT INTO BulletItem (bullet_entry_id, \"order\", emoji, text, category) VALUES (?, ?, ?, ?, ?)");
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        itemStmt.run(entryId, i, item.emoji, item.text, item.category);
    }

    return { status: 200, body: "Entry updated" };
};

// DELETE /entries/:id
async function deleteEntry(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user";
    const entryId = request.params.id;

    const entryStmt = db.prepare("SELECT id FROM BulletEntry WHERE id = ? AND user_id = ?");
    const entry = entryStmt.get(entryId, userId);

    if (!entry) {
        return { status: 404, body: "Entry not found" };
    }

    db.transaction(() => {
        db.prepare("DELETE FROM AIInsight WHERE bullet_entry_id = ?").run(entryId);
        db.prepare("DELETE FROM BulletItem WHERE bullet_entry_id = ?").run(entryId);
        db.prepare("DELETE FROM BulletEntry WHERE id = ?").run(entryId);
    })();

    return { status: 200, body: "Entry deleted" };
};


app.http("entries", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    route: "entries",
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        switch (request.method) {
            case "GET":
                return getEntries(request, context);
            case "POST":
                return createEntry(request, context);
        }
        return { status: 405, body: "Method Not Allowed" };
    },
});

app.http("entryById", {
    methods: ["GET", "PUT", "DELETE"],
    authLevel: "anonymous",
    route: "entries/{id}",
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        switch (request.method) {
            case "GET":
                return getEntryById(request, context);
            case "PUT":
                return updateEntry(request, context);
            case "DELETE":
                return deleteEntry(request, context);
        }
        return { status: 405, body: "Method Not Allowed" };
    },
});
