// Enhanced Data Manager - Combines real database operations with local storage
import { supabase } from '../lib/supabase';
import { booksService } from './books';
import { usersService } from './users';
import { borrowingService } from './borrowing';
import { categoriesService } from './categories';
import { coursesService } from './courses';
import { localStorageService, type DraftData } from './localStorage';
import type { ApiResponse } from '../types';

export interface DataManagerOptions {
  useCache?: boolean;
  autoSave?: boolean;
  realTimeUpdates?: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class DataManager {
  private cache = new Map<string, CacheEntry<any>>();
  private subscriptions = new Map<string, any>();
  private pendingRequests = new Map<string, Promise<any>>(); // Track pending requests
  private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================

  // Subscribe to table changes
  subscribeToTable(
    table: string, 
    callback: (payload: any) => void,
    filter?: string
  ): () => void {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        callback
      )
      .subscribe();

    const unsubscribe = () => {
      subscription.unsubscribe();
      this.subscriptions.delete(table);
    };

    this.subscriptions.set(table, unsubscribe);
    return unsubscribe;
  }

  // Subscribe to user-specific data
  subscribeToUserData(userId: string, callback: (payload: any) => void): () => void {
    const tables = ['borrowing_records', 'reading_progress', 'notifications', 'course_enrollments'];
    const unsubscribers: (() => void)[] = [];

    tables.forEach(table => {
      const unsubscribe = this.subscribeToTable(
        table,
        callback,
        `user_id=eq.${userId}`
      );
      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  // Clean up expired cache entries and pending requests
  private cleanupCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Clean up all resources
  cleanup() {
    this.cache.clear();
    this.pendingRequests.clear();
    this.subscriptions.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    this.subscriptions.clear();
  }

  // ============================================================================
  // ENHANCED CRUD OPERATIONS WITH CACHING
  // ============================================================================

  // Get data with caching and duplicate request prevention
  async getData<T>(
    key: string,
    fetcher: () => Promise<ApiResponse<T>>,
    options: DataManagerOptions = {}
  ): Promise<ApiResponse<T>> {
    const { useCache = true } = options;

    // Check cache first
    if (useCache) {
      const cached = this.cache.get(key);
      if (cached && Date.now() < cached.expiry) {
        console.log('📦 [DATA_MANAGER] Cache hit for:', key);
        return { data: cached.data, error: null };
      }
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      console.log('⏳ [DATA_MANAGER] Request already pending for:', key);
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    console.log('🔄 [DATA_MANAGER] Fetching data for:', key);
    const requestPromise = this.executeRequest(key, fetcher, useCache);
    this.pendingRequests.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(key);
    }
  }

  private async executeRequest<T>(
    key: string,
    fetcher: () => Promise<ApiResponse<T>>,
    useCache: boolean
  ): Promise<ApiResponse<T>> {
    try {
      console.log('🚀 [DATA_MANAGER] Executing fetcher for:', key);

      // Fetch from database
      const result = await fetcher();

      console.log('📊 [DATA_MANAGER] Fetcher result for', key, ':', {
        hasData: !!result.data,
        dataLength: Array.isArray(result.data) ? result.data.length : 'not array',
        error: result.error
      });

      // Cache successful results
      if (result.data && useCache) {
        this.cache.set(key, {
          data: result.data,
          timestamp: Date.now(),
          expiry: Date.now() + this.CACHE_EXPIRY
        });
        console.log('💾 [DATA_MANAGER] Cached result for:', key);
      }

      return result;
    } catch (error) {
      console.error('❌ [DATA_MANAGER] Request failed for:', key, error);
      return { data: null, error: (error as Error).message };
    }
  }

  // Save data with draft support
  async saveData<T>(
    key: string,
    data: any,
    saver: (data: any) => Promise<ApiResponse<T>>,
    options: DataManagerOptions = {}
  ): Promise<ApiResponse<T>> {
    const { autoSave = false } = options;

    try {
      // Save draft first if auto-save is enabled
      if (autoSave) {
        const draft: DraftData = {
          id: key,
          type: this.extractTypeFromKey(key),
          data,
          userId: await this.getCurrentUserId(),
          timestamp: Date.now(),
          autoSave: true
        };
        localStorageService.saveDraft(draft);
      }

      // Save to database
      const result = await saver(data);

      // Clear draft on successful save
      if (result.data && autoSave) {
        localStorageService.deleteDraft(this.extractTypeFromKey(key), key);
      }

      // Invalidate cache
      this.cache.delete(key);

      return result;
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // DASHBOARD STATISTICS WITH CACHING
  // ============================================================================

  async getDashboardStats(userId?: string): Promise<ApiResponse<any>> {
    const cacheKey = `dashboard_stats_${userId || 'all'}`;

    return this.getData(cacheKey, async () => {
      try {
        const [bookStats, userStats, borrowingStats, categoryStats] = await Promise.all([
          this.getBookStatistics(),
          this.getUserStatistics(),
          this.getBorrowingStatistics(),
          this.getCategoryStatistics()
        ]);

        const stats = {
          books: bookStats.data || { total: 0, featured: 0, available: 0, byCategory: {}, byLanguage: {} },
          users: userStats.data || { total: 0, active: 0, byRole: {}, newThisMonth: 0 },
          borrowing: borrowingStats.data || { totalActive: 0, totalOverdue: 0, totalReturned: 0, totalFines: 0, activeUsers: 0, popularBooks: [] },
          categories: categoryStats.data || { totalCategories: 0, activeCategories: 0, byType: {} }
        };

        return { data: stats, error: null };
      } catch (error) {
        return { data: null, error: (error as Error).message };
      }
    });
  }

  // ============================================================================
  // STATISTICS HELPERS
  // ============================================================================

  private async getBookStatistics(): Promise<ApiResponse<any>> {
    try {
      const { data: books, error } = await supabase
        .from('books')
        .select('category, language, is_featured, is_available');

      if (error) {
        return { data: null, error: error.message };
      }

      const stats = {
        total: books?.length || 0,
        featured: books?.filter(b => b.is_featured).length || 0,
        available: books?.filter(b => b.is_available).length || 0,
        byCategory: this.groupBy(books || [], 'category'),
        byLanguage: this.groupBy(books || [], 'language')
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  private async getUserStatistics(): Promise<ApiResponse<any>> {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('role, is_active, created_at');

      if (error) {
        return { data: null, error: error.message };
      }

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        total: users?.length || 0,
        active: users?.filter(u => u.is_active).length || 0,
        byRole: this.groupBy(users || [], 'role'),
        newThisMonth: users?.filter(u => new Date(u.created_at) >= thisMonth).length || 0
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  private async getBorrowingStatistics(): Promise<ApiResponse<any>> {
    try {
      const { data: borrowings, error } = await supabase
        .from('borrowing_records')
        .select(`
          status,
          user_id,
          book_id,
          books(id, title, author_name)
        `);

      if (error) {
        return { data: null, error: error.message };
      }

      const stats = {
        totalActive: borrowings?.filter(b => b.status === 'active').length || 0,
        totalOverdue: borrowings?.filter(b => b.status === 'overdue').length || 0,
        totalReturned: borrowings?.filter(b => b.status === 'returned').length || 0,
        totalFines: 0, // Would need to query fines table
        activeUsers: new Set(borrowings?.filter(b => b.status === 'active').map(b => b.user_id)).size || 0,
        popularBooks: this.getPopularBooks(borrowings || [])
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  private async getCategoryStatistics(): Promise<ApiResponse<any>> {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('category_type, is_active');

      if (error) {
        return { data: null, error: error.message };
      }

      const stats = {
        totalCategories: categories?.length || 0,
        activeCategories: categories?.filter(c => c.is_active).length || 0,
        byType: this.groupBy(categories || [], 'category_type')
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = item[key] || 'unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private getPopularBooks(borrowings: any[]): any[] {
    const bookCounts = this.groupBy(borrowings, 'book_id');
    return Object.entries(bookCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([bookId, count]) => {
        const borrowing = borrowings.find(b => b.book_id === bookId);
        return {
          book_id: bookId,
          count,
          book: borrowing?.books || { id: bookId, title: 'Unknown', author_name: 'Unknown' }
        };
      });
  }

  private extractTypeFromKey(key: string): 'book' | 'assignment' | 'quiz' | 'course' | 'user' | 'category' {
    if (key.includes('book')) return 'book';
    if (key.includes('assignment')) return 'assignment';
    if (key.includes('quiz')) return 'quiz';
    if (key.includes('course')) return 'course';
    if (key.includes('user')) return 'user';
    return 'category';
  }

  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }
}

export const dataManager = new DataManager();
