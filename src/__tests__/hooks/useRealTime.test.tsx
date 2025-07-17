import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SupabaseProvider } from '../../context/SupabaseContext';
import { 
  useRealtimeDashboard, 
  useRealtimeNotifications, 
  useRealtimeActivity,
  useRealtimePresence 
} from '../../hooks/useRealTime';
import { vi } from 'vitest';

const mockSupabaseContext = {
  state: {
    user: { id: 'test-user', email: 'user@test.com' },
    profile: { full_name: 'Test User', role: 'admin' },
    isLoading: false,
    error: null
  },
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      send: vi.fn()
    })),
    removeChannel: vi.fn(),
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  }
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <SupabaseProvider value={mockSupabaseContext as any}>
      {children}
    </SupabaseProvider>
  </BrowserRouter>
);

describe('useRealtimeDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with default state', () => {
    const { result } = renderHook(() => useRealtimeDashboard(), { wrapper });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.lastUpdate).toBeNull();
    expect(typeof result.current.reconnectAll).toBe('function');
  });

  test('establishes connection on mount', () => {
    renderHook(() => useRealtimeDashboard(), { wrapper });

    expect(mockSupabaseContext.supabase.channel).toHaveBeenCalledWith('dashboard-updates');
  });

  test('handles connection state changes', () => {
    const { result } = renderHook(() => useRealtimeDashboard(), { wrapper });

    // Simulate connection
    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'presence')[1];
      onCallback({ event: 'sync' });
    });

    expect(result.current.isConnected).toBe(true);
  });

  test('handles reconnection', () => {
    const { result } = renderHook(() => useRealtimeDashboard(), { wrapper });

    act(() => {
      result.current.reconnectAll();
    });

    expect(mockSupabaseContext.supabase.removeChannel).toHaveBeenCalled();
    expect(mockSupabaseContext.supabase.channel).toHaveBeenCalledTimes(2);
  });

  test('cleans up on unmount', () => {
    const { unmount } = renderHook(() => useRealtimeDashboard(), { wrapper });

    unmount();

    expect(mockSupabaseContext.supabase.removeChannel).toHaveBeenCalled();
  });
});

