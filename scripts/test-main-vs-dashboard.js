require('dotenv').config({ path: '.env.local' });

async function testMainVsDashboard() {
  console.log('🧪 Testing Main Page vs Dashboard API Calls...\n');

  try {
    // Test main page API call (getVideos)
    console.log('1️⃣ Testing main page API call (/api/videos?isShort=false)...');
    const mainResponse = await fetch('http://localhost:3000/api/videos?isShort=false');
    
    if (!mainResponse.ok) {
      throw new Error(`Main page API failed: ${mainResponse.status}`);
    }

    const mainData = await mainResponse.json();
    console.log(`✅ Main page returned ${mainData.videos.length} videos\n`);

    // Test dashboard API call (getUserVideos)
    console.log('2️⃣ Testing dashboard API call (/api/videos?userId=4)...');
    const dashboardResponse = await fetch('http://localhost:3000/api/videos?userId=4');
    
    if (!dashboardResponse.ok) {
      throw new Error(`Dashboard API failed: ${dashboardResponse.status}`);
    }

    const dashboardData = await dashboardResponse.json();
    console.log(`✅ Dashboard returned ${dashboardData.videos.length} videos\n`);

    // Compare the results
    console.log('3️⃣ Comparing results...\n');
    
    console.log('Main page videos:');
    mainData.videos.forEach((video, index) => {
      console.log(`   ${index + 1}. "${video.title}" (ID: ${video.id})`);
      console.log(`      Thumbnail: ${video.thumbnail_url || 'No thumbnail'}`);
      console.log(`      User ID: ${video.user_id}`);
      console.log('');
    });

    console.log('Dashboard videos:');
    dashboardData.videos.forEach((video, index) => {
      console.log(`   ${index + 1}. "${video.title}" (ID: ${video.id})`);
      console.log(`      Thumbnail: ${video.thumbnail_url || 'No thumbnail'}`);
      console.log(`      User ID: ${video.user_id}`);
      console.log('');
    });

    // Check for any videos with test-thumbnail in main page results
    const testVideosInMain = mainData.videos.filter(v => 
      v.thumbnail_url && v.thumbnail_url.includes('test-thumbnail')
    );

    if (testVideosInMain.length > 0) {
      console.log('⚠️  Found videos with test-thumbnail in main page results:');
      testVideosInMain.forEach(video => {
        console.log(`   - "${video.title}" (ID: ${video.id})`);
        console.log(`     Thumbnail: ${video.thumbnail_url}`);
      });
    } else {
      console.log('✅ No test-thumbnail videos found in main page results');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMainVsDashboard(); 