// Test script to verify Supabase authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzuzcssqvgcvqddjctqg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dXpjc3NxdmdjdnFkZGpjdHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTQ2NDUsImV4cCI6MjA2NjEzMDY0NX0.rd3zI6EpmKNiRF1E4HlEBoMMzTIl7HKhdgj6cNSMuKM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('Testing Supabase authentication...');
  
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test authentication with admin user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@idarah.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Authentication failed:', error.message);
      return;
    }
    
    if (data.user) {
      console.log('✅ Authentication successful');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      
      // Test profile fetch
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile fetch failed:', profileError.message);
      } else {
        console.log('✅ Profile fetch successful');
        console.log('Profile:', profile);
      }
      
      // Sign out
      await supabase.auth.signOut();
      console.log('✅ Sign out successful');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();
