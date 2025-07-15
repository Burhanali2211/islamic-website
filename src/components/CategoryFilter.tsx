import React from 'react';
import { Book, BookOpen, Users, Clock, FileText, User, Star, Scroll } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCategory } from '../types';

const categoryIcons: Record<BookCategory | 'all', React.ReactNode> = {
  all: <Book className="h-5 w-5" />,
  quran: <Star className="h-5 w-5" />,
  hadith: <Scroll className="h-5 w-5" />,
  fiqh: <Users className="h-5 w-5" />,
  history: <Clock className="h-5 w-5" />,
  tafsir: <BookOpen className="h-5 w-5" />,
  biography: <User className="h-5 w-5" />
};

export function CategoryFilter() {
  const { state, dispatch } = useApp();

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
    <div className="glass-card p-4 sm:p-6 rounded-3xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center space-x-2">
        <Book className="h-5 w-5 text-green-600 dark:text-green-400" />
        <span>Aqsam-e-Kutub</span>
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
              state.selectedCategory === category.id
                ? 'neomorph-active bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-600 dark:text-green-400 shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:neomorph-hover hover:bg-green-50 dark:hover:bg-green-900/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-colors ${
                state.selectedCategory === category.id
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-green-50 dark:group-hover:bg-green-900/20'
              }`}>
                {categoryIcons[category.id as BookCategory | 'all']}
              </div>
              <span className="font-medium text-sm sm:text-base">{category.label}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              state.selectedCategory === category.id
                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
