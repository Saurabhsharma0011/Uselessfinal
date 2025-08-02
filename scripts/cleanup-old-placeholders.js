require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function cleanupOldPlaceholders() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧹 Cleaning up old placeholder videos...\n');
    
    // Find videos with placeholder thumbnails
    const placeholderVideos = await prisma.video.findMany({
      where: {
        OR: [
          { thumbnailUrl: { contains: '/placeholder.svg' } },
          { title: { contains: 'Staring at a Blank Wall' } },
          { title: { contains: 'Watching Paint Dry' } },
          { title: { contains: 'Official Useless Content Guidelines' } }
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
    
    if (placeholderVideos.length === 0) {
      console.log('✅ No placeholder videos found to clean up');
      return;
    }
    
    console.log(`Found ${placeholderVideos.length} placeholder videos to delete:\n`);
    
    placeholderVideos.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}" (ID: ${video.id})`);
      console.log(`   User ID: ${video.userId}`);
      console.log(`   Thumbnail: ${video.thumbnailUrl}`);
      console.log(`   Video: ${video.videoUrl}`);
      console.log('');
    });
    
    // Delete the placeholder videos
    console.log('🗑️  Deleting placeholder videos...\n');
    
    for (const video of placeholderVideos) {
      try {
        await prisma.video.delete({
          where: { id: video.id }
        });
        console.log(`✅ Deleted video "${video.title}" (ID: ${video.id})`);
      } catch (error) {
        console.log(`❌ Failed to delete video "${video.title}" (ID: ${video.id}): ${error.message}`);
      }
    }
    
    console.log('\n🎉 Placeholder video cleanup completed!');
    
    // Verify cleanup
    const remainingPlaceholders = await prisma.video.findMany({
      where: {
        thumbnailUrl: { contains: '/placeholder.svg' }
      }
    });
    
    if (remainingPlaceholders.length === 0) {
      console.log('✅ All placeholder videos successfully removed');
    } else {
      console.log(`⚠️  ${remainingPlaceholders.length} placeholder videos still remain`);
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOldPlaceholders(); 