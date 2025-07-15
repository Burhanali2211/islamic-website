import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpen, User, Briefcase, Shield } from 'lucide-react';

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: 'user' | 'teacher' | 'admin') => {
    login(role);
    const path = role === 'user' ? '/student' : `/${role}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
              Welcome to Idarah Islamic Library
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Please select your role to continue.</p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogin('user')}
              className="w-full neomorph-button py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3"
            >
              <User className="h-5 w-5" />
              <span>Login as Talib-e-Ilm</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogin('teacher')}
              className="w-full neomorph-button py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3"
            >
              <Briefcase className="h-5 w-5" />
              <span>Login as Muallim</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogin('admin')}
              className="w-full neomorph-button py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3"
            >
              <Shield className="h-5 w-5" />
              <span>Login as Nazim</span>
            </motion.button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                Indimam
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
