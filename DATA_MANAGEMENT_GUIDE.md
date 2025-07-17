# IDARAH WALI UL ASER - Data Management System Guide

## Overview

This guide explains the comprehensive data management system implemented for the Islamic library dashboard. The system provides dual data management with real Supabase database integration and local storage for draft management.

## Architecture

### 1. **Real Database Integration**
- **Primary Data Source**: Supabase PostgreSQL database
- **Schema**: Complete Islamic library schema with RLS policies
- **Real-time Updates**: Supabase subscriptions for live data
- **Caching**: Intelligent caching with automatic invalidation

### 2. **Local Storage Draft Management**
- **Auto-save**: Automatic form data saving every 3-5 seconds
- **Draft Recovery**: Restore unsaved work on page reload
- **Quiz Progress**: Save quiz answers and progress locally
- **User Preferences**: Bookmarks, recent reads, settings

### 3. **Enhanced Error Handling**
- **Error Classification**: Automatic error categorization and severity
- **Retry Logic**: Exponential backoff for retryable operations
- **User-friendly Messages**: Islamic context-appropriate error messages
- **Error Logging**: Comprehensive error tracking and reporting

## Key Components

### Services

#### 1. **DataManager** (`src/services/dataManager.ts`)
Central data management service that combines database operations with caching.

```typescript
// Get data with caching
const { data, error } = await dataManager.getData(
  'books_featured',
  () => booksService.getFeaturedBooks(),
  { useCache: true }
);

// Save data with draft support
const result = await dataManager.saveData(
  'book_123',
  bookData,
  (data) => booksService.updateBook('123', data),
  { autoSave: true }
);
```

#### 2. **LocalStorageService** (`src/services/localStorage.ts`)
Handles all local storage operations for drafts and user preferences.

```typescript
// Save draft
localStorageService.saveDraft({
  id: 'book-123',
  type: 'book',
  data: formData,
  userId: user.id,
  timestamp: Date.now()
});

// Auto-save form data
localStorageService.saveFormData('book-form', formData, user.id);

// Save quiz progress
localStorageService.saveQuizProgress({
  quizId: 'quiz-456',
  answers: { q1: 'A', q2: 'B' },
  currentQuestion: 2,
  userId: user.id
});
```

#### 3. **CoursesService** (`src/services/courses.ts`)
Complete course, assignment, and quiz management.

```typescript
// Get courses for teacher
const courses = await coursesService.getCourses(teacherId);

// Create assignment
const assignment = await coursesService.createAssignment({
  title: 'Hadith Analysis',
  course_id: courseId,
  teacher_id: teacherId,
  due_date: '2024-02-15'
});

// Get quiz attempts
const attempts = await coursesService.getQuizAttempts(quizId, studentId);
```

#### 4. **ErrorHandler** (`src/services/errorHandler.ts`)
Comprehensive error handling with Islamic context.

```typescript
// Handle errors with context
const errorResponse = await errorHandler.handleError(
  error,
  'book_creation',
  userId
);

// Retry operations with backoff
const result = await errorHandler.retryOperation(
  () => booksService.createBook(data),
  3, // max retries
  1000 // base delay
);
```

### Hooks

#### 1. **useFormAutoSave** (`src/hooks/useFormAutoSave.ts`)
Automatic form data saving and recovery.

```typescript
const {
  saveFormData,
  saveNow,
  loadFormData,
  clearFormData,
  hasSavedData
} = useFormAutoSave({
  formId: 'book-form-123',
  autoSaveInterval: 3000,
  onSave: (data) => console.log('Auto-saved:', data),
  onRestore: (data) => setFormData(data)
});
```

#### 2. **useQuizAutoSave**
Quiz progress management.

```typescript
const {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  hasProgress
} = useQuizAutoSave('quiz-123');
```

#### 3. **useDraftManager**
Draft management for different entity types.

