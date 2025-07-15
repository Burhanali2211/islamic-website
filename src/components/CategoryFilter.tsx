import React, { useState } from 'react';
import { Book, BookOpen, Users, Clock, FileText, User, Star, Scroll, Filter, SlidersHorizontal, Calendar, Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons: Record<BookCategory | 'all', React.ReactNode> = {
  all: <Book className="h-5 w-5" />,
  quran: <Star className="h-5 w-5" />,
  hadith: <Scroll className="h-5 w-5" />,
  fiqh: <Users className="h-5 w-5" />,
  history: <Clock className="h-5 w-5" />,
  tafsir: <BookOpen className="h-5 w-5" />,
  biography: <User className="h-5 w-5" />
};

const categoryColors: Record<BookCategory | 'all', { from: string; to: string; bg: string }> = {
  all: { from: 'rgb(107, 114, 128)', to: 'rgb(75, 85, 99)', bg: 'rgba(107, 114, 128, 0.1)' },
  quran: { from: 'rgb(16, 185, 129)', to: 'rgb(5, 150, 105)', bg: 'rgba(16, 185, 129, 0.1)' },
  hadith: { from: 'rgb(59, 130, 246)', to: 'rgb(79, 70, 229)', bg: 'rgba(59, 130, 246, 0.1)' },
  fiqh: { from: 'rgb(139, 92, 246)', to: 'rgb(124, 58, 237)', bg: 'rgba(139, 92, 246, 0.1)' },
  history: { from: 'rgb(245, 158, 11)', to: 'rgb(217, 119, 6)', bg: 'rgba(245, 158, 11, 0.1)' },
  tafsir: { from: 'rgb(20, 184, 166)', to: 'rgb(8, 145, 178)', bg: 'rgba(20, 184, 166, 0.1)' },
  biography: { from: 'rgb(244, 63, 94)', to: 'rgb(219, 39, 119)', bg: 'rgba(244, 63, 94, 0.1)' }
};

export function CategoryFilter() {
  const { state, dispatch } = useApp();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    { id: 'all', label: 'Tamam Kutub', count: state.books.length },
    { id: 'quran', label: "Qur'an Majeed", count: state.books.filter(b => b.category === 'quran').length },
    { id: 'hadith', label: 'Ahadith Shareef', count: state.books.filter(b => b.category === 'hadith').length },
    { id: 'fiqh', label: 'Fiqh Islami', count: state.books.filter(b => b.category === 'fiqh').length },
    { id: 'history', label: 'Tareekh Islam', count: state.books.filter(b => b.category === 'history').length },
    { id: 'tafsir', label: 'Tafseer Qur\'an', count: state.books.filter(b => b.category === 'tafsir').length },
    { id: 'biography', label: 'Seerah Nabawi', count: state.books.filter(b => b.category === 'biography').length }
  ];

  const handleCategoryChange = (categoryId: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId });
  };

  return (
    <div className="space-y-6">
      {/* Main Categories */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Book className="h-4 w-4 text-white" />
            </div>
            <span>Aqsam-e-Kutub</span>
          </h3>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-3">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-left transition-all duration-300 group ${
                state.selectedCategory === category.id
                  ? 'shadow-lg transform scale-105'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
              }`}
              style={{
                background: state.selectedCategory === category.id
                  ? categoryColors[category.id as BookCategory | 'all'].bg
                  : undefined
              }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    state.selectedCategory === category.id
                      ? 'text-white shadow-lg'
                      : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-500'
                  }`}
                  style={{
                    background: state.selectedCategory === category.id
                      ? `linear-gradient(135deg, ${categoryColors[category.id as BookCategory | 'all'].from}, ${categoryColors[category.id as BookCategory | 'all'].to})`
                      : undefined
                  }}
                >
                  {categoryIcons[category.id as BookCategory | 'all']}
                </div>
                <div>
                  <span className={`font-semibold text-sm ${
                    state.selectedCategory === category.id
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {category.label}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {category.count} books available
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                state.selectedCategory === category.id
                  ? 'bg-white/20 text-gray-800 dark:text-gray-100'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {category.count}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Filter className="h-4 w-4 text-blue-500" />
              <span>Advanced Filters</span>
            </h4>

            <div className="space-y-4">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Languages className="h-4 w-4 inline mr-1" />
                  Language
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">All Languages</option>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="ur">Urdu</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Star className="h-4 w-4 inline mr-1" />
                  Minimum Rating
                </label>
                <div className="flex space-x-2">
                  {[4, 4.5, 5].map((rating) => (
                    <button
                      key={rating}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      {rating}+ ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Publication Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Publication Year
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
