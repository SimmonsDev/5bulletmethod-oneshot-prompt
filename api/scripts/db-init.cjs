#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../db/5bulletmethod.db');
const schemaPath = path.resolve(__dirname, '../../db/schema.sql');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);
console.log('DB initialized at', dbPath);
