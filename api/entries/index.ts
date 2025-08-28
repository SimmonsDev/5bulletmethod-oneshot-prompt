import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { db } from "../src/database.js";

export async function entries(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const userId = "test-user"; // Simulated auth

  try {
    switch (req.method) {
      case "GET":
        if (req.params.id) {
          // Get single entry
          const entry = db.getBulletEntryById(parseInt(req.params.id));
          if (!entry) {
            return { status: 404, jsonBody: { error: "Entry not found" } };
          }
          const items = db.getBulletItemsByEntryId(entry.id);
          return { status: 200, jsonBody: { ...entry, items } };
        } else {
          // Get all entries
          const entries = db.getBulletEntries(userId);
          const entriesWithItems = entries.map(entry => ({
            ...entry,
            items: db.getBulletItemsByEntryId(entry.id)
          }));
          return { status: 200, jsonBody: entriesWithItems };
        }

      case "POST":
        // Create new entry
        const body = await req.json() as { weekStartDate: string; items: any[] };
        const { weekStartDate, items } = body;
        if (!weekStartDate || !items || !Array.isArray(items)) {
          return { status: 400, jsonBody: { error: "Missing required fields" } };
        }

        const entry = db.createBulletEntry(userId, weekStartDate);
        const createdItems = items.map((item: any, index: number) =>
          db.createBulletItem(entry.id, index + 1, item.emoji, item.text, item.category)
        );

        return { status: 201, jsonBody: { ...entry, items: createdItems } };

      case "PUT":
        // Update entry
        if (!req.params.id) {
          return { status: 400, jsonBody: { error: "Entry ID required" } };
        }

        const entryId = parseInt(req.params.id);
        const existingEntry = db.getBulletEntryById(entryId);
        if (!existingEntry) {
          return { status: 404, jsonBody: { error: "Entry not found" } };
        }

        const updateBody = await req.json() as { weekStartDate?: string; items?: any[] };
        const { weekStartDate: updateDate, items: updateItems } = updateBody;
        if (updateDate) {
          db.updateBulletEntry(entryId, updateDate);
        }

        if (updateItems && Array.isArray(updateItems)) {
          // Delete existing items and create new ones
          const existingItems = db.getBulletItemsByEntryId(entryId);
          existingItems.forEach(item => db.deleteBulletItem(item.id));

          updateItems.forEach((item: any, index: number) =>
            db.createBulletItem(entryId, index + 1, item.emoji, item.text, item.category)
          );
        }

        const updatedEntry = db.getBulletEntryById(entryId);
        const updatedItems = db.getBulletItemsByEntryId(entryId);
        return { status: 200, jsonBody: { ...updatedEntry, items: updatedItems } };

      case "DELETE":
        // Delete entry
        if (!req.params.id) {
          return { status: 400, jsonBody: { error: "Entry ID required" } };
        }

        const deleteId = parseInt(req.params.id);
        const deleted = db.deleteBulletEntry(deleteId);
        if (!deleted) {
          return { status: 404, jsonBody: { error: "Entry not found" } };
        }

        return { status: 200, jsonBody: { message: "Entry deleted successfully" } };

      default:
        return { status: 405, jsonBody: { error: "Method not allowed" } };
    }
  } catch (error) {
    context.log('Error:', error);
    return { status: 500, jsonBody: { error: "Internal server error" } };
  }
}

// For traditional Azure Functions model
export default entries;
