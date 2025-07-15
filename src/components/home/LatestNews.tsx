import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
  const { state } = useApp();

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest News & Events
            </h2>
            <Link to="/news" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-6 rounded-3xl flex flex-col hover:scale-105 transition-transform"
              >
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar size={16} />
                  <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{item.description}</p>
                <Link to="/news-item" className="mt-4 font-medium text-green-600 dark:text-green-400 flex items-center space-x-1">
                  <span>Mazeed Maloomat</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
