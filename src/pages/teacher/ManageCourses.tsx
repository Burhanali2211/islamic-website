import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function ManageCourses() {
  const courses = [
    { title: 'Quranic Tafsir', students: 25, progress: 75, nextClass: 'Tomorrow, 10 AM' },
    { title: 'Hadith Sciences', students: 18, progress: 45, nextClass: 'Jan 22, 2 PM' },
    { title: 'Islamic History', students: 31, progress: 30, nextClass: 'Jan 25, 6 PM' },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your assigned courses.
          </p>
        </div>
        <button className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Course</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{course.students} students</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
