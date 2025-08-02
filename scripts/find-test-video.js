require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function findTestVideo() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Finding video with test-thumbnail.jpg...\n');
    
    // Search for videos with test-thumbnail in the URL
    const testVideos = await prisma.video.findMany({
      where: {
        OR: [
          { thumbnailUrl: { contains: 'test-thumbnail' } },
          { videoUrl: { contains: 'test-video' } },
          { title: { contains: 'test' } }
        ]
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        videoUrl: true,
        userId: true,
        createdAt: true
      }
    });
    
    if (testVideos.length === 0) {
      console.log('✅ No test videos found in database');
    } else {
      console.log(`Found ${testVideos.length} test videos:\n`);
      
      testVideos.forEach((video, index) => {
        console.log(`${index + 1}. "${video.title}" (ID: ${video.id})`);
        console.log(`   User ID: ${video.userId}`);
        console.log(`   Thumbnail URL: ${video.thumbnailUrl || 'No thumbnail'}`);
        console.log(`   Video URL: ${video.videoUrl || 'No video'}`);
        console.log(`   Created: ${video.createdAt}`);
        console.log('');
      });
    }

    // Also check for any videos with missing files
    console.log('🔍 Checking for videos with potentially missing files...\n');
    
    const allVideos = await prisma.video.findMany({
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        videoUrl: true,
        userId: true
      }
    });

    const videosWithLocalStorage = allVideos.filter(v => 
      v.thumbnailUrl && v.thumbnailUrl.startsWith('/api/files/')
    );

    console.log(`Found ${videosWithLocalStorage.length} videos with local storage URLs:\n`);
    
    videosWithLocalStorage.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}" (ID: ${video.id})`);
      console.log(`   Thumbnail: ${video.thumbnailUrl}`);
      console.log(`   Video: ${video.videoUrl}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

findTestVideo(); 