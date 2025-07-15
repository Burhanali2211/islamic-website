import React from 'react';
import { motion } from 'framer-motion';
import { BookCard } from './BookCard';
import { useApp } from '../context/AppContext';

export function FeaturedBooks() {
  const { state } = useApp();

  const featuredBooks = React.useMemo(() => {
    return state.books
      .filter(book => book.rating >= 4.5)
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 8);
  }, [state.books]);

  if (featuredBooks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Recommended Books
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the most popular and highly-rated books in our collection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
