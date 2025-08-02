require('dotenv').config({ path: '.env.local' });

async function testWalletConnection() {
  console.log('🧪 Testing Wallet Connection and Profile Creation...\n');

  // Test wallet connection
  const testWalletAddress = 'test-wallet-address-' + Date.now();
  
  try {
    console.log('1️⃣ Testing wallet connection...');
    const connectResponse = await fetch('http://localhost:3000/api/auth/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: testWalletAddress })
    });

    if (!connectResponse.ok) {
      throw new Error(`Connection failed: ${connectResponse.status}`);
    }

    const connectData = await connectResponse.json();
    console.log('✅ Wallet connection successful!');
    console.log('   User ID:', connectData.user.id);
    console.log('   Is New User:', connectData.isNewUser);
    console.log('   Wallet Address:', connectData.user.wallet_address);

    // Test profile update
    console.log('\n2️⃣ Testing profile update...');
    const profileResponse = await fetch('http://localhost:3000/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: testWalletAddress,
        name: 'Test User',
        avatarUrl: '/test-avatar.jpg'
      })
    });

    if (!profileResponse.ok) {
      throw new Error(`Profile update failed: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profile update successful!');
    console.log('   Updated Name:', profileData.user.name);
    console.log('   Updated Avatar:', profileData.user.avatar_url);

    console.log('\n🎉 All tests passed! Wallet connection and profile creation are working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure the development server is running: pnpm dev');
    }
  }
}

testWalletConnection(); 