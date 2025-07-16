import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface IslamicProfile {
  id: string;
  email: string;
  full_name?: string;
  name_arabic?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
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
}

export interface AuthResponse {
  user: User | null;
  profile: IslamicProfile | null;
  session: Session | null;
  error: string | null;
}

class AuthService {
  // Sign up new user (Tasjeel - تسجيل)
  async signUp(email: string, password: string, userData: Partial<IslamicProfile>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            name_arabic: userData.name_arabic,
            role: userData.role || 'student'
          }
        }
      });

      if (error) {
        return { user: null, profile: null, session: null, error: error.message };
      }

      if (data.user) {
        // Create profile in profiles table
        const profileData: Partial<IslamicProfile> = {
          id: data.user.id,
          email: data.user.email!,
          full_name: userData.full_name,
          name_arabic: userData.name_arabic,
          role: userData.role || 'student',
          guardian_name: userData.guardian_name,
          guardian_phone: userData.guardian_phone,
          class_level: userData.class_level,
          preferred_language: userData.preferred_language || 'en',
          is_active: true,
          max_borrow_limit: userData.role === 'teacher' ? 10 : 3,
          enrollment_date: new Date().toISOString().split('T')[0]
        };

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          return { user: data.user, profile: null, session: data.session, error: profileError.message };
        }

        return { user: data.user, profile, session: data.session, error: null };
      }

      return { user: null, profile: null, session: null, error: 'Registration failed' };
    } catch (error) {
      return { user: null, profile: null, session: null, error: (error as Error).message };
    }
  }

  // Sign in user (Dukhuul - دخول)
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, profile: null, session: null, error: error.message };
      }

      if (data.user) {
        const profile = await this.getProfile(data.user.id);
        return { user: data.user, profile, session: data.session, error: null };
      }

      return { user: null, profile: null, session: null, error: 'Login failed' };
    } catch (error) {
      return { user: null, profile: null, session: null, error: (error as Error).message };
    }
  }

  // Sign out user (Khuruuj - خروج)
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Get current user profile
  async getProfile(userId: string): Promise<IslamicProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<IslamicProfile>): Promise<{ profile: IslamicProfile | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: (error as Error).message };
    }
  }

  // Get current session
  async getCurrentSession(): Promise<{ user: User | null; session: Session | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    return { user: session?.user || null, session };
  }

  // Reset password (I'adat Kalimat al-Muruur - إعادة كلمة المرور)
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Check if user has specific role
  hasRole(profile: IslamicProfile | null, role: 'admin' | 'teacher' | 'student'): boolean {
    return profile?.role === role;
  }

  // Check if user is admin (Mudir - مدير)
  isAdmin(profile: IslamicProfile | null): boolean {
    return this.hasRole(profile, 'admin');
  }

  // Check if user is teacher (Ustadh - أستاذ)
  isTeacher(profile: IslamicProfile | null): boolean {
    return this.hasRole(profile, 'teacher');
  }

  // Check if user is student (Talib - طالب)
  isStudent(profile: IslamicProfile | null): boolean {
    return this.hasRole(profile, 'student');
  }

  // Check if user can access admin features
  canAccessAdmin(profile: IslamicProfile | null): boolean {
    return this.isAdmin(profile);
  }

  // Check if user can access teacher features
  canAccessTeacher(profile: IslamicProfile | null): boolean {
    return this.isAdmin(profile) || this.isTeacher(profile);
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Generate student ID (Raqam al-Talib - رقم الطالب)
  generateStudentId(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `IWA${year}${randomNum}`;
  }

  // Validate Islamic name (Arabic characters)
  validateArabicName(name: string): boolean {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicRegex.test(name);
  }

  // Get user's Islamic greeting based on time
  getIslamicGreeting(profile: IslamicProfile | null): string {
    const hour = new Date().getHours();
    const name = profile?.full_name || profile?.name_arabic || 'أخي الكريم';
    
    if (hour < 12) {
      return `صباح الخير، ${name}`;
    } else if (hour < 18) {
      return `مساء الخير، ${name}`;
    } else {
      return `مساء الخير، ${name}`;
    }
  }

  // Get role display name in Arabic
  getRoleDisplayName(role: string, language: 'ar' | 'en' = 'en'): string {
    const roleNames = {
      admin: { ar: 'مدير', en: 'Administrator' },
      teacher: { ar: 'أستاذ', en: 'Teacher' },
      student: { ar: 'طالب', en: 'Student' }
    };

    return roleNames[role as keyof typeof roleNames]?.[language] || role;
  }
}

export const authService = new AuthService();
