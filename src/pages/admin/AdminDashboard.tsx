import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Award,
  Plus,
  UserPlus,
  RefreshCw,
  Bell,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  Star,
  BookMarked,
  UserCheck,
  FileText,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseApp } from '../../context/SupabaseContext';
import { NotificationSystem } from '../../components/notifications/NotificationSystem';
import { ActivityFeed } from '../../components/realtime/ActivityFeed';
import { OnlineUsers } from '../../components/realtime/OnlineUsers';
import { useRealtimeDashboard } from '../../hooks/useRealTime';

export function AdminDashboard() {
  const { state, loadDashboardStats, loadBooks, loadUsers, loadBorrowingRecords } = useSupabaseApp();

  // Real-time dashboard hook
  const {
    isConnected: realtimeConnected,
    hasError: realtimeError,
    lastUpdate: realtimeLastUpdate,
    reconnectAll: reconnectRealtime
  } = useRealtimeDashboard();

  // Prevent duplicate loading
  const isLoadingRef = useRef(false);

  // Enhanced state management
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [showRealTimePanel, setShowRealTimePanel] = useState(true);

  // Load all dashboard data with duplicate prevention - memoized to prevent infinite re-renders
  const loadAllData = useCallback(async () => {
    // Prevent duplicate loading
    if (isLoadingRef.current) {
      console.log('📊 [ADMIN_DASHBOARD] Load already in progress, skipping duplicate request');
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      await Promise.all([
        loadDashboardStats(),
        loadBooks(),
        loadUsers(),
        loadBorrowingRecords()
      ]);
      setLastUpdated(new Date());
      setNotification({ type: 'success', message: 'Dashboard data refreshed successfully' });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setNotification({ type: 'error', message: 'Failed to refresh dashboard data' });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false; // Reset loading flag
    }
  }, [loadDashboardStats, loadBooks, loadUsers, loadBorrowingRecords]);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAllData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadAllData]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Generate recent activities (mock data for now)
  useEffect(() => {
    const activities = [
      {
        id: 1,
        type: 'book_added',
        message: 'New book "Sahih Bukhari" added to library',
        time: '2 minutes ago',
        icon: BookOpen,
        color: 'text-green-600'
      },
      {
        id: 2,
        type: 'user_registered',
        message: 'New student "Ahmad Ali" registered',
        time: '15 minutes ago',
        icon: UserPlus,
        color: 'text-blue-600'
      },
      {
        id: 3,
        type: 'book_borrowed',
        message: 'Book "Tafseer Ibn Kathir" borrowed by Fatima',
        time: '1 hour ago',
        icon: BookMarked,
        color: 'text-purple-600'
      },
      {
        id: 4,
        type: 'book_returned',
        message: 'Book "Riyadh as-Salihin" returned by Omar',
        time: '2 hours ago',
        icon: CheckCircle,
        color: 'text-emerald-600'
      },
      {
        id: 5,
        type: 'overdue_alert',
        message: '3 books are now overdue',
        time: '3 hours ago',
        icon: AlertTriangle,
        color: 'text-red-600'
      }
    ];
    setRecentActivities(activities);
  }, []);

  // Generate system alerts
  useEffect(() => {
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'Overdue Books Alert',
        message: '5 books are currently overdue and require attention',
        priority: 'high',
        action: 'View Overdue Books'
      },
      {
        id: 2,
        type: 'info',
        title: 'System Backup',
        message: 'Scheduled backup completed successfully at 2:00 AM',
        priority: 'low',
        action: 'View Backup Logs'
      },
      {
        id: 3,
        type: 'success',
        title: 'Monthly Report Ready',
        message: 'October 2024 library usage report is ready for download',
        priority: 'medium',
        action: 'Download Report'
      }
    ];
    setSystemAlerts(alerts);
  }, []);

  const stats = state.dashboardStats;

  const adminStats = useMemo(() => [
    {
      id: 'total_books',
      label: 'Total Books',
      value: stats?.books.total || 0,
      color: 'from-emerald-500 to-teal-500',
      icon: BookOpen,
      subtitle: `${stats?.books.featured || 0} Featured`,
      trend: '+12%',
      trendUp: true,
      description: 'Complete library collection',
      link: '/admin/books'
    },
    {
      id: 'total_users',
      label: 'Total Users',
      value: stats?.users.total || 0,
      color: 'from-blue-500 to-indigo-500',
      icon: Users,
      subtitle: `${stats?.users.active || 0} Active`,
      trend: '+8%',
      trendUp: true,
      description: 'Registered library members',
      link: '/admin/users'
    },
    {
      id: 'teachers',
      label: 'Teachers',
      value: stats?.users.byRole.teacher || 0,
      color: 'from-purple-500 to-violet-500',
      icon: UserCheck,
      subtitle: 'Instructors',
      trend: '+3%',
      trendUp: true,
      description: 'Educational staff members',
      link: '/admin/users?role=teacher'
    },
    {
      id: 'students',
      label: 'Students',
      value: stats?.users.byRole.student || 0,
      color: 'from-orange-500 to-amber-500',
      icon: Users,
      subtitle: 'Learners',
      trend: '+15%',
      trendUp: true,
      description: 'Enrolled students',
      link: '/admin/users?role=student'
    },
    {
      id: 'active_borrowings',
      label: 'Active Borrowings',
      value: stats?.borrowing.totalActive || 0,
      color: 'from-cyan-500 to-blue-500',
      icon: BookMarked,
      subtitle: 'Currently Borrowed',
      trend: '+5%',
      trendUp: true,
      description: 'Books currently on loan',
      link: '/admin/borrowing?status=active'
    },
    {
      id: 'overdue_books',
      label: 'Overdue Books',
      value: stats?.borrowing.totalOverdue || 0,
      color: 'from-red-500 to-rose-500',
      icon: AlertTriangle,
      subtitle: 'Past Due Date',
      trend: '-2%',
      trendUp: false,
      description: 'Books requiring attention',
      link: '/admin/borrowing?status=overdue',
      urgent: (stats?.borrowing.totalOverdue || 0) > 0
    },
    {
      id: 'categories',
      label: 'Categories',
      value: stats?.categories.totalCategories || 0,
      color: 'from-teal-500 to-emerald-500',
      icon: Calendar,
      subtitle: 'Islamic Categories',
      trend: '0%',
      trendUp: true,
      description: 'Book classification system',
      link: '/admin/books?view=categories'
    },
    {
      id: 'returned_books',
      label: 'Returned Books',
      value: stats?.borrowing.totalReturned || 0,
      color: 'from-green-500 to-emerald-500',
      icon: CheckCircle,
      subtitle: 'Successfully Returned',
      trend: '+18%',
      trendUp: true,
      description: 'Completed transactions',
      link: '/admin/borrowing?status=returned'
    },
  ], [stats]);

  const quickActions = useMemo(() => [
    {
      id: 'add_book',
      title: 'Add New Book',
      description: 'Add a new book to the library collection',
      icon: Plus,
      color: 'from-emerald-500 to-teal-500',
      link: '/admin/books',
      badge: 'Quick Add',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'manage_users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: UserPlus,
      color: 'from-blue-500 to-indigo-500',
      link: '/admin/users',
      badge: `${stats?.users.total || 0} Users`,
      shortcut: 'Ctrl+U'
    },
    {
      id: 'view_reports',
      title: 'View Reports',
      description: 'Generate and view system reports',
      icon: BarChart3,
      color: 'from-purple-500 to-violet-500',
      link: '/admin/reports',
      badge: 'Analytics',
      shortcut: 'Ctrl+R'
    },
    {
      id: 'system_settings',
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      color: 'from-orange-500 to-amber-500',
      link: '/admin/settings',
      badge: 'Config',
      shortcut: 'Ctrl+S'
    },
    {
      id: 'borrowing_management',
      title: 'Borrowing Management',
      description: 'Manage book loans and returns',
      icon: BookMarked,
      color: 'from-cyan-500 to-blue-500',
      link: '/admin/borrowing',
      badge: `${stats?.borrowing.totalActive || 0} Active`,
      shortcut: 'Ctrl+B'
    },
    {
      id: 'overdue_books',
      title: 'Handle Overdue Books',
      description: 'Manage overdue book returns',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      link: '/admin/borrowing?status=overdue',
      badge: `${stats?.borrowing.totalOverdue || 0} Overdue`,
      urgent: (stats?.borrowing.totalOverdue || 0) > 0,
      shortcut: 'Ctrl+O'
    },
    {
      id: 'backup_system',
      title: 'Backup System',
      description: 'Create system backup and maintenance',
      icon: Download,
      color: 'from-indigo-500 to-purple-500',
      link: '/admin/settings?tab=system',
      badge: 'Maintenance',
      shortcut: 'Ctrl+Shift+B'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View system notifications and alerts',
      icon: Bell,
      color: 'from-yellow-500 to-orange-500',
      link: '#',
      badge: `${systemAlerts.length} Alerts`,
      onClick: () => setShowNotifications(true),
      shortcut: 'Ctrl+Shift+N'
    }
  ], [stats, systemAlerts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg border ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
                  : notification.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
                  : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
                  {notification.type === 'error' && <AlertTriangle className="h-5 w-5" />}
                  {notification.type === 'info' && <Info className="h-5 w-5" />}
                  <span>{notification.message}</span>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              لوحة التحكم - Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              مرحباً بك في نظام إدارة المكتبة الإسلامية - Welcome to IDARAH WALI UL ASER Islamic Library Management System
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Activity className={`h-4 w-4 ${autoRefresh ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
              </div>
              <div>
                Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
              title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            >
              <Activity className={`h-4 w-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
              <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
            </button>

            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 flex items-center space-x-2"
              title="Refresh dashboard data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <div className="relative z-10">
              <NotificationSystem
                position="top-right"
                maxVisible={5}
                autoHide={true}
                autoHideDelay={5000}
              />
            </div>
            <Link to="/admin/reports">
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group">
                <BarChart3 className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700 dark:text-gray-300">View Reports</span>
              </button>
            </Link>
            <Link to="/admin/settings">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </button>
            </Link>
          </div>
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
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
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

        {/* Popular Books Section */}
        {stats?.borrowing.popularBooks && stats.borrowing.popularBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Most Borrowed Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.borrowing.popularBooks.slice(0, 6).map((book, index) => (
                <div key={book.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {book.author}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {book.borrowCount} borrowings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
          >
            <p className="text-red-800 dark:text-red-200 font-medium">{state.error}</p>
          </motion.div>
        )}

        {/* Real-time Components Grid */}
        {showRealTimePanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <ActivityFeed
                maxItems={20}
                showFilters={true}
                autoScroll={true}
                className="h-full"
              />
            </div>

            {/* Online Users */}
            <div>
              <OnlineUsers
                roomName="admin_dashboard"
                showRoles={true}
                className="h-full"
              />
            </div>
          </motion.div>
        )}

        {/* Real-time Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${realtimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Real-time Status: {realtimeConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {realtimeLastUpdate && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last update: {realtimeLastUpdate.toLocaleTimeString()}
                </div>
              )}

              {realtimeError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  Connection error detected
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRealTimePanel(!showRealTimePanel)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {showRealTimePanel ? 'Hide' : 'Show'} Real-time Panel
              </button>

              {!realtimeConnected && (
                <button
                  onClick={reconnectRealtime}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Reconnect
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Activities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <Link
              to="/admin/reports?tab=activity"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.color === 'text-green-600' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.color === 'text-blue-600' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  activity.color === 'text-purple-600' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  activity.color === 'text-emerald-600' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  'bg-red-100 dark:bg-red-900/30'}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Alerts Modal */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNotifications(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    System Notifications
                  </h2>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border ${
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                        alert.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                        'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                            alert.type === 'success' ? 'text-green-800 dark:text-green-200' :
                            'text-blue-800 dark:text-blue-200'
                          }`}>
                            {alert.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            alert.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                            alert.type === 'success' ? 'text-green-700 dark:text-green-300' :
                            'text-blue-700 dark:text-blue-300'
                          }`}>
                            {alert.message}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            alert.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                          }`}>
                            {alert.priority}
                          </span>
                          <button className={`text-sm font-medium hover:underline ${
                            alert.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                            alert.type === 'success' ? 'text-green-600 dark:text-green-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`}>
                            {alert.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
