import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { BookForm } from '../../components/forms/BookForm';
import { Book } from '../../types';

export function ManageBooks() {
  const { state, loadBooks, deleteBook } = useSupabaseApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const handleAddNew = () => {
    setSelectedBook(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكتاب؟ - Are you sure you want to delete this book?')) {
      setIsLoading(true);
      try {
        await deleteBook(bookId);
      } catch (error) {
        console.error('Error deleting book:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchQuery || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      };
      await loadBooks(filters);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    let books = state.books;

    if (searchQuery) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.title_arabic?.includes(searchQuery) ||
        book.author_arabic?.includes(searchQuery)
      );
    }

    if (selectedCategory !== 'all') {
      books = books.filter(book => book.category === selectedCategory);
    }

    return books;
  }, [state.books, searchQuery, selectedCategory]);

  const columns = useMemo(() => [
    {
      accessor: 'title',
      header: 'العنوان - Title',
      render: (book: Book) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{book.title}</div>
          {book.title_arabic && (
            <div className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">{book.title_arabic}</div>
          )}
        </div>
      )
    },
    {
      accessor: 'author',
      header: 'المؤلف - Author',
      render: (book: Book) => (
        <div>
          <div className="text-gray-900 dark:text-white">{book.author}</div>
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
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(book)}
            className="neomorph-button p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="تعديل - Edit"
          >
            <Edit size={16} className="text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(book.id)}
            className="neomorph-button p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="حذف - Delete"
            disabled={isLoading}
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ], [isLoading]);

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            إدارة الكتب - Manage Books
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            إضافة وتعديل وحذف الكتب من المكتبة - Add, edit, or delete books from the library
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>إضافة كتاب جديد - Add New Book</span>
        </button>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في الكتب... - Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
            >
              <option value="all">جميع التصنيفات - All Categories</option>
              <option value="quran">القرآن - Quran</option>
              <option value="hadith">الحديث - Hadith</option>
              <option value="fiqh">الفقه - Fiqh</option>
              <option value="tafsir">التفسير - Tafsir</option>
              <option value="history">التاريخ - History</option>
              <option value="biography">السيرة - Biography</option>
              <option value="aqeedah">العقيدة - Aqeedah</option>
              <option value="dua">الأدعية - Dua</option>
              <option value="islamic_law">الشريعة - Islamic Law</option>
            </select>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-transform flex items-center space-x-2"
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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
