require('dotenv').config({ path: '.env.local' });

async function testThumbnailUrls() {
  console.log('🧪 Testing Actual Thumbnail URLs...\n');

  try {
    // Get videos from main page API
    console.log('1️⃣ Fetching videos from main page API...');
    const response = await fetch('http://localhost:3000/api/videos?isShort=false');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.videos.length} videos\n`);

    // Test each thumbnail URL
    let workingThumbnails = 0;
    let brokenThumbnails = 0;

    for (const video of data.videos) {
      console.log(`Testing: "${video.title}" (ID: ${video.id})`);
      console.log(`   Thumbnail URL: ${video.thumbnail_url || 'No thumbnail'}`);
      
      if (video.thumbnail_url) {
        try {
          const thumbnailResponse = await fetch(`http://localhost:3000${video.thumbnail_url}`);
          console.log(`   Status: ${thumbnailResponse.status} ${thumbnailResponse.statusText}`);
          
          if (thumbnailResponse.ok) {
            workingThumbnails++;
            console.log(`   ✅ Thumbnail working`);
          } else {
            brokenThumbnails++;
            console.log(`   ❌ Thumbnail broken`);
          }
        } catch (error) {
          brokenThumbnails++;
          console.log(`   ❌ Thumbnail error: ${error.message}`);
        }
      } else {
        console.log(`   ⚠️  No thumbnail URL`);
      }
      console.log('');
    }

    console.log(`📊 Summary:`);
    console.log(`   Total videos: ${data.videos.length}`);
    console.log(`   Working thumbnails: ${workingThumbnails}`);
    console.log(`   Broken thumbnails: ${brokenThumbnails}`);
    console.log(`   Success rate: ${((workingThumbnails / data.videos.length) * 100).toFixed(1)}%`);

    if (workingThumbnails === data.videos.length) {
      console.log(`\n🎉 All thumbnails are working perfectly!`);
      console.log(`The 404 error in the logs is likely from a cached browser request.`);
    } else {
      console.log(`\n⚠️  Some thumbnails are still broken.`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testThumbnailUrls(); 