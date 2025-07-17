import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';
import { motion, AnimatePresence } from 'framer-motion';

export function PublicHeader() {
  const { state, dispatch } = useSupabaseApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/library', label: 'Library' },
    { path: '/about', label: 'About' },
    { path: '/foundation', label: 'Foundation' },
    { path: '/learning-center', label: 'Learning Center' },
    { path: '/contact', label: 'Contact' },
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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg shadow-sm">
              <img
                src="/idarah wali ul aser logo.png"
                alt="IDARAH WALI UL ASER Logo"
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 object-contain"
              />
            </div>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
              <span className="hidden sm:inline">IDARAH WALI UL ASER</span>
              <span className="sm:hidden">IDARAH</span>
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-medium text-sm xl:text-base px-3 py-2 rounded-lg transition-all duration-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-gold after:transition-transform after:duration-300 ${
                    isActive ? 'text-green-600 dark:text-green-400 after:scale-x-100 bg-green-50 dark:bg-green-900/20' : 'text-gray-700 dark:text-gray-300 after:scale-x-0 hover:after:scale-x-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <button
              onClick={toggleTheme}
              className="neomorph-button p-2.5 xl:p-3 rounded-full hover:scale-105 transition-transform"
              aria-label="Toggle theme"
            >
              {state.theme === 'light' ? <Moon size={18} className="xl:w-5 xl:h-5" /> : <Sun size={18} className="xl:w-5 xl:h-5" />}
            </button>
            <Link to="/login">
              <button className="px-4 py-2.5 xl:px-6 xl:py-3 rounded-xl font-semibold text-sm xl:text-base text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                Dakhil
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="neomorph-button p-2.5 rounded-full hover:scale-105 transition-transform touch-manipulation"
              aria-label="Toggle theme"
            >
              {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="neomorph-button p-2.5 rounded-full hover:scale-105 transition-transform touch-manipulation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t border-gray-200 dark:border-gray-700"
          >
            <nav className="flex flex-col space-y-2 p-4 sm:p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-medium text-base sm:text-lg py-3 px-4 rounded-xl transition-all duration-300 touch-manipulation min-h-[48px] flex items-center justify-center ${
                      isActive
                        ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-green-600 dark:hover:text-green-400'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block">
                  <button className="w-full py-3.5 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-green-500/25 touch-manipulation min-h-[48px]">
                    Login
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
