require('dotenv').config({ path: '.env.local' });

async function testMainPage() {
  console.log('🧪 Testing Main Page Thumbnail Display...\n');

  try {
    // Simulate what the main page does - fetch videos and check thumbnails
    console.log('1️⃣ Fetching videos like the main page does...');
    const response = await fetch('http://localhost:3000/api/videos?isShort=false');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.videos.length} videos\n`);

    // Check thumbnails like the main page would
    let workingThumbnails = 0;
    let brokenThumbnails = 0;

    for (const video of data.videos) {
      if (video.thumbnail_url) {
        try {
          const thumbnailResponse = await fetch(`http://localhost:3000${video.thumbnail_url}`);
          if (thumbnailResponse.ok) {
            workingThumbnails++;
            console.log(`✅ "${video.title}" - Thumbnail working`);
          } else {
            brokenThumbnails++;
            console.log(`❌ "${video.title}" - Thumbnail broken (${thumbnailResponse.status})`);
          }
        } catch (error) {
          brokenThumbnails++;
          console.log(`❌ "${video.title}" - Thumbnail error: ${error.message}`);
        }
      } else {
        console.log(`⚠️  "${video.title}" - No thumbnail URL`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total videos: ${data.videos.length}`);
    console.log(`   Working thumbnails: ${workingThumbnails}`);
    console.log(`   Broken thumbnails: ${brokenThumbnails}`);
    console.log(`   Success rate: ${((workingThumbnails / data.videos.length) * 100).toFixed(1)}%`);

    if (workingThumbnails > 0) {
      console.log(`\n🎉 Thumbnails are working! The main page should display them correctly.`);
    } else {
      console.log(`\n❌ No thumbnails are working. There might still be an issue.`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMainPage(); 