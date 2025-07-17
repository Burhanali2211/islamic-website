// Test basic Supabase connection without RLS issues
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzuzcssqvgcvqddjctqg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dXpjc3NxdmdjdnFkZGpjdHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTQ2NDUsImV4cCI6MjA2NjEzMDY0NX0.rd3zI6EpmKNiRF1E4HlEBoMMzTIl7HKhdgj6cNSMuKM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing basic Supabase connection...');
  
  try {
    // Test basic connection with a simple query that doesn't involve RLS
    const { data, error } = await supabase
      .from('books')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return;
    }
    
    console.log('✅ Basic connection successful');
    
    // Check if we can see any users in auth.users (this should work without RLS)
    const { data: authUsers, error: authError } = await supabase
      .rpc('get_auth_users'); // This won't work, but let's try a different approach
    
    // Let's try to create a new user with signup instead
    console.log('Attempting to create a test user with signup...');
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'test@idarah.com',
      password: 'test123',
      options: {
        data: {
          full_name: 'Test User',
          role: 'student'
        }
      }
    });
    
    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
    } else {
      console.log('✅ Signup successful');
      console.log('User:', signupData.user?.email);
      
      // Try to sign in with the new user
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email: 'test@idarah.com',
        password: 'test123'
      });
      
      if (signinError) {
        console.error('❌ Signin failed:', signinError.message);
      } else {
        console.log('✅ Signin successful');
        console.log('Signed in user:', signinData.user?.email);
        
        // Sign out
        await supabase.auth.signOut();
        console.log('✅ Sign out successful');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();
