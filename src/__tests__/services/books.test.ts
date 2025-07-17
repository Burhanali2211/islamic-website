import { describe, test, expect, vi, beforeEach } from 'vitest';
import { booksService } from '../../services/books';
import { mockBook } from '../../test/setup';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    single: vi.fn(),
    then: vi.fn()
  }))
};

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}));

describe('booksService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBooks', () => {
    test('fetches all books successfully', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().order().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      const result = await booksService.getAllBooks();

      expect(mockSupabase.from).toHaveBeenCalledWith('books');
      expect(result.data).toEqual(mockBooks);
      expect(result.error).toBeNull();
    });

    test('handles error when fetching books', async () => {
      const mockError = { message: 'Database error' };
      mockSupabase.from().select().order().then.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.getAllBooks();

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    test('applies pagination correctly', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().order().range().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      await booksService.getAllBooks({ page: 2, limit: 10 });

      expect(mockSupabase.from().range).toHaveBeenCalledWith(10, 19);
    });

    test('applies category filter', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().eq().order().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      await booksService.getAllBooks({ category: 'quran' });

      expect(mockSupabase.from().eq).toHaveBeenCalledWith('category', 'quran');
    });

    test('applies availability filter', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().eq().order().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      await booksService.getAllBooks({ availableOnly: true });

      expect(mockSupabase.from().eq).toHaveBeenCalledWith('is_available', true);
    });
  });

  describe('getBookById', () => {
    test('fetches book by ID successfully', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockBook,
        error: null
      });

      const result = await booksService.getBookById('test-book-id');

      expect(mockSupabase.from).toHaveBeenCalledWith('books');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'test-book-id');
      expect(result.data).toEqual(mockBook);
    });

    test('handles book not found', async () => {
      const mockError = { message: 'Book not found' };
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.getBookById('non-existent-id');

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('createBook', () => {
    test('creates book successfully', async () => {
      const newBookData = {
        title: 'New Islamic Book',
        author: 'Test Author',
        category: 'fiqh',
        isbn: '978-0123456789'
      };

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: { ...mockBook, ...newBookData },
        error: null
      });

      const result = await booksService.createBook(newBookData);

      expect(mockSupabase.from).toHaveBeenCalledWith('books');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(newBookData);
      expect(result.data).toMatchObject(newBookData);
    });

    test('handles validation errors', async () => {
      const invalidBookData = {
        title: '', // Invalid: empty title
        author: 'Test Author'
      };

      const mockError = { message: 'Title is required' };
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.createBook(invalidBookData);

      expect(result.error).toEqual(mockError);
    });

    test('handles duplicate ISBN error', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-0123456789' // Duplicate ISBN
      };

      const mockError = { 
        message: 'duplicate key value violates unique constraint',
        code: '23505'
      };
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.createBook(bookData);

      expect(result.error).toEqual(mockError);
    });
  });

  describe('updateBook', () => {
    test('updates book successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        is_featured: true
      };

      const updatedBook = { ...mockBook, ...updateData };
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedBook,
        error: null
      });

      const result = await booksService.updateBook('test-book-id', updateData);

      expect(mockSupabase.from().update).toHaveBeenCalledWith(updateData);
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'test-book-id');
      expect(result.data).toEqual(updatedBook);
    });

    test('handles book not found for update', async () => {
      const updateData = { title: 'Updated Title' };
      const mockError = { message: 'Book not found' };

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.updateBook('non-existent-id', updateData);

      expect(result.error).toEqual(mockError);
    });
  });

  describe('deleteBook', () => {
    test('deletes book successfully', async () => {
      mockSupabase.from().delete().eq().then.mockResolvedValue({
        data: null,
        error: null
      });

      const result = await booksService.deleteBook('test-book-id');

      expect(mockSupabase.from().delete).toHaveBeenCalled();
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'test-book-id');
      expect(result.error).toBeNull();
    });

    test('handles delete error when book has active borrowings', async () => {
      const mockError = { 
        message: 'Cannot delete book with active borrowings',
        code: '23503'
      };

      mockSupabase.from().delete().eq().then.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.deleteBook('test-book-id');

      expect(result.error).toEqual(mockError);
    });
  });

  describe('searchBooks', () => {
    test('searches books by title', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().ilike().order().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      const result = await booksService.searchBooks({ query: 'Islamic' });

      expect(mockSupabase.from().ilike).toHaveBeenCalledWith('title', '%Islamic%');
      expect(result.data).toEqual(mockBooks);
    });

    test('searches books by author', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().ilike().order().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      const result = await booksService.searchBooks({ author: 'Bukhari' });

      expect(mockSupabase.from().ilike).toHaveBeenCalledWith('author', '%Bukhari%');
    });

    test('searches with multiple filters', async () => {
      const mockBooks = [mockBook];
      mockSupabase.from().select().ilike().eq().gte().lte().order().then.mockResolvedValue({
        data: mockBooks,
        error: null
      });

      const searchParams = {
        query: 'Islamic',
        category: 'hadith',
        yearFrom: 800,
        yearTo: 900
      };

      await booksService.searchBooks(searchParams);

      expect(mockSupabase.from().ilike).toHaveBeenCalledWith('title', '%Islamic%');
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('category', 'hadith');
      expect(mockSupabase.from().gte).toHaveBeenCalledWith('publication_year', 800);
      expect(mockSupabase.from().lte).toHaveBeenCalledWith('publication_year', 900);
    });
  });

  describe('getFeaturedBooks', () => {
    test('fetches featured books', async () => {
      const featuredBooks = [{ ...mockBook, is_featured: true }];
      mockSupabase.from().select().eq().order().limit().then.mockResolvedValue({
        data: featuredBooks,
        error: null
      });

      const result = await booksService.getFeaturedBooks();

      expect(mockSupabase.from().eq).toHaveBeenCalledWith('is_featured', true);
      expect(mockSupabase.from().limit).toHaveBeenCalledWith(10);
      expect(result.data).toEqual(featuredBooks);
    });

    test('applies custom limit for featured books', async () => {
      const featuredBooks = [{ ...mockBook, is_featured: true }];
      mockSupabase.from().select().eq().order().limit().then.mockResolvedValue({
        data: featuredBooks,
        error: null
      });

      await booksService.getFeaturedBooks(5);

      expect(mockSupabase.from().limit).toHaveBeenCalledWith(5);
    });
  });

  describe('getBooksByCategory', () => {
    test('fetches books by category', async () => {
      const categoryBooks = [mockBook];
      mockSupabase.from().select().eq().order().then.mockResolvedValue({
        data: categoryBooks,
        error: null
      });

      const result = await booksService.getBooksByCategory('quran');

      expect(mockSupabase.from().eq).toHaveBeenCalledWith('category', 'quran');
      expect(result.data).toEqual(categoryBooks);
    });

    test('handles invalid category', async () => {
      const mockError = { message: 'Invalid category' };
      mockSupabase.from().select().eq().order().then.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await booksService.getBooksByCategory('invalid-category');

      expect(result.error).toEqual(mockError);
    });
  });

  describe('updateBookAvailability', () => {
    test('updates book availability', async () => {
      const updatedBook = { ...mockBook, is_available: false };
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedBook,
        error: null
      });

      const result = await booksService.updateBookAvailability('test-book-id', false);

      expect(mockSupabase.from().update).toHaveBeenCalledWith({ is_available: false });
      expect(result.data?.is_available).toBe(false);
    });
  });

  describe('getBookStatistics', () => {
    test('fetches book statistics', async () => {
      const mockStats = {
        total: 150,
        available: 120,
        featured: 25,
        byCategory: {
          quran: 30,
          hadith: 25,
          fiqh: 20
        }
      };

      // Mock multiple queries for statistics
      mockSupabase.from().select.mockImplementation((columns) => {
        if (columns === 'count') {
          return {
            then: vi.fn().mockResolvedValue({
              data: [{ count: 150 }],
              error: null
            })
          };
        }
        return mockSupabase.from();
      });

      const result = await booksService.getBookStatistics();

      expect(result.data).toBeDefined();
      expect(typeof result.data?.total).toBe('number');
    });
  });
});
