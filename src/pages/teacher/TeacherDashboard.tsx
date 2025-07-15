import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function TeacherDashboard() {
  const { state } = useApp();

  const stats = [
    { label: 'Active Courses', value: 3, icon: BookOpen },
    { label: 'Total Students', value: 74, icon: Users },
    { label: 'Assignments to Grade', value: 8, icon: Award },
    { label: 'Upcoming Classes', value: 2, icon: Calendar },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Muallim Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back, {state.currentUser?.name}! Here's your teaching overview.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-green-500" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
