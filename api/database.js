const Database = require('better-sqlite3');
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '..', 'db', '5bulletmethod.db');
let db;

function getDatabase() {
    if (!db) {
        db = new Database(dbPath);
        // Enable foreign keys
        db.pragma('foreign_keys = ON');
    }
    return db;
}

// Utility function to get the start of the week (Monday) for a given date
function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Entry operations
const entryOperations = {
    // Create a new entry
    createEntry(userId, items) {
        const db = getDatabase();
        const weekStart = getWeekStart();
        
        // Check if entry already exists for this week
        const existingEntry = db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE user_id = ? AND week_start_date = ?
        `).get(userId, weekStart);
        
        if (existingEntry) {
            // Return existing entry with items
            const existingItems = db.prepare(`
                SELECT * FROM bullet_items 
                WHERE bullet_entry_id = ? 
                ORDER BY order_index
            `).all(existingEntry.id);
            
            return {
                ...existingEntry,
                items: existingItems
            };
        }
        
        // Create new entry
        const insertEntry = db.prepare(`
            INSERT INTO bullet_entries (user_id, week_start_date) 
            VALUES (?, ?)
        `);
        
        const insertItem = db.prepare(`
            INSERT INTO bullet_items (bullet_entry_id, order_index, emoji, text, category) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const transaction = db.transaction((userId, weekStart, items) => {
            const result = insertEntry.run(userId, weekStart);
            const entryId = result.lastInsertRowid;
            
            const insertedItems = [];
            items.forEach((item, index) => {
                const itemResult = insertItem.run(entryId, index, item.emoji, item.text, item.category || null);
                insertedItems.push({
                    id: itemResult.lastInsertRowid,
                    bullet_entry_id: entryId,
                    order_index: index,
                    ...item
                });
            });
            
            return {
                id: entryId,
                user_id: userId,
                week_start_date: weekStart,
                created_at: new Date().toISOString(),
                items: insertedItems
            };
        });
        
        return transaction(userId, weekStart, items);
    },
    
    // Get all entries for a user
    getEntries(userId) {
        const db = getDatabase();
        
        const entries = db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE user_id = ? 
            ORDER BY week_start_date DESC
        `).all(userId);
        
        return entries.map(entry => {
            const items = db.prepare(`
                SELECT * FROM bullet_items 
                WHERE bullet_entry_id = ? 
                ORDER BY order_index
            `).all(entry.id);
            
            return { ...entry, items };
        });
    },
    
    // Get specific entry
    getEntry(userId, entryId) {
        const db = getDatabase();
        
        const entry = db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE id = ? AND user_id = ?
        `).get(entryId, userId);
        
        if (!entry) return null;
        
        const items = db.prepare(`
            SELECT * FROM bullet_items 
            WHERE bullet_entry_id = ? 
            ORDER BY order_index
        `).all(entry.id);
        
        return { ...entry, items };
    },
    
    // Update entry items
    updateEntry(userId, entryId, items) {
        const db = getDatabase();
        
        // Verify entry exists and belongs to user
        const entry = db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE id = ? AND user_id = ?
        `).get(entryId, userId);
        
        if (!entry) return null;
        
        const deleteItems = db.prepare(`DELETE FROM bullet_items WHERE bullet_entry_id = ?`);
        const insertItem = db.prepare(`
            INSERT INTO bullet_items (bullet_entry_id, order_index, emoji, text, category) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const transaction = db.transaction((entryId, items) => {
            deleteItems.run(entryId);
            
            const insertedItems = [];
            items.forEach((item, index) => {
                const result = insertItem.run(entryId, index, item.emoji, item.text, item.category || null);
                insertedItems.push({
                    id: result.lastInsertRowid,
                    bullet_entry_id: entryId,
                    order_index: index,
                    ...item
                });
            });
            
            return insertedItems;
        });
        
        const updatedItems = transaction(entryId, items);
        
        return { ...entry, items: updatedItems };
    },
    
    // Delete entry
    deleteEntry(userId, entryId) {
        const db = getDatabase();
        
        const result = db.prepare(`
            DELETE FROM bullet_entries 
            WHERE id = ? AND user_id = ?
        `).run(entryId, userId);
        
        return result.changes > 0;
    },
    
    // Get user streak
    getStreak(userId) {
        const db = getDatabase();
        
        const entries = db.prepare(`
            SELECT week_start_date FROM bullet_entries 
            WHERE user_id = ? 
            ORDER BY week_start_date DESC
        `).all(userId);
        
        if (entries.length === 0) return 0;
        
        let streak = 0;
        const currentWeek = getWeekStart();
        
        // Convert week start dates to week numbers for easier comparison
        const entryWeeks = entries.map(entry => entry.week_start_date);
        const currentWeekDate = new Date(currentWeek);
        
        // Check each consecutive week
        let checkDate = new Date(currentWeekDate);
        for (let i = 0; i < entryWeeks.length; i++) {
            const checkWeek = checkDate.toISOString().split('T')[0];
            if (entryWeeks.includes(checkWeek)) {
                streak++;
                // Move to previous week
                checkDate.setDate(checkDate.getDate() - 7);
            } else {
                break;
            }
        }
        
        return streak;
    },
    
    // Get or create AI insight
    getInsight(userId, entryId) {
        const db = getDatabase();
        
        // Verify entry belongs to user
        const entry = db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE id = ? AND user_id = ?
        `).get(entryId, userId);
        
        if (!entry) return '';
        
        // Check if insight already exists
        const existingInsight = db.prepare(`
            SELECT insight_text FROM ai_insights 
            WHERE bullet_entry_id = ?
        `).get(entryId);
        
        if (existingInsight) {
            return existingInsight.insight_text;
        }
        
        // Create new insight (stubbed for now)
        const insightText = "You're staying balanced across life areas!";
        
        db.prepare(`
            INSERT INTO ai_insights (bullet_entry_id, insight_text) 
            VALUES (?, ?)
        `).run(entryId, insightText);
        
        return insightText;
    }
};

module.exports = {
    entryOperations,
    getWeekStart
};
