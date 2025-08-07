#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../db/5bulletmethod.db');
const seedPath = path.resolve(__dirname, '../../db/seed.sql');

const db = new Database(dbPath);
const seed = fs.readFileSync(seedPath, 'utf-8');
db.exec(seed);
console.log('DB seeded at', dbPath);
