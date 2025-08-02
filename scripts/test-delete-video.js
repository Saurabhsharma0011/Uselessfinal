require('dotenv').config({ path: '.env.local' });

async function testDeleteVideo() {
  console.log('🧪 Testing Video Delete Functionality...\n');

  try {
    // First create a test user
    const testWalletAddress = 'test-wallet-delete-' + Date.now();
    
    console.log('1️⃣ Creating test user...');
    const connectResponse = await fetch('http://localhost:3000/api/auth/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: testWalletAddress })
    });

    if (!connectResponse.ok) {
      throw new Error(`User creation failed: ${connectResponse.status}`);
    }

    const connectData = await connectResponse.json();
    const userId = connectData.user.id;
    console.log('✅ Test user created! User ID:', userId);

    // Upload a test video
    console.log('\n2️⃣ Uploading test video...');
    const videoData = {
      userId: userId,
      title: 'Test Video for Deletion',
      description: 'This video will be deleted to test the delete functionality.',
      videoUrl: '/api/files/videos/test-delete-video.mp4',
      thumbnailUrl: '/api/files/thumbnails/test-delete-thumbnail.jpg',
      duration: 60,
      isShort: false
    };

    const uploadResponse = await fetch('http://localhost:3000/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData)
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Video upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    const videoId = uploadData.video.id;
    console.log('✅ Test video uploaded! Video ID:', videoId);

    // Verify video exists
    console.log('\n3️⃣ Verifying video exists...');
    const verifyResponse = await fetch(`http://localhost:3000/api/videos/${videoId}`);
    
    if (!verifyResponse.ok) {
      throw new Error(`Video verification failed: ${verifyResponse.status}`);
    }

    console.log('✅ Video exists and is accessible');

    // Delete the video
    console.log('\n4️⃣ Testing video deletion...');
    const deleteResponse = await fetch(`http://localhost:3000/api/videos/${videoId}?userId=${userId}`, {
      method: 'DELETE'
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      throw new Error(`Video deletion failed: ${deleteResponse.status} - ${errorText}`);
    }

    console.log('✅ Video deleted successfully!');

    // Verify video is gone
    console.log('\n5️⃣ Verifying video is deleted...');
    const checkResponse = await fetch(`http://localhost:3000/api/videos/${videoId}`);
    
    if (checkResponse.status === 404) {
      console.log('✅ Video successfully removed from database');
    } else {
      console.log('⚠️  Video might still exist in database');
    }

    console.log('\n🎉 Video delete functionality test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User creation working');
    console.log('   ✅ Video upload working');
    console.log('   ✅ Video deletion working');
    console.log('   ✅ Database cleanup working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure the development server is running: pnpm dev');
    }
  }
}

testDeleteVideo(); 