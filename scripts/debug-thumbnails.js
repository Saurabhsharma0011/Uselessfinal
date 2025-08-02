require('dotenv').config({ path: '.env.local' });

async function debugThumbnails() {
  console.log('🔍 Debugging Thumbnail Issues...\n');

  try {
    // Get all videos from API
    console.log('1️⃣ Fetching videos from API...');
    const response = await fetch('http://localhost:3000/api/videos');
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.videos.length} videos\n`);

    // Check each video's thumbnail
    for (let i = 0; i < data.videos.length; i++) {
      const video = data.videos[i];
      console.log(`${i + 1}. Video: "${video.title}"`);
      console.log(`   ID: ${video.id}`);
      console.log(`   Thumbnail URL: ${video.thumbnail_url || 'No thumbnail'}`);
      
      if (video.thumbnail_url) {
        // Test if thumbnail is accessible
        try {
          const thumbnailResponse = await fetch(`http://localhost:3000${video.thumbnail_url}`);
          console.log(`   Thumbnail Status: ${thumbnailResponse.status} ${thumbnailResponse.statusText}`);
          
          if (thumbnailResponse.ok) {
            console.log(`   ✅ Thumbnail accessible`);
          } else {
            console.log(`   ❌ Thumbnail not accessible`);
          }
        } catch (error) {
          console.log(`   ❌ Thumbnail fetch error: ${error.message}`);
        }
      }
      console.log('');
    }

    // Check if there are any videos with local storage URLs
    const localStorageVideos = data.videos.filter(v => 
      v.thumbnail_url && v.thumbnail_url.startsWith('/api/files/')
    );
    
    console.log(`📊 Summary:`);
    console.log(`   Total videos: ${data.videos.length}`);
    console.log(`   Videos with thumbnails: ${data.videos.filter(v => v.thumbnail_url).length}`);
    console.log(`   Videos with local storage URLs: ${localStorageVideos.length}`);
    
    if (localStorageVideos.length > 0) {
      console.log(`\n🎯 Local storage videos:`);
      localStorageVideos.forEach(video => {
        console.log(`   - "${video.title}" (ID: ${video.id})`);
        console.log(`     Thumbnail: ${video.thumbnail_url}`);
      });
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure the development server is running: pnpm dev');
    }
  }
}

debugThumbnails(); 