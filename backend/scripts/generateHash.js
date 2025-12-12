const bcrypt = require('bcrypt');

const password = 'password123';
const saltRounds = 10;

console.log('Generating bcrypt hash for password: password123\n');

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('Generated Hash:');
  console.log(hash);
  console.log('\n');
  console.log('Copy this hash and replace the placeholder hashes in backend/database/seed.sql');
  console.log('\nThe INSERT statement should look like:');
  console.log(`INSERT INTO users (username, email, password_hash, full_name, role_id) VALUES`);
  console.log(`('admin', 'admin@minierp.com', '${hash}', 'System Administrator', 1);`);
});
