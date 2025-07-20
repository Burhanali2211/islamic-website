// Script to fix the database RLS policies and add test data
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI3OTgsImV4cCI6MjA2ODI4ODc5OH0.qSJ3Dqr-jza_mEJu0byxChZO8AVTHV3yUrW8zbrjOO4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabase() {
  console.log('🔧 Starting database fix...');
  
  try {
    // First, let's try to add some test books directly
    console.log('📚 Adding test books...');
    
    const testBooks = [
      {
        title: 'Sahih Al-Bukhari',
        title_arabic: 'صحيح البخاري',
        author_name: 'Imam Muhammad al-Bukhari',
        author_arabic: 'الإمام محمد البخاري',
        category: 'hadith',
        description: 'The most authentic collection of Prophetic traditions, compiled by Imam al-Bukhari.',
        description_arabic: 'أصح مجموعة من الأحاديث النبوية الشريفة، جمعها الإمام البخاري.',
        language: 'ar',
        pages: 2000,
        is_featured: true,
        is_available: true,
        physical_copies: 5,
        rating: 4.9,
        download_count: 1250,
        tags: ['hadith', 'authentic', 'bukhari', 'sunnah']
      },
      {
        title: 'Tafseer Ibn Kathir',
        title_arabic: 'تفسير ابن كثير',
        author_name: 'Ibn Kathir',
        author_arabic: 'ابن كثير',
        category: 'tafsir',
        description: 'A comprehensive commentary on the Holy Quran by the renowned scholar Ibn Kathir.',
        description_arabic: 'تفسير شامل للقرآن الكريم من قبل العالم الجليل ابن كثير.',
        language: 'ar',
        pages: 3500,
        is_featured: true,
        is_available: true,
        physical_copies: 3,
        rating: 4.8,
        download_count: 980,
        tags: ['tafsir', 'quran', 'commentary', 'ibn kathir']
      },
      {
        title: 'Riyadh as-Salihin',
        title_arabic: 'رياض الصالحين',
        author_name: 'Imam an-Nawawi',
        author_arabic: 'الإمام النووي',
        category: 'hadith',
        description: 'A collection of authentic hadiths compiled by Imam an-Nawawi for spiritual development.',
        description_arabic: 'مجموعة من الأحاديث الصحيحة جمعها الإمام النووي للتطوير الروحي.',
        language: 'ar',
        pages: 800,
        is_featured: true,
        is_available: true,
        physical_copies: 7,
        rating: 4.7,
        download_count: 1500,
        tags: ['hadith', 'nawawi', 'spiritual', 'development']
      }
    ];

    // Try to insert books one by one to see which ones work
    for (const book of testBooks) {
      try {
        const { data, error } = await supabase
          .from('books')
          .insert(book)
          .select()
          .single();
          
        if (error) {
          console.error(`❌ Error adding book "${book.title}":`, error.message);
        } else {
          console.log(`✅ Successfully added book: ${book.title}`);
        }
      } catch (err) {
        console.error(`❌ Exception adding book "${book.title}":`, err.message);
      }
    }

    // Now let's check if we can read books
    console.log('\n📖 Checking if books are readable...');
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*');
      
    if (booksError) {
      console.error('❌ Error reading books:', booksError.message);
    } else {
      console.log(`✅ Successfully read ${books.length} books from database`);
      books.forEach(book => {
        console.log(`  - ${book.title} by ${book.author_name}`);
      });
    }

    // Check categories
    console.log('\n🏷️ Checking categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
      
    if (categoriesError) {
      console.error('❌ Error reading categories:', categoriesError.message);
    } else {
      console.log(`✅ Successfully read ${categories.length} categories from database`);
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.name_arabic})`);
      });
    }

  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

fixDatabase().catch(console.error);
