import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Calendar, Star, Search } from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';

export function ReadingHistory() {
  const { state } = useSupabaseApp();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterBy, setFilterBy] = React.useState('all');

  const readingHistory = [
    {
      id: 1,
      book: state.books.find(b => b.id === state.recentReads[0]),
      readDate: '2024-01-15',
      duration: '2h 30m',
      progress: 100,
      rating: 5,
      status: 'completed'
    },
    {
      id: 2,
      book: state.books.find(b => b.id === state.recentReads[1]),
      readDate: '2024-01-14',
      duration: '1h 45m',
      progress: 75,
      rating: 4,
      status: 'reading'
    },
    {
      id: 3,
      book: state.books.find(b => b.id === state.recentReads[2]),
      readDate: '2024-01-13',
      duration: '3h 15m',
      progress: 100,
      rating: 5,
      status: 'completed'
    },
  ].filter(item => item.book);

  const filteredHistory = readingHistory.filter(item => {
    const matchesSearch = item.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.book?.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || item.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const totalStats = {
    totalBooks: readingHistory.length,
    completedBooks: readingHistory.filter(h => h.status === 'completed').length,
    totalHours: readingHistory.reduce((acc, h) => acc + parseFloat(h.duration), 0),
    averageRating: readingHistory.reduce((acc, h) => acc + h.rating, 0) / readingHistory.length
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Reading History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your reading progress and achievements
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="glass-card p-6 rounded-2xl text-center">
          <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalBooks}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center">
          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalHours.toFixed(1)}h</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Reading Time</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center">
          <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.completedBooks}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.averageRating.toFixed(1)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-3xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
            />
          </div>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
          >
            <option value="all">All Books</option>
            <option value="completed">Completed</option>
            <option value="reading">Currently Reading</option>
          </select>
        </div>
      </motion.div>

      {/* Reading History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {filteredHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform"
          >
            <div className="flex items-start space-x-6">
              <img
                src={item.book?.coverImage}
                alt={item.book?.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {item.book?.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      by {item.book?.author}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{item.readDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < item.rating 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'completed' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {item.status === 'completed' ? 'Completed' : 'Reading'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No reading history found. Start reading to build your history!
          </p>
        </motion.div>
      )}
    </div>
  );
}
