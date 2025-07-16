import { createClient } from '@supabase/supabase-js';

// Supabase configuration for IDARAH WALI UL ASER Islamic Library
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dzuzcssqvgcvqddjctqg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dXpjc3NxdmdjdnFkZGpjdHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTQ2NDUsImV4cCI6MjA2NjEzMDY0NX0.rd3zI6EpmKNiRF1E4HlEBoMMzTIl7HKhdgj6cNSMuKM';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          title_arabic?: string;
          author: string;
          author_arabic?: string;
          category: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'history' | 'biography' | 'aqeedah' | 'seerah' | 'dua' | 'islamic_law';
          subcategory?: string;
          description?: string;
          description_arabic?: string;
          cover_image_url?: string;
          language: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          file_url?: string;
          file_type?: 'pdf' | 'epub' | 'audio' | 'video';
          isbn?: string;
          publisher?: string;
          publisher_arabic?: string;
          published_date?: string;
          pages?: number;
          download_count?: number;
          rating?: number;
          rating_count?: number;
          tags?: string[];
          is_featured?: boolean;
          is_available?: boolean;
          physical_copies?: number;
          digital_copies?: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_arabic?: string;
          author: string;
          author_arabic?: string;
          category: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'history' | 'biography' | 'aqeedah' | 'seerah' | 'dua' | 'islamic_law';
          subcategory?: string;
          description?: string;
          description_arabic?: string;
          cover_image_url?: string;
          language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          file_url?: string;
          file_type?: 'pdf' | 'epub' | 'audio' | 'video';
          isbn?: string;
          publisher?: string;
          publisher_arabic?: string;
          published_date?: string;
          pages?: number;
          download_count?: number;
          rating?: number;
          rating_count?: number;
          tags?: string[];
          is_featured?: boolean;
          is_available?: boolean;
          physical_copies?: number;
          digital_copies?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_arabic?: string;
          author?: string;
          author_arabic?: string;
          category?: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'history' | 'biography' | 'aqeedah' | 'seerah' | 'dua' | 'islamic_law';
          subcategory?: string;
          description?: string;
          description_arabic?: string;
          cover_image_url?: string;
          language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          file_url?: string;
          file_type?: 'pdf' | 'epub' | 'audio' | 'video';
          isbn?: string;
          publisher?: string;
          publisher_arabic?: string;
          published_date?: string;
          pages?: number;
          download_count?: number;
          rating?: number;
          rating_count?: number;
          tags?: string[];
          is_featured?: boolean;
          is_available?: boolean;
          physical_copies?: number;
          digital_copies?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name?: string;
          name_arabic?: string;
          avatar_url?: string;
          phone?: string;
          date_of_birth?: string;
          gender?: string;
          is_admin?: boolean;
          is_vendor?: boolean;
          email_verified?: boolean;
          phone_verified?: boolean;
          marketing_emails?: boolean;
          role?: 'admin' | 'teacher' | 'student';
          guardian_name?: string;
          guardian_phone?: string;
          student_id?: string;
          class_level?: string;
          enrollment_date?: string;
          is_active?: boolean;
          preferred_language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          bookmarks?: string[];
          recent_reads?: string[];
          total_books_borrowed?: number;
          current_borrowed_count?: number;
          max_borrow_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          name_arabic?: string;
          avatar_url?: string;
          phone?: string;
          date_of_birth?: string;
          gender?: string;
          is_admin?: boolean;
          is_vendor?: boolean;
          email_verified?: boolean;
          phone_verified?: boolean;
          marketing_emails?: boolean;
          role?: 'admin' | 'teacher' | 'student';
          guardian_name?: string;
          guardian_phone?: string;
          student_id?: string;
          class_level?: string;
          enrollment_date?: string;
          is_active?: boolean;
          preferred_language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          bookmarks?: string[];
          recent_reads?: string[];
          total_books_borrowed?: number;
          current_borrowed_count?: number;
          max_borrow_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          name_arabic?: string;
          avatar_url?: string;
          phone?: string;
          date_of_birth?: string;
          gender?: string;
          is_admin?: boolean;
          is_vendor?: boolean;
          email_verified?: boolean;
          phone_verified?: boolean;
          marketing_emails?: boolean;
          role?: 'admin' | 'teacher' | 'student';
          guardian_name?: string;
          guardian_phone?: string;
          student_id?: string;
          class_level?: string;
          enrollment_date?: string;
          is_active?: boolean;
          preferred_language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          bookmarks?: string[];
          recent_reads?: string[];
          total_books_borrowed?: number;
          current_borrowed_count?: number;
          max_borrow_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      borrowing_records: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          borrowed_date?: string;
          due_date: string;
          returned_date?: string;
          status?: 'active' | 'returned' | 'overdue' | 'lost';
          renewal_count?: number;
          max_renewals?: number;
          fine_amount?: number;
          notes?: string;
          issued_by?: string;
          returned_to?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          borrowed_date?: string;
          due_date: string;
          returned_date?: string;
          status?: 'active' | 'returned' | 'overdue' | 'lost';
          renewal_count?: number;
          max_renewals?: number;
          fine_amount?: number;
          notes?: string;
          issued_by?: string;
          returned_to?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          borrowed_date?: string;
          due_date?: string;
          returned_date?: string;
          status?: 'active' | 'returned' | 'overdue' | 'lost';
          renewal_count?: number;
          max_renewals?: number;
          fine_amount?: number;
          notes?: string;
          issued_by?: string;
          returned_to?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      islamic_categories: {
        Row: {
          id: string;
          name: string;
          name_arabic?: string;
          description?: string;
          description_arabic?: string;
          parent_category_id?: string;
          category_type: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'history' | 'biography' | 'aqeedah' | 'seerah' | 'dua' | 'islamic_law';
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_arabic?: string;
          description?: string;
          description_arabic?: string;
          parent_category_id?: string;
          category_type: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'history' | 'biography' | 'aqeedah' | 'seerah' | 'dua' | 'islamic_law';
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_arabic?: string;
          description?: string;
          description_arabic?: string;
          parent_category_id?: string;
          category_type?: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'history' | 'biography' | 'aqeedah' | 'seerah' | 'dua' | 'islamic_law';
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          current_page?: number;
          total_pages?: number;
          progress_percentage?: number;
          last_read_date?: string;
          reading_time_minutes?: number;
          notes?: string;
          bookmarks_pages?: number[];
          is_completed?: boolean;
          completion_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          current_page?: number;
          total_pages?: number;
          progress_percentage?: number;
          last_read_date?: string;
          reading_time_minutes?: number;
          notes?: string;
          bookmarks_pages?: number[];
          is_completed?: boolean;
          completion_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          current_page?: number;
          total_pages?: number;
          progress_percentage?: number;
          last_read_date?: string;
          reading_time_minutes?: number;
          notes?: string;
          bookmarks_pages?: number[];
          is_completed?: boolean;
          completion_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      islamic_events: {
        Row: {
          id: string;
          title: string;
          title_arabic?: string;
          description?: string;
          description_arabic?: string;
          event_date: string;
          hijri_date?: string;
          event_type?: string;
          is_recurring?: boolean;
          recurrence_pattern?: string;
          location?: string;
          organizer_id?: string;
          max_participants?: number;
          current_participants?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_arabic?: string;
          description?: string;
          description_arabic?: string;
          event_date: string;
          hijri_date?: string;
          event_type?: string;
          is_recurring?: boolean;
          recurrence_pattern?: string;
          location?: string;
          organizer_id?: string;
          max_participants?: number;
          current_participants?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_arabic?: string;
          description?: string;
          description_arabic?: string;
          event_date?: string;
          hijri_date?: string;
          event_type?: string;
          is_recurring?: boolean;
          recurrence_pattern?: string;
          location?: string;
          organizer_id?: string;
          max_participants?: number;
          current_participants?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
