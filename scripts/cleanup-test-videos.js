require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function cleanupTestVideos() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧹 Cleaning up test videos...\n');
    
    // Find test videos to delete
    const testVideos = await prisma.video.findMany({
      where: {
        OR: [
          { thumbnailUrl: { contains: 'test-thumbnail' } },
          { videoUrl: { contains: 'test-video' } },
          { title: { contains: 'Test Video' } }
        ]
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        videoUrl: true,
        userId: true
      }
    });
    
    if (testVideos.length === 0) {
      console.log('✅ No test videos found to clean up');
      return;
    }
    
    console.log(`Found ${testVideos.length} test videos to delete:\n`);
    
    testVideos.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}" (ID: ${video.id})`);
      console.log(`   User ID: ${video.userId}`);
      console.log(`   Thumbnail: ${video.thumbnailUrl}`);
      console.log(`   Video: ${video.videoUrl}`);
      console.log('');
    });
    
    // Delete the test videos
    console.log('🗑️  Deleting test videos...\n');
    
    for (const video of testVideos) {
      try {
        await prisma.video.delete({
          where: { id: video.id }
        });
        console.log(`✅ Deleted video "${video.title}" (ID: ${video.id})`);
      } catch (error) {
        console.log(`❌ Failed to delete video "${video.title}" (ID: ${video.id}): ${error.message}`);
      }
    }
    
    console.log('\n🎉 Test video cleanup completed!');
    
    // Verify cleanup
    const remainingTestVideos = await prisma.video.findMany({
      where: {
        OR: [
          { thumbnailUrl: { contains: 'test-thumbnail' } },
          { videoUrl: { contains: 'test-video' } },
          { title: { contains: 'Test Video' } }
        ]
      }
    });
    
    if (remainingTestVideos.length === 0) {
      console.log('✅ All test videos successfully removed');
    } else {
      console.log(`⚠️  ${remainingTestVideos.length} test videos still remain`);
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestVideos(); 