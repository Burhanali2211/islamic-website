import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { dataManager } from '../../services/dataManager';
import { booksService } from '../../services/books';
import { usersService } from '../../services/users';
import { borrowingService } from '../../services/borrowing';
import { useFormAutoSave, useDraftManager } from '../../hooks/useFormAutoSave';
import { errorHandler } from '../../services/errorHandler';
import { NotificationCenter } from '../notifications/NotificationCenter';
import type { Book, User } from '../../types';

export function EnhancedAdminDashboard() {
  const { state, loadDashboardStats } = useSupabaseApp();
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'books' | 'users' | 'borrowing'>('overview');

  // Draft management for new book form
  const { saveDraft, loadDraft, clearDraft } = useDraftManager('book');

  // Load dashboard data with enhanced error handling
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load dashboard stats with caching
      await loadDashboardStats();

      // Load books with caching
      const booksResult = await dataManager.getData(
        'admin_books_overview',
        () => booksService.getBooks({ limit: 10 }),
        { useCache: true }
      );

      if (booksResult.error) {
        throw new Error(booksResult.error);
      }

      setBooks(Array.isArray(booksResult.data) ? booksResult.data : []);

      // Load recent users
      const usersResult = await dataManager.getData(
        'admin_users_recent',
        () => usersService.getUsers({ limit: 10, sortBy: 'created_at' }),
        { useCache: true }
      );

      if (usersResult.error) {
        throw new Error(usersResult.error);
      }

      setUsers(Array.isArray(usersResult.data) ? usersResult.data : []);

    } catch (error) {
      const errorResponse = await errorHandler.handleError(
        error,
        'admin_dashboard_load',
        state.user?.id
      );
      
      setError(errorResponse.error?.message || 'Failed to load dashboard data');
      
      // Show user-friendly notification
      const notification = errorHandler.createErrorNotification(errorResponse.error!);
      // You would integrate this with your notification system
      
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!state.user) return;

    // Subscribe to books table changes
    const unsubscribeBooks = dataManager.subscribeToTable(
      'books',
      (payload) => {
        // Refresh books data
        loadDashboardData();
      }
    );

    // Subscribe to users table changes
    const unsubscribeUsers = dataManager.subscribeToTable(
      'profiles',
      (payload) => {
        // Refresh users data
        loadDashboardData();
      }
    );

    return () => {
      unsubscribeBooks();
      unsubscribeUsers();
    };
  }, [state.user]);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle book creation with draft support
  const handleCreateBook = async (bookData: Partial<Book>) => {
    try {
      // Save as draft first
      const draftId = `new-book-${Date.now()}`;
      saveDraft(draftId, bookData);

      // Create in database with enhanced error handling
      const result = await dataManager.saveData(
        draftId,
        bookData,
        (data) => booksService.createBook(data),
        { autoSave: true }
      );

      if (result.error) {
        throw new Error(result.error);
      }

      // Clear draft on success
      clearDraft(draftId);
      
      // Refresh data
      loadDashboardData();
      
      return result.data;
    } catch (error) {
      const errorResponse = await errorHandler.handleError(
        error,
        'book_creation',
        state.user?.id
      );
      
      throw new Error(errorResponse.error?.message || 'Failed to create book');
    }
  };

  // Handle book deletion with confirmation
  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await booksService.deleteBook(bookId);
      
      if (error) {
        throw new Error(error);
      }

      // Update local state immediately for better UX
      setBooks(prev => prev.filter(book => book.id !== bookId));
      
      // Refresh dashboard stats
      loadDashboardStats();
      
    } catch (error) {
      const errorResponse = await errorHandler.handleError(
        error,
        'book_deletion',
        state.user?.id
      );
      
      setError(errorResponse.error?.message || 'Failed to delete book');
    }
  };

  const stats = state.dashboardStats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                IDARAH WALI UL ASER - Islamic Library Management
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadDashboardData}
                disabled={isLoading}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Refresh Data"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowNotifications(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white relative"
              >
                <Eye className="h-5 w-5" />
                {/* Notification badge would go here */}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'books', label: 'Books', icon: BookOpen },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'borrowing', label: 'Borrowing', icon: RefreshCw }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedTab === key
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.books?.total || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.users?.active || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Borrowings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.borrowing?.totalActive || 0}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Books</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.borrowing?.totalOverdue || 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Books Tab */}
        {selectedTab === 'books' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Books
                </h2>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {book.author_name} • {book.category}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
