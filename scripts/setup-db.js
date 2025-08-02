require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    console.log('📡 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`📊 Found ${tableCount[0].count} tables in database`);
    
    if (tableCount[0].count === 0) {
      console.log('⚠️  No tables found. You need to run database migrations.');
      console.log('   Run: pnpm db:push');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env.local');
    console.log('3. If using Docker, run: docker-compose up -d');
    console.log('4. If using local PostgreSQL, make sure the database exists');
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 