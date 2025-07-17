# Component Documentation

## Overview

This document provides detailed information about the React components used in the IDARAH WALI UL ASER Islamic Library Management System. All components are built with TypeScript and follow modern React patterns.

## Component Architecture

### Design Principles
- **Atomic Design**: Components are organized in a hierarchical structure
- **Reusability**: Components are designed to be reusable across different contexts
- **Type Safety**: All components use TypeScript for type safety
- **Accessibility**: Components follow WCAG guidelines
- **Islamic Context**: Components use appropriate Islamic terminology and cultural sensitivity

### Component Categories

1. **UI Components** (`src/components/ui/`): Basic building blocks
2. **Form Components** (`src/components/forms/`): Form-related components
3. **Dashboard Components** (`src/components/dashboard/`): Dashboard-specific components
4. **Search Components** (`src/components/search/`): Search functionality
5. **Real-time Components** (`src/components/realtime/`): Real-time features
6. **Notification Components** (`src/components/notifications/`): Notification system

## Core Components

### BookForm

**Location**: `src/components/forms/BookForm.tsx`

A comprehensive form component for creating and editing book records.

**Props:**
```typescript
interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  autoSave?: boolean;
  onAutoSave?: (data: Partial<BookFormData>) => void;
}
```

**Features:**
- Form validation with Zod schema
- Auto-save functionality
- Islamic category selection
- ISBN validation
- Character count for description
- Keyboard shortcuts support

**Usage:**
```tsx
<BookForm
  initialData={book}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={isSubmitting}
  autoSave={true}
/>
```

### AdvancedSearch

**Location**: `src/components/search/AdvancedSearch.tsx`

Advanced search component with multiple filter options for books.

**Props:**
```typescript
interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
  onClear: () => void;
  isLoading?: boolean;
  showSuggestions?: boolean;
  showHistory?: boolean;
  resultCount?: number;
  onExport?: () => void;
}
```

**Features:**
- Multi-criteria search (title, author, category, language, year range)
- Search suggestions
- Search history
- Export functionality
- Keyboard shortcuts
- Real-time validation

**Usage:**
```tsx
<AdvancedSearch
  onSearch={handleSearch}
  onClear={handleClear}
  isLoading={searching}
  showSuggestions={true}
  resultCount={results.length}
/>
```

### DashboardLayout

**Location**: `src/components/DashboardLayout.tsx`

Main layout component for the admin dashboard with sidebar navigation.

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

**Features:**
- Responsive sidebar navigation
- User menu with profile options
- Breadcrumb navigation
- Real-time status indicators
- Islamic design elements

### NotificationSystem

**Location**: `src/components/notifications/NotificationSystem.tsx`

Real-time notification system for displaying alerts and updates.

**Props:**
```typescript
interface NotificationSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  autoHide?: boolean;
  hideDelay?: number;
}
```

**Features:**
- Real-time notifications via Supabase
- Multiple notification types (info, success, warning, error)
- Auto-hide functionality
- Sound notifications (optional)
- Notification history
- Mark as read functionality

### ActivityFeed

**Location**: `src/components/realtime/ActivityFeed.tsx`

Real-time activity feed showing system events and user actions.

**Props:**
```typescript
interface ActivityFeedProps {
  maxItems?: number;
  showUserActions?: boolean;
  showSystemEvents?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}
```

**Features:**
- Real-time activity updates
- Filterable activity types
- User action tracking
- System event monitoring
- Activity history
- Export functionality

### OnlineUsers

**Location**: `src/components/realtime/OnlineUsers.tsx`

Component displaying currently online users with presence tracking.

**Props:**
```typescript
interface OnlineUsersProps {
  showAvatars?: boolean;
  showRoles?: boolean;
  maxUsers?: number;
  layout?: 'list' | 'grid' | 'compact';
}
```

**Features:**
- Real-time presence tracking
- User role indicators
- Online status indicators
- User avatars
- Click to view profile

## Form Components

### UserForm

**Location**: `src/components/forms/UserForm.tsx`

Form component for creating and editing user accounts.

**Features:**
- Role selection (student, teacher, admin)
- Email validation
- Password strength indicator
- Phone number validation
- Islamic name validation

### BorrowingForm

**Location**: `src/components/forms/BorrowingForm.tsx`

Form for processing book borrowing requests.

**Features:**
- Book selection with search
- Due date calculation
- User selection (admin only)
- Availability checking
- Borrowing rules validation

