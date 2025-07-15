import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export function UserMenu() {
  const { state, logout } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!state.currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 neomorph-button p-2 rounded-full hover:scale-105 transition-transform"
      >
        <img src={state.currentUser.avatar} alt={state.currentUser.name} className="w-8 h-8 rounded-full" />
        <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300 pr-2">{state.currentUser.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 glass-card rounded-2xl shadow-lg z-50 overflow-hidden"
          >
            <div className="p-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Khurooj</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
