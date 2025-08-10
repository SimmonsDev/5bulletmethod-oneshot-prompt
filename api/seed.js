// Seed DB with sample data
const db = require('./db');
const fs = require('fs');
const path = require('path');
const seed = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
db.exec(seed);
console.log('Seeded sample data.');
