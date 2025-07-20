// Script to add a book using admin authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI3OTgsImV4cCI6MjA2ODI4ODc5OH0.qSJ3Dqr-jza_mEJu0byxChZO8AVTHV3yUrW8zbrjOO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBookAsAdmin() {
  console.log('🔐 Attempting to sign in as admin...');
  
  // First, sign in as admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@idarah-wali-ul-asr.org',
    password: 'Admin@123456'
  });
  
  if (authError) {
    console.error('❌ Authentication failed:', authError.message);
    return;
  }
  
  console.log('✅ Successfully authenticated as admin');
  console.log('👤 User ID:', authData.user.id);
  
  // Now try to add a book
  console.log('📚 Adding test book...');
  
  const testBook = {
    title: 'Test Islamic Book - Admin Added',
    title_arabic: 'كتاب إسلامي تجريبي - أضافه المدير',
    author_name: 'Test Author',
    author_arabic: 'مؤلف تجريبي',
    category: 'general',
    description: 'This is a test book added by the admin to verify the RLS policies are working correctly.',
    description_arabic: 'هذا كتاب تجريبي أضافه المدير للتحقق من أن سياسات الأمان تعمل بشكل صحيح.',
    language: 'en',
    pages: 100,
    is_featured: false,
    is_available: true,
    physical_copies: 1,
    rating: 4.5,
    download_count: 0,
    tags: ['test', 'admin', 'islamic', 'book']
  };
  
  const { data: bookData, error: bookError } = await supabase
    .from('books')
    .insert(testBook)
    .select()
    .single();
    
  if (bookError) {
    console.error('❌ Error adding book:', bookError);
    
    // Let's check what the current user's profile looks like
    console.log('🔍 Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profileError) {
      console.error('❌ Error fetching profile:', profileError);
    } else {
      console.log('👤 User profile:', profile);
    }
    
    return;
  }
  
  console.log('✅ Successfully added book:', bookData);
  
  // Now let's check if we can read all books
  console.log('📖 Fetching all books...');
  const { data: allBooks, error: fetchError } = await supabase
    .from('books')
    .select('*');
    
  if (fetchError) {
    console.error('❌ Error fetching books:', fetchError);
  } else {
    console.log(`✅ Successfully fetched ${allBooks.length} books:`);
    allBooks.forEach(book => {
      console.log(`  - ${book.title} by ${book.author_name}`);
    });
  }
  
  // Sign out
  await supabase.auth.signOut();
  console.log('🚪 Signed out');
}

addBookAsAdmin().catch(console.error);
