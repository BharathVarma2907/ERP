const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const seedDatabase = async (req, res) => {
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
      await db.query(stmt);
    }

    console.log('✅ Schema initialized successfully');

    // Execute seed (populate data)
    const seedStatements = seedData
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const stmt of seedStatements) {
      await db.query(stmt);
    }

    console.log('✅ Database seeded successfully');

    return res.json({
      success: true,
      message: 'Database initialized and seeded successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
};

module.exports = { seedDatabase };
