import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new sqlite3.Database(`${__dirname}/db/reports.db`);

db.run("DELETE FROM reports", function(err) {
  if (err) {
    console.error("Error clearing reports:", err.message);
  } else {
    console.log(`✅ Cleared ${this.changes} reports from database`);
  }
  db.close();
});