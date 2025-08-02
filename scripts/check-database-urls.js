require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function checkDatabaseUrls() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking Database Thumbnail URLs...\n');
    
    const videos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        videoUrl: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${videos.length} videos in database:\n`);
    
    videos.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}" (ID: ${video.id})`);
      console.log(`   Thumbnail URL: ${video.thumbnailUrl || 'No thumbnail'}`);
      console.log(`   Video URL: ${video.videoUrl || 'No video'}`);
      
      if (video.thumbnailUrl) {
        // Check if URL contains spaces or special characters
        const hasSpaces = video.thumbnailUrl.includes(' ');
        const hasSpecialChars = /[^a-zA-Z0-9\/\-_\.]/.test(video.thumbnailUrl);
        
        if (hasSpaces || hasSpecialChars) {
          console.log(`   ⚠️  URL contains spaces or special characters`);
          console.log(`   Spaces: ${hasSpaces}, Special chars: ${hasSpecialChars}`);
        } else {
          console.log(`   ✅ URL looks clean`);
        }
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseUrls(); 