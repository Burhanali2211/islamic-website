import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { useFormAutoSave, useDraftManager } from '../../hooks/useFormAutoSave';
import { errorHandler } from '../../services/errorHandler';
import type { Book } from '../../types';

interface EnhancedBookFormProps {
  book?: Partial<Book>;
  onSave?: (book: Book) => void;
  onCancel?: () => void;
}

export function EnhancedBookForm({ book, onSave, onCancel }: EnhancedBookFormProps) {
  const { createBook, updateBook, state } = useSupabaseApp();
  const [formData, setFormData] = useState({
    title: book?.title || '',
    title_arabic: book?.title_arabic || '',
    author_name: book?.author_name || '',
    author_arabic: book?.author_arabic || '',
    category: book?.category || 'general',
    language: book?.language || 'en',
    description: book?.description || '',
    description_arabic: book?.description_arabic || '',
    isbn: book?.isbn || '',
    pages: book?.pages || 0,
    publisher_name: book?.publisher_name || '',
    published_date: book?.published_date || '',
    physical_copies: book?.physical_copies || 1,
    digital_copies: book?.digital_copies || 0,
    is_featured: book?.is_featured || false,
    tags: book?.tags || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const formId = `book-form-${book?.id || 'new'}`;
  const draftId = book?.id || `new-${Date.now()}`;

  // Auto-save functionality
  const {
    saveFormData,
    saveNow,
    loadFormData,
    clearFormData,
    hasSavedData
  } = useFormAutoSave({
    formId,
    enabled: true,
    autoSaveInterval: 3000, // 3 seconds
    onSave: () => {
      setAutoSaveStatus('saving');
      setTimeout(() => setAutoSaveStatus('saved'), 500);
    },
    onRestore: (data) => {
      setFormData(prev => ({ ...prev, ...data }));
    }
  });

  // Draft management
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useDraftManager('book');

  // Load saved data on mount
  useEffect(() => {
    if (hasSavedData()) {
      loadFormData();
    } else if (hasDraft(draftId)) {
      const draft = loadDraft(draftId);
      if (draft) {
        setFormData(prev => ({ ...prev, ...draft.data }));
      }
    }
  }, []);

  // Auto-save form data when it changes
  useEffect(() => {
    if (Object.values(formData).some(value => value !== '' && value !== 0 && value !== false)) {
      saveFormData(formData);
      saveDraft(draftId, formData);
    }
  }, [formData, saveFormData, saveDraft, draftId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Save immediately before submitting
      await saveNow(formData);

      let result;
      if (book?.id) {
        result = await updateBook(book.id, formData);
      } else {
        result = await createBook(formData);
      }

      if (result.error) {
        const errorResponse = await errorHandler.handleError(
          new Error(result.error),
          'book_form_submit',
          state.user?.id
        );
        setSubmitError(errorResponse.error?.message || 'Failed to save book');
        return;
      }

      // Clear saved data on successful submit
      clearFormData();
      clearDraft(draftId);
      setSubmitSuccess(true);
      
      if (onSave && result.data) {
        onSave(result.data);
      }

      // Reset form for new book
      if (!book?.id) {
        setFormData({
          title: '',
          title_arabic: '',
          author_name: '',
          author_arabic: '',
          category: 'general',
          language: 'en',
          description: '',
          description_arabic: '',
          isbn: '',
          pages: 0,
          publisher_name: '',
          published_date: '',
          physical_copies: 1,
          digital_copies: 0,
          is_featured: false,
          tags: []
        });
      }
    } catch (error) {
      const errorResponse = await errorHandler.handleError(
        error,
        'book_form_submit',
        state.user?.id
      );
      setSubmitError(errorResponse.error?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Ask user if they want to save draft
    if (Object.values(formData).some(value => value !== '' && value !== 0 && value !== false)) {
      const shouldSaveDraft = window.confirm(
        'You have unsaved changes. Would you like to save them as a draft?'
      );
      
      if (shouldSaveDraft) {
        saveDraft(draftId, formData);
      } else {
        clearFormData();
        clearDraft(draftId);
      }
    }
    
    onCancel?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      {/* Header with auto-save status */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {book?.id ? 'Edit Book' : 'Add New Book'}
        </h2>
        
        <div className="flex items-center space-x-2">
          {autoSaveStatus === 'saving' && (
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4 mr-1 animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}
          {autoSaveStatus === 'saved' && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Auto-saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">
              Book saved successfully! Alhamdulillah.
            </span>
          </div>
        </motion.div>
      )}

      {submitError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{submitError}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title (English) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title (Arabic)
            </label>
            <input
              type="text"
              value={formData.title_arabic}
              onChange={(e) => handleInputChange('title_arabic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              dir="rtl"
            />
          </div>
        </div>

        {/* Author Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author (English) *
            </label>
            <input
              type="text"
              value={formData.author_name}
              onChange={(e) => handleInputChange('author_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author (Arabic)
            </label>
            <input
              type="text"
              value={formData.author_arabic}
              onChange={(e) => handleInputChange('author_arabic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              dir="rtl"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {book?.id ? 'Update Book' : 'Add Book'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
