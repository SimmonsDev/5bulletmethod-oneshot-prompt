// Initialize SQLite database from schema.sql
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '5bulletmethod.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

console.log(`Using DB at: ${dbPath}`);
const db = new Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// ensure test user exists
const ensureUser = db.prepare('INSERT OR IGNORE INTO users (id) VALUES (?)');
ensureUser.run('test-user');

console.log('Database initialized.');
