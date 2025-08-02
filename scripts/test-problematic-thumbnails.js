require('dotenv').config({ path: '.env.local' });

async function testProblematicThumbnails() {
  console.log('🧪 Testing Problematic Thumbnails with Spaces...\n');

  const problematicThumbnails = [
    '/api/files/thumbnails/1754137339158-ChatGPT Image Aug 2, 2025, 10_46_57 AM.png',
    '/api/files/thumbnails/1754136957457-ChatGPT Image Aug 2, 2025, 12_11_04 PM.png'
  ];

  for (const thumbnailUrl of problematicThumbnails) {
    console.log(`Testing: ${thumbnailUrl}`);
    
    try {
      const response = await fetch(`http://localhost:3000${thumbnailUrl}`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        console.log(`   ✅ Working! File size: ${buffer.byteLength} bytes`);
      } else {
        console.log(`   ❌ Failed to load`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  // Test with URL encoding
  console.log('🔧 Testing with URL encoding...\n');
  
  const encodedThumbnails = [
    '/api/files/thumbnails/1754137339158-ChatGPT%20Image%20Aug%202,%202025,%2010_46_57%20AM.png',
    '/api/files/thumbnails/1754136957457-ChatGPT%20Image%20Aug%202,%202025,%2012_11_04%20PM.png'
  ];

  for (const thumbnailUrl of encodedThumbnails) {
    console.log(`Testing encoded: ${thumbnailUrl}`);
    
    try {
      const response = await fetch(`http://localhost:3000${thumbnailUrl}`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        console.log(`   ✅ Working! File size: ${buffer.byteLength} bytes`);
      } else {
        console.log(`   ❌ Failed to load`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

testProblematicThumbnails(); 