const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const seedDatabase = async (req, res) => {
  const dbPath = path.join(__dirname, '../database/mini_erp.db');
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Database error:', err.message);
      return res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
    }
  });

  try {
    // Read schema
    const schemaPath = path.join(__dirname, '../database/schema-sqlite.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Read seed data
    const seedPath = path.join(__dirname, '../database/seed-sqlite.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');

    // Execute schema (create tables)
    const schemaStatements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const stmt of schemaStatements) {
      await new Promise((resolve, reject) => {
        db.run(stmt, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('✅ Schema initialized successfully');

    // Execute seed (populate data)
    const seedStatements = seedData
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const stmt of seedStatements) {
      await new Promise((resolve, reject) => {
        db.run(stmt, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('✅ Database seeded successfully');

    db.close();

    return res.json({
      success: true,
      message: 'Database initialized and seeded successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    db.close();
    return res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
};

module.exports = { seedDatabase };
