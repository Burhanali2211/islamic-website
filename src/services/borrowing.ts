import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { usersService } from './users';
import { booksService } from './books';

type BorrowingRecord = Database['public']['Tables']['borrowing_records']['Row'];
type BorrowingInsert = Database['public']['Tables']['borrowing_records']['Insert'];
type BorrowingUpdate = Database['public']['Tables']['borrowing_records']['Update'];

export interface BorrowingFilters {
  userId?: string;
  bookId?: string;
  status?: 'active' | 'returned' | 'overdue' | 'lost';
  isOverdue?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface BorrowingResponse {
  data: BorrowingRecord[] | BorrowingRecord | null;
  error: string | null;
  count?: number;
}

export interface BorrowingWithDetails extends BorrowingRecord {
  book?: Book;
  user?: User;
  issued_by_user?: User;
  returned_to_user?: User;
}

class BorrowingService {
  // Get all borrowing records with filtering (Sijillat al-Isti'ara - سجلات الاستعارة)
  async getBorrowingRecords(filters?: BorrowingFilters, page = 1, limit = 20): Promise<BorrowingResponse> {
    try {
      let query = supabase
        .from('borrowing_records')
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*),
          issued_by_user:profiles!borrowing_records_issued_by_fkey(*),
          returned_to_user:profiles!borrowing_records_returned_to_fkey(*)
        `, { count: 'exact' });

      // Apply filters
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.bookId) {
        query = query.eq('book_id', filters.bookId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.isOverdue) {
        const today = new Date().toISOString();
        query = query.lt('due_date', today).eq('status', 'active');
      }

      if (filters?.dateFrom) {
        query = query.gte('borrowed_date', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('borrowed_date', filters.dateTo);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Order by borrowed date (newest first)
      query = query.order('borrowed_date', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null, count: count || 0 };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get borrowing record by ID
  async getBorrowingById(id: string): Promise<BorrowingResponse> {
    try {
      const { data, error } = await supabase
        .from('borrowing_records')
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*),
          issued_by_user:profiles!borrowing_records_issued_by_fkey(*),
          returned_to_user:profiles!borrowing_records_returned_to_fkey(*)
        `)
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

