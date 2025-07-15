import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpen, User, Mail, Lock } from 'lucide-react';

export function Register() {
  const { state } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-block neomorph-icon p-3 rounded-2xl mb-4">
              <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Join our community of learners.</p>
          </div>

          <form className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full neomorph-button py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500"
            >
              Indimam
            </motion.button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                Dakhil
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
