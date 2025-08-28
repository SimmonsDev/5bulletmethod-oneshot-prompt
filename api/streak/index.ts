import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { db } from "../src/database.js";

export async function streak(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const userId = "test-user"; // Simulated auth

  try {
    const streak = db.getStreak(userId);
    return { status: 200, jsonBody: { streak } };
  } catch (error) {
    context.log('Error:', error);
    return { status: 500, jsonBody: { error: "Internal server error" } };
  }
}

// For traditional Azure Functions model
export default streak;

app.http('streak', {
  methods: ['GET'],
  route: 'streak',
  authLevel: 'anonymous',
  handler: streak
});
