const { app } = require('@azure/functions');
const { entryOperations } = require('./database');

// POST /api/entries - Create a new weekly entry
app.http('createEntry', {
    methods: ['POST'],
    route: 'entries',
    handler: async (request, context) => {
        try {
            const userId = 'test-user'; // Simulated auth
            const body = await request.json();
            
            // Validate request body
            if (!body.items || !Array.isArray(body.items)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Items array is required' }
                };
            }
            
            if (body.items.length === 0 || body.items.length > 5) {
                return {
                    status: 400,
                    jsonBody: { error: 'Must provide 1-5 bullet items' }
                };
            }
            
            // Validate each item
            for (const item of body.items) {
                if (!item.emoji || !item.text) {
                    return {
                        status: 400,
                        jsonBody: { error: 'Each item must have emoji and text' }
                    };
                }
            }
            
            // Check if entry already exists for this week
            const existingEntries = entryOperations.getEntries(userId);
            const currentWeek = require('./database').getWeekStart();
            const existingEntry = existingEntries.find(entry => entry.week_start_date === currentWeek);
            
            if (existingEntry) {
                return {
                    status: 409,
                    jsonBody: { 
                        error: 'Entry already exists for this week',
                        existingEntryId: existingEntry.id
                    }
                };
            }
            
            // Create new entry
            const newEntry = entryOperations.createEntry(userId, body.items);
            
            return {
                status: 201,
                jsonBody: newEntry
            };
            
        } catch (error) {
            context.log('Error creating entry:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});

// GET /api/entries - Get all entries for user
app.http('getEntries', {
    methods: ['GET'],
    route: 'entries',
    handler: async (request, context) => {
        try {
            const userId = 'test-user'; // Simulated auth
            const entries = entryOperations.getEntries(userId);
            
            return {
                status: 200,
                jsonBody: entries
            };
            
        } catch (error) {
            context.log('Error getting entries:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});

// GET /api/entries/:id - Get specific entry
app.http('getEntry', {
    methods: ['GET'],
    route: 'entries/{id}',
    handler: async (request, context) => {
        try {
            const userId = 'test-user'; // Simulated auth
            const entryId = parseInt(request.params.id);
            
            if (isNaN(entryId)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid entry ID' }
                };
            }
            
            const entry = entryOperations.getEntry(userId, entryId);
            
            if (!entry) {
                return {
                    status: 404,
                    jsonBody: { error: 'Entry not found' }
                };
            }
            
            return {
                status: 200,
                jsonBody: entry
            };
            
        } catch (error) {
            context.log('Error getting entry:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});

// PUT /api/entries/:id - Update entry
app.http('updateEntry', {
    methods: ['PUT'],
    route: 'entries/{id}',
    handler: async (request, context) => {
        try {
            const userId = 'test-user'; // Simulated auth
            const entryId = parseInt(request.params.id);
            const body = await request.json();
            
            if (isNaN(entryId)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid entry ID' }
                };
            }
            
            // Validate request body
            if (!body.items || !Array.isArray(body.items)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Items array is required' }
                };
            }
            
            if (body.items.length === 0 || body.items.length > 5) {
                return {
                    status: 400,
                    jsonBody: { error: 'Must provide 1-5 bullet items' }
                };
            }
            
            // Validate each item
            for (const item of body.items) {
                if (!item.emoji || !item.text) {
                    return {
                        status: 400,
                        jsonBody: { error: 'Each item must have emoji and text' }
                    };
                }
            }
            
            const updatedEntry = entryOperations.updateEntry(userId, entryId, body.items);
            
            if (!updatedEntry) {
                return {
                    status: 404,
                    jsonBody: { error: 'Entry not found' }
                };
            }
            
            return {
                status: 200,
                jsonBody: updatedEntry
            };
            
        } catch (error) {
            context.log('Error updating entry:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});

// DELETE /api/entries/:id - Delete entry
app.http('deleteEntry', {
    methods: ['DELETE'],
    route: 'entries/{id}',
    handler: async (request, context) => {
        try {
            const userId = 'test-user'; // Simulated auth
            const entryId = parseInt(request.params.id);
            
            if (isNaN(entryId)) {
                return {
                    status: 400,
                    jsonBody: { error: 'Invalid entry ID' }
                };
            }
            
            const deleted = entryOperations.deleteEntry(userId, entryId);
            
            if (!deleted) {
                return {
                    status: 404,
                    jsonBody: { error: 'Entry not found' }
                };
            }
            
            return {
                status: 204
            };
            
        } catch (error) {
            context.log('Error deleting entry:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});
