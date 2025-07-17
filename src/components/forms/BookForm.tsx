import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book } from '../../types';
import { useSupabaseApp } from '../../context/SupabaseContext';

// Islamic book cover images by category
const categoryImages = {
  quran: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  hadith: [
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  fiqh: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  history: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  tafsir: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  biography: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ]
};

const bookSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  title_arabic: z.string().optional(),
  author_name: z.string().min(3, 'Author is required'),
  author_arabic: z.string().optional(),
  category: z.enum(['quran', 'hadith', 'fiqh', 'tafsir', 'aqeedah', 'seerah', 'history', 'biography', 'dua', 'islamic_law', 'arabic_language', 'islamic_ethics', 'comparative_religion', 'islamic_philosophy', 'sufism', 'general']),
  subcategory: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  description_arabic: z.string().optional(),
  language: z.enum(['ar', 'en', 'ur', 'fa', 'tr']),
  isbn: z.string().optional(),
  publisher_name: z.string().optional(),
  publisher_arabic: z.string().optional(),
  published_date: z.string().optional(),
  pages: z.number().min(1, 'Pages must be at least 1'),
  is_featured: z.boolean().optional(),
  physical_copies: z.number().min(0, 'Physical copies cannot be negative').optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  onClose: () => void;
  book?: Book;
}

export function BookForm({ onClose, book }: BookFormProps) {
  const { createBook, updateBook, state } = useSupabaseApp();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || '',
      title_arabic: book?.title_arabic || '',
      author_name: book?.author_name || '',
      author_arabic: book?.author_arabic || '',
      category: book?.category || 'quran',
      subcategory: book?.subcategory || '',
      description: book?.description || '',
      description_arabic: book?.description_arabic || '',
      language: book?.language || 'en',
      isbn: book?.isbn || '',
      publisher_name: book?.publisher_name || '',
      publisher_arabic: book?.publisher_arabic || '',
      published_date: book?.published_date || '',
      pages: book?.pages || 100,
      is_featured: book?.is_featured || false,
      physical_copies: book?.physical_copies || 1,
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: BookFormData) => {
    try {
      setSubmitError(null);

      if (book) {
        await updateBook(book.id, {
          ...data,
          cover_image_url: book.cover_image_url || categoryImages[data.category][0],
          tags: [data.category, ...(data.subcategory ? [data.subcategory] : [])],
        });
      } else {
        await createBook({
          ...data,
          cover_image_url: categoryImages[data.category][0],
          file_type: 'pdf',
          download_count: 0,
          rating: 0,
          rating_count: 0,
          tags: [data.category, ...(data.subcategory ? [data.subcategory] : [])],
          is_available: true,
          digital_copies: 1,
        });
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving book:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save book. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto">
      {/* Success/Error Messages */}
      {isSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200 flex items-center">
            <span className="mr-2">✓</span>
            Book {book ? 'updated' : 'created'} successfully!
          </p>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{submitError}</p>
        </div>
      )}

      {/* Book Preview */}
      {selectedCategory && (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-20 rounded-lg overflow-hidden shadow-lg">
              <img
                src={categoryImages[selectedCategory][0]}
                alt="Book preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Book Preview</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Category: {selectedCategory}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cover will be automatically assigned</p>
            </div>
          </div>
        </div>
      )}

      {/* Title Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input {...register('title')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter book title" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Arabic Title</label>
          <input {...register('title_arabic')} className="w-full glass-input p-3 rounded-lg" placeholder="أدخل العنوان بالعربية" dir="rtl" />
          {errors.title_arabic && <p className="text-red-500 text-sm mt-1">{errors.title_arabic.message}</p>}
        </div>
      </div>

      {/* Author Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <input {...register('author_name')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter author name" />
          {errors.author_name && <p className="text-red-500 text-sm mt-1">{errors.author_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Arabic Author</label>
          <input {...register('author_arabic')} className="w-full glass-input p-3 rounded-lg" placeholder="أدخل اسم المؤلف بالعربية" dir="rtl" />
          {errors.author_arabic && <p className="text-red-500 text-sm mt-1">{errors.author_arabic.message}</p>}
        </div>
      </div>

      {/* Category and Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select {...register('category')} className="w-full glass-input p-3 rounded-lg">
            <option value="quran">Quran</option>
            <option value="hadith">Hadith</option>
            <option value="fiqh">Fiqh</option>
            <option value="tafsir">Tafsir</option>
            <option value="history">History</option>
            <option value="biography">Biography</option>
            <option value="aqeedah">Aqeedah</option>
            <option value="seerah">Seerah</option>
            <option value="dua">Dua</option>
            <option value="islamic_law">Islamic Law</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subcategory</label>
          <input {...register('subcategory')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter subcategory" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Language *</label>
          <select {...register('language')} className="w-full glass-input p-3 rounded-lg">
            <option value="ar">Arabic</option>
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="fa">Farsi</option>
            <option value="tr">Turkish</option>
          </select>
          {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
        </div>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea {...register('description')} className="w-full glass-input p-3 rounded-lg" rows={4} placeholder="Enter book description"></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Arabic Description</label>
          <textarea {...register('description_arabic')} className="w-full glass-input p-3 rounded-lg" rows={4} placeholder="أدخل وصف الكتاب بالعربية" dir="rtl"></textarea>
          {errors.description_arabic && <p className="text-red-500 text-sm mt-1">{errors.description_arabic.message}</p>}
        </div>
      </div>

      {/* Publication Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">ISBN</label>
          <input {...register('isbn')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter ISBN" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Publisher</label>
          <input {...register('publisher')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter publisher" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Published Date</label>
          <input type="date" {...register('published_date')} className="w-full glass-input p-3 rounded-lg" />
        </div>
      </div>

      {/* Publisher Arabic */}
      <div>
        <label className="block text-sm font-medium mb-1">Arabic Publisher</label>
        <input {...register('publisher_arabic')} className="w-full glass-input p-3 rounded-lg" placeholder="أدخل اسم الناشر بالعربية" dir="rtl" />
      </div>

      {/* Numbers and Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pages *</label>
          <input type="number" {...register('pages', { valueAsNumber: true })} className="w-full glass-input p-3 rounded-lg" min="1" />
          {errors.pages && <p className="text-red-500 text-sm mt-1">{errors.pages.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Physical Copies</label>
          <input type="number" {...register('physical_copies', { valueAsNumber: true })} className="w-full glass-input p-3 rounded-lg" min="0" />
          {errors.physical_copies && <p className="text-red-500 text-sm mt-1">{errors.physical_copies.message}</p>}
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input type="checkbox" {...register('is_featured')} className="rounded" />
          <label className="text-sm font-medium">Featured Book</label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <button
          type="button"
          onClick={onClose}
          className="neomorph-button px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
          disabled={isSubmitting || isSuccess}
        >
          {isSuccess ? 'Close' : 'Cancel'}
        </button>
        <button
          type="submit"
          className="neomorph-button px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          disabled={isSubmitting || isSuccess}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : isSuccess ? (
            <>
              <span>✓</span>
              <span>Saved!</span>
            </>
          ) : (
            <span>{book ? 'Update Book' : 'Add Book'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
