import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BookOpen, 
  Users, 
  UserPlus, 
  BookMarked, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  Pause,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { useRealtimeActivity } from '../../hooks/useRealTime';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  maxItems?: number;
  showFilters?: boolean;
  autoScroll?: boolean;
  compact?: boolean;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  maxItems = 50,
  showFilters = true,
  autoScroll = true,
  compact = false,
  className = ''
}) => {
  const { activities, clearActivities } = useRealtimeActivity();
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayedActivities, setDisplayedActivities] = useState<any[]>([]);

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  // Update displayed activities when not paused
  useEffect(() => {
    if (!isPaused) {
      setDisplayedActivities(filteredActivities.slice(0, maxItems));
    }
  }, [filteredActivities, maxItems, isPaused]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'book_added': return BookOpen;
      case 'user_registered': return UserPlus;
      case 'book_borrowed': return BookMarked;
      case 'book_returned': return CheckCircle;
      case 'book_overdue': return AlertTriangle;
      case 'user_login': return Users;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'book_added': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'user_registered': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'book_borrowed': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'book_returned': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
      case 'book_overdue': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'user_login': return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.type) {
      case 'book_added':
        return `New book "${activity.data?.title || 'Unknown'}" added to library`;
      case 'user_registered':
        return `New ${activity.data?.role || 'user'} "${activity.data?.full_name || 'Unknown'}" registered`;
      case 'book_borrowed':
        return `Book borrowed by ${activity.data?.user_name || 'user'}`;
      case 'book_returned':
        return `Book returned by ${activity.data?.user_name || 'user'}`;
      case 'book_overdue':
        return `Book is now overdue`;
      case 'user_login':
        return `${activity.data?.full_name || 'User'} logged in`;
      default:
        return activity.message || 'Unknown activity';
    }
  };

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'book_added', label: 'Books Added' },
    { value: 'user_registered', label: 'User Registrations' },
    { value: 'book_borrowed', label: 'Books Borrowed' },
    { value: 'book_returned', label: 'Books Returned' },
    { value: 'book_overdue', label: 'Overdue Books' },
    { value: 'user_login', label: 'User Logins' }
  ];

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Recent Activity
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {displayedActivities.length}
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {displayedActivities.slice(0, 5).map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 text-xs"
                >
                  <div className={`p-1 rounded ${colorClass}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 truncate">
                    {getActivityMessage(activity)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Activity Feed
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real-time updates from your library system
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-lg transition-colors ${
                isPaused 
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              }`}
              title={isPaused ? 'Resume updates' : 'Pause updates'}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>

            <button
              onClick={clearActivities}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Clear all activities"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && isExpanded && (
          <div className="mt-4 flex items-center justify-between">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                {displayedActivities.length} of {activities.length} activities
              </span>
              {isPaused && (
                <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <Pause className="h-3 w-3 mr-1" />
                  Paused
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {displayedActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No activities yet</p>
              <p className="text-sm mt-1">Activities will appear here as they happen</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {displayedActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {getActivityMessage(activity)}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
                              {activity.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates active</span>
          </div>
          <span>
            Last update: {activities.length > 0 ? formatDistanceToNow(activities[0]?.timestamp || new Date(), { addSuffix: true }) : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
};
