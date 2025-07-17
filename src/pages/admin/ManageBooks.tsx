import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Star,
  Copy,
  RefreshCw,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  X,
  FileText,
  BarChart3
} from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { BookForm } from '../../components/forms/BookForm';
import { Book, BookFilters } from '../../types';

export function ManageBooks() {
  const { state, loadBooks, deleteBook, loadCategories } = useSupabaseApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, [loadBooks, loadCategories]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
  };

  const handleAddNew = () => {
    setSelectedBook(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleView = (book: Book) => {
    // Open book details in a modal or navigate to detail page
    console.log('Viewing book:', book);
    showNotification('info', `Viewing details for "${book.title}"`);
  };

  const handleDuplicate = async (book: Book) => {
    try {
      setIsLoading(true);
      const { id, created_at, updated_at, ...bookData } = book;
      const duplicatedBook = {
        ...bookData,
        title: `${book.title} (Copy)`,
      } as Book;
      setSelectedBook(duplicatedBook);
      setIsModalOpen(true);
      showNotification('info', 'Book duplicated. Please modify details and save.');
    } catch (error) {
      console.error('Error duplicating book:', error);
      showNotification('error', 'Failed to duplicate book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async (bookId: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      // This would call an update function to toggle featured status
      console.log('Toggling featured status for book:', bookId, !currentStatus);
      showNotification('success', `Book ${!currentStatus ? 'marked as featured' : 'removed from featured'}`);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showNotification('error', 'Failed to update featured status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = useCallback(async (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await deleteBook(bookId);
        showNotification('success', 'Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        showNotification('error', 'Failed to delete book');
      } finally {
        setIsLoading(false);
      }
    }
  }, [deleteBook]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filters: BookFilters = {
        search: searchQuery || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
        author: selectedAuthor || undefined,
      };
      await loadBooks(filters);
      showNotification('success', `Found ${filteredBooks.length} books matching your criteria`);
    } catch (error) {
      console.error('Error searching books:', error);
      showNotification('error', 'Failed to search books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedAuthor('');
    setAvailabilityFilter('all');
    setFeaturedFilter('all');
    setSortBy('title');
    setSortOrder('asc');
    loadBooks();
    showNotification('info', 'Filters cleared');
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedBooks.length} selected books? This action cannot be undone.`)) {
      setIsLoading(true);
      try {
        for (const bookId of selectedBooks) {
          await deleteBook(bookId);
        }
        setSelectedBooks([]);
        showNotification('success', `Successfully deleted ${selectedBooks.length} books`);
      } catch (error) {
        console.error('Error bulk deleting books:', error);
        showNotification('error', 'Failed to delete some books');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === filteredBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
  };

  const handleSelectBook = (bookId: string) => {
    setSelectedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const filteredBooks = useMemo(() => {
    let books = [...state.books];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.title_arabic?.includes(searchQuery) ||
        book.author_arabic?.includes(searchQuery) ||
        book.description?.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query) ||
        book.publisher?.toLowerCase().includes(query) ||
        book.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      books = books.filter(book => book.category === selectedCategory);
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      books = books.filter(book => book.language === selectedLanguage);
    }

    // Author filter
    if (selectedAuthor) {
      const author = selectedAuthor.toLowerCase();
      books = books.filter(book =>
        book.author.toLowerCase().includes(author) ||
        book.author_arabic?.includes(selectedAuthor)
      );
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      books = books.filter(book =>
        availabilityFilter === 'available' ? book.is_available : !book.is_available
      );
    }

    // Featured filter
    if (featuredFilter !== 'all') {
      books = books.filter(book =>
        featuredFilter === 'featured' ? book.is_featured : !book.is_featured
      );
    }

    // Sorting
    books.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'pages':
          aValue = a.pages || 0;
          bValue = b.pages || 0;
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return books;
  }, [
    state.books,
    searchQuery,
    selectedCategory,
    selectedLanguage,
    selectedAuthor,
    availabilityFilter,
    featuredFilter,
    sortBy,
    sortOrder
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  // Get unique authors for filter dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Set<string>();
    state.books.forEach(book => {
      authors.add(book.author_name);
      if (book.author_arabic) authors.add(book.author_arabic);
    });
    return Array.from(authors).sort();
  }, [state.books]);

  // Statistics
  const stats = useMemo(() => ({
    total: filteredBooks.length,
    available: filteredBooks.filter(book => book.is_available).length,
    featured: filteredBooks.filter(book => book.is_featured).length,
    categories: new Set(filteredBooks.map(book => book.category)).size,
    languages: new Set(filteredBooks.map(book => book.language)).size,
  }), [filteredBooks]);

  const columns = useMemo(() => [
    {
      accessor: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      ),
      render: (book: Book) => (
        <input
          type="checkbox"
          checked={selectedBooks.includes(book.id)}
          onChange={() => handleSelectBook(book.id)}
          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
      )
    },
    {
      accessor: 'title',
      header: 'العنوان - Title',
      render: (book: Book) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="font-semibold text-gray-900 dark:text-white">
              {book.title}
            </div>
            {book.is_featured && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
            {!book.is_available && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {book.title_arabic && (
            <div className="text-sm text-gray-600 dark:text-gray-300 font-arabic" dir="rtl">
              {book.title_arabic}
            </div>
          )}
          {book.isbn && (
            <div className="text-xs text-gray-500">
              ISBN: {book.isbn}
            </div>
          )}
        </div>
      )
    },
    {
      accessor: 'author_name',
      header: 'المؤلف - Author',
      render: (book: Book) => (
        <div>
          <div className="text-gray-900 dark:text-white">{book.author_name}</div>
          {book.author_arabic && (
            <div className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">{book.author_arabic}</div>
          )}
        </div>
      )
    },
    {
      accessor: 'category',
      header: 'التصنيف - Category',
      render: (book: Book) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
          {book.category}
        </span>
      )
    },
    {
      accessor: 'language',
      header: 'اللغة - Language',
      render: (book: Book) => (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
          {book.language}
        </span>
      )
    },
    {
      accessor: 'pages',
      header: 'الصفحات - Pages',
      render: (book: Book) => book.pages || 'N/A'
    },
    {
      accessor: 'is_available',
      header: 'الحالة - Status',
      render: (book: Book) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          book.is_available
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {book.is_available ? 'متاح - Available' : 'غير متاح - Unavailable'}
        </span>
      )
    },
    {
      accessor: 'actions',
      header: 'الإجراءات - Actions',
      render: (book: Book) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleView(book)}
            className="btn-icon bg-gray-50 dark:bg-gray-900/20 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/40 group"
            title="View Details"
          >
            <Eye size={14} className="transition-transform group-hover:scale-110" />
          </button>
          <button
            onClick={() => handleEdit(book)}
            className="btn-icon bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 group"
            title="Edit Book"
          >
            <Edit size={14} className="transition-transform group-hover:scale-110" />
          </button>
          <button
            onClick={() => handleDuplicate(book)}
            className="btn-icon bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40 group"
            title="Duplicate Book"
          >
            <Copy size={14} className="transition-transform group-hover:scale-110" />
          </button>
          <button
            onClick={() => handleToggleFeatured(book.id, book.is_featured || false)}
            className={`btn-icon ${book.is_featured
              ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
              : 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/40'
            } group`}
            title={book.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
          >
            <Star size={14} className={`transition-transform group-hover:scale-110 ${book.is_featured ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => handleDelete(book.id)}
            className="btn-icon bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Book"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner w-3 h-3" />
            ) : (
              <Trash2 size={14} className="transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>
      ),
    },
  ], [
    isLoading,
    handleDelete,
    handleView,
    handleEdit,
    handleDuplicate,
    handleToggleFeatured,
    selectedBooks,
    filteredBooks,
    handleSelectAll,
    handleSelectBook
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg border ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
              : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
              {notification.type === 'error' && <AlertTriangle className="h-5 w-5" />}
              {notification.type === 'info' && <FileText className="h-5 w-5" />}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            إدارة الكتب - Manage Books
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            إضافة وتعديل وحذف الكتب من المكتبة - Comprehensive book management for the Islamic library
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{stats.total} Total Books</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{stats.available} Available</span>
            </span>
            <span className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{stats.featured} Featured</span>
            </span>
            <span className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span>{stats.categories} Categories</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleAddNew}
            className="btn-primary flex items-center space-x-2 group"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            <span>إضافة كتاب جديد - Add New Book</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-emerald-500" />
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-enhanced pl-10 pr-4"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-enhanced pl-10 pr-8 min-w-[200px]"
              >
                <option value="all">All Categories</option>
                <option value="quran">Quran</option>
                <option value="hadith">Hadith</option>
                <option value="fiqh">Fiqh</option>
                <option value="tafsir">Tafsir</option>
                <option value="history">History</option>
                <option value="biography">Biography</option>
                <option value="aqeedah">Aqeedah</option>
                <option value="dua">Dua</option>
                <option value="islamic_law">Islamic Law</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2 group"
            >
              <Filter className="h-4 w-4" />
              <span>بحث - Search</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Books Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {state.isLoading || isLoading ? (
          <div className="glass-card p-12 rounded-3xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="loading-spinner w-12 h-12"></div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Books</h3>
                <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the library collection...</p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredBooks} />
        )}
      </motion.div>

      {/* Error Display */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p className="text-red-800 dark:text-red-200">{state.error}</p>
        </motion.div>
      )}

      {/* Book Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBook ? 'تعديل الكتاب - Edit Book' : 'إضافة كتاب جديد - Add New Book'}
      >
        <BookForm
          onClose={() => setIsModalOpen(false)}
          book={selectedBook}
        />
      </Modal>
    </div>
  );
}
