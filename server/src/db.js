import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.env.DB_PATH || path.join(here, '..', 'data.db');

const db = new Database(file);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL DEFAULT '',
    author     TEXT    NOT NULL DEFAULT 'anonymous',
    likes      INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
