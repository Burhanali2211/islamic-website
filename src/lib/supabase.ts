import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Admin client for server-side operations (if needed)
// Note: This should only be used in secure server environments
// For client-side operations, use the regular supabase client above
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database types (you can extend these based on your actual database schema)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          name_arabic: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: 'admin' | 'teacher' | 'student' | 'librarian';
          status: 'active' | 'inactive' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          name_arabic?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'admin' | 'teacher' | 'student' | 'librarian';
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          name_arabic?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: 'admin' | 'teacher' | 'student' | 'librarian';
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          title_arabic: string | null;
          author: string;
          author_arabic: string | null;
          isbn: string | null;
          category_id: string | null;
          description: string | null;
          description_arabic: string | null;
          cover_url: string | null;
          pdf_url: string | null;
          total_copies: number;
          available_copies: number;
          language: 'arabic' | 'english' | 'urdu' | 'other';
          publication_year: number | null;
          publisher: string | null;
          status: 'available' | 'unavailable' | 'maintenance';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_arabic?: string | null;
          author: string;
          author_arabic?: string | null;
          isbn?: string | null;
          category_id?: string | null;
          description?: string | null;
          description_arabic?: string | null;
          cover_url?: string | null;
          pdf_url?: string | null;
          total_copies?: number;
          available_copies?: number;
          language?: 'arabic' | 'english' | 'urdu' | 'other';
          publication_year?: number | null;
          publisher?: string | null;
          status?: 'available' | 'unavailable' | 'maintenance';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_arabic?: string | null;
          author?: string;
          author_arabic?: string | null;
          isbn?: string | null;
          category_id?: string | null;
          description?: string | null;
          description_arabic?: string | null;
          cover_url?: string | null;
          pdf_url?: string | null;
          total_copies?: number;
          available_copies?: number;
          language?: 'arabic' | 'english' | 'urdu' | 'other';
          publication_year?: number | null;
          publisher?: string | null;
          status?: 'available' | 'unavailable' | 'maintenance';
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          name_arabic: string | null;
          description: string | null;
          description_arabic: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_arabic?: string | null;
          description?: string | null;
          description_arabic?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_arabic?: string | null;
          description?: string | null;
          description_arabic?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      borrowing_records: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          borrowed_at: string;
          due_date: string;
          returned_at: string | null;
          status: 'active' | 'returned' | 'overdue' | 'lost';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          borrowed_at?: string;
          due_date: string;
          returned_at?: string | null;
          status?: 'active' | 'returned' | 'overdue' | 'lost';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          borrowed_at?: string;
          due_date?: string;
          returned_at?: string | null;
          status?: 'active' | 'returned' | 'overdue' | 'lost';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'teacher' | 'student' | 'librarian';
      user_status: 'active' | 'inactive' | 'suspended';
      book_language: 'arabic' | 'english' | 'urdu' | 'other';
      book_status: 'available' | 'unavailable' | 'maintenance';
      borrowing_status: 'active' | 'returned' | 'overdue' | 'lost';
    };
  };
};

// Export typed client
export type SupabaseClient = typeof supabase;
