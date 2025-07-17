import { Session } from '@supabase/supabase-js';

export interface Book {
  id: string;
  title: string;
  title_arabic?: string;
  subtitle?: string;
  subtitle_arabic?: string;
  author_id?: string;
  author_name: string;
  author_arabic?: string;
  publisher_id?: string;
  publisher_name?: string;
  publisher_arabic?: string;
  category_id?: string;
  category: BookCategory;
  subcategory?: string;
  description?: string;
  description_arabic?: string;
  language: LanguageType;
  isbn?: string;
  pages?: number;
  edition?: number;
  published_date?: string;
  cover_image_url?: string;
  file_url?: string;
  file_type?: FileType;
  file_size_mb?: number;
  physical_copies?: number;
  digital_copies?: number;
  available_copies?: number;
  is_available?: boolean;
  location_shelf?: string;
  location_section?: string;
  download_count?: number;
  borrow_count?: number;
  rating?: number;
  rating_count?: number;
  is_featured?: boolean;
  is_recommended?: boolean;
  age_restriction?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export type BookCategory = 'quran' | 'hadith' | 'fiqh' | 'tafsir' | 'aqeedah' | 'seerah' | 'history' | 'biography' | 'dua' | 'islamic_law' | 'arabic_language' | 'islamic_ethics' | 'comparative_religion' | 'islamic_philosophy' | 'sufism' | 'general';
export type LanguageType = 'ar' | 'en' | 'ur' | 'fa' | 'tr';
export type FileType = 'pdf' | 'epub' | 'audio' | 'video';
export type UserRole = 'admin' | 'teacher' | 'student';
export type BorrowingStatus = 'active' | 'returned' | 'overdue' | 'lost';

export interface IslamicCategory {
  id: string;
  name: string;
  name_arabic?: string;
  description?: string;
  description_arabic?: string;
  parent_id?: string;
  category_type: BookCategory;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: IslamicCategory[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  name_arabic?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  role?: UserRole;
  guardian_name?: string;
  guardian_phone?: string;
  student_id?: string;
  class_level?: string;
  enrollment_date?: string;
  is_active?: boolean;
  preferred_language?: LanguageType;
  bookmarks?: string[];
  recent_reads?: string[];
  total_books_borrowed?: number;
  current_borrowed_count?: number;
  max_borrow_limit?: number;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  name?: string;
  avatar?: string;
  joinDate?: string;
  recentReads?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  studentIds: string[];
  category: BookCategory;
}

export interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

export interface IslamicDate {
  hijri: string;
  gregorian: string;
  month: string;
  day: number;
  year: number;
}

export type Theme = 'light' | 'dark';

// Islamic Library specific interfaces
export interface BorrowingRecord {
  id: string;
  user_id: string;
  book_id: string;
  borrowed_date?: string;
  due_date: string;
  returned_date?: string;
  status?: BorrowingStatus;
  renewal_count?: number;
  max_renewals?: number;
  fine_amount?: number;
  notes?: string;
  issued_by?: string;
  returned_to?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IslamicCategory {
  id: string;
  name: string;
  name_arabic?: string;
  description?: string;
  description_arabic?: string;
  parent_category_id?: string;
  category_type: BookCategory;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: IslamicCategory[];
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page?: number;
  total_pages?: number;
  progress_percentage?: number;
  last_read_date?: string;
  reading_time_minutes?: number;
  notes?: string;
  bookmarks_pages?: number[];
  is_completed?: boolean;
  completion_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  title_arabic?: string;
  description?: string;
  description_arabic?: string;
  event_date: string;
  hijri_date?: string;
  event_type?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  location?: string;
  organizer_id?: string;
  max_participants?: number;
  current_participants?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Extended interfaces with relationships
export interface BookWithDetails extends Book {
  borrowing_records?: BorrowingRecord[];
  reading_progress?: ReadingProgress[];
  category_details?: IslamicCategory;
}

export interface UserWithDetails extends User {
  borrowing_records?: BorrowingRecord[];
  reading_progress?: ReadingProgress[];
  organized_events?: IslamicEvent[];
}

export interface BorrowingWithDetails extends BorrowingRecord {
  book?: Book;
  user?: User;
  issued_by_user?: User;
  returned_to_user?: User;
}

// Dashboard statistics interfaces
export interface DashboardStats {
  books: {
    total: number;
    featured: number;
    available: number;
    byCategory: Record<string, number>;
    byLanguage: Record<string, number>;
  };
  users: {
    total: number;
    active: number;
    byRole: Record<string, number>;
    newThisMonth: number;
  };
  borrowing: {
    totalActive: number;
    totalOverdue: number;
    totalReturned: number;
    totalFines: number;
    activeUsers: number;
    popularBooks: Array<Book & { borrowCount: number }>;
  };
  categories: {
    totalCategories: number;
    activeCategories: number;
    byType: Record<string, number>;
  };
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  totalPages: number;
}

// Filter interfaces
export interface BookFilters {
  category?: string;
  language?: string;
  author?: string;
  search?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
  tags?: string[];
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  classLevel?: string;
  search?: string;
}

export interface BorrowingFilters {
  userId?: string;
  bookId?: string;
  status?: BorrowingStatus;
  isOverdue?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// Form data interfaces
export interface BookFormData {
  title: string;
  title_arabic?: string;
  author: string;
  author_arabic?: string;
  category: BookCategory;
  subcategory?: string;
  description?: string;
  description_arabic?: string;
  language: LanguageType;
  isbn?: string;
  publisher?: string;
  publisher_arabic?: string;
  published_date?: string;
  pages?: number;
  tags?: string[];
  is_featured?: boolean;
  physical_copies?: number;
}

export interface UserFormData {
  full_name: string;
  name_arabic?: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  role: UserRole;
  guardian_name?: string;
  guardian_phone?: string;
  class_level?: string;
  preferred_language?: LanguageType;
  max_borrow_limit?: number;
}

export interface BorrowingFormData {
  user_id: string;
  book_id: string;
  due_date: string;
  notes?: string;
}

// Authentication interfaces
export interface AuthUser {
  id: string;
  email: string;
  profile?: User;
}

export interface AuthResponse {
  user: AuthUser | null;
  profile: User | null;
  session: Session | null;
  error: string | null;
}

// Islamic terminology mappings
export interface IslamicTerms {
  ar: Record<string, string>;
  en: Record<string, string>;
  ur: Record<string, string>;
}

// Notification interfaces
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  title_arabic?: string;
  message: string;
  message_arabic?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
}

// Search interfaces
export interface SearchResult {
  books: Book[];
  users: User[];
  categories: IslamicCategory[];
  total: number;
}

export interface SearchFilters {
  query: string;
  type?: 'books' | 'users' | 'categories' | 'all';
  category?: string;
  language?: string;
  role?: UserRole;
}

// Filter types for data loading
export interface BookFilters {
  category?: BookCategory;
  language?: LanguageType;
  author?: string;
  is_featured?: boolean;
  is_available?: boolean;
  search?: string;
}

export interface UserFilters {
  role?: UserRole;
  is_active?: boolean;
  search?: string;
}

export interface BorrowingFilters {
  status?: BorrowingStatus;
  user_id?: string;
  book_id?: string;
  overdue?: boolean;
  search?: string;
}

// Data creation/update types
export interface CreateBookData {
  title: string;
  title_arabic?: string;
  author: string;
  author_arabic?: string;
  category: BookCategory;
  subcategory?: string;
  description?: string;
  description_arabic?: string;
  cover_image_url?: string;
  language: LanguageType;
  file_url?: string;
  file_type?: FileType;
  isbn?: string;
  publisher?: string;
  publisher_arabic?: string;
  published_date?: string;
  pages?: number;
  tags?: string[];
  is_featured?: boolean;
  is_available?: boolean;
  physical_copies?: number;
  digital_copies?: number;
}

export type UpdateBookData = Partial<CreateBookData>;

export interface CreateUserData {
  email: string;
  full_name?: string;
  name_arabic?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  role?: UserRole;
  guardian_name?: string;
  guardian_phone?: string;
  student_id?: string;
  address?: string;
  emergency_contact?: string;
  enrollment_date?: string;
  class_level?: string;
  is_active?: boolean;
}

export type UpdateUserData = Partial<CreateUserData>;

export interface CreateCategoryData {
  name: string;
  name_arabic?: string;
  description?: string;
  description_arabic?: string;
  parent_id?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

// User borrowing summary interface
export interface UserBorrowingSummary {
  currentBorrowed: number;
  maxLimit: number;
  overdueCount: number;
  totalBorrowed: number;
}
