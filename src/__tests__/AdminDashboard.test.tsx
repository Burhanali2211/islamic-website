import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { SupabaseProvider } from '../context/SupabaseContext';
import '@testing-library/jest-dom';

// Mock the Supabase context
const mockSupabaseContext = {
  state: {
    user: {
      id: 'test-user-id',
      email: 'admin@test.com'
    },
    profile: {
      full_name: 'Test Admin',
      role: 'admin'
    },
    dashboardStats: {
      books: {
        total: 150,
        featured: 25,
        byCategory: {
          quran: 30,
          hadith: 25,
          fiqh: 20,
          tafsir: 15,
          history: 10,
          biography: 10,
          aqeedah: 8,
          seerah: 7,
          dua: 5,
          islamic_law: 20
        }
      },
      users: {
        total: 75,
        active: 60,
        byRole: {
          student: 50,
          teacher: 20,
          admin: 5
        }
      },
      borrowing: {
        totalActive: 45,
        totalOverdue: 8,
        totalReturned: 120,
        recentActivity: []
      },
      categories: {
        totalCategories: 10
      }
    },
    books: [],
    users: [],
    borrowingRecords: [],
    isLoading: false,
    error: null
  },
  loadDashboardStats: jest.fn(),
  loadBooks: jest.fn(),
  loadUsers: jest.fn(),
  loadBorrowingRecords: jest.fn()
};

// Mock the real-time hooks
jest.mock('../hooks/useRealTime', () => ({
  useRealtimeDashboard: () => ({
    isConnected: true,
    hasError: false,
    lastUpdate: new Date(),
    reconnectAll: jest.fn()
  }),
  useRealtimeNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    isConnected: true,
    isConnecting: false,
    error: null,
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    reconnect: jest.fn()
  }),
  useRealtimeActivity: () => ({
    activities: [
      {
        id: '1',
        type: 'book_added',
        message: 'New book "Sahih Bukhari" added to library',
        timestamp: new Date(),
        icon: 'book'
      },
      {
        id: '2',
        type: 'user_registered',
        message: 'New student "Ahmad Ali" registered',
        timestamp: new Date(),
        icon: 'user'
      }
    ],
    clearActivities: jest.fn()
  }),
  useRealtimePresence: () => ({
    onlineUsers: [
      {
        user_id: 'user1',
        email: 'admin@test.com',
        full_name: 'Test Admin',
        role: 'admin',
        online_at: new Date().toISOString()
      }
    ],
    isOnline: true
  })
}));

// Mock components that might cause issues in tests
jest.mock('../components/notifications/NotificationSystem', () => ({
  NotificationSystem: () => <div data-testid="notification-system">Notification System</div>
}));

jest.mock('../components/realtime/ActivityFeed', () => ({
  ActivityFeed: () => <div data-testid="activity-feed">Activity Feed</div>
}));

