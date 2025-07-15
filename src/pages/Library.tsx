import React from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { BookGrid } from '../components/BookGrid';
import { motion } from 'framer-motion';

export function Library() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8 text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Maktabah Digitali
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our vast collection of authentic Islamic books and scholarly resources
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-1"
        >
          <div className="sticky top-20 sm:top-24">
            <CategoryFilter />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-3"
        >
          <BookGrid />
        </motion.div>
      </div>
    </div>
  );
}
