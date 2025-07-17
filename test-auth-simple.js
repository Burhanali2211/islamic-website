// Simple test script to update admin user metadata and test authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzuzcssqvgcvqddjctqg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dXpjc3NxdmdjdnFkZGpjdHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTQ2NDUsImV4cCI6MjA2NjEzMDY0NX0.rd3zI6EpmKNiRF1E4HlEBoMMzTIl7HKhdgj6cNSMuKM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleAuth() {
  console.log('Testing simple authentication...');
  
  try {
    // First, let's try to sign in with the admin user
    console.log('Attempting to sign in with admin credentials...');
    
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
      console.log('User metadata:', data.user.user_metadata);
      console.log('App metadata:', data.user.app_metadata);
      
      // Try to update user metadata to include role
      console.log('Updating user metadata...');
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: { role: 'admin' }
      });
      
      if (updateError) {
        console.error('❌ Metadata update failed:', updateError.message);
      } else {
        console.log('✅ Metadata updated successfully');
        console.log('Updated metadata:', updateData.user?.user_metadata);
      }
      
      // Sign out
      await supabase.auth.signOut();
      console.log('✅ Sign out successful');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimpleAuth();
