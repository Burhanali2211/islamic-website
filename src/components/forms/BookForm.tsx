import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book, BookCategory, LanguageType } from '../../types';
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
  title: z.string().min(3, 'العنوان مطلوب - Title is required'),
  title_arabic: z.string().optional(),
  author: z.string().min(3, 'المؤلف مطلوب - Author is required'),
  author_arabic: z.string().optional(),
  category: z.enum(['quran', 'hadith', 'fiqh', 'tafsir', 'history', 'biography', 'aqeedah', 'seerah', 'dua', 'islamic_law']),
  subcategory: z.string().optional(),
  description: z.string().min(10, 'الوصف مطلوب - Description is required'),
  description_arabic: z.string().optional(),
  language: z.enum(['ar', 'en', 'ur', 'fa', 'tr']),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  publisher_arabic: z.string().optional(),
  published_date: z.string().optional(),
  pages: z.number().min(1, 'عدد الصفحات يجب أن يكون على الأقل 1 - Pages must be at least 1'),
  is_featured: z.boolean().optional(),
  physical_copies: z.number().min(0, 'عدد النسخ لا يمكن أن يكون سالباً - Physical copies cannot be negative').optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  onClose: () => void;
  book?: Book;
}

export function BookForm({ onClose, book }: BookFormProps) {
  const { createBook, updateBook } = useSupabaseApp();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || '',
      title_arabic: book?.title_arabic || '',
      author: book?.author || '',
      author_arabic: book?.author_arabic || '',
      category: book?.category || 'quran',
      subcategory: book?.subcategory || '',
      description: book?.description || '',
      description_arabic: book?.description_arabic || '',
      language: book?.language || 'en',
      isbn: book?.isbn || '',
      publisher: book?.publisher || '',
      publisher_arabic: book?.publisher_arabic || '',
      published_date: book?.published_date || '',
      pages: book?.pages || 100,
      is_featured: book?.is_featured || false,
      physical_copies: book?.physical_copies || 1,
    },
  });

  const onSubmit = async (data: BookFormData) => {
    try {
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
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Title Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">العنوان - Title *</label>
          <input {...register('title')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter book title" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">العنوان بالعربية - Arabic Title</label>
          <input {...register('title_arabic')} className="w-full glass-input p-3 rounded-lg" placeholder="أدخل العنوان بالعربية" dir="rtl" />
          {errors.title_arabic && <p className="text-red-500 text-sm mt-1">{errors.title_arabic.message}</p>}
        </div>
      </div>

      {/* Author Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">المؤلف - Author *</label>
          <input {...register('author')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter author name" />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">المؤلف بالعربية - Arabic Author</label>
          <input {...register('author_arabic')} className="w-full glass-input p-3 rounded-lg" placeholder="أدخل اسم المؤلف بالعربية" dir="rtl" />
          {errors.author_arabic && <p className="text-red-500 text-sm mt-1">{errors.author_arabic.message}</p>}
        </div>
      </div>

      {/* Category and Language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">التصنيف - Category *</label>
          <select {...register('category')} className="w-full glass-input p-3 rounded-lg">
            <option value="quran">القرآن - Quran</option>
            <option value="hadith">الحديث - Hadith</option>
            <option value="fiqh">الفقه - Fiqh</option>
            <option value="tafsir">التفسير - Tafsir</option>
            <option value="history">التاريخ - History</option>
            <option value="biography">السيرة - Biography</option>
            <option value="aqeedah">العقيدة - Aqeedah</option>
            <option value="seerah">السيرة النبوية - Seerah</option>
            <option value="dua">الأدعية - Dua</option>
            <option value="islamic_law">الشريعة - Islamic Law</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">التصنيف الفرعي - Subcategory</label>
          <input {...register('subcategory')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter subcategory" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">اللغة - Language *</label>
          <select {...register('language')} className="w-full glass-input p-3 rounded-lg">
            <option value="ar">العربية - Arabic</option>
            <option value="en">English - الإنجليزية</option>
            <option value="ur">Urdu - الأردية</option>
            <option value="fa">Farsi - الفارسية</option>
            <option value="tr">Turkish - التركية</option>
          </select>
          {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
        </div>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الوصف - Description *</label>
          <textarea {...register('description')} className="w-full glass-input p-3 rounded-lg" rows={4} placeholder="Enter book description"></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف بالعربية - Arabic Description</label>
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
          <label className="block text-sm font-medium mb-1">الناشر - Publisher</label>
          <input {...register('publisher')} className="w-full glass-input p-3 rounded-lg" placeholder="Enter publisher" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">تاريخ النشر - Published Date</label>
          <input type="date" {...register('published_date')} className="w-full glass-input p-3 rounded-lg" />
        </div>
      </div>

      {/* Publisher Arabic */}
      <div>
        <label className="block text-sm font-medium mb-1">الناشر بالعربية - Arabic Publisher</label>
        <input {...register('publisher_arabic')} className="w-full glass-input p-3 rounded-lg" placeholder="أدخل اسم الناشر بالعربية" dir="rtl" />
      </div>

      {/* Numbers and Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">عدد الصفحات - Pages *</label>
          <input type="number" {...register('pages', { valueAsNumber: true })} className="w-full glass-input p-3 rounded-lg" min="1" />
          {errors.pages && <p className="text-red-500 text-sm mt-1">{errors.pages.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">النسخ المتاحة - Physical Copies</label>
          <input type="number" {...register('physical_copies', { valueAsNumber: true })} className="w-full glass-input p-3 rounded-lg" min="0" />
          {errors.physical_copies && <p className="text-red-500 text-sm mt-1">{errors.physical_copies.message}</p>}
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input type="checkbox" {...register('is_featured')} className="rounded" />
          <label className="text-sm font-medium">كتاب مميز - Featured Book</label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="neomorph-button px-6 py-2 rounded-lg"
          disabled={isSubmitting}
        >
          إلغاء - Cancel
        </button>
        <button
          type="submit"
          className="neomorph-button px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جاري الحفظ...' : book ? 'تحديث الكتاب - Update Book' : 'إضافة الكتاب - Add Book'}
        </button>
      </div>
    </form>
  );
}
