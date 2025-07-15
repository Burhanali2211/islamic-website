import React, { useState } from 'react';
import { BookOpen, Star, Bookmark, BookmarkCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '../types';
import { useApp } from '../context/AppContext';
import { OptimizedImage } from './ui/OptimizedImage';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { state, dispatch } = useApp();
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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: book.id });
    } else {
      dispatch({ type: 'ADD_BOOKMARK', payload: book.id });
    }
  };

  const handleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_RECENT_READ', payload: book.id });
    // In a real app, you would navigate to the reader view
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    inView: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="inView"
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      viewport={{ once: true }}
      className="relative glass-card rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer shadow-lg shadow-black/5 border border-white/20 dark:border-gray-700/30"
    >
      <div className="relative h-48 sm:h-56 lg:h-64">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          <OptimizedImage
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full"
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <button
            onClick={handleBookmark}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-gold" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <h3 className="font-bold text-white mb-1 line-clamp-2 text-base sm:text-lg" style={{textShadow: '0 1px 3px rgba(0,0,0,0.7)'}}>
            {book.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-1" style={{textShadow: '0 1px 3px rgba(0,0,0,0.7)'}}>{book.author}</p>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
          <div className="flex items-center space-x-1">
            <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-300 text-xs rounded-full font-medium border border-green-200 dark:border-green-800">
              {getCategoryDisplayName(book.category)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-gold fill-current" />
            <span className="font-medium text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{book.rating}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 sm:mb-4 flex-grow leading-relaxed">
          {book.description}
        </p>

        <div className="mt-auto">
          <button
            onClick={handleRead}
            className="w-full text-center py-2.5 sm:py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Mutala'ah Shuru Karen</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
