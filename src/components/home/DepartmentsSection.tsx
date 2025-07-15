import React from 'react';
import { motion } from 'framer-motion';
import { School, Library, Heart, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function DepartmentsSection() {
  const { state } = useApp();

  const departments = [
    { name: 'Maktab Wali Ul Aser', description: 'Our educational institution providing authentic Islamic learning and spiritual development for students of all ages.', icon: School, color: 'text-green-500' },
    { name: 'Digital Maktabah', description: 'Comprehensive collection of Islamic texts, books, and resources available for research and study.', icon: Library, color: 'text-blue-500' },
    { name: 'Spiritual Guidance', description: 'Counseling and guidance services based on the teachings of Imam Hussain (AS) and Islamic principles.', icon: Heart, color: 'text-red-500' },
    { name: 'Community Outreach', description: 'Programs and initiatives to serve the Kashmir community and spread the message of Karbala.', icon: Users, color: 'text-orange-500' },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Our Departments
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4 sm:px-2 leading-relaxed">
            IDARAH WALI UL ASER operates multiple departments to serve our community's educational and spiritual needs.
          </p>
        </motion.div>
        {/* Mobile-optimized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl text-center hover:scale-105 transition-transform"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 shadow-lg">
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 ${dept.color}`} />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">{dept.name}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{dept.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
