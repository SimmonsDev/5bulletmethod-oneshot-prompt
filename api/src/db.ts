import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = process.env.DATABASE_PATH || 'd:/Code/SimmonsDev/5bulletmethod/db/5bullet.db';
const schemaPath = 'd:/Code/SimmonsDev/5bulletmethod/db/schema.sql';

const db = new Database(dbPath);

function initDb() {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Database initialized.');
}

// Check if the tables exist
try {
    const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='BulletEntry'").get();
    if (!table) {
        initDb();
    }
} catch (err) {
    initDb();
}


export default db;
