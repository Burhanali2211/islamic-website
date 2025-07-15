import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminDashboard() {
  const { state } = useApp();

  const adminStats = [
    { label: 'Total Books', value: state.books.length, color: 'from-green-500 to-emerald-500', icon: BookOpen },
    { label: 'Total Users', value: state.users.length, color: 'from-blue-500 to-cyan-500', icon: Users },
    { label: 'Teachers', value: state.users.filter(u => u.role === 'teacher').length, color: 'from-purple-500 to-pink-500', icon: Users },
    { label: 'Students', value: state.users.filter(u => u.role === 'user').length, color: 'from-orange-500 to-red-500', icon: Users },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Overview of the library's statistics and activities.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
