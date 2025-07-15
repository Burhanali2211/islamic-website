import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Calendar, BookOpen, Clock } from 'lucide-react';
import { CircularProgressBar } from '../components/CircularProgressBar';

export function Progress() {
  const overallStats = [
    { label: 'Books Completed', value: 24, target: 30, color: 'text-green-500' },
    { label: 'Study Hours', value: 142, target: 200, color: 'text-blue-500' },
    { label: 'Quiz Average', value: 92, target: 100, color: 'text-yellow-500' },
    { label: 'Streak Days', value: 15, target: 30, color: 'text-purple-500' },
  ];

  const monthlyProgress = [
    { month: 'Jan', books: 3, hours: 25 },
    { month: 'Feb', books: 4, hours: 32 },
    { month: 'Mar', books: 2, hours: 28 },
    { month: 'Apr', books: 5, hours: 35 },
    { month: 'May', books: 3, hours: 30 },
    { month: 'Jun', books: 4, hours: 38 },
  ];

  const achievements = [
    { title: 'First Book', description: 'Completed your first book', date: '2 months ago', icon: BookOpen },
    { title: 'Study Streak', description: '7 days continuous study', date: '1 month ago', icon: Calendar },
    { title: 'Quiz Master', description: 'Scored 100% in quiz', date: '2 weeks ago', icon: Award },
    { title: 'Speed Reader', description: 'Read 5 books in a month', date: '1 week ago', icon: TrendingUp },
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
            Progress Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your learning journey and achievements
          </p>
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 rounded-3xl"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Overall Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overallStats.map((stat, index) => (
            <div key={index} className="text-center">
              <CircularProgressBar 
                progress={(stat.value / stat.target) * 100} 
                size={120}
                color={stat.color}
              />
              <h3 className="font-semibold text-gray-900 dark:text-white mt-4">{stat.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.value} / {stat.target}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-8 rounded-3xl"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Progress</h2>
          <div className="space-y-4">
            {monthlyProgress.map((month, index) => (
              <div key={index} className="neomorph-inset p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{month.month}</span>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{month.books} books</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{month.hours}h</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${(month.books / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Books Progress</p>
                  </div>
                  <div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${(month.hours / 40) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hours Progress</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          <div className="glass-card p-6 rounded-3xl">
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 neomorph-inset rounded-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{achievement.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
