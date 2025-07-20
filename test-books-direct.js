// Test script to call books service directly from the browser context
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI3OTgsImV4cCI6MjA2ODI4ODc5OH0.qSJ3Dqr-jza_mEJu0byxChZO8AVTHV3yUrW8zbrjOO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBooksDirectly() {
  console.log('🧪 Testing books service directly...');
  
  try {
    // First, sign in as admin to get proper auth context
    console.log('🔐 Signing in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@idarah-wali-ul-asr.org',
      password: 'Admin@123456'
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }
    
    console.log('✅ Signed in successfully');
    
    // Now try to fetch books directly
    console.log('📚 Fetching books directly from Supabase...');
    
    const { data: books, error: booksError, count } = await supabase
      .from('books')
      .select('*', { count: 'exact' });
      
    if (booksError) {
      console.error('❌ Books error:', booksError);
      return;
    }
    
    console.log('✅ Books fetched successfully:');
    console.log('📊 Count:', count);
    console.log('📚 Books:', books);
    
    books.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author_name}`);
    });
    
    // Test the exact query that the frontend uses
    console.log('\n🔍 Testing with frontend-style query...');
    
    let query = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .eq('is_available', true)
      .order('created_at', { ascending: false });
      
    const { data: frontendBooks, error: frontendError, count: frontendCount } = await query;
    
    if (frontendError) {
      console.error('❌ Frontend-style query error:', frontendError);
      return;
    }
    
    console.log('✅ Frontend-style query successful:');
    console.log('📊 Count:', frontendCount);
    console.log('📚 Books:', frontendBooks?.length || 0);
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

testBooksDirectly().catch(console.error);
