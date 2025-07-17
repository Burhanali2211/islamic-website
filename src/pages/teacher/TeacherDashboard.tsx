import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Calendar, Plus, Eye, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseApp } from '../../context/SupabaseContext';

export function TeacherDashboard() {
  const { state } = useSupabaseApp();

  const stats = [
    {
      label: 'Active Courses',
      value: 3,
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      trend: '+1',
      trendUp: true,
      subtitle: 'This semester'
    },
    {
      label: 'Total Students',
      value: 74,
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      trend: '+12',
      trendUp: true,
      subtitle: 'Enrolled students'
    },
    {
      label: 'Assignments to Grade',
      value: 8,
      icon: Award,
      color: 'from-orange-500 to-amber-500',
      trend: '-3',
      trendUp: false,
      subtitle: 'Pending review'
    },
    {
      label: 'Upcoming Classes',
      value: 2,
      icon: Calendar,
      color: 'from-purple-500 to-violet-500',
      trend: '0',
      trendUp: true,
      subtitle: 'This week'
    },
  ];

  const quickActions = [
    {
      title: 'Create Assignment',
      description: 'Create new assignment for students',
      icon: Plus,
      color: 'from-emerald-500 to-teal-500',
      link: '/teacher/assignments/new'
    },
    {
      title: 'Grade Submissions',
      description: 'Review and grade student work',
      icon: Award,
      color: 'from-blue-500 to-indigo-500',
      link: '/teacher/grading'
    },
    {
      title: 'View Students',
      description: 'Manage your students',
      icon: Users,
      color: 'from-purple-500 to-violet-500',
      link: '/teacher/students'
    },
    {
      title: 'Course Materials',
      description: 'Manage course content',
      icon: BookOpen,
      color: 'from-orange-500 to-amber-500',
      link: '/teacher/courses'
    }
  ];

  const recentActivities = [
    { action: 'Assignment submitted', student: 'Ahmad Ali', course: 'Quranic Tafsir', time: '2 hours ago', type: 'submission' },
    { action: 'Quiz completed', student: 'Fatima Hassan', course: 'Hadith Studies', time: '4 hours ago', type: 'quiz' },
    { action: 'New enrollment', student: 'Omar Khan', course: 'Islamic History', time: '1 day ago', type: 'enrollment' },
    { action: 'Assignment graded', student: 'Aisha Ahmed', course: 'Quranic Tafsir', time: '2 days ago', type: 'graded' },
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
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Welcome back, {state.currentUser?.name || 'Teacher'}! Here's your teaching overview.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/teacher/courses">
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group">
                <Eye className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700 dark:text-gray-300">View Courses</span>
              </button>
            </Link>
            <Link to="/teacher/grading">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span className="font-medium">Grade Work</span>
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

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'submission' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  activity.type === 'quiz' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  activity.type === 'enrollment' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {activity.type === 'submission' && <TrendingUp className="h-4 w-4" />}
                  {activity.type === 'quiz' && <CheckCircle className="h-4 w-4" />}
                  {activity.type === 'enrollment' && <Users className="h-4 w-4" />}
                  {activity.type === 'graded' && <Award className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.student} • {activity.course}
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
      </div>
    </div>
  );
}
