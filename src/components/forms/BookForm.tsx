import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book, BookCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { faker } from '@faker-js/faker';

const bookSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  author: z.string().min(3, 'Author is required'),
  category: z.enum(['quran', 'hadith', 'fiqh', 'history', 'tafsir', 'biography']),
  description: z.string().min(10, 'Description is required'),
  pages: z.number().min(1, 'Pages must be at least 1'),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  onClose: () => void;
  book?: Book;
}

export function BookForm({ onClose, book }: BookFormProps) {
  const { dispatch } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      category: book?.category || 'quran',
      description: book?.description || '',
      pages: book?.pages || 100,
    },
  });

  const onSubmit = (data: BookFormData) => {
    if (book) {
      const updatedBook: Book = { ...book, ...data };
      dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
    } else {
      const newBook: Book = {
        id: faker.string.uuid(),
        ...data,
        coverImage: `https://picsum.photos/400/600?random=${faker.number.int({ min: 1, max: 1000 })}`,
        language: 'en',
        fileUrl: faker.internet.url(),
        fileType: 'pdf',
        publishedDate: new Date().toISOString(),
        downloadCount: 0,
        rating: 0,
        tags: [data.category],
      };
      dispatch({ type: 'ADD_BOOK', payload: newBook });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input {...register('title')} className="w-full glass-input p-3 rounded-lg" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Author</label>
        <input {...register('author')} className="w-full glass-input p-3 rounded-lg" />
        {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select {...register('category')} className="w-full glass-input p-3 rounded-lg">
          {(['quran', 'hadith', 'fiqh', 'history', 'tafsir', 'biography'] as BookCategory[]).map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register('description')} className="w-full glass-input p-3 rounded-lg" rows={4}></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Pages</label>
        <input type="number" {...register('pages', { valueAsNumber: true })} className="w-full glass-input p-3 rounded-lg" />
        {errors.pages && <p className="text-red-500 text-sm mt-1">{errors.pages.message}</p>}
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onClose} className="neomorph-button px-6 py-2 rounded-lg">Cancel</button>
        <button type="submit" className="neomorph-button px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
          {book ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}