```typescript
const {
  saveDraft,
  loadDraft,
  clearDraft,
  getUserDrafts,
  hasDraft
} = useDraftManager('book');
```

## Implementation Examples

### 1. **Enhanced Book Form**
See `src/components/forms/EnhancedBookForm.tsx` for a complete example of:
- Auto-save functionality
- Draft management
- Error handling
- Real-time status updates

### 2. **Dashboard with Real-time Updates**
```typescript
// Subscribe to user-specific data changes
useEffect(() => {
  const unsubscribe = dataManager.subscribeToUserData(
    userId,
    (payload) => {
      // Handle real-time updates
      switch (payload.table) {
        case 'borrowing_records':
          loadBorrowingRecords();
          break;
        case 'notifications':
          loadNotifications();
          break;
      }
    }
  );

  return unsubscribe;
}, [userId]);
```

### 3. **Course Management**
```typescript
// Teacher creating assignment with auto-save
const createAssignment = async (assignmentData) => {
  try {
    // Save draft first
    saveDraft(`assignment-${Date.now()}`, assignmentData);
    
    // Create in database
    const result = await coursesService.createAssignment(assignmentData);
    
    if (result.data) {
      // Clear draft on success
      clearDraft(`assignment-${Date.now()}`);
      return result.data;
    }
  } catch (error) {
    // Error handling with retry
    const errorResponse = await errorHandler.handleError(error);
    if (errorResponse.retryable) {
      // Show retry option to user
    }
  }
};
```

## Database Schema Integration

### Row Level Security (RLS)
All tables have RLS policies that respect user roles:

- **Admin**: Full access to all data
- **Teacher**: Access to their courses, students, assignments
- **Student**: Access to their own data, enrolled courses, public content

### Real-time Subscriptions
Automatic updates for:
- Borrowing record changes
- New notifications
- Course enrollment updates
- Assignment submissions
- Quiz attempts

## Best Practices

### 1. **Data Loading**
```typescript
// Always use the enhanced data manager
const loadBooks = async (filters) => {
  const cacheKey = `books_${JSON.stringify(filters)}`;
  const { data, error } = await dataManager.getData(
    cacheKey,
    () => booksService.getBooks(filters),
    { useCache: true }
  );
  
  if (error) {
    const errorResponse = await errorHandler.handleError(error);
    // Handle error appropriately
  }
  
  return data;
};
```

### 2. **Form Management**
```typescript
// Always implement auto-save for forms
const BookForm = () => {
  const { saveFormData, loadFormData } = useFormAutoSave({
    formId: 'book-form',
    autoSaveInterval: 3000
  });
  
  // Auto-save on form changes
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);
};
```

### 3. **Error Handling**
```typescript
// Always use the error handler for consistent UX
try {
  const result = await someOperation();
} catch (error) {
  const errorResponse = await errorHandler.handleError(
    error,
    'operation_context',
    userId
  );
  
  // Show user-friendly message
  showNotification(errorHandler.getUserMessage(errorResponse.error));
}
```

## Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Local Storage Settings
- **Draft Expiry**: 7 days
- **Cache Expiry**: 5 minutes
- **Max Drafts**: 50 per user
- **Auto-save Interval**: 3-5 seconds

## Monitoring and Debugging

### Error Logs
- In-memory error log (last 100 errors)
- localStorage persistence
- Console logging in development
- Database logging for critical errors

### Performance Monitoring
- Cache hit/miss rates
- Local storage usage
- Real-time subscription status
- Database query performance

## Migration from Mock Data

The system automatically detects demo mode and falls back to mock data when needed. To fully migrate:

1. Ensure database schema is deployed
2. Create admin user with proper permissions
3. Update environment variables
4. Test RLS policies
5. Verify real-time subscriptions

## Support

For technical issues or questions about the data management system, refer to:
- Error logs in browser console
- Local storage error log
- Database logs in Supabase dashboard
- Real-time subscription status
