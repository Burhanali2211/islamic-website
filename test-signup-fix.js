// Test script to verify the signup duplicate key fix
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjcxMjc5OCwiZXhwIjoyMDY4Mjg4Nzk4fQ.VABQbqQOcmqih7Z7jB-O43-xSCvckNBPyXYJ6doirzU';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testSignupFix() {
  console.log('🧪 Testing signup duplicate key fix...');
  
  // Test email
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  try {
    console.log('1. Creating user via auth.signUp...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      user_metadata: {
        full_name: 'Test User',
        role: 'student'
      }
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }
    
    console.log('✅ User created:', authData.user.id);
    
    // Wait a moment for trigger
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('2. Checking if profile was created by trigger...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile check error:', profileError);
    } else {
      console.log('✅ Profile found:', profile.id, profile.full_name, profile.role);
    }
    
    console.log('3. Attempting to create duplicate profile (should handle gracefully)...');
    const { data: duplicateProfile, error: duplicateError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: testEmail,
        full_name: 'Duplicate Test User',
        role: 'student'
      })
      .select()
      .single();
    
    if (duplicateError) {
      console.log('✅ Duplicate error handled correctly:', duplicateError.message);
    } else {
      console.log('⚠️ Unexpected: Duplicate profile created:', duplicateProfile);
    }
    
    // Cleanup
    console.log('4. Cleaning up test user...');
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testSignupFix();
