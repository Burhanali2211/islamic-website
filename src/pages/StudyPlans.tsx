import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Plus, Play } from 'lucide-react';

export function StudyPlans() {
  const studyPlans = [
    {
      id: 1,
      title: 'Quranic Arabic Mastery',
      description: 'Master the Arabic language through Quranic study',
      duration: '12 weeks',
      progress: 75,
      books: ['Arabic Grammar', 'Quranic Vocabulary', 'Tajweed Rules'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      title: 'Hadith Sciences',
      description: 'Deep dive into the science of Hadith',
      duration: '8 weeks',
      progress: 45,
      books: ['Sahih Bukhari', 'Sahih Muslim', 'Hadith Methodology'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Islamic History',
      description: 'Complete Islamic history from Prophet to modern times',
      duration: '16 weeks',
      progress: 30,
      books: ['The Sealed Nectar', 'Rightly Guided Caliphs', 'Islamic Civilization'],
      color: 'from-purple-500 to-pink-500'
    },
  ];

  const weeklySchedule = [
    { day: 'Monday', time: '9:00 AM', subject: 'Arabic Grammar', duration: '1 hour' },
    { day: 'Tuesday', time: '8:30 AM', subject: 'Hadith Study', duration: '45 mins' },
    { day: 'Wednesday', time: '9:00 AM', subject: 'Quranic Recitation', duration: '1 hour' },
    { day: 'Thursday', time: '8:30 AM', subject: 'Islamic History', duration: '45 mins' },
    { day: 'Friday', time: '9:00 AM', subject: 'Fiqh Studies', duration: '1 hour' },
    { day: 'Saturday', time: '10:00 AM', subject: 'Review & Quiz', duration: '2 hours' },
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
            Study Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your Islamic learning journey
          </p>
        </div>
        <button className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create Plan</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Plans */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Plans</h2>
          {studyPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-6 rounded-3xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{plan.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{plan.books.length} books</span>
                    </div>
                  </div>
                </div>
                <button className="neomorph-button p-3 rounded-xl hover:scale-105 transition-transform">
                  <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${plan.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {plan.books.map((book, bookIndex) => (
                  <span
                    key={bookIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                  >
                    {book}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Schedule</h2>
          <div className="glass-card p-6 rounded-3xl">
            <div className="space-y-4">
              {weeklySchedule.map((item, index) => (
                <div key={index} className="neomorph-inset p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.day}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.time}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Stats */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Study Hours</span>
                <span className="font-semibold text-gray-900 dark:text-white">12.5h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-semibold text-gray-900 dark:text-white">5/6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Streak</span>
                <span className="font-semibold text-gray-900 dark:text-white">7 days</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
