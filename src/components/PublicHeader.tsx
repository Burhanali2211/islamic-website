import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, Sun, Moon, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicHeader() {
  const { state, dispatch } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Bayt' },
    { path: '/library', label: 'Maktabah' },
    { path: '/about', label: 'Haqiqat' },
    { path: '/foundation', label: 'Idarah' },
    { path: '/learning-center', label: 'Darsgah' },
    { path: '/contact', label: 'Rabita' },
  ];

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-header sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg shadow-sm">
              <img
                src="/idarah wali ul aser logo.png"
                alt="IDARAH WALI UL ASER Logo"
                className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
              />
            </div>
            <h1 className="text-xs sm:text-sm md:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
              <span className="hidden sm:inline">IDARAH WALI UL ASER</span>
              <span className="sm:hidden">IDARAH</span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium text-sm xl:text-base transition-colors hover:text-green-600 dark:hover:text-green-400 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-gold after:transition-transform after:duration-300 ${
                    isActive ? 'text-green-600 dark:text-green-400 after:scale-x-100' : 'text-gray-700 dark:text-gray-300 after:scale-x-0 hover:after:scale-x-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <button onClick={toggleTheme} className="neomorph-button p-2 xl:p-3 rounded-full hover:scale-105 transition-transform">
              {state.theme === 'light' ? <Moon size={16} className="xl:w-[18px] xl:h-[18px]" /> : <Sun size={16} className="xl:w-[18px] xl:h-[18px]" />}
            </button>
            <Link to="/login">
              <button className="px-4 py-2 xl:px-6 xl:py-3 rounded-lg font-semibold text-sm xl:text-base text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform shadow-md">
                Dakhil
              </button>
            </Link>
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="neomorph-button p-2 rounded-full">
              {state.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="neomorph-button p-2 rounded-full">
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden"
          >
            <nav className="flex flex-col items-center space-y-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-medium text-lg py-2 px-4 rounded-lg transition-colors ${isActive ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex flex-col items-center space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full max-w-xs">
                  <button className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform">
                    Dakhil
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
