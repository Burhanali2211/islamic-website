// Simple test script to add a book directly to the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI3OTgsImV4cCI6MjA2ODI4ODc5OH0.qSJ3Dqr-jza_mEJu0byxChZO8AVTHV3yUrW8zbrjOO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAddBook() {
  console.log('🧪 Testing book addition...');
  
  // First, let's check if the books table exists
  const { data: tables, error: tablesError } = await supabase
    .from('books')
    .select('*')
    .limit(1);
    
  if (tablesError) {
    console.error('❌ Error accessing books table:', tablesError);
    return;
  }
  
  console.log('✅ Books table accessible');
  
  // Try to add a simple test book
  const testBook = {
    title: 'Test Islamic Book',
    title_arabic: 'كتاب إسلامي تجريبي',
    author_name: 'Test Author',
    author_arabic: 'مؤلف تجريبي',
    category: 'general',
    description: 'This is a test book to verify the database connection and book creation functionality.',
    description_arabic: 'هذا كتاب تجريبي للتحقق من اتصال قاعدة البيانات ووظيفة إنشاء الكتب.',
    language: 'en',
    pages: 100,
    is_featured: false,
    is_available: true,
    physical_copies: 1,
    rating: 4.5,
    download_count: 0,
    tags: ['test', 'islamic', 'book']
  };
  
  const { data, error } = await supabase
    .from('books')
    .insert(testBook)
    .select()
    .single();
    
  if (error) {
    console.error('❌ Error adding test book:', error);
    return;
  }
  
  console.log('✅ Test book added successfully:', data);
  
  // Now let's check if we can retrieve it
  const { data: books, error: fetchError } = await supabase
    .from('books')
    .select('*');
    
  if (fetchError) {
    console.error('❌ Error fetching books:', fetchError);
    return;
  }
  
  console.log('📚 Total books in database:', books.length);
  console.log('📖 Books:', books);
}

testAddBook().catch(console.error);
