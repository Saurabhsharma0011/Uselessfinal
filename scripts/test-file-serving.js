require('dotenv').config({ path: '.env.local' });

async function testFileServing() {
  console.log('🧪 Testing File Serving...\n');

  try {
    // Test a known thumbnail file
    const thumbnailUrl = '/api/files/thumbnails/1754135075122-ChatGPT Image Aug 2, 2025, 10_58_43 AM.png';
    
    console.log('1️⃣ Testing thumbnail file serving...');
    console.log('   URL:', thumbnailUrl);
    
    const response = await fetch(`http://localhost:3000${thumbnailUrl}`);
    
    console.log('   Status:', response.status, response.statusText);
    console.log('   Content-Type:', response.headers.get('content-type'));
    console.log('   Content-Length:', response.headers.get('content-length'));
    
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log('   File size:', buffer.byteLength, 'bytes');
      console.log('   ✅ File served successfully');
    } else {
      console.log('   ❌ File serving failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFileServing(); 