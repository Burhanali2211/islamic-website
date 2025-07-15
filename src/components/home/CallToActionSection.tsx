import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function CallToActionSection() {
  const { state } = useApp();

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center overflow-hidden"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Join Our Digital Maktabah
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Access thousands of authentic Islamic books, join our learning community, and embark on a journey of spiritual and intellectual growth with IDARAH WALI UL ASER.
          </p>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <Link to="/library" className="flex-1 sm:flex-none">
              <button className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto text-sm sm:text-base min-h-[48px] touch-manipulation hover:scale-105">
                <span>Explore Maktabah</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </Link>
            <Link to="/about" className="flex-1 sm:flex-none">
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base min-h-[48px] touch-manipulation hover:scale-105">
                Learn About Us
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
