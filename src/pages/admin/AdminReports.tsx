import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Clock,
  Award,
  FileText,
  AlertTriangle,
  CheckCircle,
  Star,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Settings,
  Mail,
  Phone,
  MapPin,
  Globe,
  Database,
  Shield,
  Zap,
  HardDrive,
  Wifi,
  Server,
  LineChart,
  DollarSign,
  Target,
  Bookmark,
  BookmarkCheck,
  UserCheck,
  UserX,
  BookX,
  AlertCircle,
  Info,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Share2,
  Printer,
  Save,
  Upload,
  FolderOpen,
  Archive,
  Trash2,
  Edit,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { useSupabaseApp } from '../../context/SupabaseContext';

export function AdminReports() {
  const { state, loadDashboardStats, loadBooks, loadUsers, loadBorrowingRecords } = useSupabaseApp();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReportType, setSelectedReportType] = useState('user_activity');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportFormat, setExportFormat] = useState('csv');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardStats();
    loadBooks();
    loadUsers();
    loadBorrowingRecords();
  }, [loadDashboardStats, loadBooks, loadUsers, loadBorrowingRecords]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize date range to last 30 days
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - parseInt(selectedPeriod));

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  }, [selectedPeriod]);

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
  };

  // Toggle card expansion
  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const stats = state.dashboardStats;

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    const books = state.books;
    const users = state.users;
    const borrowingRecords = state.borrowingRecords;

    // Book analytics
    const booksByCategory = books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const booksByLanguage = books.reduce((acc, book) => {
      acc[book.language] = (acc[book.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const featuredBooks = books.filter(book => book.is_featured).length;
    const availableBooks = books.filter(book => book.is_available).length;

    // User analytics
    const usersByRole = users.reduce((acc, user) => {
      const role = user.role || 'student';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activeUsers = users.filter(user => user.is_active).length;
    const newUsersThisMonth = users.filter(user => {
      const createdAt = new Date(user.created_at || '');
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return createdAt > monthAgo;
    }).length;

    // Borrowing analytics
    const activeBorrowings = borrowingRecords.filter(record => record.status === 'active').length;
    const overdueBorrowings = borrowingRecords.filter(record => record.status === 'overdue').length;
    const returnedBorrowings = borrowingRecords.filter(record => record.status === 'returned').length;

    const borrowingsByMonth = borrowingRecords.reduce((acc, record) => {
      const month = new Date(record.borrowed_date || '').toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularBooks = books
      .map(book => ({
        ...book,
        borrowCount: borrowingRecords.filter(record => record.book_id === book.id).length
      }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10);

    const topBorrowers = users
      .map(user => ({
        ...user,
        borrowCount: borrowingRecords.filter(record => record.user_id === user.id).length
      }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10);

    // Performance metrics
    const averageBorrowingDuration = borrowingRecords
      .filter(record => record.returned_date)
      .reduce((acc, record) => {
        const borrowed = new Date(record.borrowed_date || '');
        const returned = new Date(record.returned_date || '');
        return acc + (returned.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / returnedBorrowings || 0;

    const returnRate = returnedBorrowings / (returnedBorrowings + activeBorrowings + overdueBorrowings) * 100;
    const overdueRate = overdueBorrowings / (returnedBorrowings + activeBorrowings + overdueBorrowings) * 100;

    return {
      books: {
        total: books.length,
        byCategory: booksByCategory,
        byLanguage: booksByLanguage,
        featured: featuredBooks,
        available: availableBooks,
        unavailable: books.length - availableBooks
      },
      users: {
        total: users.length,
        byRole: usersByRole,
        active: activeUsers,
        inactive: users.length - activeUsers,
        newThisMonth: newUsersThisMonth
      },
      borrowing: {
        total: borrowingRecords.length,
        active: activeBorrowings,
        overdue: overdueBorrowings,
        returned: returnedBorrowings,
        byMonth: borrowingsByMonth,
        averageDuration: Math.round(averageBorrowingDuration),
        returnRate: Math.round(returnRate),
        overdueRate: Math.round(overdueRate)
      },
      popular: {
        books: popularBooks,
        borrowers: topBorrowers
      }
    };
  }, [state.books, state.users, state.borrowingRecords]);

  const reportCards = [
    {
      id: 'user_activity',
      title: 'User Activity Report',
      description: 'Detailed analysis of user engagement and activity patterns',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      metrics: [
        { label: 'Total Users', value: analytics.users.total || 0 },
        { label: 'Active Users', value: analytics.users.active || 0 },
        { label: 'New This Month', value: analytics.users.newThisMonth || 0 }
      ],
      charts: [
        {
          type: 'pie',
          title: 'Users by Role',
          data: Object.entries(analytics.users.byRole || {}).map(([key, value]) => ({ name: key, value }))
        }
      ]
    },
    {
      id: 'book_circulation',
      title: 'Book Circulation Report',
      description: 'Library book borrowing and return statistics',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      metrics: [
        { label: 'Total Books', value: analytics.books.total || 0 },
        { label: 'Books Borrowed', value: analytics.borrowing.active || 0 },
        { label: 'Return Rate', value: `${analytics.borrowing.returnRate || 0}%` }
      ],
      charts: [
        {
          type: 'bar',
          title: 'Borrowing Status',
          data: [
            { name: 'Active', value: analytics.borrowing.active || 0 },
            { name: 'Overdue', value: analytics.borrowing.overdue || 0 },
            { name: 'Returned', value: analytics.borrowing.returned || 0 }
          ]
        }
      ]
    },
    {
      id: 'category_performance',
      title: 'Category Performance',
      description: 'Most popular Islamic book categories and subjects',
      icon: PieChart,
      color: 'from-purple-500 to-violet-500',
      metrics: [
        { label: 'Categories', value: Object.keys(analytics.books.byCategory || {}).length || 0 },
        {
          label: 'Most Popular',
          value: Object.entries(analytics.books.byCategory || {})
            .sort((a, b) => b[1] - a[1])
            .map(([key]) => key)[0] || 'N/A'
        },
        {
          label: 'Engagement',
          value: `${Math.round((analytics.borrowing.total / analytics.books.total) * 100) || 0}%`
        }
      ],
      charts: [
        {
          type: 'pie',
          title: 'Books by Category',
          data: Object.entries(analytics.books.byCategory || {}).map(([key, value]) => ({ name: key, value }))
        }
      ]
    },
    {
      id: 'borrowing_trends',
      title: 'Borrowing Trends',
      description: 'Monthly borrowing patterns and trends analysis',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-500',
      metrics: [
        { label: 'Total Borrowings', value: analytics.borrowing.total || 0 },
        { label: 'Avg. Duration', value: `${analytics.borrowing.averageDuration || 0} days` },
        { label: 'Overdue Rate', value: `${analytics.borrowing.overdueRate || 0}%` }
      ],
      charts: [
        {
          type: 'line',
          title: 'Borrowings by Month',
          data: Object.entries(analytics.borrowing.byMonth || {})
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6)
            .map(([key, value]) => ({
              name: new Date(key).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
              value
            }))
        }
      ]
    },
    {
      id: 'popular_books',
      title: 'Popular Books Report',
      description: 'Most borrowed and highly rated books in the library',
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      metrics: [
        { label: 'Featured Books', value: analytics.books.featured || 0 },
        { label: 'Available Books', value: analytics.books.available || 0 },
        { label: 'Unavailable', value: analytics.books.unavailable || 0 }
      ],
      charts: [
        {
          type: 'bar',
          title: 'Top 5 Most Borrowed Books',
          data: (analytics.popular.books || []).slice(0, 5).map(book => ({
            name: book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title,
            value: book.borrowCount
          }))
        }
      ]
    },
    {
      id: 'system_performance',
      title: 'System Performance',
      description: 'Technical metrics and system health indicators',
      icon: Activity,
      color: 'from-red-500 to-pink-500',
      metrics: [
        { label: 'Uptime', value: '99.9%' },
        { label: 'Response Time', value: '120ms' },
        { label: 'Storage Used', value: '2.4GB' }
      ],
      charts: [
        {
          type: 'line',
          title: 'System Load',
          data: [
            { name: 'Mon', value: 65 },
            { name: 'Tue', value: 59 },
            { name: 'Wed', value: 80 },
            { name: 'Thu', value: 81 },
            { name: 'Fri', value: 56 },
            { name: 'Sat', value: 40 },
            { name: 'Sun', value: 30 }
          ]
        }
      ]
    }
  ];

  const quickStats = [
    {
      label: 'Total Borrowings This Month',
      value: analytics.borrowing.active || 0,
      change: '+12%',
      positive: true,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'Overdue Books',
      value: analytics.borrowing.overdue || 0,
      change: analytics.borrowing.overdue > 0 ? `${analytics.borrowing.overdueRate}%` : '0%',
      positive: analytics.borrowing.overdue === 0,
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500'
    },
    {
      label: 'New Users This Month',
      value: analytics.users.newThisMonth || 0,
      change: '+15%',
      positive: true,
      icon: UserCheck,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      label: 'Books Added This Month',
      value: analytics.books.total || 0,
      change: '+3%',
      positive: true,
      icon: BookOpen,
      color: 'from-purple-500 to-violet-500'
    },
    {
      label: 'Active Users',
      value: analytics.users.active || 0,
      change: `${Math.round((analytics.users.active / analytics.users.total) * 100) || 0}%`,
      positive: true,
      icon: Users,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      label: 'Return Rate',
      value: `${analytics.borrowing.returnRate || 0}%`,
      change: analytics.borrowing.returnRate > 90 ? 'Excellent' : analytics.borrowing.returnRate > 80 ? 'Good' : 'Needs Improvement',
      positive: analytics.borrowing.returnRate > 80,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Featured Books',
      value: analytics.books.featured || 0,
      change: `${Math.round((analytics.books.featured / analytics.books.total) * 100) || 0}%`,
      positive: true,
      icon: Star,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      label: 'Available Books',
      value: analytics.books.available || 0,
      change: `${Math.round((analytics.books.available / analytics.books.total) * 100) || 0}%`,
      positive: analytics.books.available > analytics.books.unavailable,
      icon: BookmarkCheck,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true);
    setIsLoading(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportData = {
        type: reportType,
        period: selectedPeriod,
        dateRange,
        generatedAt: new Date().toISOString(),
        analytics,
        filters: {
          categories: selectedCategories,
          userRoles: selectedUserRoles,
          sortBy,
          sortOrder
        }
      };

      let content = '';
      let filename = '';
      let mimeType = '';

      if (exportFormat === 'csv') {
        content = generateCSVReport(reportType, reportData);
        filename = `${reportType.toLowerCase().replace(/\s+/g, '_')}_report_${selectedPeriod}days.csv`;
        mimeType = 'text/csv';
      } else if (exportFormat === 'json') {
        content = JSON.stringify(reportData, null, 2);
        filename = `${reportType.toLowerCase().replace(/\s+/g, '_')}_report_${selectedPeriod}days.json`;
        mimeType = 'application/json';
      } else if (exportFormat === 'txt') {
        content = generateTextReport(reportType, reportData);
        filename = `${reportType.toLowerCase().replace(/\s+/g, '_')}_report_${selectedPeriod}days.txt`;
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification('success', `${reportType} report generated and downloaded successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      showNotification('error', 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const generateCSVReport = (reportType: string, data: any) => {
    let csv = `IDARAH WALI UL ASER Islamic Library - ${reportType}\n`;
    csv += `Generated At,${new Date().toLocaleString()}\n`;
    csv += `Period,${selectedPeriod} days\n`;
    csv += `Date Range,${dateRange.start} to ${dateRange.end}\n\n`;

    if (reportType === 'User Activity Report') {
      csv += `User Statistics\n`;
      csv += `Metric,Value\n`;
      csv += `Total Users,${data.analytics.users.total}\n`;
      csv += `Active Users,${data.analytics.users.active}\n`;
      csv += `Inactive Users,${data.analytics.users.inactive}\n`;
      csv += `New Users This Month,${data.analytics.users.newThisMonth}\n\n`;

      csv += `Users by Role\n`;
      csv += `Role,Count\n`;
      Object.entries(data.analytics.users.byRole || {}).forEach(([role, count]) => {
        csv += `${role},${count}\n`;
      });
    } else if (reportType === 'Book Circulation Report') {
      csv += `Book Statistics\n`;
      csv += `Metric,Value\n`;
      csv += `Total Books,${data.analytics.books.total}\n`;
      csv += `Available Books,${data.analytics.books.available}\n`;
      csv += `Unavailable Books,${data.analytics.books.unavailable}\n`;
      csv += `Featured Books,${data.analytics.books.featured}\n\n`;

      csv += `Books by Category\n`;
      csv += `Category,Count\n`;
      Object.entries(data.analytics.books.byCategory || {}).forEach(([category, count]) => {
        csv += `${category},${count}\n`;
      });
    }

    return csv;
  };

  const generateTextReport = (reportType: string, data: any) => {
    let text = `IDARAH WALI UL ASER Islamic Library\n`;
    text += `${reportType}\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Period: ${selectedPeriod} days\n`;
    text += `Date Range: ${dateRange.start} to ${dateRange.end}\n\n`;

    text += `SUMMARY STATISTICS\n`;
    text += `${'-'.repeat(30)}\n`;
    text += `Total Books: ${data.analytics.books.total}\n`;
    text += `Total Users: ${data.analytics.users.total}\n`;
    text += `Active Borrowings: ${data.analytics.borrowing.active}\n`;
    text += `Overdue Books: ${data.analytics.borrowing.overdue}\n`;
    text += `Return Rate: ${data.analytics.borrowing.returnRate}%\n\n`;

    if (data.analytics.popular.books.length > 0) {
      text += `TOP 10 MOST BORROWED BOOKS\n`;
      text += `${'-'.repeat(30)}\n`;
      data.analytics.popular.books.slice(0, 10).forEach((book: any, index: number) => {
        text += `${index + 1}. ${book.title} (${book.borrowCount} times)\n`;
      });
      text += `\n`;
    }

    return text;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Reports', icon: Users },
    { id: 'books', label: 'Book Reports', icon: BookOpen },
    { id: 'borrowing', label: 'Borrowing Reports', icon: TrendingUp },
    { id: 'analytics', label: 'Advanced Analytics', icon: Activity },
    { id: 'export', label: 'Export & Settings', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Comprehensive insights into your Islamic library system
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
            
            <button
              onClick={() => loadDashboardStats()}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.positive
                      ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'
                      : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Report Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {reportCards.map((report, index) => {
            const Icon = report.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${report.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <button
                      onClick={() => handleGenerateReport(report.title)}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span>{isGenerating ? 'Generating...' : 'Download'}</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{report.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{report.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      {report.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-center">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Popular Islamic Categories</h3>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Hadith', 'Fiqh', 'Tafseer'].map((category, index) => (
              <div key={category} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{category}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{Math.floor(Math.random() * 50) + 20} books</p>
                <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
