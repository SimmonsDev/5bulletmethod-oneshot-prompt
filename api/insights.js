const { app } = require('@azure/functions');
const { entryOperations } = require('./database');

// GET /api/entries/:id/insight - Get AI insight for entry
app.http('getInsight', {
    methods: ['GET'],
    route: 'entries/{id}/insight',
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
            
            const insight = entryOperations.getInsight(userId, entryId);
            
            if (!insight) {
                return {
                    status: 404,
                    jsonBody: { error: 'Entry not found' }
                };
            }
            
            return {
                status: 200,
                jsonBody: { insight }
            };
            
        } catch (error) {
            context.log('Error getting insight:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});
