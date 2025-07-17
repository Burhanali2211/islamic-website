import { supabase, supabaseAdmin } from '../lib/supabase';
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
    console.log('🔐 [AUTH_SERVICE] Starting signUp process...', { email, role: userData.role });
    try {
      console.log('📧 [AUTH_SERVICE] Attempting Supabase auth.signUp...');
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
        console.error('❌ [AUTH_SERVICE] Supabase auth.signUp error:', error);
        return { user: null, profile: null, session: null, error: error.message };
      }

      console.log('✅ [AUTH_SERVICE] Supabase auth.signUp successful:', {
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session
      });

      if (data.user) {
        // Wait a moment for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if profile was created by trigger, if not create it manually
        console.log('👤 [AUTH_SERVICE] Checking if profile exists...');
        const { data: existingProfile, error: checkError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ [AUTH_SERVICE] Error checking profile:', checkError);
          return { user: data.user, profile: null, session: data.session, error: checkError.message };
        }

        let profile = existingProfile;

        if (!existingProfile) {
          // Profile doesn't exist, create it manually
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

          console.log('👤 [AUTH_SERVICE] Creating profile manually...', { userId: data.user.id });
          const { data: newProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert(profileData)
            .select()
            .single();

          if (profileError) {
            console.error('❌ [AUTH_SERVICE] Profile creation error:', profileError);
            return { user: data.user, profile: null, session: data.session, error: profileError.message };
          }

          profile = newProfile;
          console.log('✅ [AUTH_SERVICE] Profile created manually:', { profileId: profile?.id });
        } else {
          // Profile exists (created by trigger), update it with additional data
          const updateData: Partial<IslamicProfile> = {
            full_name: userData.full_name || existingProfile.full_name,
            name_arabic: userData.name_arabic,
            guardian_name: userData.guardian_name,
            guardian_phone: userData.guardian_phone,
            class_level: userData.class_level,
            preferred_language: userData.preferred_language || 'en',
            max_borrow_limit: userData.role === 'teacher' ? 10 : userData.role === 'admin' ? 50 : 3,
          };

          console.log('👤 [AUTH_SERVICE] Updating existing profile...', { userId: data.user.id });
          const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update(updateData)
            .eq('id', data.user.id)
            .select()
            .single();

          if (updateError) {
            console.error('❌ [AUTH_SERVICE] Profile update error:', updateError);
            // Still return success since profile exists
            profile = existingProfile;
          } else {
            profile = updatedProfile;
            console.log('✅ [AUTH_SERVICE] Profile updated successfully:', { profileId: profile?.id });
          }
        }

        return { user: data.user, profile, session: data.session, error: null };
      }

      console.error('❌ [AUTH_SERVICE] No user returned from signUp');
      return { user: null, profile: null, session: null, error: 'Registration failed' };
    } catch (error) {
      console.error('💥 [AUTH_SERVICE] SignUp error caught:', error);
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

  // Get current user profile with enhanced error handling
  async getProfile(userId: string): Promise<IslamicProfile | null> {
    try {
      console.log('🔍 [AUTH] Fetching profile for user:', userId);

      // First check if user exists in auth.users
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('❌ [AUTH] Error getting current user:', userError);
        return null;
      }

      if (!user || user.id !== userId) {
        console.error('❌ [AUTH] User mismatch or not authenticated');
        return null;
      }

      // Try to get profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ [AUTH] Error fetching profile from database:', error);

        // If profile doesn't exist, create it from auth metadata
        if (error.code === 'PGRST116') { // No rows returned
          console.log('🔧 [AUTH] Profile not found, creating from auth metadata...');
          return await this.createProfileFromAuth(user);
        }

        return null;
      }

      console.log('✅ [AUTH] Profile fetched successfully:', { id: data.id, role: data.role });
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Error in getProfile:', error);
      return null;
    }
  }

  // Create profile from auth user metadata
  private async createProfileFromAuth(user: any): Promise<IslamicProfile | null> {
    try {
      const metadata = user.user_metadata || {};
      const appMetadata = user.app_metadata || {};

      // First check if profile already exists
      const { data: existingProfile, error: checkError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ [AUTH] Error checking existing profile:', checkError);
        return null;
      }

      if (existingProfile) {
        console.log('✅ [AUTH] Profile already exists:', existingProfile);
        return existingProfile;
      }

      const profileData: Partial<IslamicProfile> = {
        id: user.id,
        email: user.email,
        full_name: metadata.full_name || user.email?.split('@')[0] || 'User',
        name_arabic: metadata.name_arabic,
        role: metadata.role || appMetadata.role || 'student',
        is_active: true,
        preferred_language: metadata.preferred_language || 'en',
        max_borrow_limit: metadata.role === 'admin' ? 50 : metadata.role === 'teacher' ? 10 : 3,
        enrollment_date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ [AUTH] Error creating profile:', error);

        // If it's a duplicate key error, try to fetch the existing profile
        if (error.code === '23505') {
          console.log('🔄 [AUTH] Duplicate key error, fetching existing profile...');
          const { data: retryProfile, error: retryError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (retryError) {
            console.error('❌ [AUTH] Error fetching existing profile after duplicate:', retryError);
            return null;
          }

          return retryProfile;
        }

        return null;
      }

      console.log('✅ [AUTH] Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ [AUTH] Error in createProfileFromAuth:', error);
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
    const name = profile?.full_name || 'Dear Student';

    if (hour < 12) {
      return `Good morning, ${name}`;
    } else if (hour < 18) {
      return `Good afternoon, ${name}`;
    } else {
      return `Good evening, ${name}`;
    }
  }

  // Get role display name
  getRoleDisplayName(role: string): string {
    const roleNames = {
      admin: 'Administrator',
      teacher: 'Teacher',
      student: 'Student'
    };

    return roleNames[role as keyof typeof roleNames] || role;
  }
}

export const authService = new AuthService();
