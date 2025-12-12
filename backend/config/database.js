const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../database/mini_erp.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(-1);
  } else {
    console.log('✅ Database connected successfully at', dbPath);
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
});

const transformPlaceholders = (sql) => sql.replace(/\$([0-9]+)/g, '?');

const selectById = (table, id) => new Promise((resolve, reject) => {
  db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
    if (err) return reject(err);
    resolve(row || null);
  });
});

const query = (sql, params = []) => {
  const statement = transformPlaceholders(sql);
  const upper = statement.trim().toUpperCase();

  return new Promise((resolve, reject) => {
    const runStatement = (cb) => db.run(statement, params, function(err) { cb(err, this); });

    if (upper.startsWith('SELECT')) {
      db.all(statement, params, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows: rows || [] });
      });
    } else if (upper.startsWith('BEGIN') || upper.startsWith('COMMIT') || upper.startsWith('ROLLBACK')) {
      db.run(statement, (err) => {
        if (err) return reject(err);
        resolve({ rows: [], changes: 0 });
      });
    } else if (upper.startsWith('INSERT')) {
      runStatement(async (err, ctx) => {
        if (err) return reject(err);

        if (/RETURNING/i.test(sql)) {
          const match = sql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
          if (match) {
            try {
              const row = await selectById(match[1], ctx.lastID);
              return resolve({ rows: row ? [row] : [], lastID: ctx.lastID, changes: ctx.changes });
            } catch (e) {
              return reject(e);
            }
          }
        }

        resolve({ rows: [], lastID: ctx.lastID, changes: ctx.changes });
      });
    } else if (upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
      runStatement(async (err, ctx) => {
        if (err) return reject(err);

        if (/RETURNING/i.test(sql)) {
          const tableMatch = sql.match(/UPDATE\s+([a-zA-Z0-9_]+)/i) || sql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
          const table = tableMatch ? tableMatch[1] : null;
          const idParam = params[params.length - 1];

          if (table && idParam !== undefined) {
            try {
              const row = await selectById(table, idParam);
              return resolve({ rows: row ? [row] : [], changes: ctx.changes });
            } catch (e) {
              return reject(e);
            }
          }
        }

        resolve({ rows: [], changes: ctx.changes });
      });
    } else {
      db.run(statement, params, function(err) {
        if (err) return reject(err);
        resolve({ rows: [], changes: this.changes, lastID: this.lastID });
      });
    }
  });
};

db.query = query;
db.connect = async () => ({
  query,
  release: () => {}
});

module.exports = db;
