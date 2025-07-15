import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Frown } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Frown className="h-24 w-24 mx-auto text-gray-400 mb-6" />
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mt-4 mb-8">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <button className="neomorph-button px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform">
            Go to Homepage
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
