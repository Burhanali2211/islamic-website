import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';

const newsItems = [
  {
    date: '2025-07-15',
    title: 'Muharram Programs 2025 Schedule Released',
    description: 'Join us for our annual Muharram programs featuring student recitations, scholarly lectures on Karbala, and community gatherings at IDARAH WALI UL ASER.',
  },
  {
    date: '2025-07-10',
    title: 'Maktab Wali Ul Aser New Session Begins',
    description: 'Enrollment is now open for our innovative Islamic education programs designed for Gen-Z and Gen-X students with new competitions and engaging activities.',
  },
  {
    date: '2025-07-05',
    title: 'Digital Library Collection Expanded',
    description: 'We have added new authentic texts on the teachings of Imam Hussain (AS) and the message of Karbala to our digital Maktabah collection.',
  },
];

export function LatestNews() {
  const { state } = useSupabaseApp();

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Mobile-optimized header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
              Latest News & Events
            </h2>
            <Link to="/news" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center justify-center sm:justify-start space-x-1 text-sm sm:text-base">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          {/* Mobile-optimized grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newsItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col hover:scale-105 transition-transform"
              >
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex-grow leading-relaxed">{item.description}</p>
                <Link to="/news-item" className="mt-4 font-medium text-green-600 dark:text-green-400 flex items-center space-x-1 text-xs sm:text-sm">
                  <span>Mazeed Maloomat</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
