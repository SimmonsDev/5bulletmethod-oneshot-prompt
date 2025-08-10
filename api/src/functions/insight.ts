import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import db from "../db";

// GET /entries/:id/insight
async function getInsight(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = "test-user";
    const entryId = request.params.id;

    const entryStmt = db.prepare("SELECT id FROM BulletEntry WHERE id = ? AND user_id = ?");
    const entry = entryStmt.get(entryId, userId);

    if (!entry) {
        return { status: 404, body: "Entry not found" };
    }

    const insightStmt = db.prepare("SELECT insight_text, generated_at FROM AIInsight WHERE bullet_entry_id = ?");
    const insight = insightStmt.get(entryId);

    if (!insight) {
        return { status: 404, body: "Insight not found" };
    }

    return { jsonBody: insight };
};

app.http("insight", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "entries/{id}/insight",
    handler: getInsight,
});