describe('useRealtimeNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with empty notifications', () => {
    const { result } = renderHook(() => useRealtimeNotifications(), { wrapper });

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('receives new notifications', () => {
    const { result } = renderHook(() => useRealtimeNotifications(), { wrapper });

    const mockNotification = {
      id: '1',
      title: 'New Book Added',
      message: 'A new book has been added to the library',
      type: 'info',
      created_at: new Date().toISOString(),
      read: false
    };

    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'postgres_changes')[1];
      onCallback({
        eventType: 'INSERT',
        new: mockNotification,
        old: null,
        schema: 'public',
        table: 'notifications'
      });
    });

    expect(result.current.notifications).toContain(mockNotification);
    expect(result.current.unreadCount).toBe(1);
  });

  test('marks notification as read', () => {
    const { result } = renderHook(() => useRealtimeNotifications(), { wrapper });

    const mockNotification = {
      id: '1',
      title: 'Test',
      message: 'Test message',
      type: 'info',
      created_at: new Date().toISOString(),
      read: false
    };

    // Add notification first
    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'postgres_changes')[1];
      onCallback({
        eventType: 'INSERT',
        new: mockNotification,
        old: null,
        schema: 'public',
        table: 'notifications'
      });
    });

    // Mark as read
    act(() => {
      result.current.markAsRead('1');
    });

    const updatedNotification = result.current.notifications.find(n => n.id === '1');
    expect(updatedNotification?.read).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  test('marks all notifications as read', () => {
    const { result } = renderHook(() => useRealtimeNotifications(), { wrapper });

    // Add multiple notifications
    const notifications = [
      { id: '1', title: 'Test 1', message: 'Message 1', type: 'info', created_at: new Date().toISOString(), read: false },
      { id: '2', title: 'Test 2', message: 'Message 2', type: 'warning', created_at: new Date().toISOString(), read: false }
    ];

    notifications.forEach(notification => {
      act(() => {
        const channelMock = mockSupabaseContext.supabase.channel();
        const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'postgres_changes')[1];
        onCallback({
          eventType: 'INSERT',
          new: notification,
          old: null,
          schema: 'public',
          table: 'notifications'
        });
      });
    });

    expect(result.current.unreadCount).toBe(2);

    // Mark all as read
    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications.every(n => n.read)).toBe(true);
  });

  test('deletes notification', () => {
    const { result } = renderHook(() => useRealtimeNotifications(), { wrapper });

    const mockNotification = {
      id: '1',
      title: 'Test',
      message: 'Test message',
      type: 'info',
      created_at: new Date().toISOString(),
      read: false
    };

    // Add notification
    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'postgres_changes')[1];
      onCallback({
        eventType: 'INSERT',
        new: mockNotification,
        old: null,
        schema: 'public',
        table: 'notifications'
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    // Delete notification
    act(() => {
      result.current.deleteNotification('1');
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});

describe('useRealtimeActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with empty activities', () => {
    const { result } = renderHook(() => useRealtimeActivity(), { wrapper });

    expect(result.current.activities).toEqual([]);
    expect(typeof result.current.clearActivities).toBe('function');
  });

  test('receives new activities', () => {
    const { result } = renderHook(() => useRealtimeActivity(), { wrapper });

    const mockActivity = {
      id: '1',
      type: 'book_added',
      message: 'New book "Sahih Bukhari" added',
      timestamp: new Date(),
      icon: 'book',
      user_id: 'admin-user'
    };

    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'broadcast')[1];
      onCallback({
        type: 'broadcast',
        event: 'activity',
        payload: mockActivity
      });
    });

    expect(result.current.activities).toContain(mockActivity);
  });

  test('limits activity history', () => {
    const { result } = renderHook(() => useRealtimeActivity({ maxActivities: 2 }), { wrapper });

    // Add 3 activities
    for (let i = 1; i <= 3; i++) {
      act(() => {
        const channelMock = mockSupabaseContext.supabase.channel();
        const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'broadcast')[1];
        onCallback({
          type: 'broadcast',
          event: 'activity',
          payload: {
            id: i.toString(),
            type: 'test',
            message: `Activity ${i}`,
            timestamp: new Date(),
            icon: 'test'
          }
        });
      });
    }

    expect(result.current.activities).toHaveLength(2);
    expect(result.current.activities[0].id).toBe('3'); // Most recent first
  });

  test('clears activities', () => {
    const { result } = renderHook(() => useRealtimeActivity(), { wrapper });

    // Add activity
    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'broadcast')[1];
      onCallback({
        type: 'broadcast',
        event: 'activity',
        payload: {
          id: '1',
          type: 'test',
          message: 'Test activity',
          timestamp: new Date(),
          icon: 'test'
        }
      });
    });

    expect(result.current.activities).toHaveLength(1);

    // Clear activities
    act(() => {
      result.current.clearActivities();
    });

    expect(result.current.activities).toHaveLength(0);
  });
});

describe('useRealtimePresence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with empty presence', () => {
    const { result } = renderHook(() => useRealtimePresence(), { wrapper });

    expect(result.current.onlineUsers).toEqual([]);
    expect(result.current.isOnline).toBe(false);
  });

  test('tracks user presence', () => {
    const { result } = renderHook(() => useRealtimePresence(), { wrapper });

    const mockPresence = {
      'user-1': [
        {
          user_id: 'user-1',
          email: 'user1@test.com',
          full_name: 'User One',
          role: 'student',
          online_at: new Date().toISOString()
        }
      ]
    };

    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'presence')[1];
      onCallback({ event: 'sync', currentPresences: mockPresence });
    });

    expect(result.current.onlineUsers).toHaveLength(1);
    expect(result.current.onlineUsers[0].user_id).toBe('user-1');
  });

  test('handles user join', () => {
    const { result } = renderHook(() => useRealtimePresence(), { wrapper });

    const newUser = {
      user_id: 'user-2',
      email: 'user2@test.com',
      full_name: 'User Two',
      role: 'teacher',
      online_at: new Date().toISOString()
    };

    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'presence')[1];
      onCallback({ event: 'join', newPresences: { 'user-2': [newUser] } });
    });

    expect(result.current.onlineUsers).toContain(newUser);
  });

  test('handles user leave', () => {
    const { result } = renderHook(() => useRealtimePresence(), { wrapper });

    // First add a user
    const user = {
      user_id: 'user-1',
      email: 'user1@test.com',
      full_name: 'User One',
      role: 'student',
      online_at: new Date().toISOString()
    };

    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'presence')[1];
      onCallback({ event: 'join', newPresences: { 'user-1': [user] } });
    });

    expect(result.current.onlineUsers).toHaveLength(1);

    // Then remove the user
    act(() => {
      const channelMock = mockSupabaseContext.supabase.channel();
      const onCallback = channelMock.on.mock.calls.find(call => call[0] === 'presence')[1];
      onCallback({ event: 'leave', leftPresences: { 'user-1': [user] } });
    });

    expect(result.current.onlineUsers).toHaveLength(0);
  });
});