  // Borrow a book (Isti'arat Kitab - استعارة كتاب)
  async borrowBook(
    userId: string, 
    bookId: string, 
    issuedBy: string, 
    daysToReturn = 14
  ): Promise<BorrowingResponse> {
    try {
      // Check if user can borrow more books
      const borrowingSummary = await usersService.getUserBorrowingSummary(userId);
      if (!borrowingSummary.canBorrow) {
        return { 
          data: null, 
          error: `User has reached maximum borrowing limit (${borrowingSummary.maxLimit} books)` 
        };
      }

      // Check if book is available
      const { available, error: availabilityError } = await booksService.isBookAvailable(bookId);
      if (availabilityError) {
        return { data: null, error: availabilityError };
      }
      if (!available) {
        return { data: null, error: 'Book is not available for borrowing' };
      }

      // Calculate due date
      const borrowedDate = new Date();
      const dueDate = new Date(borrowedDate);
      dueDate.setDate(dueDate.getDate() + daysToReturn);

      // Create borrowing record
      const borrowingData: BorrowingInsert = {
        user_id: userId,
        book_id: bookId,
        borrowed_date: borrowedDate.toISOString(),
        due_date: dueDate.toISOString(),
        status: 'active',
        issued_by: issuedBy,
        renewal_count: 0,
        max_renewals: 2
      };

      const { data, error } = await supabase
        .from('borrowing_records')
        .insert(borrowingData)
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Update user's borrowing count
      await usersService.updateUser(userId, {
        current_borrowed_count: borrowingSummary.currentBorrowed + 1,
        total_books_borrowed: borrowingSummary.totalBorrowed + 1
      });

      // Update book's physical copies count
      const { data: book } = await booksService.getBookById(bookId);
      if (book && book.physical_copies && book.physical_copies > 0) {
        await booksService.updateBook(bookId, {
          physical_copies: book.physical_copies - 1
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Return a book (I'adat Kitab - إعادة كتاب)
  async returnBook(
    borrowingId: string, 
    returnedTo: string, 
    notes?: string
  ): Promise<BorrowingResponse> {
    try {
      // Get borrowing record
      const { data: borrowing } = await this.getBorrowingById(borrowingId);
      if (!borrowing) {
        return { data: null, error: 'Borrowing record not found' };
      }

      if (borrowing.status !== 'active') {
        return { data: null, error: 'Book is already returned or not active' };
      }

      // Calculate fine if overdue
      const returnDate = new Date();
      const dueDate = new Date(borrowing.due_date);
      let fineAmount = 0;

      if (returnDate > dueDate) {
        const overdueDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        fineAmount = overdueDays * 1; // 1 unit per day fine
      }

      // Update borrowing record
      const { data, error } = await supabase
        .from('borrowing_records')
        .update({
          status: 'returned',
          returned_date: returnDate.toISOString(),
          returned_to: returnedTo,
          fine_amount: fineAmount,
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', borrowingId)
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Update user's current borrowed count
      const borrowingSummary = await usersService.getUserBorrowingSummary(borrowing.user_id);
      await usersService.updateUser(borrowing.user_id, {
        current_borrowed_count: Math.max(0, borrowingSummary.currentBorrowed - 1)
      });

      // Update book's physical copies count
      const { data: book } = await booksService.getBookById(borrowing.book_id);
      if (book) {
        await booksService.updateBook(borrowing.book_id, {
          physical_copies: (book.physical_copies || 0) + 1
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Renew a book (Tajdid Isti'ara - تجديد استعارة)
  async renewBook(borrowingId: string, additionalDays = 14): Promise<BorrowingResponse> {
    try {
      // Get borrowing record
      const { data: borrowing } = await this.getBorrowingById(borrowingId);
      if (!borrowing) {
        return { data: null, error: 'Borrowing record not found' };
      }

      if (borrowing.status !== 'active') {
        return { data: null, error: 'Cannot renew non-active borrowing' };
      }

      if ((borrowing.renewal_count || 0) >= (borrowing.max_renewals || 2)) {
        return { data: null, error: 'Maximum renewals reached' };
      }

      // Calculate new due date
      const currentDueDate = new Date(borrowing.due_date);
      const newDueDate = new Date(currentDueDate);
      newDueDate.setDate(newDueDate.getDate() + additionalDays);

      // Update borrowing record
      const { data, error } = await supabase
        .from('borrowing_records')
        .update({
          due_date: newDueDate.toISOString(),
          renewal_count: (borrowing.renewal_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', borrowingId)
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get overdue books (Kutub Muta'akhkhira - كتب متأخرة)
  async getOverdueBooks(): Promise<BorrowingResponse> {
    return this.getBorrowingRecords({ isOverdue: true });
  }

  // Get active borrowings for a user
  async getUserActiveBorrowings(userId: string): Promise<BorrowingResponse> {
    return this.getBorrowingRecords({ userId, status: 'active' });
  }

  // Get borrowing history for a user
  async getUserBorrowingHistory(userId: string, page = 1, limit = 20): Promise<BorrowingResponse> {
    return this.getBorrowingRecords({ userId }, page, limit);
  }

  // Get borrowing statistics for admin dashboard
  async getBorrowingStatistics(): Promise<{
    totalActive: number;
    totalOverdue: number;
    totalReturned: number;
    totalFines: number;
    popularBooks: { book_id: string; count: number; book?: Book }[];
    activeUsers: number;
    error: string | null;
  }> {
    try {
      const { data: records, error } = await supabase
        .from('borrowing_records')
        .select('status, fine_amount, book_id, user_id');

      if (error) {
        return {
          totalActive: 0,
          totalOverdue: 0,
          totalReturned: 0,
          totalFines: 0,
          popularBooks: [],
          activeUsers: 0,
          error: error.message
        };
      }

      const today = new Date().toISOString();
      const activeRecords = records.filter(r => r.status === 'active');
      
      const stats = {
        totalActive: activeRecords.length,
        totalOverdue: 0, // Will be calculated separately
        totalReturned: records.filter(r => r.status === 'returned').length,
        totalFines: records.reduce((sum, r) => sum + (r.fine_amount || 0), 0),
        popularBooks: [],
        activeUsers: new Set(activeRecords.map(r => r.user_id)).size,
        error: null
      };

      // Get overdue count
      const { count: overdueCount } = await supabase
        .from('borrowing_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lt('due_date', today);

      stats.totalOverdue = overdueCount || 0;

      // Get popular books (most borrowed)
      const bookCounts = records.reduce((acc, record) => {
        acc[record.book_id] = (acc[record.book_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedBooks = Object.entries(bookCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      // Get book details for popular books
      for (const [bookId, count] of sortedBooks) {
        const { data: book } = await booksService.getBookById(bookId);
        if (book) {
          stats.popularBooks.push({ ...book, borrowCount: count });
        }
      }

      return stats;
    } catch (error) {
      return {
        totalActive: 0,
        totalOverdue: 0,
        totalReturned: 0,
        totalFines: 0,
        popularBooks: [],
        activeUsers: 0,
        error: (error as Error).message
      };
    }
  }

  // Mark book as lost (I'lan Faqdan Kitab - إعلان فقدان كتاب)
  async markBookAsLost(borrowingId: string, notes?: string): Promise<BorrowingResponse> {
    try {
      const { data, error } = await supabase
        .from('borrowing_records')
        .update({
          status: 'lost',
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', borrowingId)
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update borrowing record
  async updateBorrowingRecord(id: string, updates: BorrowingUpdate): Promise<BorrowingResponse> {
    try {
      const { data, error } = await supabase
        .from('borrowing_records')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          book:books(*),
          user:profiles!borrowing_records_user_id_fkey(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}

export const borrowingService = new BorrowingService();

// Export types for use in other files
export type { BorrowingRecord, BorrowingInsert, BorrowingUpdate, BorrowingFilters, BorrowingResponse, BorrowingWithDetails };
