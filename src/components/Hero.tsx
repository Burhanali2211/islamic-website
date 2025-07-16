import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ArrowRight } from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';

export function Hero() {
  const { state } = useSupabaseApp();

  return (
    <section className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-green-100" />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              IDARAH WALI UL ASER
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-green-100 max-w-3xl mx-auto">
              Awwal Qadam Taqwa Ki Taraf
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto"
          >
            <button className="w-full sm:w-auto bg-white text-green-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 shadow-lg">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Browse Kutub</span>
            </button>
            <button className="w-full sm:w-auto border border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center space-x-2">
              <span className="text-sm sm:text-base">Mansookh Kutub</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{state.books.length}+</div>
              <div className="text-green-100 text-sm sm:text-base">Kutub</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">6</div>
              <div className="text-green-100 text-sm sm:text-base">Aqsam</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">1</div>
              <div className="text-green-100 text-sm sm:text-base">Zaban</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
