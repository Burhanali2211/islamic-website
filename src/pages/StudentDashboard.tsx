import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, Calendar, Award, Eye, Bookmark, CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseApp } from '../context/SupabaseContext';
import { CircularProgressBar } from '../components/CircularProgressBar';

export function StudentDashboard() {
  const { state } = useSupabaseApp();

  const recentBooks = state.books
    .filter(book => state.recentReads.includes(book.id))
    .slice(0, 3);

  const stats = [
    {
      label: 'Books Read',
      value: 12,
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      trend: '+3',
      trendUp: true,
      subtitle: 'This month'
    },
    {
      label: 'Reading Time',
      value: 45,
      icon: Clock,
      color: 'from-blue-500 to-indigo-500',
      trend: '+15',
      trendUp: true,
      subtitle: 'Hours this week'
    },
    {
      label: 'Quizzes Completed',
      value: 8,
      icon: Award,
      color: 'from-purple-500 to-violet-500',
      trend: '+2',
      trendUp: true,
      subtitle: 'This month'
    },
    {
      label: 'Study Streak',
      value: 7,
      icon: Target,
      color: 'from-orange-500 to-amber-500',
      trend: '+1',
      trendUp: true,
      subtitle: 'Days in a row'
    }
  ];

  const activities = [
    { action: 'Completed', book: 'Islamic Jurisprudence Issues', time: '2 hours ago', type: 'completed' },
    { action: 'Started', book: 'Hadith of Ghadeer', time: '5 hours ago', type: 'started' },
    { action: 'Bookmarked', book: 'Rules of Life', time: '1 day ago', type: 'bookmarked' },
    { action: 'Quiz completed', book: 'History of Islam', time: '2 days ago', type: 'quiz' },
  ];

  const studyGoals = [
    { title: 'Daily Reading', current: 45, target: 60, unit: 'minutes', color: 'emerald' },
    { title: 'Weekly Books', current: 2, target: 3, unit: 'books', color: 'blue' },
    { title: 'Monthly Quizzes', current: 8, target: 12, unit: 'quizzes', color: 'purple' },
  ];

  const quickActions = [
    {
      title: 'Browse Library',
      description: 'Explore our Islamic book collection',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      link: '/library'
    },
    {
      title: 'My Reading List',
      description: 'View your saved books',
      icon: Bookmark,
      color: 'from-blue-500 to-indigo-500',
      link: '/reading-list'
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      icon: Award,
      color: 'from-purple-500 to-violet-500',
      link: '/quizzes'
    },
    {
      title: 'Study Plans',
      description: 'Manage your study schedule',
      icon: Calendar,
      color: 'from-orange-500 to-amber-500',
      link: '/study-plans'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Welcome back, {state.currentUser?.name || 'Student'}! Continue your Islamic studies journey.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/library">
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group">
                <Eye className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Browse Library</span>
              </button>
            </Link>
            <Link to="/quizzes">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span className="font-medium">Take Quiz</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.trendUp
                      ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'
                      : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  }`}>
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Study Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Study Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyGoals.map((goal, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <CircularProgressBar
                  progress={(goal.current / goal.target) * 100}
                  size={80}
                  color={`text-${goal.color}-500`}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                    <div
                      className={`bg-${goal.color}-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group hover:scale-105 cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  activity.type === 'started' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  activity.type === 'bookmarked' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {activity.type === 'completed' && <CheckCircle className="h-4 w-4" />}
                  {activity.type === 'started' && <Play className="h-4 w-4" />}
                  {activity.type === 'bookmarked' && <Bookmark className="h-4 w-4" />}
                  {activity.type === 'quiz' && <Award className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    "{activity.book}"
                  </p>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Continue Reading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBooks.length > 0 ? recentBooks.map((book) => (
              <div key={book.id} className="p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group hover:scale-105">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">65% completed</p>
                <Link to={`/library/${book.id}`}>
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Continue Reading</span>
                  </button>
                </Link>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Recent Books</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Start reading to see your recent books here</p>
                <Link to="/library">
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto">
                    <BookOpen className="h-5 w-5" />
                    <span>Browse Library</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
