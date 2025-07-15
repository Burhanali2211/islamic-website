import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, TrendingUp, Calendar, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CircularProgressBar } from '../components/CircularProgressBar';

export function StudentDashboard() {
  const { state } = useApp();

  const recentBooks = state.books
    .filter(book => state.recentReads.includes(book.id))
    .slice(0, 3);

  const activities = [
    { action: 'Mukammal', book: 'Fiqh e Masail', time: '2 hours ago' },
    { action: 'Shuru', book: 'Hadis e Ghadeer', time: '5 hours ago' },
    { action: 'Nishani', book: 'Ahkam e Zindagi', time: '1 day ago' },
    { action: 'Imtihan mukammal', book: 'Tareekh e Islam', time: '2 days ago' },
  ];

  const studyGoals = [
    { title: 'Rozana Mutala\'ah', current: 45, target: 60, unit: 'minutes' },
    { title: 'Hafta war Kutub', current: 2, target: 3, unit: 'kutub' },
    { title: 'Mahanah Imtihanat', current: 8, target: 12, unit: 'imtihanat' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {state.currentUser?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Today is a good day to learn something new.
          </p>
        </div>
      </motion.div>

      {/* Study Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 rounded-3xl"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Maqasid e Mutala'ah</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyGoals.map((goal, index) => (
            <div key={index} className="flex items-center space-x-4">
              <CircularProgressBar 
                progress={(goal.current / goal.target) * 100} 
                size={80}
                color="text-green-500"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {goal.current} / {goal.target} {goal.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-8 rounded-3xl"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Jadeed Faaliyat</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 neomorph-inset rounded-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.action}</span> "{activity.book}"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kutub Mukammal</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Waqt e Mutala'ah</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">142h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Natija e Imtihan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue Reading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 rounded-3xl"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mutala'ah Jari Rakhiye</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBooks.map((book) => (
            <div key={book.id} className="neomorph-card p-6 rounded-2xl hover:scale-105 transition-transform">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{book.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">65% mukammal</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
