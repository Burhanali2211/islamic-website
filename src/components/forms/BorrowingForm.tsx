import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BorrowingRecord, UserBorrowingSummary } from '../../types';
import { useSupabaseApp } from '../../context/SupabaseContext';

const borrowingSchema = z.object({
  user_id: z.string().min(1, 'Borrower is required'),
  book_id: z.string().min(1, 'Book is required'),
  due_date: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

type BorrowingFormData = z.infer<typeof borrowingSchema>;

interface BorrowingFormProps {
  onClose: () => void;
  record?: BorrowingRecord;
}

export function BorrowingForm({ onClose, record }: BorrowingFormProps) {
  const { state, borrowBook, loadBorrowingRecords } = useSupabaseApp();
  const [userBorrowingSummary, setUserBorrowingSummary] = useState<UserBorrowingSummary | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<BorrowingFormData>({
    resolver: zodResolver(borrowingSchema),
    defaultValues: {
      user_id: record?.user_id || '',
      book_id: record?.book_id || '',
      due_date: record?.due_date ? record.due_date.split('T')[0] : '',
      notes: record?.notes || '',
    },
  });

  const watchedUserId = watch('user_id');

  useEffect(() => {
    if (watchedUserId) {
      // Get user borrowing summary
      const user = state.users.find(u => u.id === watchedUserId);
      if (user) {
        setUserBorrowingSummary({
          currentBorrowed: user.current_borrowed_count || 0,
          maxLimit: user.max_borrow_limit || 3,
          overdueCount: 0, // TODO: Calculate from borrowing records
          totalBorrowed: user.total_books_borrowed || 0
        });
      }
    }
  }, [watchedUserId, state.users]);

  // Set default due date to 14 days from now
  useEffect(() => {
    if (!record) {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 14);
      setValue('due_date', defaultDueDate.toISOString().split('T')[0]);
    }
  }, [record, setValue]);

  const onSubmit = async (data: BorrowingFormData) => {
    try {
      if (!record) {
        // Create new borrowing
        await borrowBook(data.user_id, data.book_id, state.profile?.id || '');
        await loadBorrowingRecords();
      }
      onClose();
    } catch (error) {
      console.error('Error creating borrowing:', error);
    }
  };

  const availableBooks = state.books.filter(book => 
    book.is_available && (book.physical_copies || 0) > 0
  );

  const activeStudents = state.users.filter(user => 
    user.is_active && (user.role === 'student' || user.role === 'teacher')
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* User Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Borrower *</label>
        <select
          {...register('user_id')}
          className="w-full glass-input p-3 rounded-lg"
          disabled={!!record}
        >
          <option value="">Select Borrower</option>
          {activeStudents.map(user => (
            <option key={user.id} value={user.id}>
              {user.full_name} ({user.email})
              {user.student_id && ` - ID: ${user.student_id}`}
              {user.role === 'teacher' && ' - Teacher'}
            </option>
          ))}
        </select>
        {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id.message}</p>}
        
        {/* User Borrowing Summary */}
        {userBorrowingSummary && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm">
              <p>Current Borrowings: {userBorrowingSummary.currentBorrowed} / {userBorrowingSummary.maxLimit}</p>
              <p className={`${userBorrowingSummary.canBorrow ? 'text-green-600' : 'text-red-600'}`}>
                {userBorrowingSummary.canBorrow ? 'Can Borrow' : 'Cannot Borrow'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Book Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Book *</label>
        <select
          {...register('book_id')}
          className="w-full glass-input p-3 rounded-lg"
          disabled={!!record}
        >
          <option value="">Select Book</option>
          {availableBooks.map(book => (
            <option key={book.id} value={book.id}>
              {book.title} - {book.author_name}
              ({book.physical_copies} copies available)
            </option>
          ))}
        </select>
        {errors.book_id && <p className="text-red-500 text-sm mt-1">{errors.book_id.message}</p>}
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Expected Return Date *</label>
        <input
          type="date"
          {...register('due_date')}
          className="w-full glass-input p-3 rounded-lg"
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date.message}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Default borrowing period is 14 days
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <textarea
          {...register('notes')}
          className="w-full glass-input p-3 rounded-lg"
          rows={3}
          placeholder="Enter any additional notes..."
        />
      </div>

      {/* Borrowing Rules */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Borrowing Rules
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Maximum borrowing: 3 books for students, 10 for teachers</li>
          <li>• Default borrowing period: 14 days</li>
          <li>• Maximum 2 renewals allowed</li>
          <li>• Late fee: 1 SAR per day</li>
          <li>• Books must be returned in good condition</li>
          <li>• Lost books must be replaced or paid for</li>
        </ul>
      </div>

      {/* Warning for non-borrowable users */}
      {userBorrowingSummary && !userBorrowingSummary.canBorrow && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">
            ⚠️ This user has reached the maximum borrowing limit
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="neomorph-button px-6 py-2 rounded-lg"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="neomorph-button px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white disabled:opacity-50"
          disabled={isSubmitting || (userBorrowingSummary && !userBorrowingSummary.canBorrow)}
        >
          {isSubmitting ? 'Saving...' : 'Confirm Borrowing'}
        </button>
      </div>
    </form>
  );
}
