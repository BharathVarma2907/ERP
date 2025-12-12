const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'mini_erp.db');
const schemaPath = path.join(__dirname, 'schema-sqlite.sql');
const seedPath = path.join(__dirname, 'seed-sqlite.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
    process.exit(1);
  }
  console.log('✅ Database opened/created at:', dbPath);
  initializeSchema();
});

function initializeSchema() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  // Split by semicolon to execute individual statements
  const statements = schema.split(';').filter(s => s.trim());
  
  let index = 0;
  
  function executeNext() {
    if (index >= statements.length) {
      console.log(`✅ Schema initialized (${statements.length} statements)`);
      seedData();
      return;
    }
    
    const statement = statements[index];
    db.run(statement + ';', (err) => {
      if (err) {
        console.error(`⚠️ Warning in statement ${index}:`, err.message);
      }
      index++;
      executeNext();
    });
  }
  
  executeNext();
}

function seedData() {
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error('❌ Error checking data:', err);
      return;
    }
    
    if (row.count > 0) {
      console.log('✅ Database already seeded. Skipping seed data.');
      closeDb();
      return;
    }
    
    const seed = fs.readFileSync(seedPath, 'utf8');
    const statements = seed.split(';').filter(s => s.trim());
    
    let index = 0;
    
    function executeNext() {
      if (index >= statements.length) {
        console.log(`✅ Database seeded with sample data (${statements.length} statements)`);
        closeDb();
        return;
      }
      
      const statement = statements[index];
      db.run(statement + ';', (err) => {
        if (err) {
          console.error(`⚠️ Warning in seed statement ${index}:`, err.message);
        }
        index++;
        executeNext();
      });
    }
    
    executeNext();
  });
}

function closeDb() {
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err);
    } else {
      console.log('✅ Database initialization complete!');
    }
  });
}
