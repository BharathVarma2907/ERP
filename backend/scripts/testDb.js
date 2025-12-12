const pool = require('../config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...\n');
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Current time from database:', result.rows[0].now);
    
    // Test if tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables in database:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Count users
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Total users: ${userCount.rows[0].count}`);
    
    // Count projects
    const projectCount = await pool.query('SELECT COUNT(*) FROM projects');
    console.log(`📁 Total projects: ${projectCount.rows[0].count}`);
    
    // Count invoices
    const invoiceCount = await pool.query('SELECT COUNT(*) FROM invoices');
    console.log(`📄 Total invoices: ${invoiceCount.rows[0].count}`);
    
    console.log('\n✅ Database setup is complete and ready!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    console.log('\n📝 Make sure:');
    console.log('  1. PostgreSQL is running');
    console.log('  2. Database "mini_erp_db" exists');
    console.log('  3. Credentials in .env are correct');
    console.log('  4. Schema has been imported');
    process.exit(1);
  }
}

testConnection();
