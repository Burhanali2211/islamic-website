import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  User, 
  UserCheck, 
  Shield, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Wifi,
  WifiOff,
  RefreshCw,
  X,
  Search
} from 'lucide-react';
import { useRealtimePresence } from '../../hooks/useRealTime';
import { formatDistanceToNow } from 'date-fns';

interface OnlineUsersProps {
  roomName?: string;
  showRoles?: boolean;
  compact?: boolean;
  className?: string;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({
  roomName = 'admin_dashboard',
  showRoles = true,
  compact = false,
  className = ''
}) => {
  const { onlineUsers, isOnline } = useRealtimePresence(roomName);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = onlineUsers.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return UserCheck;
      case 'student': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'teacher': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'student': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Online Users
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {onlineUsers.length}
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {onlineUsers.slice(0, 5).map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            const roleColor = getRoleColor(user.role);
            
            return (
              <div key={user.user_id} className="flex items-center space-x-2 text-xs">
                <div className={`p-1 rounded ${roleColor}`}>
                  <RoleIcon className="h-3 w-3" />
                </div>
                <span className="text-gray-900 dark:text-white truncate">
                  {user.full_name || user.email}
                </span>
              </div>
            );
          })}
          
          {onlineUsers.length > 5 && (
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              +{onlineUsers.length - 5} more users
            </div>
          )}
          
          {onlineUsers.length === 0 && (
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              No users online
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Online Users
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {onlineUsers.length} {onlineUsers.length === 1 ? 'user' : 'users'} currently active
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
              isOnline 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}>
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isOnline ? 'Connected' : 'Disconnected'}</span>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Search */}
        {isExpanded && onlineUsers.length > 5 && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* User List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No users online</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    const roleColor = getRoleColor(user.role);
                    
                    return (
                      <div
                        key={user.user_id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${roleColor}`}>
                            <RoleIcon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.full_name || 'Unknown User'}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          
                          {showRoles && (
                            <span className={`px-2 py-1 text-xs rounded-full ${roleColor}`}>
                              {user.role || 'user'}
                            </span>
                          )}
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {user.online_at ? formatDistanceToNow(new Date(user.online_at), { addSuffix: true }) : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>{isOnline ? 'Presence system active' : 'Presence system offline'}</span>
          </div>
          <span>
            Room: {roomName}
          </span>
        </div>
      </div>
    </div>
  );
};