## UI Components

### Button

**Location**: `src/components/ui/Button.tsx`

Reusable button component with multiple variants.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Modal

**Location**: `src/components/ui/Modal.tsx`

Modal dialog component for overlays and confirmations.

**Features:**
- Backdrop click to close
- Escape key to close
- Focus management
- Animation support
- Size variants

### Table

**Location**: `src/components/ui/Table.tsx`

Data table component with sorting, filtering, and pagination.

**Features:**
- Column sorting
- Row selection
- Pagination
- Search filtering
- Export functionality
- Responsive design

## Dashboard Components

### StatsCard

**Location**: `src/components/dashboard/StatsCard.tsx`

Statistical display card for dashboard metrics.

**Features:**
- Trend indicators
- Icon support
- Color variants
- Animation effects
- Click actions

### ChartContainer

**Location**: `src/components/dashboard/ChartContainer.tsx`

Container component for charts and graphs.

**Features:**
- Responsive charts
- Multiple chart types
- Data export
- Real-time updates
- Islamic color scheme

## Hooks Integration

### useRealTime

Components integrate with custom hooks for real-time functionality:

```tsx
const { isConnected, hasError, reconnectAll } = useRealtimeDashboard();
const { notifications, markAsRead } = useRealtimeNotifications();
const { activities, clearActivities } = useRealtimeActivity();
const { onlineUsers, isOnline } = useRealtimePresence();
```

### useAdvancedSearch

Search components use the advanced search hook:

```tsx
const {
  searchResults,
  isSearching,
  searchHistory,
  performSearch,
  clearSearch
} = useAdvancedSearch();
```

## Styling Guidelines

### Tailwind CSS Classes
- Use utility-first approach
- Follow Islamic design principles
- Maintain consistent spacing
- Use semantic color names

### Color Scheme
- Primary: Islamic green variants
- Secondary: Gold/amber accents
- Text: Dark grays for readability
- Background: Light neutrals

### Typography
- Use system fonts for performance
- Maintain proper hierarchy
- Support Arabic text direction
- Ensure readability

## Accessibility

### ARIA Labels
All interactive components include proper ARIA labels:

```tsx
<button
  aria-label="Add new book to library"
  aria-describedby="add-book-help"
>
  Add Book
</button>
```

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements are keyboard accessible
- Escape key closes modals and dropdowns
- Enter key submits forms

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Live regions for dynamic content

## Testing

### Component Testing
Each component includes comprehensive tests:

```typescript
describe('BookForm', () => {
  test('renders form fields correctly', () => {
    render(<BookForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    // Test validation logic
  });

  test('submits form with valid data', async () => {
    // Test form submission
  });
});
```

### Integration Testing
Components are tested in realistic scenarios:

```typescript
test('complete book creation workflow', async () => {
  render(<BookManagementPage />);
  
  // Open form
  fireEvent.click(screen.getByText('Add Book'));
  
  // Fill form
  await userEvent.type(screen.getByLabelText(/title/i), 'Test Book');
  
  // Submit
  fireEvent.click(screen.getByText('Save'));
  
  // Verify result
  await waitFor(() => {
    expect(screen.getByText('Book added successfully')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Lazy Loading
Large components are lazy-loaded:

```tsx
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
```

### Memoization
Components use React.memo for performance:

```tsx
export const BookCard = React.memo<BookCardProps>(({ book, onSelect }) => {
  // Component implementation
});
```

### Virtual Scrolling
Large lists use virtual scrolling for performance:

```tsx
<VirtualizedList
  items={books}
  itemHeight={80}
  renderItem={({ item }) => <BookCard book={item} />}
/>
```

## Best Practices

1. **Component Composition**: Prefer composition over inheritance
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Error Boundaries**: Wrap components in error boundaries
4. **Loading States**: Always handle loading and error states
5. **Accessibility**: Include ARIA labels and keyboard support
6. **Testing**: Write comprehensive tests for all components
7. **Documentation**: Document complex components with JSDoc
8. **Islamic Context**: Use appropriate terminology and cultural sensitivity

## Future Enhancements

- **Internationalization**: Add support for multiple languages
- **Theme System**: Implement dynamic theming
- **Component Library**: Extract components into a separate library
- **Storybook**: Add Storybook for component documentation
- **Performance Monitoring**: Add performance monitoring for components
