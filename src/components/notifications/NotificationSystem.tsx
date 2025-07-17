import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Trash2,
  MarkAsUnread,
  Settings,
  Filter,
  Search,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { useRealtimeNotifications } from '../../hooks/useRealTime';
import { formatDistanceToNow } from 'date-fns';

interface NotificationSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  position = 'top-right',
  maxVisible = 5,
  autoHide = true,
  autoHideDelay = 5000
}) => {
  const {
    notifications,
    unreadCount,
    isConnected,
    isConnecting,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reconnect
  } = useRealtimeNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastNotifications, setToastNotifications] = useState<any[]>([]);

  // Handle new notifications for toast display
  useEffect(() => {
    const latestNotifications = notifications.slice(0, maxVisible);
    const newToasts = latestNotifications
      .filter(notif => !notif.is_read)
      .map(notif => ({
        ...notif,
        id: `toast_${notif.id}`,
        showTime: Date.now()
      }));

    setToastNotifications(prev => {
      const existing = prev.filter(toast => 
        newToasts.some(newToast => newToast.id === toast.id)
      );
      return [...existing, ...newToasts.filter(newToast => 
        !existing.some(existing => existing.id === newToast.id)
      )];
    });

    // Auto-hide toasts
    if (autoHide) {
      newToasts.forEach(toast => {
        setTimeout(() => {
          setToastNotifications(prev => 
            prev.filter(t => t.id !== toast.id)
          );
        }, autoHideDelay);
      });
    }
  }, [notifications, maxVisible, autoHide, autoHideDelay]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.is_read) return false;
    if (filter === 'read' && !notif.is_read) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return notif.title.toLowerCase().includes(query) ||
             notif.message.toLowerCase().includes(query);
    }
    
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return X;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const removeToast = (toastId: string) => {
    setToastNotifications(prev => prev.filter(t => t.id !== toastId));
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-lg transition-colors ${
            isConnected 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50' 
              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
          }`}
          title={isConnected ? 'Notifications' : 'Connection lost - Click to reconnect'}
        >
          {isConnecting ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : isConnected ? (
            <Bell className="h-5 w-5" />
          ) : (
            <WifiOff className="h-5 w-5" />
          )}
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          
          {!isConnected && (
            <span className="absolute -bottom-1 -right-1 bg-red-500 rounded-full h-3 w-3"></span>
          )}
        </button>

        {/* Connection Status Indicator */}
        <div className={`absolute top-full mt-1 right-0 text-xs px-2 py-1 rounded ${
          isConnected 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
        } ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <div className="flex items-center space-x-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 right-0 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {!isConnected && (
                    <button
                      onClick={reconnect}
                      className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Reconnect"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                  !notification.is_read 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.is_read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="Mark as read"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
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

      {/* Toast Notifications */}
      <div className={`fixed ${positionClasses[position]} z-50 space-y-2`}>
        <AnimatePresence>
          {toastNotifications.map((toast) => {
            const Icon = getNotificationIcon(toast.type);
            const colorClass = getNotificationColor(toast.type);
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: position.includes('right') ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: position.includes('right') ? 300 : -300 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {toast.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {toast.message}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};
