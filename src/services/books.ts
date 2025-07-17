import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

export interface BookFilters {
  category?: string;
  language?: string;
  author?: string;
  search?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  tags?: string[];
}

export interface BookResponse {
  data: Book[] | Book | null;
  error: string | null;
  count?: number;
}

class BooksService {
  // Get all books with optional filtering (Kutub - كتب)
  async getBooks(filters?: BookFilters, page = 1, limit = 20): Promise<BookResponse> {
    try {
      let query = supabase
        .from('books')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.language) {
        query = query.eq('language', filters.language);
      }

      if (filters?.author) {
        query = query.ilike('author_name', `%${filters.author}%`);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,author_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured);
      }

      if (filters?.isAvailable !== undefined) {
        query = query.eq('is_available', filters.isAvailable);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Order by featured first, then by created date
      query = query.order('is_featured', { ascending: false })
                   .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null, count: count || 0 };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get featured books (Kutub Mumayyaza - كتب مميزة)
  async getFeaturedBooks(limit = 10): Promise<BookResponse> {
    return this.getBooks({ isFeatured: true }, 1, limit);
  }

  // Get book by ID
  async getBookById(id: string): Promise<BookResponse> {
    try {
      const { data, error } = await supabase
        .from('books')
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

  // Create new book (Idafat Kitab - إضافة كتاب)
  async createBook(bookData: BookInsert): Promise<BookResponse> {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          ...bookData,
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

  // Update book (Tahdith Kitab - تحديث كتاب)
  async updateBook(id: string, updates: BookUpdate): Promise<BookResponse> {
    try {
      const { data, error } = await supabase
        .from('books')
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

  // Delete book (Hadhf Kitab - حذف كتاب)
  async deleteBook(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      return { error: error?.message || null };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  // Increment download count
  async incrementDownloadCount(id: string): Promise<BookResponse> {
    try {
      const { error } = await supabase.rpc('increment_download_count', {
        book_id: id
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return await this.getBookById(id);
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update book rating
  async updateBookRating(id: string, rating: number): Promise<BookResponse> {
    try {
      // Get current rating data
      const { data: book } = await this.getBookById(id);
      if (!book) {
        return { data: null, error: 'Book not found' };
      }

      const currentRating = book.rating || 0;
      const currentCount = book.rating_count || 0;
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + rating) / newCount;

      const { data, error } = await supabase
        .from('books')
        .update({
          rating: Math.round(newRating * 100) / 100, // Round to 2 decimal places
          rating_count: newCount,
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

  // Get books by category (Kutub hasab al-Tasnif - كتب حسب التصنيف)
  async getBooksByCategory(category: string, limit = 20): Promise<BookResponse> {
    return this.getBooks({ category }, 1, limit);
  }

  // Search books (Bahth fi al-Kutub - بحث في الكتب)
  async searchBooks(query: string, filters?: Omit<BookFilters, 'search'>): Promise<BookResponse> {
    return this.getBooks({ ...filters, search: query });
  }

  // Get books by author (Kutub al-Mu'allif - كتب المؤلف)
  async getBooksByAuthor(author: string, limit = 20): Promise<BookResponse> {
    return this.getBooks({ author }, 1, limit);
  }

  // Get books by language (Kutub hasab al-Lugha - كتب حسب اللغة)
  async getBooksByLanguage(language: string, limit = 20): Promise<BookResponse> {
    return this.getBooks({ language }, 1, limit);
  }

  // Get books by tags
  async getBooksByTags(tags: string[], limit = 20): Promise<BookResponse> {
    return this.getBooks({ tags }, 1, limit);
  }

  // Get book statistics for admin dashboard
  async getBookStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byLanguage: Record<string, number>;
    featured: number;
    available: number;
    error: string | null;
  }> {
    try {
      const { data: books, error } = await supabase
        .from('books')
        .select('category, language, is_featured, is_available');

      if (error) {
        return {
          total: 0,
          byCategory: {},
          byLanguage: {},
          featured: 0,
          available: 0,
          error: error.message
        };
      }

      const stats = {
        total: books.length,
        byCategory: {} as Record<string, number>,
        byLanguage: {} as Record<string, number>,
        featured: books.filter(b => b.is_featured).length,
        available: books.filter(b => b.is_available).length,
        error: null
      };

      // Count by category
      books.forEach(book => {
        stats.byCategory[book.category] = (stats.byCategory[book.category] || 0) + 1;
        stats.byLanguage[book.language] = (stats.byLanguage[book.language] || 0) + 1;
      });

      return stats;
    } catch (error) {
      return {
        total: 0,
        byCategory: {},
        byLanguage: {},
        featured: 0,
        available: 0,
        error: (error as Error).message
      };
    }
  }

  // Bulk update books
  async bulkUpdateBooks(updates: { id: string; data: BookUpdate }[]): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };

    for (const update of updates) {
      const { error } = await this.updateBook(update.id, update.data);
      if (error) {
        results.errors.push(`Failed to update book ${update.id}: ${error}`);
      } else {
        results.success++;
      }
    }

    return results;
  }

  // Check if book is available for borrowing
  async isBookAvailable(id: string): Promise<{ available: boolean; error: string | null }> {
    try {
      const { data: book } = await this.getBookById(id);
      if (!book) {
        return { available: false, error: 'Book not found' };
      }

      // Check if book is marked as available and has physical copies
      const available = book.is_available && (book.physical_copies || 0) > 0;
      return { available, error: null };
    } catch (error) {
      return { available: false, error: (error as Error).message };
    }
  }
}

export const booksService = new BooksService();
