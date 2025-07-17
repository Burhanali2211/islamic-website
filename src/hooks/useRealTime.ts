import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useSupabaseApp } from '../context/SupabaseContext';

export interface RealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
  autoReconnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export interface RealtimeState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastUpdate: Date | null;
  connectionCount: number;
}

// Hook for subscribing to real-time table changes
export function useRealtimeTable<T = any>(
  options: RealtimeOptions,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  const [state, setState] = useState<RealtimeState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastUpdate: null,
    connectionCount: 0
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    const channelName = `${options.table}_${Date.now()}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter
        },
        (payload) => {
          setState(prev => ({ 
            ...prev, 
            lastUpdate: new Date(),
            connectionCount: prev.connectionCount + 1
          }));
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`📡 [REALTIME] ${options.table} subscription status:`, status);
        
        if (status === 'SUBSCRIBED') {
          setState(prev => ({ 
            ...prev, 
            isConnected: true, 
            isConnecting: false, 
            error: null 
          }));
          reconnectAttempts.current = 0;
          options.onConnect?.();
        } else if (status === 'CHANNEL_ERROR') {
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            isConnecting: false, 
            error: 'Connection failed' 
          }));
          options.onError?.('Connection failed');
          
          // Auto-reconnect logic
          if (options.autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(`🔄 [REALTIME] Reconnecting to ${options.table} (attempt ${reconnectAttempts.current})`);
              connect();
            }, delay);
          }
        } else if (status === 'CLOSED') {
          setState(prev => ({ 
            ...prev, 
            isConnected: false, 
            isConnecting: false 
          }));
          options.onDisconnect?.();
        }
      });

    channelRef.current = channel;
  }, [options, callback]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isConnecting: false 
    }));
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 1000);
  }, [disconnect, connect]);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    ...state,
    reconnect,
    disconnect
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const { state } = useSupabaseApp();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNotificationUpdate = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        setNotifications(prev => [newRecord, ...prev]);
        if (!newRecord.is_read) {
          setUnreadCount(prev => prev + 1);
        }
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(newRecord.title, {
            body: newRecord.message,
            icon: '/favicon.ico',
            tag: newRecord.id
          });
        }
        break;
        
      case 'UPDATE':
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === newRecord.id ? newRecord : notif
          )
        );
        
        // Update unread count if read status changed
        if (oldRecord.is_read !== newRecord.is_read) {
          setUnreadCount(prev => newRecord.is_read ? prev - 1 : prev + 1);
        }
        break;
        
      case 'DELETE':
        setNotifications(prev => 
          prev.filter(notif => notif.id !== oldRecord.id)
        );
        if (!oldRecord.is_read) {
          setUnreadCount(prev => prev - 1);
        }
        break;
    }
  }, []);

  const realtimeState = useRealtimeTable(
    {
      table: 'notifications',
      filter: state.user ? `user_id=eq.${state.user.id}` : undefined,
      autoReconnect: true
    },
    handleNotificationUpdate
  );

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', state.user.id)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [state.user]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected: realtimeState.isConnected,
    isConnecting: realtimeState.isConnecting,
    error: realtimeState.error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    reconnect: realtimeState.reconnect
  };
}

// Hook for real-time dashboard stats
export function useRealtimeDashboard() {
  const { loadDashboardStats, state } = useSupabaseApp();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleDataChange = useCallback((payload: any) => {
    console.log('📊 [DASHBOARD] Data changed, refreshing stats:', payload.table);
    setLastUpdate(new Date());
    
    // Debounce the stats reload to avoid too many calls
    setTimeout(() => {
      loadDashboardStats();
    }, 1000);
  }, [loadDashboardStats]);

  // Subscribe to tables that affect dashboard stats
  const booksRealtime = useRealtimeTable(
    { table: 'books', autoReconnect: true },
    handleDataChange
  );

  const usersRealtime = useRealtimeTable(
    { table: 'users', autoReconnect: true },
    handleDataChange
  );

  const borrowingRealtime = useRealtimeTable(
    { table: 'borrowing_records', autoReconnect: true },
    handleDataChange
  );

  const isConnected = booksRealtime.isConnected && 
                     usersRealtime.isConnected && 
                     borrowingRealtime.isConnected;

  const hasError = booksRealtime.error || 
                   usersRealtime.error || 
                   borrowingRealtime.error;

  return {
    isConnected,
    hasError,
    lastUpdate,
    stats: state.dashboardStats,
    reconnectAll: () => {
      booksRealtime.reconnect();
      usersRealtime.reconnect();
      borrowingRealtime.reconnect();
    }
  };
}

// Hook for real-time activity feed
export function useRealtimeActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const maxActivities = 50;

  const handleActivityUpdate = useCallback((payload: any) => {
    const { table, eventType, new: newRecord } = payload;
    
    let activityType = '';
    let message = '';
    let icon = '';
    
    switch (table) {
      case 'books':
        if (eventType === 'INSERT') {
          activityType = 'book_added';
          message = `New book "${newRecord.title}" added to library`;
          icon = 'book';
        }
        break;
        
      case 'users':
        if (eventType === 'INSERT') {
          activityType = 'user_registered';
          message = `New user "${newRecord.full_name}" registered`;
          icon = 'user';
        }
        break;
        
      case 'borrowing_records':
        if (eventType === 'INSERT') {
          activityType = 'book_borrowed';
          message = `Book borrowed by user`;
          icon = 'bookmark';
        } else if (eventType === 'UPDATE' && newRecord.status === 'returned') {
          activityType = 'book_returned';
          message = `Book returned by user`;
          icon = 'check';
        }
        break;
    }

    if (activityType) {
      const activity = {
        id: `${table}_${newRecord.id}_${Date.now()}`,
        type: activityType,
        message,
        icon,
        timestamp: new Date(),
        data: newRecord
      };

      setActivities(prev => [activity, ...prev].slice(0, maxActivities));
    }
  }, []);

  // Subscribe to activity-generating tables
  useRealtimeTable(
    { table: 'books', event: 'INSERT', autoReconnect: true },
    handleActivityUpdate
  );

  useRealtimeTable(
    { table: 'users', event: 'INSERT', autoReconnect: true },
    handleActivityUpdate
  );

  useRealtimeTable(
    { table: 'borrowing_records', autoReconnect: true },
    handleActivityUpdate
  );

  return {
    activities,
    clearActivities: () => setActivities([])
  };
}

// Hook for real-time presence (who's online)
export function useRealtimePresence(roomName: string = 'admin_dashboard') {
  const { state } = useSupabaseApp();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!state.user) return;

    const channel = supabase.channel(roomName);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat();
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('👋 [PRESENCE] User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('👋 [PRESENCE] User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: state.user!.id,
            email: state.user!.email,
            full_name: state.profile?.full_name || 'Unknown',
            role: state.profile?.role || 'user',
            online_at: new Date().toISOString()
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [state.user, state.profile, roomName]);

  return {
    onlineUsers,
    isOnline: onlineUsers.length > 0
  };
}
