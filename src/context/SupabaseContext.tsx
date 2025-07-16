import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService, type IslamicProfile } from '../services/auth';
import { booksService } from '../services/books';
import { usersService } from '../services/users';
import { borrowingService } from '../services/borrowing';
import { categoriesService } from '../services/categories';
import type { 
  Book, 
  User, 
  Theme, 
  BorrowingRecord, 
  IslamicCategory,
  DashboardStats 
} from '../types';

interface SupabaseAppState {
  // Authentication
  user: SupabaseUser | null;
  profile: IslamicProfile | null;
  session: Session | null;
  
  // Data
  books: Book[];
  users: User[];
  borrowingRecords: BorrowingRecord[];
  categories: IslamicCategory[];
  
  // UI State
  theme: Theme;
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  
  // User specific
  bookmarks: string[];
  recentReads: string[];
  
  // Dashboard stats
  dashboardStats: DashboardStats | null;
  
  // Error handling
  error: string | null;
}

type SupabaseAppAction =
  // Authentication actions
  | { type: 'SET_AUTH'; payload: { user: SupabaseUser | null; profile: IslamicProfile | null; session: Session | null } }
  | { type: 'LOGOUT' }
  
  // Data actions
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  
  | { type: 'SET_BORROWING_RECORDS'; payload: BorrowingRecord[] }
  | { type: 'ADD_BORROWING_RECORD'; payload: BorrowingRecord }
  | { type: 'UPDATE_BORROWING_RECORD'; payload: BorrowingRecord }
  | { type: 'DELETE_BORROWING_RECORD'; payload: string }
  
  | { type: 'SET_CATEGORIES'; payload: IslamicCategory[] }
  | { type: 'ADD_CATEGORY'; payload: IslamicCategory }
  | { type: 'UPDATE_CATEGORY'; payload: IslamicCategory }
  | { type: 'DELETE_CATEGORY'; payload: string }
  
  // UI actions
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  
  // User actions
  | { type: 'ADD_BOOKMARK'; payload: string }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'ADD_RECENT_READ'; payload: string }
  
  // Dashboard
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: SupabaseAppState = {
  user: null,
  profile: null,
  session: null,
  books: [],
  users: [],
  borrowingRecords: [],
  categories: [],
  theme: 'light',
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: true,
  bookmarks: [],
  recentReads: [],
  dashboardStats: null,
  error: null
};

const SupabaseAppContext = createContext<{
  state: SupabaseAppState;
  dispatch: React.Dispatch<SupabaseAppAction>;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<IslamicProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Data methods
  loadBooks: (filters?: any) => Promise<void>;
  loadUsers: (filters?: any) => Promise<void>;
  loadBorrowingRecords: (filters?: any) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadDashboardStats: () => Promise<void>;
  
  // Book methods
  createBook: (bookData: any) => Promise<void>;
  updateBook: (id: string, updates: any) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  
  // User methods
  createUser: (userData: any) => Promise<void>;
  updateUser: (id: string, updates: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Borrowing methods
  borrowBook: (userId: string, bookId: string, issuedBy: string) => Promise<void>;
  returnBook: (borrowingId: string, returnedTo: string, notes?: string) => Promise<void>;
  renewBook: (borrowingId: string) => Promise<void>;
  
  // Category methods
  createCategory: (categoryData: any) => Promise<void>;
  updateCategory: (id: string, updates: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Utility methods
  addBookmark: (bookId: string) => Promise<void>;
  removeBookmark: (bookId: string) => Promise<void>;
  addRecentRead: (bookId: string) => Promise<void>;
} | null>(null);

function supabaseAppReducer(state: SupabaseAppState, action: SupabaseAppAction): SupabaseAppState {
  switch (action.type) {
    case 'SET_AUTH':
      return { 
        ...state, 
        user: action.payload.user,
        profile: action.payload.profile,
        session: action.payload.session,
        bookmarks: action.payload.profile?.bookmarks || [],
        recentReads: action.payload.profile?.recent_reads || []
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        profile: null, 
        session: null,
        bookmarks: [],
        recentReads: []
      };

    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return { ...state, books: state.books.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter(b => b.id !== action.payload) };

    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };

    case 'SET_BORROWING_RECORDS':
      return { ...state, borrowingRecords: action.payload };
    case 'ADD_BORROWING_RECORD':
      return { ...state, borrowingRecords: [...state.borrowingRecords, action.payload] };
    case 'UPDATE_BORROWING_RECORD':
      return { ...state, borrowingRecords: state.borrowingRecords.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'DELETE_BORROWING_RECORD':
      return { ...state, borrowingRecords: state.borrowingRecords.filter(r => r.id !== action.payload) };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };

    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'ADD_BOOKMARK':
      return { ...state, bookmarks: [...state.bookmarks, action.payload] };
    case 'REMOVE_BOOKMARK':
      return { ...state, bookmarks: state.bookmarks.filter(id => id !== action.payload) };
    case 'ADD_RECENT_READ':
      return { ...state, recentReads: [action.payload, ...state.recentReads.filter(id => id !== action.payload)].slice(0, 10) };

    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };

    default:
      return state;
  }
}

