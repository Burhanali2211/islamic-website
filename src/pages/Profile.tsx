import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, BookOpen, Award, Settings, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Profile() {
  const { state } = useApp();
  const userProfile = state.currentUser;

  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  const stats = {
    booksRead: 24,
    studyHours: 142,
    quizzes: 12,
    notes: 45
  };

  const badges = [
    { name: 'First Book', description: 'Completed your first book', color: 'from-green-500 to-emerald-500' },
    { name: 'Quiz Master', description: 'Scored 90%+ in 3 quizzes', color: 'from-blue-500 to-cyan-500' },
    { name: 'Study Streak', description: '7 days continuous study', color: 'from-purple-500 to-pink-500' },
    { name: 'Note Taker', description: 'Created 50+ study notes', color: 'from-orange-500 to-red-500' },
  ];

  const recentActivity = [
    { activity: 'Completed "Tafsir Ibn Kathir"', date: '2 days ago', type: 'book' },
    { activity: 'Scored 92% in Hadith Quiz', date: '4 days ago', type: 'quiz' },
  ];

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account and view your progress
          </p>
        </div>
        <button className="neomorph-button p-3 rounded-2xl hover:scale-105 transition-transform">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="relative inline-block mb-6">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white dark:border-gray-800"
              />
              <button className="absolute bottom-0 right-0 neomorph-button p-2 rounded-full hover:scale-105 transition-transform">
                <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {userProfile.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Passionate Islamic scholar and student.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">{userProfile.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Joined {new Date(userProfile.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="neomorph-inset p-6 rounded-2xl relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${badge.color}`}></div>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center`}>
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{badge.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
