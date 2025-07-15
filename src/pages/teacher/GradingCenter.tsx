import React from 'react';
import { motion } from 'framer-motion';

export function GradingCenter() {
  const submissions = [
    { student: 'Ahmed Hassan', quiz: 'Quranic Arabic Basics', date: '2 days ago' },
    { student: 'Fatima Ali', quiz: 'Hadith Classification', date: '1 day ago' },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Grading Center
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review and grade student submissions.
        </p>
      </motion.div>

      <div className="space-y-4">
        {submissions.map((sub, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{sub.student}</p>
              <p className="text-sm text-gray-500">{sub.quiz}</p>
            </div>
            <button className="neomorph-button px-4 py-2 rounded-lg">Grade</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
