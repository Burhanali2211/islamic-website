import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { authService } from './auth';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface UserFilters {
  role?: 'admin' | 'teacher' | 'student';
  isActive?: boolean;
  classLevel?: string;
  search?: string;
}

export interface UserResponse {
  data: Profile[] | Profile | null;
  error: string | null;
  count?: number;
}

class UsersService {
  // Get all users with filtering (Mustakhdimuun - مستخدمون)
  async getUsers(filters?: UserFilters, page = 1, limit = 20): Promise<UserResponse> {
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.classLevel) {
        query = query.eq('class_level', filters.classLevel);
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,student_id.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Order by role (admin first), then by name
      query = query.order('role', { ascending: true })
                   .order('full_name', { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null, count: count || 0 };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get students (Tullab - طلاب)
  async getStudents(page = 1, limit = 20): Promise<UserResponse> {
    return this.getUsers({ role: 'student' }, page, limit);
  }

  // Get teachers (Asatidha - أساتذة)
  async getTeachers(page = 1, limit = 20): Promise<UserResponse> {
    return this.getUsers({ role: 'teacher' }, page, limit);
  }

  // Get admins (Mudara' - مدراء)
  async getAdmins(page = 1, limit = 20): Promise<UserResponse> {
    return this.getUsers({ role: 'admin' }, page, limit);
  }

  // Create new user profile
  async createUser(userData: ProfileInsert): Promise<UserResponse> {
    try {
      // Generate student ID if role is student
      if (userData.role === 'student' && !userData.student_id) {
        userData.student_id = authService.generateStudentId();
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update user profile (Tahdith Bianat al-Mustakhdim - تحديث بيانات المستخدم)
  async updateUser(id: string, updates: ProfileUpdate): Promise<UserResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Delete user (Hadhf Mustakhdim - حذف مستخدم)
  async deleteUser(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Activate/Deactivate user (Taf'il/Ta'til Mustakhdim - تفعيل/تعطيل مستخدم)
  async toggleUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
    return this.updateUser(id, { is_active: isActive });
  }

  // Update user bookmarks
  async updateBookmarks(userId: string, bookmarks: string[]): Promise<UserResponse> {
    return this.updateUser(userId, { bookmarks });
  }

  // Add bookmark
  async addBookmark(userId: string, bookId: string): Promise<UserResponse> {
    try {
      const { data: user } = await this.getUserById(userId);
      if (!user) {
        return { data: null, error: 'User not found' };
      }

      const currentBookmarks = user.bookmarks || [];
      if (!currentBookmarks.includes(bookId)) {
        const newBookmarks = [...currentBookmarks, bookId];
        return this.updateBookmarks(userId, newBookmarks);
      }

      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Remove bookmark
  async removeBookmark(userId: string, bookId: string): Promise<UserResponse> {
    try {
      const { data: user } = await this.getUserById(userId);
      if (!user) {
        return { data: null, error: 'User not found' };
      }

      const currentBookmarks = user.bookmarks || [];
      const newBookmarks = currentBookmarks.filter(id => id !== bookId);
      return this.updateBookmarks(userId, newBookmarks);
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update recent reads
  async updateRecentReads(userId: string, bookId: string): Promise<UserResponse> {
    try {
      const { data: user } = await this.getUserById(userId);
      if (!user) {
        return { data: null, error: 'User not found' };
      }

      const currentReads = user.recent_reads || [];
      const newReads = [bookId, ...currentReads.filter(id => id !== bookId)].slice(0, 10);
      
      return this.updateUser(userId, { recent_reads: newReads });
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get user statistics for admin dashboard
  async getUserStatistics(): Promise<{
    total: number;
    byRole: Record<string, number>;
    active: number;
    inactive: number;
    newThisMonth: number;
    error: string | null;
  }> {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('role, is_active, created_at');

      if (error) {
        return {
          total: 0,
          byRole: {},
          active: 0,
          inactive: 0,
          newThisMonth: 0,
          error: error.message
        };
      }

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        total: users.length,
        byRole: {} as Record<string, number>,
        active: users.filter(u => u.is_active).length,
        inactive: users.filter(u => !u.is_active).length,
        newThisMonth: users.filter(u => new Date(u.created_at!) >= thisMonth).length,
        error: null
      };

      // Count by role
      users.forEach(user => {
        const role = user.role || 'student';
        stats.byRole[role] = (stats.byRole[role] || 0) + 1;
      });

      return stats;
    } catch (error) {
      return {
        total: 0,
        byRole: {},
        active: 0,
        inactive: 0,
        newThisMonth: 0,
        error: (error as Error).message
      };
    }
  }

  // Search users
  async searchUsers(query: string, filters?: Omit<UserFilters, 'search'>): Promise<UserResponse> {
    return this.getUsers({ ...filters, search: query });
  }

  // Get users by class level
  async getUsersByClass(classLevel: string): Promise<UserResponse> {
    return this.getUsers({ classLevel });
  }

  // Bulk update users
  async bulkUpdateUsers(updates: { id: string; data: ProfileUpdate }[]): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };

    for (const update of updates) {
      const { error } = await this.updateUser(update.id, update.data);
      if (error) {
        results.errors.push(`Failed to update user ${update.id}: ${error}`);
      } else {
        results.success++;
      }
    }

    return results;
  }

  // Check if student ID is unique
  async isStudentIdUnique(studentId: string, excludeUserId?: string): Promise<{ unique: boolean; error: string | null }> {
    try {
      let query = supabase
        .from('profiles')
        .select('id')
        .eq('student_id', studentId);

      if (excludeUserId) {
        query = query.neq('id', excludeUserId);
      }

      const { data, error } = await query;

      if (error) {
        return { unique: false, error: error.message };
      }

      return { unique: data.length === 0, error: null };
    } catch (error) {
      return { unique: false, error: (error as Error).message };
    }
  }

  // Get user's borrowing summary
  async getUserBorrowingSummary(userId: string): Promise<{
    currentBorrowed: number;
    totalBorrowed: number;
    maxLimit: number;
    canBorrow: boolean;
    error: string | null;
  }> {
    try {
      const { data: user } = await this.getUserById(userId);
      if (!user) {
        return {
          currentBorrowed: 0,
          totalBorrowed: 0,
          maxLimit: 0,
          canBorrow: false,
          error: 'User not found'
        };
      }

      const currentBorrowed = user.current_borrowed_count || 0;
      const totalBorrowed = user.total_books_borrowed || 0;
      const maxLimit = user.max_borrow_limit || 3;
      const canBorrow = currentBorrowed < maxLimit;

      return {
        currentBorrowed,
        totalBorrowed,
        maxLimit,
        canBorrow,
        error: null
      };
    } catch (error) {
      return {
        currentBorrowed: 0,
        totalBorrowed: 0,
        maxLimit: 0,
        canBorrow: false,
        error: (error as Error).message
      };
    }
  }
}

export const usersService = new UsersService();

// Export types for use in other files
export type { Profile, ProfileInsert, ProfileUpdate, UserFilters, UserResponse };
