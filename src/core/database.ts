import Database from "better-sqlite3";

export const db = new Database("nyon_bot.db");

db.pragma("journal_mode = WAL"); // WAL for concurrency

const USER_TABLE = `
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY
  );
`;

const USER_LEVEL_DATA_TABLE = `
  CREATE TABLE IF NOT EXISTS user_level_data (
    user_id INTEGER NOT NULL DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0,
    xp_total INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    last_message_at TEXT,
    last_level_at TEXT
  );
`;

db.exec(USER_TABLE);
db.exec(USER_LEVEL_DATA_TABLE);
