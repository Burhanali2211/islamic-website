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
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Departments
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            IDARAH WALI UL ASER operates multiple departments to serve our community's educational and spiritual needs.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform"
              >
                <div className="neomorph-icon p-4 rounded-full inline-block mb-6">
                  <Icon className={`h-10 w-10 ${dept.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{dept.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{dept.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
