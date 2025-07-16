import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, BarChart3, Settings, TrendingUp, AlertTriangle, Calendar, Award } from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';

export function AdminDashboard() {
  const { state, loadDashboardStats } = useSupabaseApp();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const stats = state.dashboardStats;

  const adminStats = [
    {
      label: 'إجمالي الكتب',
      labelEn: 'Total Books',
      value: stats?.books.total || 0,
      color: 'from-green-500 to-emerald-500',
      icon: BookOpen,
      subtitle: `${stats?.books.featured || 0} مميزة`
    },
    {
      label: 'إجمالي المستخدمين',
      labelEn: 'Total Users',
      value: stats?.users.total || 0,
      color: 'from-blue-500 to-cyan-500',
      icon: Users,
      subtitle: `${stats?.users.active || 0} نشط`
    },
    {
      label: 'الأساتذة',
      labelEn: 'Teachers',
      value: stats?.users.byRole.teacher || 0,
      color: 'from-purple-500 to-pink-500',
      icon: Users,
      subtitle: 'أستاذ'
    },
    {
      label: 'الطلاب',
      labelEn: 'Students',
      value: stats?.users.byRole.student || 0,
      color: 'from-orange-500 to-red-500',
      icon: Users,
      subtitle: 'طالب'
    },
    {
      label: 'الاستعارات النشطة',
      labelEn: 'Active Borrowings',
      value: stats?.borrowing.totalActive || 0,
      color: 'from-indigo-500 to-purple-500',
      icon: TrendingUp,
      subtitle: 'استعارة نشطة'
    },
    {
      label: 'الكتب المتأخرة',
      labelEn: 'Overdue Books',
      value: stats?.borrowing.totalOverdue || 0,
      color: 'from-red-500 to-pink-500',
      icon: AlertTriangle,
      subtitle: 'متأخرة'
    },
    {
      label: 'التصنيفات',
      labelEn: 'Categories',
      value: stats?.categories.totalCategories || 0,
      color: 'from-teal-500 to-cyan-500',
      icon: Calendar,
      subtitle: 'تصنيف إسلامي'
    },
    {
      label: 'الكتب المُعادة',
      labelEn: 'Returned Books',
      value: stats?.borrowing.totalReturned || 0,
      color: 'from-emerald-500 to-green-500',
      icon: Award,
      subtitle: 'تم إرجاعها'
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          لوحة تحكم المدير - Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          نظرة عامة على إحصائيات المكتبة وأنشطتها - Overview of the library's statistics and activities
        </p>
      </motion.div>

      {state.isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{stat.labelEn}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Popular Books Section */}
      {stats?.borrowing.popularBooks && stats.borrowing.popularBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            الكتب الأكثر استعارة - Most Borrowed Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.borrowing.popularBooks.slice(0, 6).map((book, index) => (
              <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {book.author}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {book.borrowCount} استعارة
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          إجراءات سريعة - Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform">
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">إضافة كتاب</span>
          </button>
          <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:scale-105 transition-transform">
            <Users className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">إضافة مستخدم</span>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">استعارة كتاب</span>
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:scale-105 transition-transform">
            <BarChart3 className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm">التقارير</span>
          </button>
        </div>
      </motion.div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p className="text-red-800 dark:text-red-200">{state.error}</p>
        </motion.div>
      )}
    </div>
  );
}
