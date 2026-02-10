import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import winstonLogger from "./winston.js";

const dbFolder = "/data"; // ./data for local development

if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

const dbPath = path.join(dbFolder, "db.sqlite");

const sqliteDb = new sqlite3.Database(dbPath, (err) => {
  if (err) winstonLogger.error("ERROR CONNECTING TO DB:", err);
  else winstonLogger.info("CONNECTED TO DB!");
});

sqliteDb.serialize(() => {
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS gold_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price REAL NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (datetime('now'))
      );
    `, (err) => {
      if (err) winstonLogger.error("Failed to create table:", err);
      else winstonLogger.info("Table is ready");
    });
  
    sqliteDb.run(`
      CREATE INDEX IF NOT EXISTS idx_gold_prices_created_at
      ON gold_prices (created_at DESC);
    `, (err) => {
      if (err) winstonLogger.error("Failed to create index:", err);
      else winstonLogger.info("Index is ready");
    });
});

export default sqliteDb;
