require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function setupNeonDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Setting up Neon Database for UselessTube...');
    console.log('📡 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local');
      console.log('\n🔧 Please add your Neon connection string to .env.local:');
      console.log('DATABASE_URL="postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database_name?sslmode=require"');
      return;
    }
    
    // Test the connection
    console.log('🔍 Testing Neon database connection...');
    await prisma.$connect();
    console.log('✅ Neon database connection successful!');
    
    // Check if tables exist
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`📊 Found ${tableCount[0].count} tables in database`);
    
    if (tableCount[0].count === 0) {
      console.log('⚠️  No tables found. Creating database schema...');
      console.log('   This will create all the necessary tables for UselessTube.');
      
      // Push the schema to create tables
      const { execSync } = require('child_process');
      try {
        execSync('pnpm db:push', { stdio: 'inherit' });
        console.log('✅ Database schema created successfully!');
        
        // Seed the database
        console.log('🌱 Seeding database with sample data...');
        execSync('pnpm db:seed', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully!');
        
      } catch (error) {
        console.error('❌ Failed to create schema:', error.message);
      }
    } else {
      console.log('✅ Database schema already exists!');
    }
    
    console.log('\n🎉 Neon database setup complete!');
    console.log('🚀 You can now run: pnpm dev');
    
  } catch (error) {
    console.error('❌ Neon database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your Neon connection string in .env.local');
    console.log('2. Make sure your Neon project is active');
    console.log('3. Verify the database name exists in your Neon project');
    console.log('4. Check if your IP is allowed (Neon may require IP allowlisting)');
  } finally {
    await prisma.$disconnect();
  }
}

setupNeonDatabase(); 