jest.mock('../components/realtime/OnlineUsers', () => ({
  OnlineUsers: () => <div data-testid="online-users">Online Users</div>
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SupabaseProvider value={mockSupabaseContext as any}>
        {component}
      </SupabaseProvider>
    </BrowserRouter>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard header correctly', () => {
    renderWithProviders(<AdminDashboard />);
    
    expect(screen.getByText(/Admin Dashboard/)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to IDARAH WALI UL ASER Islamic Library Management System/)).toBeInTheDocument();
  });

  test('displays dashboard statistics cards', () => {
    renderWithProviders(<AdminDashboard />);
    
    // Check for stats cards
    expect(screen.getByText('Total Books')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Active Borrowings')).toBeInTheDocument();
    expect(screen.getByText('Overdue Books')).toBeInTheDocument();
    
    // Check for actual numbers
    expect(screen.getByText('150')).toBeInTheDocument(); // Total books
    expect(screen.getByText('75')).toBeInTheDocument();  // Total users
    expect(screen.getByText('50')).toBeInTheDocument();  // Students
    expect(screen.getByText('20')).toBeInTheDocument();  // Teachers
    expect(screen.getByText('45')).toBeInTheDocument();  // Active borrowings
    expect(screen.getByText('8')).toBeInTheDocument();   // Overdue books
  });

  test('displays quick action buttons', () => {
    renderWithProviders(<AdminDashboard />);
    
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
  });

  test('shows real-time components', () => {
    renderWithProviders(<AdminDashboard />);
    
    expect(screen.getByTestId('notification-system')).toBeInTheDocument();
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
    expect(screen.getByTestId('online-users')).toBeInTheDocument();
  });

  test('displays real-time status bar', () => {
    renderWithProviders(<AdminDashboard />);
    
    expect(screen.getByText(/Real-time Status: Connected/)).toBeInTheDocument();
  });

  test('refresh button works correctly', async () => {
    renderWithProviders(<AdminDashboard />);
    
    const refreshButton = screen.getByTitle('Refresh dashboard data');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(mockSupabaseContext.loadDashboardStats).toHaveBeenCalled();
      expect(mockSupabaseContext.loadBooks).toHaveBeenCalled();
      expect(mockSupabaseContext.loadUsers).toHaveBeenCalled();
      expect(mockSupabaseContext.loadBorrowingRecords).toHaveBeenCalled();
    });
  });

  test('auto-refresh toggle works', () => {
    renderWithProviders(<AdminDashboard />);
    
    const autoRefreshButton = screen.getByTitle(/Auto-refresh/);
    fireEvent.click(autoRefreshButton);
    
    expect(screen.getByText('Auto-refresh OFF')).toBeInTheDocument();
  });

  test('real-time panel toggle works', () => {
    renderWithProviders(<AdminDashboard />);
    
    const toggleButton = screen.getByText('Hide Real-time Panel');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Show Real-time Panel')).toBeInTheDocument();
  });

  test('handles loading state correctly', () => {
    const loadingContext = {
      ...mockSupabaseContext,
      state: {
        ...mockSupabaseContext.state,
        isLoading: true
      }
    };

    render(
      <BrowserRouter>
        <SupabaseProvider value={loadingContext as any}>
          <AdminDashboard />
        </SupabaseProvider>
      </BrowserRouter>
    );

    // Should show loading indicators
    expect(screen.getByText('Refreshing...')).toBeInTheDocument();
  });

  test('handles error state correctly', () => {
    const errorContext = {
      ...mockSupabaseContext,
      state: {
        ...mockSupabaseContext.state,
        error: 'Failed to load data'
      }
    };

    render(
      <BrowserRouter>
        <SupabaseProvider value={errorContext as any}>
          <AdminDashboard />
        </SupabaseProvider>
      </BrowserRouter>
    );

    // Should handle error gracefully
    expect(screen.getByText(/Admin Dashboard/)).toBeInTheDocument();
  });

  test('stats cards have correct trend indicators', () => {
    renderWithProviders(<AdminDashboard />);
    
    // Check for trend indicators (+ or - percentages)
    expect(screen.getByText('+12%')).toBeInTheDocument(); // Books trend
    expect(screen.getByText('+8%')).toBeInTheDocument();  // Users trend
    expect(screen.getByText('+15%')).toBeInTheDocument(); // Students trend
    expect(screen.getByText('-2%')).toBeInTheDocument();  // Overdue trend (negative is good)
  });

  test('quick action cards are clickable and have correct links', () => {
    renderWithProviders(<AdminDashboard />);
    
    const addBookButton = screen.getByText('Add New Book').closest('a');
    const manageUsersButton = screen.getByText('Manage Users').closest('a');
    const viewReportsButton = screen.getByText('View Reports').closest('a');
    const systemSettingsButton = screen.getByText('System Settings').closest('a');
    
    expect(addBookButton).toHaveAttribute('href', '/admin/books');
    expect(manageUsersButton).toHaveAttribute('href', '/admin/users');
    expect(viewReportsButton).toHaveAttribute('href', '/admin/reports');
    expect(systemSettingsButton).toHaveAttribute('href', '/admin/settings');
  });

  test('responsive design elements are present', () => {
    renderWithProviders(<AdminDashboard />);
    
    // Check for responsive grid classes
    const statsGrid = screen.getByText('Total Books').closest('.grid');
    expect(statsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    
    const actionsGrid = screen.getByText('Add New Book').closest('.grid');
    expect(actionsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  test('accessibility features are implemented', () => {
    renderWithProviders(<AdminDashboard />);
    
    // Check for proper headings
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for button accessibility
    const refreshButton = screen.getByTitle('Refresh dashboard data');
    expect(refreshButton).toHaveAttribute('title');
    
    // Check for proper link text
    const addBookLink = screen.getByRole('link', { name: /Add New Book/ });
    expect(addBookLink).toBeInTheDocument();
  });

  test('dark mode classes are applied', () => {
    renderWithProviders(<AdminDashboard />);
    
    // Check for dark mode classes
    const mainContainer = screen.getByText(/Admin Dashboard/).closest('div');
    expect(mainContainer).toHaveClass('dark:bg-gray-800');
  });

  test('animation classes are present', () => {
    renderWithProviders(<AdminDashboard />);
    
    // Check for motion/animation elements
    const animatedElements = document.querySelectorAll('[style*="opacity"]');
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});
