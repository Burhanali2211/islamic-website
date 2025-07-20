import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '../../types';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { EnhancedInput, EnhancedTextarea } from './FormComponents';
import {
  BookOpen, User, Languages, FileText, Hash, Building, Calendar, Tag, Star,
  Edit3, Globe, MessageSquare, Copy, CheckCircle, AlertCircle, Info,
  Save, X, ChevronRight, ChevronDown, Sparkles, Zap, Clock, Eye, Upload, Image
} from 'lucide-react';

// Islamic book cover images by category
const defaultImages = [
  'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
];

const categoryImages: Record<string, string[]> = {
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
  tafsir: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  aqeedah: defaultImages,
  seerah: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  history: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  biography: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop',
  ],
  dua: defaultImages,
  islamic_law: defaultImages,
  arabic_language: defaultImages,
  islamic_ethics: defaultImages,
  comparative_religion: defaultImages,
  islamic_philosophy: defaultImages,
  sufism: defaultImages,
  general: defaultImages
};

// ✅ FIXED: Helper function to safely get category image
const getCategoryImage = (category: string): string => {
  const images = categoryImages[category] || defaultImages;
  return images[0] || defaultImages[0];
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

// Simple Select Component for the form
const SimpleSelect = React.forwardRef<HTMLSelectElement, any>(({
  label,
  icon: Icon,
  error,
  required = false,
  description,
  options,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
        {Icon && <Icon className="h-4 w-4 mr-2 text-blue-500" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          ref={ref}
          {...props}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 appearance-none
            ${error
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
            }
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none cursor-pointer
            ${props.className || ''}
          `}
        >
          {options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          {description}
        </p>
      )}

      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error.message}
        </div>
      )}
    </div>
  );
});



export function BookForm({ onClose, book }: BookFormProps) {
  const { createBook, updateBook, state } = useSupabaseApp();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'details' | 'publication'>('basic');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    publication: false
  });

  // Cover image state
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    book?.cover_image_url || null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  // Optimized form watching to prevent excessive re-renders
  const formValues = watch();

  // Memoized values to prevent preview from updating on every keystroke
  const previewData = useMemo(() => ({
    category: formValues.category,
    title: formValues.title,
    titleArabic: formValues.title_arabic,
    author: formValues.author_name,
    authorArabic: formValues.author_arabic,
    description: formValues.description,
    descriptionArabic: formValues.description_arabic,
    language: formValues.language,
    pages: formValues.pages,
    publisher: formValues.publisher_name,
    publishedDate: formValues.published_date,
    isbn: formValues.isbn,
    isFeatured: formValues.is_featured
  }), [
    formValues.category,
    formValues.title,
    formValues.title_arabic,
    formValues.author_name,
    formValues.author_arabic,
    formValues.description,
    formValues.description_arabic,
    formValues.language,
    formValues.pages,
    formValues.publisher_name,
    formValues.published_date,
    formValues.isbn,
    formValues.is_featured
  ]);

  // Handle cover image upload
  const handleCoverImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Image file size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    setCoverImage(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCoverImagePreview(previewUrl);

    setIsUploadingImage(false);
  }, []);

  // Handle cover image removal
  const handleRemoveCoverImage = useCallback(() => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview);
    }
  }, [coverImagePreview]);

  // Optimized Enhanced file upload component for cover image
  const CoverImageUpload = React.memo(() => (
    <div className="space-y-4">
      <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Image className="h-4 w-4 mr-2 text-blue-500" />
        Book Cover Image
      </label>

      <div className="flex items-start space-x-4">
        {/* Cover Preview */}
        <div className="flex-shrink-0">
          <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative group">
            {coverImagePreview ? (
              <>
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">No image</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverImageUpload(file);
              }}
              className="sr-only"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className={`
                flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                ${isUploadingImage
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }
              `}
            >
              {isUploadingImage ? (
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {coverImagePreview ? 'Change Cover' : 'Upload Cover'}
                  </span>
                </div>
              )}
            </label>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• Supported formats: JPG, PNG, WebP</p>
            <p>• Maximum size: 5MB</p>
            <p>• Recommended: 400x600px (2:3 ratio)</p>
          </div>
        </div>
      </div>
    </div>
  ));

  // Memoized Section component to prevent unnecessary re-renders
  const FormSection = React.memo(({
    title,
    icon: Icon,
    children,
    isExpanded,
    onToggle,
    description
  }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 hover:from-gray-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-blue-900/30 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
        <div
          className="transition-transform duration-200"
          style={{ transform: `rotate(${isExpanded ? 90 : 0}deg)` }}
        >
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6 border-t border-gray-100 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  ));

  // Optimized Helper functions for section management
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Memoized toggle functions to prevent re-renders
  const toggleBasic = useCallback(() => toggleSection('basic'), [toggleSection]);
  const toggleDetails = useCallback(() => toggleSection('details'), [toggleSection]);
  const togglePublication = useCallback(() => toggleSection('publication'), [toggleSection]);

  // Category options with better labels
  const categoryOptions = [
    { value: 'quran', label: '📖 Quran & Tafsir' },
    { value: 'hadith', label: '📚 Hadith Collections' },
    { value: 'fiqh', label: '⚖️ Islamic Jurisprudence' },
    { value: 'tafsir', label: '📝 Quranic Commentary' },
    { value: 'aqeedah', label: '🕌 Islamic Creed' },
    { value: 'seerah', label: '👤 Prophet\'s Biography' },
    { value: 'history', label: '📜 Islamic History' },
    { value: 'biography', label: '👥 Biographical Works' },
    { value: 'dua', label: '🤲 Supplications' },
    { value: 'islamic_law', label: '📋 Islamic Law' },
    { value: 'arabic_language', label: '🔤 Arabic Language' },
    { value: 'islamic_ethics', label: '💎 Islamic Ethics' },
    { value: 'comparative_religion', label: '🌍 Comparative Religion' },
    { value: 'islamic_philosophy', label: '🧠 Islamic Philosophy' },
    { value: 'sufism', label: '✨ Sufism & Spirituality' },
    { value: 'general', label: '📖 General Islamic Studies' }
  ];

  // Language options with flags
  const languageOptions = [
    { value: 'ar', label: '🇸🇦 Arabic' },
    { value: 'en', label: '🇺🇸 English' },
    { value: 'ur', label: '🇵🇰 Urdu' },
    { value: 'fa', label: '🇮🇷 Farsi' },
    { value: 'tr', label: '🇹🇷 Turkish' }
  ];

  const onSubmit = async (data: BookFormData) => {
    try {
      setSubmitError(null);

      // Determine cover image URL
      let coverImageUrl = book?.cover_image_url || getCategoryImage(data.category);

      // If user uploaded a custom cover image, use that
      if (coverImagePreview && coverImage) {
        // In a real application, you would upload the image to a storage service
        // For now, we'll use the preview URL (in production, upload to Supabase Storage)
        coverImageUrl = coverImagePreview;
      }

      if (book) {
        await updateBook(book.id, {
          ...data,
          cover_image_url: coverImageUrl,
          tags: [data.category, ...(data.subcategory ? [data.subcategory] : [])],
        });
      } else {
        await createBook({
          ...data,
          cover_image_url: coverImageUrl,
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
    <div className="max-w-6xl mx-auto">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
              {book ? 'Edit Book' : 'Add New Book'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {book ? 'Update book information' : 'Create a new book entry for your library'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Auto-saved</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-4 mb-6">
          {[
            { key: 'basic', label: 'Basic Info', icon: Edit3 },
            { key: 'details', label: 'Details', icon: FileText },
            { key: 'publication', label: 'Publication', icon: Building }
          ].map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
                ${expandedSections[step.key as keyof typeof expandedSections]
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }
              `}>
                <step.icon className="h-4 w-4" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                expandedSections[step.key as keyof typeof expandedSections]
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < 2 && (
                <ChevronRight className="h-4 w-4 mx-3 text-gray-300 dark:text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center"
          >
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              Book {book ? 'updated' : 'created'} successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {(submitError || state.error) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center"
          >
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
            <p className="text-red-800 dark:text-red-200 font-medium">
              {submitError || state.error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Enhanced Book Preview - Optimized to prevent excessive re-renders */}
      {previewData.category && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Live Book Preview
            </h3>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
              {previewData.category.charAt(0).toUpperCase() + previewData.category.slice(1).replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <img
                    src={coverImagePreview || getCategoryImage(previewData.category)}
                    alt="Book preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = defaultImages[0];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  {previewData.isFeatured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </div>
                  )}
                  {coverImagePreview && (
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Image className="h-3 w-3 mr-1" />
                      Custom
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Auto-generated cover</p>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Title Section */}
              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {previewData.title || (
                    <span className="text-gray-400 dark:text-gray-500 italic">
                      Enter book title...
                    </span>
                  )}
                </h4>
                {previewData.titleArabic && (
                  <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-right" dir="rtl">
                    {previewData.titleArabic}
                  </h5>
                )}
              </div>

              {/* Author Section */}
              <div className="space-y-1">
                <p className="text-lg text-gray-800 dark:text-gray-200 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  {previewData.author || (
                    <span className="text-gray-400 dark:text-gray-500 italic">
                      Enter author name...
                    </span>
                  )}
                </p>
                {previewData.authorArabic && (
                  <p className="text-md text-gray-600 dark:text-gray-400 text-right mr-6" dir="rtl">
                    {previewData.authorArabic}
                  </p>
                )}
              </div>

              {/* Description */}
              {previewData.description && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {previewData.description}
                  </p>
                  {previewData.descriptionArabic && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 text-right" dir="rtl">
                      {previewData.descriptionArabic}
                    </p>
                  )}
                </div>
              )}

              {/* Book Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  {previewData.language && (
                    <div className="flex items-center text-sm">
                      <Languages className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Language:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {previewData.language.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {previewData.pages > 0 && (
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {previewData.pages}
                      </span>
                    </div>
                  )}
                  {previewData.isbn && (
                    <div className="flex items-center text-sm">
                      <Hash className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">ISBN:</span>
                      <span className="ml-2 font-mono text-xs text-gray-900 dark:text-white">
                        {previewData.isbn}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {previewData.publisher && (
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Publisher:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white text-right">
                        {previewData.publisher}
                      </span>
                    </div>
                  )}
                  {previewData.publishedDate && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Published:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {new Date(previewData.publishedDate).getFullYear()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded">
                      {previewData.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-gray-600 dark:text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">PDF Format</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Digital Copy</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <div className="w-1 h-1 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Live Preview
                </div>
              </div>

              {/* Quick Actions Preview */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Library Actions Available:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    📖 Read Online
                  </span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                    📥 Download
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                    🔖 Bookmark
                  </span>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                    📚 Borrow Physical
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

        {/* Basic Information Section */}
        <FormSection
          title="Basic Information"
          icon={Edit3}
          description="Essential book details and identification"
          isExpanded={expandedSections.basic}
          onToggle={toggleBasic}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedInput
              {...register('title')}
              label="Book Title"
              icon={<BookOpen className="h-4 w-4" />}
              placeholder="Enter the book title"
              error={errors.title?.message}
              maxLength={200}
              hint="The main title of the book"
              showCharCount
            />

            <EnhancedInput
              {...register('title_arabic')}
              label="Arabic Title"
              icon={<Globe className="h-4 w-4" />}
              placeholder="أدخل العنوان بالعربية"
              dir="rtl"
              error={errors.title_arabic?.message}
              maxLength={200}
              hint="Arabic translation of the title"
              showCharCount
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedInput
              {...register('author_name')}
              label="Author Name"
              icon={<User className="h-4 w-4" />}
              placeholder="Enter the author's name"
              error={errors.author_name?.message}
              maxLength={100}
              hint="Primary author or compiler"
              showCharCount
            />

            <EnhancedInput
              {...register('author_arabic')}
              label="Arabic Author"
              icon={<User className="h-4 w-4" />}
              placeholder="أدخل اسم المؤلف بالعربية"
              dir="rtl"
              error={errors.author_arabic?.message}
              maxLength={100}
              hint="Author name in Arabic"
              showCharCount
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SimpleSelect
              {...register('category')}
              label="Category"
              icon={Tag}
              required
              error={errors.category}
              options={categoryOptions}
              description="Primary subject category"
            />

            <EnhancedInput
              {...register('subcategory')}
              label="Subcategory"
              icon={<Tag className="h-4 w-4" />}
              placeholder="Enter subcategory"
              error={errors.subcategory?.message}
              hint="More specific classification"
            />

            <SimpleSelect
              {...register('language')}
              label="Language"
              icon={Languages}
              required
              error={errors.language}
              options={languageOptions}
              description="Primary language of the book"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <CoverImageUpload />
          </div>
        </FormSection>

        {/* Details Section */}
        <FormSection
          title="Book Details"
          icon={FileText}
          description="Detailed description and content information"
          isExpanded={expandedSections.details}
          onToggle={toggleDetails}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedTextarea
              {...register('description')}
              label="Description"
              placeholder="Enter a detailed description of the book's content, themes, and significance..."
              error={errors.description?.message}
              maxLength={1000}
              rows={5}
              hint="Comprehensive description for library catalog"
              showCharCount
            />

            <EnhancedTextarea
              {...register('description_arabic')}
              label="Arabic Description"
              placeholder="أدخل وصفاً مفصلاً لمحتوى الكتاب وموضوعاته وأهميته..."
              dir="rtl"
              error={errors.description_arabic?.message}
              maxLength={1000}
              rows={5}
              hint="Arabic description for bilingual support"
              showCharCount
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedInput
              {...register('pages', { valueAsNumber: true })}
              label="Number of Pages"
              icon={<FileText className="h-4 w-4" />}
              type="number"
              placeholder="Enter page count"
              min="1"
              error={errors.pages?.message}
              hint="Total number of pages in the book"
            />

            <div className="flex items-center space-x-4 pt-8">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                    ${previewData.isFeatured
                      ? 'bg-yellow-500 border-yellow-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-yellow-400'
                    }
                  `}>
                    {previewData.isFeatured && <Star className="h-4 w-4" />}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                    Featured Book
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Highlight this book in the library
                  </p>
                </div>
              </label>
            </div>
          </div>
        </FormSection>

        {/* Publication Details Section */}
        <FormSection
          title="Publication Information"
          icon={Building}
          description="Publisher details and publication metadata"
          isExpanded={expandedSections.publication}
          onToggle={togglePublication}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EnhancedInput
              {...register('isbn')}
              label="ISBN"
              icon={<Hash className="h-4 w-4" />}
              placeholder="978-0-123456-78-9"
              error={errors.isbn?.message}
              hint="International Standard Book Number"
            />

            <EnhancedInput
              {...register('publisher_name')}
              label="Publisher"
              icon={<Building className="h-4 w-4" />}
              placeholder="Enter publisher name"
              error={errors.publisher_name?.message}
              maxLength={100}
              hint="Publishing house or organization"
              showCharCount
            />

            <EnhancedInput
              {...register('published_date')}
              label="Publication Date"
              icon={<Calendar className="h-4 w-4" />}
              type="date"
              error={errors.published_date?.message}
              hint="Date of publication"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedInput
              {...register('publisher_arabic')}
              label="Arabic Publisher"
              icon={<Building className="h-4 w-4" />}
              placeholder="أدخل اسم الناشر بالعربية"
              dir="rtl"
              error={errors.publisher_arabic?.message}
              maxLength={100}
              hint="Publisher name in Arabic"
              showCharCount
            />

            <EnhancedInput
              {...register('physical_copies', { valueAsNumber: true })}
              label="Physical Copies"
              icon={<Copy className="h-4 w-4" />}
              type="number"
              placeholder="Number of physical copies"
              min="0"
              error={errors.physical_copies?.message}
              hint="Available physical copies in library"
            />
          </div>
        </FormSection>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Auto-saving enabled</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Live preview active</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              <span>{isSuccess ? 'Close' : 'Cancel'}</span>
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 min-w-[140px]
                ${isSuccess
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }
              `}
              disabled={isSubmitting}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Saved!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{book ? 'Update Book' : 'Add Book'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
