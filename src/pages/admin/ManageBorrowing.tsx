import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, AlertTriangle, CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { BorrowingForm } from '../../components/forms/BorrowingForm';
import { BorrowingRecord } from '../../types';

export function ManageBorrowing() {
  const { state, loadBorrowingRecords, loadBooks, loadUsers, returnBook, renewBook } = useSupabaseApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBorrowingRecords();
    loadBooks();
    loadUsers();
  }, [loadBorrowingRecords, loadBooks, loadUsers]);

  const handleNewBorrowing = () => {
    setSelectedRecord(undefined);
    setIsModalOpen(true);
  };

  const handleReturnBook = useCallback(async (borrowingId: string) => {
    if (window.confirm('هل أنت متأكد من إرجاع هذا الكتاب؟ - Are you sure you want to return this book?')) {
      setIsLoading(true);
      try {
        await returnBook(borrowingId, state.profile?.id || '', 'Returned via admin panel');
        await loadBorrowingRecords();
      } catch (error) {
        console.error('Error returning book:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [returnBook, state.profile?.id, loadBorrowingRecords]);

  const handleRenewBook = useCallback(async (borrowingId: string) => {
    if (window.confirm('هل تريد تجديد استعارة هذا الكتاب؟ - Do you want to renew this book borrowing?')) {
      setIsLoading(true);
      try {
        await renewBook(borrowingId);
        await loadBorrowingRecords();
      } catch (error) {
        console.error('Error renewing book:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [renewBook, loadBorrowingRecords]);

  const filteredRecords = useMemo(() => {
    let records = state.borrowingRecords;
    
    if (searchQuery) {
      records = records.filter(record => {
        const book = state.books.find(b => b.id === record.book_id);
        const user = state.users.find(u => u.id === record.user_id);
        return (
          book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book?.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    
    if (statusFilter !== 'all') {
      records = records.filter(record => record.status === statusFilter);
    }
    
    return records;
  }, [state.borrowingRecords, state.books, state.users, searchQuery, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'returned': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'lost': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط - Active';
      case 'returned': return 'مُرجع - Returned';
      case 'overdue': return 'متأخر - Overdue';
      case 'lost': return 'مفقود - Lost';
      default: return status;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const columns = useMemo(() => [
    {
      accessor: 'book',
      header: 'الكتاب - Book',
      render: (record: BorrowingRecord) => {
        const book = state.books.find(b => b.id === record.book_id);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{book?.title || 'Unknown Book'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{book?.author || 'Unknown Author'}</div>
          </div>
        );
      }
    },
    {
      accessor: 'user',
      header: 'المستعير - Borrower',
      render: (record: BorrowingRecord) => {
        const user = state.users.find(u => u.id === record.user_id);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user?.full_name || 'Unknown User'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'No email'}</div>
            {user?.student_id && (
              <div className="text-xs text-blue-600 dark:text-blue-400">ID: {user.student_id}</div>
            )}
          </div>
        );
      }
    },
    {
      accessor: 'borrowed_date',
      header: 'تاريخ الاستعارة - Borrowed Date',
      render: (record: BorrowingRecord) => (
        <div className="text-sm">
          {record.borrowed_date ? new Date(record.borrowed_date).toLocaleDateString('ar-SA') : 'N/A'}
        </div>
      )
    },
    {
      accessor: 'due_date',
      header: 'تاريخ الإرجاع - Due Date',
      render: (record: BorrowingRecord) => (
        <div className={`text-sm ${isOverdue(record.due_date) && record.status === 'active' ? 'text-red-600 font-medium' : ''}`}>
          {new Date(record.due_date).toLocaleDateString('ar-SA')}
          {isOverdue(record.due_date) && record.status === 'active' && (
            <div className="text-xs text-red-500">متأخر - Overdue</div>
          )}
        </div>
      )
    },
    {
      accessor: 'status',
      header: 'الحالة - Status',
      render: (record: BorrowingRecord) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(record.status || 'active')}
          <span className="text-sm">{getStatusText(record.status || 'active')}</span>
        </div>
      )
    },
    {
      accessor: 'renewal_count',
      header: 'التجديدات - Renewals',
      render: (record: BorrowingRecord) => (
        <div className="text-sm">
          {record.renewal_count || 0} / {record.max_renewals || 2}
        </div>
      )
    },
    {
      accessor: 'fine_amount',
      header: 'الغرامة - Fine',
      render: (record: BorrowingRecord) => (
        <div className={`text-sm ${(record.fine_amount || 0) > 0 ? 'text-red-600 font-medium' : ''}`}>
          {record.fine_amount || 0} ريال
        </div>
      )
    },
    {
      accessor: 'actions',
      header: 'الإجراءات - Actions',
      render: (record: BorrowingRecord) => (
        <div className="flex space-x-2">
          {record.status === 'active' && (
            <>
              <button
                onClick={() => handleReturnBook(record.id)}
                className="btn-icon bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40 group disabled:opacity-50"
                title="Return Book"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner w-4 h-4" />
                ) : (
                  <CheckCircle size={16} className="transition-transform group-hover:scale-110" />
                )}
              </button>
              {(record.renewal_count || 0) < (record.max_renewals || 2) && (
                <button
                  onClick={() => handleRenewBook(record.id)}
                  className="btn-icon bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 group disabled:opacity-50"
                  title="Renew Borrowing"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner w-4 h-4" />
                  ) : (
                    <RotateCcw size={16} className="transition-transform group-hover:rotate-180" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ], [state.books, state.users, isLoading, handleRenewBook, handleReturnBook]);

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            إدارة الاستعارات - Manage Borrowings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            إدارة استعارة وإرجاع الكتب - Manage book borrowing and returns
          </p>
        </div>
        <button
          onClick={handleNewBorrowing}
          className="btn-primary flex items-center space-x-2 group"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>New Borrowing</span>
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
                placeholder="البحث في الاستعارات... - Search borrowings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
            >
              <option value="all">جميع الحالات - All Status</option>
              <option value="active">نشط - Active</option>
              <option value="returned">مُرجع - Returned</option>
              <option value="overdue">متأخر - Overdue</option>
              <option value="lost">مفقود - Lost</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'الاستعارات النشطة', value: filteredRecords.filter(r => r.status === 'active').length, color: 'from-blue-500 to-cyan-500', icon: Clock },
          { label: 'الكتب المتأخرة', value: filteredRecords.filter(r => r.status === 'overdue' || (r.status === 'active' && isOverdue(r.due_date))).length, color: 'from-red-500 to-pink-500', icon: AlertTriangle },
          { label: 'الكتب المُرجعة', value: filteredRecords.filter(r => r.status === 'returned').length, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'إجمالي الغرامات', value: `${filteredRecords.reduce((sum, r) => sum + (r.fine_amount || 0), 0)} ريال`, color: 'from-orange-500 to-red-500', icon: Calendar },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Borrowings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {state.isLoading || isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredRecords} />
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

      {/* Borrowing Form Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="استعارة جديدة - New Borrowing"
      >
        <BorrowingForm 
          onClose={() => setIsModalOpen(false)} 
          record={selectedRecord} 
        />
      </Modal>
    </div>
  );
}
