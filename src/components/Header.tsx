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
    <header className="header-main">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for kitabs, authors, or topics..."
                value={state.searchQuery}
                onChange={handleSearch}
                className="input-search"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="btn-icon"
              aria-label="Toggle theme"
            >
              {state.theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button className="btn-icon">
              <Bell className="h-5 w-5" />
            </button>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
