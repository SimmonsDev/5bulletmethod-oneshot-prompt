// SQLite DB setup using better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../db/5bullet.db');
const db = new Database(dbPath);

// Initialize schema if not exists
const fs = require('fs');
const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
