require('dotenv').config({ path: '.env.local' });

async function testVideoUpload() {
  console.log('🧪 Testing Video Upload...\n');

  // First create a test user
  const testWalletAddress = 'test-wallet-upload-' + Date.now();
  
  try {
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

    // Test video upload
    console.log('\n2️⃣ Testing video upload...');
    const videoData = {
      userId: userId,
      title: 'Test Video Upload',
      description: 'This is a test video upload to verify the functionality works.',
      videoUrl: 'https://example.com/test-video.mp4',
      thumbnailUrl: 'https://example.com/test-thumbnail.jpg',
      duration: 120,
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
    console.log('✅ Video upload successful!');
    console.log('   Video ID:', uploadData.video.id);
    console.log('   Title:', uploadData.video.title);
    console.log('   Likes:', uploadData.video.likes);
    console.log('   Creator:', uploadData.video.creator_name);

    // Test getting videos
    console.log('\n3️⃣ Testing video retrieval...');
    const videosResponse = await fetch('http://localhost:3000/api/videos');
    
    if (!videosResponse.ok) {
      throw new Error(`Video retrieval failed: ${videosResponse.status}`);
    }

    const videosData = await videosResponse.json();
    console.log('✅ Video retrieval successful!');
    console.log('   Total videos:', videosData.videos.length);
    
    const uploadedVideo = videosData.videos.find(v => v.id === uploadData.video.id);
    if (uploadedVideo) {
      console.log('   Found uploaded video in list!');
    }

    console.log('\n🎉 All video upload tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure the development server is running: pnpm dev');
    }
  }
}

testVideoUpload(); 