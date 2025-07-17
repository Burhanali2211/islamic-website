import { createClient } from '@supabase/supabase-js';

// Supabase configuration for IDARAH WALI UL ASER Islamic Library
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bxyzvaujvhumupwdmysh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI3OTgsImV4cCI6MjA2ODI4ODc5OH0.qSJ3Dqr-jza_mEJu0byxChZO8AVTHV3yUrW8zbrjOO4';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjcxMjc5OCwiZXhwIjoyMDY4Mjg4Nzk4fQ.VABQbqQOcmqih7Z7jB-O43-xSCvckNBPyXYJ6doirzU';

// Create Supabase client for regular operations
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

// Create Supabase admin client for service operations (profile creation, etc.)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
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
          subtitle?: string;
          subtitle_arabic?: string;
          author_id?: string;
          author_name: string;
          author_arabic?: string;
          publisher_id?: string;
          publisher_name?: string;
          publisher_arabic?: string;
          category_id?: string;
          category: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
          subcategory?: string;
          description?: string;
          description_arabic?: string;
          language: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          isbn?: string;
          pages?: number;
          edition?: number;
          published_date?: string;
          cover_image_url?: string;
          file_url?: string;
          file_type?: 'pdf' | 'epub' | 'audio' | 'video';
          file_size_mb?: number;
          physical_copies?: number;
          digital_copies?: number;
          available_copies?: number;
          is_available?: boolean;
          location_shelf?: string;
          location_section?: string;
          download_count?: number;
          borrow_count?: number;
          rating?: number;
          rating_count?: number;
          is_featured?: boolean;
          is_recommended?: boolean;
          age_restriction?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_arabic?: string;
          subtitle?: string;
          subtitle_arabic?: string;
          author_id?: string;
          author_name: string;
          author_arabic?: string;
          publisher_id?: string;
          publisher_name?: string;
          publisher_arabic?: string;
          category_id?: string;
          category: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
          subcategory?: string;
          description?: string;
          description_arabic?: string;
          language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          isbn?: string;
          pages?: number;
          edition?: number;
          published_date?: string;
          cover_image_url?: string;
          file_url?: string;
          file_type?: 'pdf' | 'epub' | 'audio' | 'video';
          file_size_mb?: number;
          physical_copies?: number;
          digital_copies?: number;
          available_copies?: number;
          is_available?: boolean;
          location_shelf?: string;
          location_section?: string;
          download_count?: number;
          borrow_count?: number;
          rating?: number;
          rating_count?: number;
          is_featured?: boolean;
          is_recommended?: boolean;
          age_restriction?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_arabic?: string;
          subtitle?: string;
          subtitle_arabic?: string;
          author_id?: string;
          author_name?: string;
          author_arabic?: string;
          publisher_id?: string;
          publisher_name?: string;
          publisher_arabic?: string;
          category_id?: string;
          category?: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
          subcategory?: string;
          description?: string;
          description_arabic?: string;
          language?: 'ar' | 'en' | 'ur' | 'fa' | 'tr';
          isbn?: string;
          pages?: number;
          edition?: number;
          published_date?: string;
          cover_image_url?: string;
          file_url?: string;
          file_type?: 'pdf' | 'epub' | 'audio' | 'video';
          file_size_mb?: number;
          physical_copies?: number;
          digital_copies?: number;
          available_copies?: number;
          is_available?: boolean;
          location_shelf?: string;
          location_section?: string;
          download_count?: number;
          borrow_count?: number;
          rating?: number;
          rating_count?: number;
          is_featured?: boolean;
          is_recommended?: boolean;
          age_restriction?: number;
          tags?: string[];
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
      categories: {
        Row: {
          id: string;
          name: string;
          name_arabic?: string;
          description?: string;
          description_arabic?: string;
          parent_id?: string;
          category_type: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
          sort_order?: number;
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
          parent_id?: string;
          category_type: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
          sort_order?: number;
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
          parent_id?: string;
          category_type?: 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
          sort_order?: number;
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