export function SupabaseAppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(supabaseAppReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user, session } = await authService.getCurrentSession();
        if (user) {
          const profile = await authService.getProfile(user.id);
          dispatch({ 
            type: 'SET_AUTH', 
            payload: { user, profile, session } 
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await authService.getProfile(session.user.id);
        dispatch({ 
          type: 'SET_AUTH', 
          payload: { user: session.user, profile, session } 
        });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Handle demo login
      if (email.includes('@idarah.com') && password.includes('123')) {
        const demoUser = {
          id: email.split('@')[0] === 'admin' ? 'admin-demo-id' :
              email.split('@')[0] === 'teacher' ? 'teacher-demo-id' : 'student-demo-id',
          email: email,
          aud: 'authenticated',
          role: 'authenticated'
        } as any;

        const demoProfile = {
          id: demoUser.id,
          email: email,
          full_name: email.split('@')[0] === 'admin' ? 'Administrator' :
                    email.split('@')[0] === 'teacher' ? 'Ustadh Ahmad' : 'Muhammad Ali',
          name_arabic: email.split('@')[0] === 'admin' ? 'المدير' :
                      email.split('@')[0] === 'teacher' ? 'الأستاذ أحمد' : 'محمد علي',
          role: email.split('@')[0] as 'admin' | 'teacher' | 'student',
          is_active: true,
          student_id: email.split('@')[0] === 'student' ? 'IWA20240001' : undefined,
          class_level: email.split('@')[0] === 'teacher' ? 'Senior Teacher' :
                      email.split('@')[0] === 'student' ? 'Grade 10' : undefined,
          max_borrow_limit: email.split('@')[0] === 'admin' ? 50 :
                           email.split('@')[0] === 'teacher' ? 10 : 3,
          current_borrowed_count: 0,
          total_books_borrowed: 0,
          bookmarks: [],
          recent_reads: []
        };

        const demoSession = {
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: demoUser
        } as any;

        dispatch({
          type: 'SET_AUTH',
          payload: { user: demoUser, profile: demoProfile, session: demoSession }
        });
        return;
      }

      const { user, profile, session, error } = await authService.signIn(email, password);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }

      dispatch({
        type: 'SET_AUTH',
        payload: { user, profile, session }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<IslamicProfile>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const { user, profile, session, error } = await authService.signUp(email, password, userData);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      
      dispatch({ 
        type: 'SET_AUTH', 
        payload: { user, profile, session } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Data loading methods
  const loadBooks = async (filters?: any) => {
    try {
      // Check if we're in demo mode
      if (state.user?.id?.includes('demo')) {
        // Load demo books data
        const demoBooks = [
          {
            id: '1',
            title: 'Sahih Al-Bukhari',
            title_arabic: 'صحيح البخاري',
            author: 'Imam Muhammad al-Bukhari',
            author_arabic: 'الإمام محمد البخاري',
            category: 'hadith' as const,
            description: 'The most authentic collection of Hadith compiled by Imam Bukhari',
            language: 'en' as const,
            pages: 3000,
            is_featured: true,
            is_available: true,
            physical_copies: 5,
            digital_copies: 1,
            download_count: 150,
            rating: 4.9,
            rating_count: 45,
            tags: ['hadith', 'sahih', 'bukhari'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Tafsir Ibn Kathir',
            title_arabic: 'تفسير ابن كثير',
            author: 'Ibn Kathir',
            author_arabic: 'ابن كثير',
            category: 'tafsir' as const,
            description: 'Comprehensive commentary on the Quran by the renowned scholar Ibn Kathir',
            language: 'ar' as const,
            pages: 4000,
            is_featured: true,
            is_available: true,
            physical_copies: 3,
            digital_copies: 1,
            download_count: 200,
            rating: 4.8,
            rating_count: 67,
            tags: ['tafsir', 'quran', 'commentary'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        dispatch({ type: 'SET_BOOKS', payload: demoBooks });
        return;
      }

      const { data, error } = await booksService.getBooks(filters);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_BOOKS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const loadUsers = async (filters?: any) => {
    try {
      // Check if we're in demo mode
      if (state.user?.id?.includes('demo')) {
        const demoUsers = [
          {
            id: 'admin-demo-id',
            email: 'admin@idarah.com',
            full_name: 'Administrator',
            name_arabic: 'المدير',
            role: 'admin' as const,
            is_active: true,
            max_borrow_limit: 50,
            current_borrowed_count: 0,
            total_books_borrowed: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'teacher-demo-id',
            email: 'teacher@idarah.com',
            full_name: 'Ustadh Ahmad',
            name_arabic: 'الأستاذ أحمد',
            role: 'teacher' as const,
            is_active: true,
            class_level: 'Senior Teacher',
            max_borrow_limit: 10,
            current_borrowed_count: 2,
            total_books_borrowed: 15,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'student-demo-id',
            email: 'student@idarah.com',
            full_name: 'Muhammad Ali',
            name_arabic: 'محمد علي',
            role: 'student' as const,
            is_active: true,
            student_id: 'IWA20240001',
            class_level: 'Grade 10',
            max_borrow_limit: 3,
            current_borrowed_count: 1,
            total_books_borrowed: 8,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        dispatch({ type: 'SET_USERS', payload: demoUsers });
        return;
      }

      const { data, error } = await usersService.getUsers(filters);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_USERS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const loadBorrowingRecords = async (filters?: any) => {
    try {
      // Check if we're in demo mode
      if (state.user?.id?.includes('demo')) {
        const demoBorrowingRecords = [
          {
            id: '1',
            user_id: 'student-demo-id',
            book_id: '1',
            borrowed_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active' as const,
            renewal_count: 0,
            max_renewals: 2,
            fine_amount: 0,
            issued_by: 'admin-demo-id',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: 'teacher-demo-id',
            book_id: '2',
            borrowed_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            due_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'overdue' as const,
            renewal_count: 1,
            max_renewals: 2,
            fine_amount: 6,
            issued_by: 'admin-demo-id',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        dispatch({ type: 'SET_BORROWING_RECORDS', payload: demoBorrowingRecords });
        return;
      }

      const { data, error } = await borrowingService.getBorrowingRecords(filters);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_BORROWING_RECORDS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const loadCategories = async () => {
    try {
      // Check if we're in demo mode
      if (state.user?.id?.includes('demo')) {
        const demoCategories = [
          {
            id: '1',
            name: 'Quran Studies',
            name_arabic: 'علوم القرآن',
            description: 'Studies related to the Holy Quran',
            category_type: 'quran' as const,
            display_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Hadith Sciences',
            name_arabic: 'علوم الحديث',
            description: 'Sciences related to Prophetic traditions',
            category_type: 'hadith' as const,
            display_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        dispatch({ type: 'SET_CATEGORIES', payload: demoCategories });
        return;
      }

      const { data, error } = await categoriesService.getCategories();
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_CATEGORIES', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Check if we're in demo mode
      if (state.user?.id?.includes('demo')) {
        const demoDashboardStats: DashboardStats = {
          books: {
            total: 2,
            featured: 2,
            available: 2,
            byCategory: { hadith: 1, tafsir: 1 },
            byLanguage: { en: 1, ar: 1 }
          },
          users: {
            total: 3,
            active: 3,
            byRole: { admin: 1, teacher: 1, student: 1 },
            newThisMonth: 1
          },
          borrowing: {
            totalActive: 1,
            totalOverdue: 1,
            totalReturned: 5,
            totalFines: 6,
            activeUsers: 2,
            popularBooks: [
              {
                id: '1',
                title: 'Sahih Al-Bukhari',
                author: 'Imam Muhammad al-Bukhari',
                borrowCount: 15
              } as any
            ]
          },
          categories: {
            totalCategories: 9,
            activeCategories: 9,
            byType: { hadith: 1, tafsir: 1, fiqh: 1, quran: 1, history: 1, biography: 1, aqeedah: 1, dua: 1, islamic_law: 1 }
          }
        };

        dispatch({ type: 'SET_DASHBOARD_STATS', payload: demoDashboardStats });
        return;
      }

      const [bookStats, userStats, borrowingStats, categoryStats] = await Promise.all([
        booksService.getBookStatistics(),
        usersService.getUserStatistics(),
        borrowingService.getBorrowingStatistics(),
        categoriesService.getCategoryStatistics()
      ]);

      const dashboardStats: DashboardStats = {
        books: {
          total: bookStats.total,
          featured: bookStats.featured,
          available: bookStats.available,
          byCategory: bookStats.byCategory,
          byLanguage: bookStats.byLanguage
        },
        users: {
          total: userStats.total,
          active: userStats.active,
          byRole: userStats.byRole,
          newThisMonth: userStats.newThisMonth
        },
        borrowing: {
          totalActive: borrowingStats.totalActive,
          totalOverdue: borrowingStats.totalOverdue,
          totalReturned: borrowingStats.totalReturned,
          totalFines: borrowingStats.totalFines,
          activeUsers: borrowingStats.activeUsers,
          popularBooks: borrowingStats.popularBooks
        },
        categories: {
          totalCategories: categoryStats.totalCategories,
          activeCategories: categoryStats.activeCategories,
          byType: categoryStats.byType
        }
      };

      dispatch({ type: 'SET_DASHBOARD_STATS', payload: dashboardStats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Book methods
  const createBook = async (bookData: any) => {
    try {
      const { data, error } = await booksService.createBook(bookData);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'ADD_BOOK', payload: data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const updateBook = async (id: string, updates: any) => {
    try {
      const { data, error } = await booksService.updateBook(id, updates);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'UPDATE_BOOK', payload: data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await booksService.deleteBook(id);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'DELETE_BOOK', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // User methods
  const createUser = async (userData: any) => {
    try {
      const { data, error } = await usersService.createUser(userData);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'ADD_USER', payload: data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const updateUser = async (id: string, updates: any) => {
    try {
      const { data, error } = await usersService.updateUser(id, updates);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'UPDATE_USER', payload: data });
        // Update current profile if it's the same user
        if (state.profile?.id === id) {
          dispatch({
            type: 'SET_AUTH',
            payload: {
              user: state.user,
              profile: data,
              session: state.session
            }
          });
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await usersService.deleteUser(id);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'DELETE_USER', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Borrowing methods
  const borrowBook = async (userId: string, bookId: string, issuedBy: string) => {
    try {
      const { data, error } = await borrowingService.borrowBook(userId, bookId, issuedBy);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'ADD_BORROWING_RECORD', payload: data });
        // Reload books and users to update counts
        await loadBooks();
        await loadUsers();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const returnBook = async (borrowingId: string, returnedTo: string, notes?: string) => {
    try {
      const { data, error } = await borrowingService.returnBook(borrowingId, returnedTo, notes);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'UPDATE_BORROWING_RECORD', payload: data });
        // Reload books and users to update counts
        await loadBooks();
        await loadUsers();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const renewBook = async (borrowingId: string) => {
    try {
      const { data, error } = await borrowingService.renewBook(borrowingId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'UPDATE_BORROWING_RECORD', payload: data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Category methods
  const createCategory = async (categoryData: any) => {
    try {
      const { data, error } = await categoriesService.createCategory(categoryData);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'ADD_CATEGORY', payload: data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const updateCategory = async (id: string, updates: any) => {
    try {
      const { data, error } = await categoriesService.updateCategory(id, updates);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      if (data) {
        dispatch({ type: 'UPDATE_CATEGORY', payload: data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await categoriesService.deleteCategory(id);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Utility methods
  const addBookmark = async (bookId: string) => {
    if (!state.profile) return;

    try {
      const { data, error } = await usersService.addBookmark(state.profile.id, bookId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'ADD_BOOKMARK', payload: bookId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const removeBookmark = async (bookId: string) => {
    if (!state.profile) return;

    try {
      const { data, error } = await usersService.removeBookmark(state.profile.id, bookId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'REMOVE_BOOKMARK', payload: bookId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const addRecentRead = async (bookId: string) => {
    if (!state.profile) return;

    try {
      const { data, error } = await usersService.updateRecentReads(state.profile.id, bookId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'ADD_RECENT_READ', payload: bookId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  return (
    <SupabaseAppContext.Provider value={{
      state,
      dispatch,

      // Authentication methods
      signIn,
      signUp,
      signOut,

      // Data methods
      loadBooks,
      loadUsers,
      loadBorrowingRecords,
      loadCategories,
      loadDashboardStats,

      // Book methods
      createBook,
      updateBook,
      deleteBook,

      // User methods
      createUser,
      updateUser,
      deleteUser,

      // Borrowing methods
      borrowBook,
      returnBook,
      renewBook,

      // Category methods
      createCategory,
      updateCategory,
      deleteCategory,

      // Utility methods
      addBookmark,
      removeBookmark,
      addRecentRead
    }}>
      {children}
    </SupabaseAppContext.Provider>
  );
}

export function useSupabaseApp() {
  const context = useContext(SupabaseAppContext);
  if (!context) {
    throw new Error('useSupabaseApp must be used within a SupabaseAppProvider');
  }
  return context;
}
