import React from 'react';
import { Search, Moon, Sun, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserMenu } from './UserMenu';

export function Header() {
  const { state, dispatch } = useApp();

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  return (
    <header className="glass-header backdrop-blur-xl bg-white/85 dark:bg-gray-950/85 border-b border-white/20 dark:border-gray-700/50">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl lg:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for kitabs, authors, or topics..."
                value={state.searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 glass-input rounded-xl text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={toggleTheme}
              className="neomorph-button p-2 sm:p-2.5 rounded-full hover:scale-105 transition-transform touch-manipulation"
              aria-label="Toggle theme"
            >
              {state.theme === 'light' ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            <button className="neomorph-button p-2 sm:p-2.5 rounded-full hover:scale-105 transition-transform touch-manipulation">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
