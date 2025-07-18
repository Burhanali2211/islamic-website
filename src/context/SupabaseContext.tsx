import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { authService, type IslamicProfile } from '../services/auth';
import { booksService } from '../services/books';
import { usersService } from '../services/users';
import { borrowingService } from '../services/borrowing';
import { categoriesService } from '../services/categories';
import { coursesService } from '../services/courses';
import { dataManager } from '../services/dataManager';
import { localStorageService } from '../services/localStorage';
import type {
  Book,
  User,
  Theme,
  BorrowingRecord,
  IslamicCategory,
  DashboardStats,
  BookFilters,
  UserFilters,
  BorrowingFilters,
  CreateBookData,
  UpdateBookData,
  CreateUserData,
  UpdateUserData,
  CreateCategoryData,
  UpdateCategoryData
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
  loadBooks: (filters?: BookFilters) => Promise<void>;
  loadUsers: (filters?: UserFilters) => Promise<void>;
  loadBorrowingRecords: (filters?: BorrowingFilters) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadDashboardStats: () => Promise<void>;

  // Book methods
  createBook: (bookData: CreateBookData) => Promise<void>;
  updateBook: (id: string, updates: UpdateBookData) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;

  // User methods
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: string, updates: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Borrowing methods
  borrowBook: (userId: string, bookId: string, issuedBy: string) => Promise<void>;
  returnBook: (borrowingId: string, returnedTo: string, notes?: string) => Promise<void>;
  renewBook: (borrowingId: string) => Promise<void>;
  
  // Category methods
  createCategory: (categoryData: CreateCategoryData) => Promise<void>;
  updateCategory: (id: string, updates: UpdateCategoryData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Course methods
  loadCourses: (teacherId?: string, classId?: string) => Promise<any>;
  createCourse: (courseData: any) => Promise<{ data: any; error: string | null }>;
  loadAssignments: (courseId?: string, teacherId?: string, studentId?: string) => Promise<any>;

  // Draft management methods
  saveDraft: (type: string, id: string, data: any) => boolean;
  getDraft: (type: string, id: string) => any;
  clearDraft: (type: string, id: string) => boolean;

  // Utility methods
  addBookmark: (bookId: string) => Promise<void>;
  removeBookmark: (bookId: string) => Promise<void>;
  addRecentRead: (bookId: string) => Promise<void>;
} | null>(null);

function supabaseAppReducer(state: SupabaseAppState, action: SupabaseAppAction): SupabaseAppState {
  switch (action.type) {
    case 'SET_AUTH': {
      // Prevent duplicate SET_AUTH dispatches for the same user
      const isSameUser = state.user?.id === action.payload.user?.id;
      const isSameProfile = state.profile?.id === action.payload.profile?.id &&
                           state.profile?.role === action.payload.profile?.role;

      if (isSameUser && isSameProfile && state.user && state.profile) {
        console.log('🔄 [REDUCER] SET_AUTH skipped - same user and profile already set');
        return state; // No change needed
      }

      console.log('🔄 [REDUCER] SET_AUTH action received:', {
        hasUser: !!action.payload.user,
        hasProfile: !!action.payload.profile,
        userEmail: action.payload.user?.email,
        userRole: action.payload.profile?.role,
        timestamp: new Date().toISOString(),
        isUpdate: isSameUser
      });

      const newAuthState = {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        session: action.payload.session,
        bookmarks: action.payload.profile?.bookmarks || [],
        recentReads: action.payload.profile?.recent_reads || []
      };

      console.log('✅ [REDUCER] New auth state created:', {
        hasUser: !!newAuthState.user,
        hasProfile: !!newAuthState.profile,
        userRole: newAuthState.profile?.role
      });

      return newAuthState;
    }

    case 'LOGOUT':
      console.log('🚪 [REDUCER] LOGOUT action received');
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
  const realtimeUnsubscribeRef = useRef<(() => void) | null>(null);

  // Initialize authentication state
  useEffect(() => {
    console.log('🚀 [CONTEXT] Initializing authentication state...');
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 [CONTEXT] Getting current session...');

        // Check for real Supabase session
        const { user, session } = await authService.getCurrentSession();

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (user) {
          console.log('👤 [CONTEXT] User found in session:', user.email);
          const profile = await authService.getProfile(user.id);
          console.log('📋 [CONTEXT] Profile loaded:', profile?.role);

          if (isMounted) {
            dispatch({
              type: 'SET_AUTH',
              payload: { user, profile, session }
            });
          }
        } else {
          console.log('❌ [CONTEXT] No user found in session');
        }
      } catch (error) {
        console.error('💥 [CONTEXT] Error initializing auth:', error);
        if (isMounted) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
        }
      } finally {
        console.log('🔄 [CONTEXT] Setting initial loading to false');
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('🔔 [CONTEXT] Auth state change event:', { event, hasSession: !!session, userEmail: session?.user?.email });

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('👤 [CONTEXT] User signed in, fetching profile...');
        const profile = await authService.getProfile(session.user.id);
        if (isMounted) {
          dispatch({
            type: 'SET_AUTH',
            payload: { user: session.user, profile, session }
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 [CONTEXT] User signed out');
        if (isMounted) {
          dispatch({ type: 'LOGOUT' });
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      // Clean up data manager subscriptions
      dataManager.cleanup();
      if (realtimeUnsubscribeRef.current) {
        realtimeUnsubscribeRef.current();
        realtimeUnsubscribeRef.current = null;
      }
    };
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
    console.log('🔐 [AUTH] Starting signIn process...', { email, timestamp: new Date().toISOString() });

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('🔄 [AUTH] Loading state set to true, error cleared');

      // Real authentication
      console.log('🔗 [AUTH] Attempting Supabase authentication...');
      const { user, profile, session, error } = await authService.signIn(email, password);

      if (error) {
        console.error('❌ [AUTH] Supabase authentication error:', error);
        dispatch({ type: 'SET_ERROR', payload: error });
        throw new Error(error);
      }

      if (!user || !profile) {
        const errorMsg = 'Authentication failed - user or profile not found';
        console.error('❌ [AUTH] Authentication failed:', errorMsg);
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        throw new Error(errorMsg);
      }

      console.log('✅ [AUTH] Supabase authentication successful:', { user: user.email, role: profile.role });
      dispatch({
        type: 'SET_AUTH',
        payload: { user, profile, session }
      });

      // Set up real-time subscriptions for user data (with cleanup)
      if (realtimeUnsubscribeRef.current) {
        try {
          realtimeUnsubscribeRef.current();
        } catch (error) {
          console.warn('Error cleaning up previous realtime subscription:', error);
        }
        realtimeUnsubscribeRef.current = null;
      }

      // Add a small delay to ensure previous subscriptions are cleaned up
      setTimeout(() => {
        realtimeUnsubscribeRef.current = dataManager.subscribeToUserData(user.id, (payload) => {
          console.log('📡 [REALTIME] User data updated:', payload);
          // Refresh relevant data based on the table that changed
          switch (payload.table) {
            case 'borrowing_records':
              loadBorrowingRecords();
              break;
            case 'reading_progress':
              // Refresh reading progress
              break;
            case 'notifications':
              // Refresh notifications
              break;
            case 'course_enrollments':
              // Refresh course enrollments
              break;
          }
        });
      }, 100);
    } catch (error) {
      let errorMessage = 'Authentication failed';

      if (error instanceof Error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'بيانات الدخول غير صحيحة - Invalid login credentials. Please check your email and password.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'البريد الإلكتروني غير مؤكد - Email not confirmed. Please check your email for confirmation link.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'محاولات كثيرة جداً - Too many login attempts. Please wait a moment and try again.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'مشكلة في الاتصال - Network error. Please check your internet connection.';
        } else {
          errorMessage = `خطأ في المصادقة - Authentication error: ${error.message}`;
        }
      }

      console.error('💥 [AUTH] SignIn error caught:', errorMessage);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error; // Re-throw to allow Login component to handle it
    } finally {
      console.log('🔄 [AUTH] Setting loading to false');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<IslamicProfile>) => {
    console.log('🔐 [AUTH] Starting signUp process...', { email, role: userData.role });
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      console.log('🔄 [AUTH] Loading state set to true, error cleared');

      console.log('🔗 [AUTH] Attempting Supabase registration...');
      const { user, profile, session, error } = await authService.signUp(email, password, userData);

      if (error) {
        console.error('❌ [AUTH] Supabase registration error:', error);
        dispatch({ type: 'SET_ERROR', payload: error });
        throw new Error(error);
      }

      if (!user) {
        const errorMsg = 'Registration failed - user not created';
        console.error('❌ [AUTH] Registration failed:', errorMsg);
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        throw new Error(errorMsg);
      }

      console.log('✅ [AUTH] Registration successful:', { userId: user.id, email: user.email });
      dispatch({
        type: 'SET_AUTH',
        payload: { user, profile, session }
      });
    } catch (error) {
      console.error('💥 [AUTH] SignUp error caught:', (error as Error).message);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error; // Re-throw to let the component handle it
    } finally {
      console.log('🔄 [AUTH] Setting loading to false');
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
  const loadBooks = useCallback(async (filters?: BookFilters) => {
    try {
      // Use enhanced data manager with caching
      const cacheKey = `books_${JSON.stringify(filters || {})}`;
      const { data, error } = await dataManager.getData(
        cacheKey,
        () => booksService.getBooks(filters),
        { useCache: true }
      );

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }

      dispatch({ type: 'SET_BOOKS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  const loadUsers = useCallback(async (filters?: UserFilters) => {
    try {
      const { data, error } = await usersService.getUsers(filters);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_USERS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  const loadBorrowingRecords = useCallback(async (filters?: BorrowingFilters) => {
    try {
      const { data, error } = await borrowingService.getBorrowingRecords(filters);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_BORROWING_RECORDS', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await categoriesService.getCategories();
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'SET_CATEGORIES', payload: data || [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  // Use ref to store current user ID to prevent dependency issues
  const currentUserIdRef = useRef<string | null>(null);
  currentUserIdRef.current = state.user?.id || null;

  const loadDashboardStats = useCallback(async () => {
    try {
      const userId = currentUserIdRef.current;
      if (!userId) {
        console.log('📊 [DASHBOARD_STATS] No user ID available, skipping stats load');
        return;
      }

      // Use enhanced data manager for real database stats
      const { data: stats, error } = await dataManager.getDashboardStats(userId);

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }

      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []); // No dependencies to prevent infinite loops

  // Book methods
  const createBook = async (bookData: CreateBookData) => {
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

  const updateBook = async (id: string, updates: UpdateBookData) => {
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
  const createUser = async (userData: CreateUserData) => {
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

  const updateUser = async (id: string, updates: UpdateUserData) => {
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
  const createCategory = async (categoryData: CreateCategoryData) => {
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

  const updateCategory = async (id: string, updates: UpdateCategoryData) => {
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
      const { error } = await usersService.addBookmark(state.profile.id, bookId);
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
      const { error } = await usersService.removeBookmark(state.profile.id, bookId);
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
      // Save to local storage immediately for better UX
      const currentReads = localStorageService.getRecentReads();
      const updatedReads = [bookId, ...currentReads.filter(id => id !== bookId)].slice(0, 10);
      localStorageService.saveRecentReads(updatedReads);

      const { error } = await usersService.updateRecentReads(state.profile.id, bookId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      dispatch({ type: 'ADD_RECENT_READ', payload: bookId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  // Course management methods
  const loadCourses = useCallback(async (teacherId?: string, classId?: string) => {
    try {
      const { data, error } = await coursesService.getCourses(teacherId, classId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  const createCourse = useCallback(async (courseData: any) => {
    try {
      const { data, error } = await dataManager.saveData(
        `course_${Date.now()}`,
        courseData,
        (data) => coursesService.createCourse(data),
        { autoSave: true }
      );

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      const errorMsg = (error as Error).message;
      dispatch({ type: 'SET_ERROR', payload: errorMsg });
      return { data: null, error: errorMsg };
    }
  }, []);

  const loadAssignments = useCallback(async (courseId?: string, teacherId?: string, studentId?: string) => {
    try {
      const { data, error } = await coursesService.getAssignments(courseId, teacherId, studentId);
      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
        return;
      }
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  }, []);

  // Draft management methods
  const saveDraft = useCallback((type: string, id: string, data: any) => {
    if (!state.user) return false;

    return localStorageService.saveDraft({
      id,
      type: type as any,
      data,
      userId: state.user.id,
      timestamp: Date.now(),
      autoSave: true
    });
  }, [state.user]);

  const getDraft = useCallback((type: string, id: string) => {
    return localStorageService.getDraft(type, id);
  }, []);

  const clearDraft = useCallback((type: string, id: string) => {
    return localStorageService.deleteDraft(type, id);
  }, []);

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

      // Course methods
      loadCourses,
      createCourse,
      loadAssignments,

      // Draft management methods
      saveDraft,
      getDraft,
      clearDraft,

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
