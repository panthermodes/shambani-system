const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: 'postgresql://shamba:SHAMBANI123@localhost:5432/shambani?schema=public'
  });

  try {
    await client.connect();
    console.log(' Database connection successful!');
    
    // Test basic query
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    await client.end();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
