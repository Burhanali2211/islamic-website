import React, { useState } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { BookGrid } from '../components/BookGrid';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Users, Star, TrendingUp, Grid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Library() {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const stats = [
    { icon: BookOpen, label: 'Total Books', value: state.books.length, color: 'text-green-600' },
    { icon: Users, label: 'Active Readers', value: '2.8K', color: 'text-blue-600' },
    { icon: Star, label: 'Avg Rating', value: '4.8', color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Downloads', value: '15.2K', color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 islamic-pattern"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse delay-1000"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Maktabah
              </span>
              <span className="block">Digitali</span>
            </h1>
            <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Discover the treasures of Islamic knowledge through our comprehensive digital library
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-green-100 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for books, authors, or topics..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className="w-full pl-14 pr-6 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>

            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{state.books.length}</span> books found
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`xl:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="sticky top-24">
              <CategoryFilter />
            </div>
          </motion.div>

          {/* Books Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-3"
          >
            <BookGrid viewMode={viewMode} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
