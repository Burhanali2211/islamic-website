import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  GraduationCap,
  Calendar,
  BarChart3,
  StickyNote,
  Users,
  Brain,
  User,
  Clock,
  Settings,
  Briefcase,
  UserCheck,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { state } = useApp();
  const location = useLocation();

  const studentNav = [
    { icon: GraduationCap, label: 'Talib-e-Ilm Dashboard', path: '/student' },
    { icon: Calendar, label: "Minhaj-e-Mutala'ah", path: '/study-plans' },
    { icon: BarChart3, label: 'Taraqqi', path: '/progress' },
    { icon: StickyNote, label: 'Hawashi', path: '/notes' },
    { icon: Users, label: 'Halaqaat', path: '/study-groups' },
    { icon: Brain, label: 'Imtihan', path: '/quizzes' },
    { icon: Clock, label: "Sabiqa Mutala'ah", path: '/history' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const teacherNav = [
    { icon: LayoutDashboard, label: 'Muallim Dashboard', path: '/teacher/dashboard' },
    { icon: BookOpen, label: 'Idarat-e-Durus', path: '/teacher/courses' },
    { icon: UserCheck, label: 'Idarat-e-Tullab', path: '/teacher/students' },
    { icon: Brain, label: 'Markaz-e-Taqyeem', path: '/teacher/grading' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const adminNav = [
    { icon: LayoutDashboard, label: 'Nazim Dashboard', path: '/admin/dashboard' },
    { icon: BookOpen, label: 'Idarat-e-Kutub', path: '/admin/books' },
    { icon: Users, label: 'Idarat-e-Mustakhdimeen', path: '/admin/users' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems = 
    state.currentUser?.role === 'user' ? studentNav :
    state.currentUser?.role === 'teacher' ? teacherNav :
    state.currentUser?.role === 'admin' ? adminNav : [];

  const renderMenuItems = (items: typeof studentNav) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname.startsWith(item.path) && (item.path !== '/student' || location.pathname === '/student');
      
      return (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-200 group touch-manipulation min-h-[44px] ${
            isActive
              ? 'neomorph-active bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-600 dark:text-green-400'
              : 'hover:neomorph-hover text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${isActive ? 'text-green-600 dark:text-green-400' : ''}`} />
          <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
        </Link>
      );
    });
  };

  return (
    <aside className="w-64 lg:w-72 xl:w-80 glass-sidebar backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-r border-white/20 dark:border-gray-700/30 h-screen sticky top-0 overflow-y-auto">
      <div className="p-4 sm:p-6">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
            <div className="neomorph-icon p-1.5 sm:p-2 rounded-xl">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Maktabah
            </h1>
        </Link>
        <nav className="space-y-1 sm:space-y-2">
          {renderMenuItems(navItems)}
        </nav>
      </div>
    </aside>
  );
}
