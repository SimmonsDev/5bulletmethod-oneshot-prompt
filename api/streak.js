const { app } = require('@azure/functions');
const { entryOperations } = require('./database');

// GET /api/streak - Get user's current streak
app.http('getStreak', {
    methods: ['GET'],
    route: 'streak',
    handler: async (request, context) => {
        try {
            const userId = 'test-user'; // Simulated auth
            const streak = entryOperations.getStreak(userId);
            
            return {
                status: 200,
                jsonBody: { streak }
            };
            
        } catch (error) {
            context.log('Error getting streak:', error);
            return {
                status: 500,
                jsonBody: { error: 'Internal server error' }
            };
        }
    }
});
