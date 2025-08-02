require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function verifyDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verifying Database State...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            views: true,
          }
        },
        _count: {
          select: {
            videos: true,
            comments: true,
            subscriptions: true,
            subscribers: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Found ${users.length} users in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Wallet: ${user.walletAddress}`);
      console.log(`   Name: ${user.name || 'Not set'}`);
      console.log(`   Avatar: ${user.avatarUrl || 'Not set'}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log(`   Videos: ${user._count.videos}`);
      console.log(`   Comments: ${user._count.comments}`);
      console.log(`   Subscriptions: ${user._count.subscriptions}`);
      console.log(`   Subscribers: ${user._count.subscribers}`);
      
      if (user.videos.length > 0) {
        console.log(`   Video Titles:`);
        user.videos.forEach(video => {
          console.log(`     - ${video.title} (${video.views} views)`);
        });
      }
      console.log('');
    });
    
    // Get total counts
    const totalVideos = await prisma.video.count();
    const totalComments = await prisma.comment.count();
    const totalLikes = await prisma.videoLike.count();
    const totalSubscriptions = await prisma.subscription.count();
    
    console.log('📈 Database Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Videos: ${totalVideos}`);
    console.log(`   Total Comments: ${totalComments}`);
    console.log(`   Total Likes: ${totalLikes}`);
    console.log(`   Total Subscriptions: ${totalSubscriptions}`);
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase(); 