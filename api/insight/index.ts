import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { db } from "../src/database.js";

export async function insight(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const entryId = req.params.id;
    if (!entryId) {
      return { status: 400, jsonBody: { error: "Entry ID required" } };
    }

    // Check if entry exists
    const entry = db.getBulletEntryById(parseInt(entryId));
    if (!entry) {
      return { status: 404, jsonBody: { error: "Entry not found" } };
    }

    // Get existing insight or create new one
    let insight = db.getAIInsightByEntryId(parseInt(entryId));
    if (!insight) {
      // Generate AI insight (stub implementation)
      const insightText = "You're staying balanced across life areas!";
      insight = db.createAIInsight(parseInt(entryId), insightText);
    }

    return { status: 200, jsonBody: insight };
  } catch (error) {
    context.log('Error:', error);
    return { status: 500, jsonBody: { error: "Internal server error" } };
  }
}

// For traditional Azure Functions model
export default insight;

app.http('insight', {
  methods: ['GET'],
  route: 'entries/{id}/insight',
  authLevel: 'anonymous',
  handler: insight
});
