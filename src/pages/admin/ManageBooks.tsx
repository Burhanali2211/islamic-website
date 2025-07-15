import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { BookForm } from '../../components/forms/BookForm';
import { Book } from '../../types';

export function ManageBooks() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

  const handleAddNew = () => {
    setSelectedBook(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch({ type: 'DELETE_BOOK', payload: bookId });
    }
  };

  const columns = useMemo(() => [
    { accessor: 'title', header: 'Title' },
    { accessor: 'author', header: 'Author' },
    { accessor: 'category', header: 'Category' },
    { accessor: 'pages', header: 'Pages' },
    {
      accessor: 'actions',
      header: 'Actions',
      render: (book: Book) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(book)} className="neomorph-button p-2 rounded-lg"><Edit size={16} /></button>
          <button onClick={() => handleDelete(book.id)} className="neomorph-button p-2 rounded-lg text-red-500"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ], [dispatch]);

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Manage Books
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add, edit, or delete books from the library.
          </p>
        </div>
        <button onClick={handleAddNew} className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add New Book</span>
        </button>
      </motion.div>

      <DataTable columns={columns} data={state.books} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedBook ? 'Edit Book' : 'Add New Book'}>
        <BookForm onClose={() => setIsModalOpen(false)} book={selectedBook} />
      </Modal>
    </div>
  );
}
