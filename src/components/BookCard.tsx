import React, { useState } from 'react';
import { BookOpen, Star, Bookmark, BookmarkCheck, Download, Eye, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Book } from '../types';
import { useSupabaseApp } from '../context/SupabaseContext';
import { OptimizedImage } from './ui/OptimizedImage';

interface BookCardProps {
  book: Book;
  viewMode?: 'grid' | 'list';
}

export function BookCard({ book }: BookCardProps) {
  const { state, addBookmark, removeBookmark, addRecentRead } = useSupabaseApp();
  const isBookmarked = state.bookmarks.includes(book.id);
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'quran': "Qur'an Majeed",
      'hadith': 'Ahadith',
      'fiqh': 'Fiqh Islami',
      'history': 'Tareekh',
      'tafsir': 'Tafseer',
      'biography': 'Seerah'
    };
    return categoryNames[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'quran': 'from-emerald-500 to-green-600',
      'hadith': 'from-blue-500 to-indigo-600',
      'fiqh': 'from-purple-500 to-violet-600',
      'history': 'from-amber-500 to-orange-600',
      'tafsir': 'from-teal-500 to-cyan-600',
      'biography': 'from-rose-500 to-pink-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isBookmarked) {
        await removeBookmark(book.id);
      } else {
        await addBookmark(book.id);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addRecentRead(book.id);
      // In a real app, you would navigate to the reader view
    } catch (error) {
      console.error('Error adding to recent reads:', error);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, you would handle the download
    console.log('Downloading book:', book.title);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    inView: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="inView"
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden h-full flex flex-col shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/40 transition-all duration-500"
    >
      {/* Book Cover Section */}
      <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          {book.cover_image_url ? (
            <OptimizedImage
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <span className="text-xs font-medium">Islamic Book</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(book.category)} shadow-lg backdrop-blur-sm`}>
            {getCategoryDisplayName(book.category)}
          </span>
        </div>

        {/* Bookmark Button */}
        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
            className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-yellow-400" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </motion.button>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-semibold">{book.rating || 0}</span>
          </div>
        </div>

        {/* Title and Author Overlay */}
        <div className="absolute bottom-4 left-4 right-20">
          <h3 className="font-bold text-white mb-1 line-clamp-2 text-lg leading-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
            {book.title}
          </h3>
          <div className="flex items-center space-x-1 text-gray-200">
            <User className="h-3 w-3" />
            <p className="text-sm line-clamp-1" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>{book.author_name}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        {/* Book Info */}
        <div className="flex-grow mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{book.published_date ? new Date(book.published_date).getFullYear() : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <Eye className="h-4 w-4" />
              <span>{(book.download_count || 0).toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
            {book.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {book.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Book Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Pages:</span>
              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">{book.pages}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Format:</span>
              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300 uppercase">{book.file_type}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRead}
            className={`w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r ${getCategoryColor(book.category)} hover:shadow-lg hover:shadow-current/25 transition-all duration-300 flex items-center justify-center space-x-2 text-sm`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Mutala'ah Shuru Karen</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="w-full py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
