const { app } = require('@azure/functions');

// Import all function definitions
require('./entries');
require('./streak');
require('./insights');

module.exports = app;
