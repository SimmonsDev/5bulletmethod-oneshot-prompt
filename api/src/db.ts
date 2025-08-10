import Database from 'better-sqlite3';
import path from 'node:path';

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../db/5bulletmethod.db');
export const db = new Database(dbPath);
