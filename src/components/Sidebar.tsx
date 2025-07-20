import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  BarChart3,
  StickyNote,
  Users,
  Brain,
  User,
  Clock,
  UserCheck,
  LayoutDashboard,
  Settings,
  FileText,
  BookMarked,
  X
} from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { state } = useSupabaseApp();
  const location = useLocation();
  const navigate = useNavigate();

  const studentNav = [
    { icon: GraduationCap, label: 'Student Dashboard', path: '/student' },
    { icon: Calendar, label: 'Study Plans', path: '/study-plans' },
    { icon: BarChart3, label: 'Progress', path: '/progress' },
    { icon: StickyNote, label: 'Notes', path: '/notes' },
    { icon: Users, label: 'Study Groups', path: '/study-groups' },
    { icon: Brain, label: 'Quizzes', path: '/quizzes' },
    { icon: Clock, label: 'Reading History', path: '/history' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const teacherNav = [
    { icon: LayoutDashboard, label: 'Teacher Dashboard', path: '/teacher/dashboard' },
    { icon: BookOpen, label: 'Manage Courses', path: '/teacher/courses' },
    { icon: UserCheck, label: 'Manage Students', path: '/teacher/students' },
    { icon: Brain, label: 'Grading Center', path: '/teacher/grading' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const adminNav = [
    { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin/dashboard' },
    { icon: BookOpen, label: 'Manage Books', path: '/admin/books' },
    { icon: Users, label: 'Manage Users', path: '/admin/users' },
    { icon: BookMarked, label: 'Manage Borrowing', path: '/admin/borrowing' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems =
    state.profile?.role === 'student' ? studentNav :
    state.profile?.role === 'teacher' ? teacherNav :
    state.profile?.role === 'admin' ? adminNav : [];

  const renderMenuItems = (items: typeof studentNav) => {
    return items.map((item) => {
      const Icon = item.icon;
      // More precise active state logic to prevent conflicts
      const isActive = location.pathname === item.path ||
        (item.path !== '/student' && item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/')) ||
        (item.path === '/student' && location.pathname === '/student') ||
        (item.path === '/admin/dashboard' && location.pathname === '/admin/dashboard');

      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={(e) => {
            // Prevent default and use programmatic navigation for more reliable navigation
            e.preventDefault();
            navigate(item.path);
            handleLinkClick(item.path);
          }}
          className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group touch-manipulation ${
            isActive
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
          }`}
        >
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
          <span className="font-medium text-xs sm:text-sm truncate">{item.label}</span>
        </Link>
      );
    });
  };

  const handleLinkClick = (path: string) => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col shadow-lg pointer-events-auto">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">IDARAH</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">WALI UL ASER</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <nav className="space-y-1 sm:space-y-2">
          {renderMenuItems(navItems)}
        </nav>
      </div>

      {/* User info at bottom */}
      <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
              {state.profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
              {state.profile?.role || 'Student'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
