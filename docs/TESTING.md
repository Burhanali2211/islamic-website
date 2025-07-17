# Testing Guide

## Overview

This guide covers the comprehensive testing strategy for the IDARAH WALI UL ASER Islamic Library Management System. The testing approach ensures reliability, security, and cultural appropriateness of all features.

## Testing Philosophy

### Core Principles
1. **Comprehensive Coverage**: All critical paths and edge cases are tested
2. **Cultural Sensitivity**: Tests verify appropriate Islamic terminology and context
3. **Security First**: Authentication and authorization are thoroughly tested
4. **Real-world Scenarios**: Tests simulate actual user workflows
5. **Performance Awareness**: Tests include performance and accessibility checks

## Testing Stack

### Testing Framework
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers
- **@faker-js/faker**: Test data generation

### Test Types
1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Component interactions and API calls
3. **End-to-End Tests**: Complete user workflows
4. **Performance Tests**: Load and response time testing
5. **Accessibility Tests**: WCAG compliance verification

## Test Structure

### Directory Organization
```
src/__tests__/
├── components/          # Component tests
│   ├── forms/          # Form component tests
│   ├── dashboard/      # Dashboard component tests
│   ├── search/         # Search component tests
│   └── ui/            # UI component tests
├── hooks/              # Custom hook tests
├── services/           # Service layer tests
├── utils/              # Utility function tests
├── integration/        # Integration tests
└── e2e/               # End-to-end tests
```

### Test File Naming
- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Service tests: `serviceName.test.ts`
- Utility tests: `utilityName.test.ts`
- Integration tests: `feature.integration.test.ts`

## Running Tests

### Basic Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm run test BookForm.test.tsx

# Run tests matching pattern
npm run test -- --grep "authentication"
```

### Test Configuration

**vitest.config.ts**
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

## Unit Testing

### Component Testing

**Example: BookForm Component**
```typescript
describe('BookForm', () => {
  test('renders all form fields', () => {
    render(<BookForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  test('validates Islamic categories', async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    
    const categorySelect = screen.getByLabelText(/category/i);
    
    // Test valid Islamic categories
    await user.selectOptions(categorySelect, 'quran');
    expect(screen.getByDisplayValue('quran')).toBeInTheDocument();
    
    await user.selectOptions(categorySelect, 'hadith');
    expect(screen.getByDisplayValue('hadith')).toBeInTheDocument();
  });

  test('validates ISBN format', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    
    render(<BookForm onSubmit={mockSubmit} onCancel={jest.fn()} />);
    
    // Test invalid ISBN
    await user.type(screen.getByLabelText(/isbn/i), 'invalid-isbn');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/invalid isbn format/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

### Service Testing

**Example: Authentication Service**
```typescript
describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('signs up user with Islamic name validation', async () => {
    const userData = {
      email: 'ahmad@example.com',
      password: 'SecurePass123!',
      full_name: 'Ahmad ibn Abdullah',
      role: 'student'
    };

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    const result = await authService.signUp(userData);

    expect(result.data?.user).toBeDefined();
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role
        }
      }
    });
  });

  test('handles authentication errors gracefully', async () => {
    const mockError = { message: 'Invalid credentials' };
    
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    });

    const result = await authService.signIn({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });

    expect(result.error).toEqual(mockError);
    expect(result.data).toBeNull();
  });
});
```

### Hook Testing

**Example: useRealTime Hook**
```typescript
describe('useRealtimeDashboard', () => {
  test('establishes connection on mount', () => {
    renderHook(() => useRealtimeDashboard(), { wrapper });

    expect(mockSupabase.channel).toHaveBeenCalledWith('dashboard-updates');
  });

  test('handles connection state changes', () => {
    const { result } = renderHook(() => useRealtimeDashboard(), { wrapper });

    act(() => {
      // Simulate connection event
      const channelMock = mockSupabase.channel();
      const onCallback = channelMock.on.mock.calls[0][2];
      onCallback({ event: 'sync' });
    });

    expect(result.current.isConnected).toBe(true);
  });
});
```

## Integration Testing

### Database Integration

**Example: Complete Book Management Flow**
```typescript
describe('Book Management Integration', () => {
  test('complete book lifecycle', async () => {
    // Create book
    const newBook = {
      title: 'Sahih Muslim',
      author: 'Imam Muslim',
      category: 'hadith',
      isbn: '978-0123456789'
    };

    mockSupabase.from().insert().select().single.mockResolvedValue({
      data: { ...mockBook, ...newBook, id: 'new-book-id' },
      error: null
    });

    const createResult = await booksService.createBook(newBook);
    expect(createResult.data).toMatchObject(newBook);

    // Update book
    const updateData = { is_featured: true };
    mockSupabase.from().update().eq().select().single.mockResolvedValue({
      data: { ...createResult.data, ...updateData },
      error: null
    });

    const updateResult = await booksService.updateBook('new-book-id', updateData);
    expect(updateResult.data.is_featured).toBe(true);

    // Delete book
    mockSupabase.from().delete().eq().then.mockResolvedValue({
      data: null,
      error: null
    });

    const deleteResult = await booksService.deleteBook('new-book-id');
    expect(deleteResult.error).toBeNull();
  });
});
```

### Real-time Integration

**Example: Real-time Notifications**
```typescript
describe('Real-time Notifications Integration', () => {
  test('receives and processes notifications', async () => {
    const { result } = renderHook(() => useRealtimeNotifications(), { wrapper });

    const mockNotification = {
      id: '1',
      title: 'New Book Added',
      message: 'Tafsir Ibn Kathir has been added to the library',
      type: 'info',
      created_at: new Date().toISOString(),
      read: false
    };

    act(() => {
      // Simulate real-time notification
      const channelMock = mockSupabase.channel();
      const onCallback = channelMock.on.mock.calls[0][2];
      onCallback({
        eventType: 'INSERT',
        new: mockNotification,
        schema: 'public',
        table: 'notifications'
      });
    });

    expect(result.current.notifications).toContain(mockNotification);
    expect(result.current.unreadCount).toBe(1);
  });
});
```

## End-to-End Testing

### User Workflow Testing

**Example: Complete Borrowing Workflow**
```typescript
describe('Book Borrowing E2E', () => {
  test('student can borrow and return book', async () => {
    // Login as student
    render(<App />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'student@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Navigate to library
    await userEvent.click(screen.getByText(/library/i));

    // Search for book
    await userEvent.type(screen.getByLabelText(/search/i), 'Sahih Bukhari');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    // Borrow book
    await userEvent.click(screen.getByText(/borrow/i));
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

    // Verify borrowing success
    expect(screen.getByText(/book borrowed successfully/i)).toBeInTheDocument();

    // Navigate to borrowing history
    await userEvent.click(screen.getByText(/my books/i));

    // Return book
    await userEvent.click(screen.getByText(/return/i));
    await userEvent.click(screen.getByRole('button', { name: /confirm return/i }));

    // Verify return success
    expect(screen.getByText(/book returned successfully/i)).toBeInTheDocument();
  });
});
```

## Performance Testing

### Load Testing

**Example: Search Performance**
```typescript
describe('Search Performance', () => {
  test('search completes within acceptable time', async () => {
    const startTime = performance.now();
    
    const searchResults = await booksService.searchBooks({
      query: 'Islamic',
      category: 'all'
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(500); // 500ms threshold
    expect(searchResults.data).toBeDefined();
  });

  test('handles large result sets efficiently', async () => {
    const largeResultSet = Array(1000).fill(mockBook);
    
    mockSupabase.from().select().then.mockResolvedValue({
      data: largeResultSet,
      error: null
    });

    const startTime = performance.now();
    render(<BookGrid books={largeResultSet} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## Accessibility Testing

### WCAG Compliance

**Example: Keyboard Navigation**
```typescript
describe('Accessibility', () => {
  test('form is keyboard navigable', async () => {
    render(<BookForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    const titleInput = screen.getByLabelText(/title/i);
    const authorInput = screen.getByLabelText(/author/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Test tab navigation
    titleInput.focus();
    await userEvent.tab();
    expect(authorInput).toHaveFocus();

    await userEvent.tab();
    // Continue through all form elements
    
    // Test form submission with Enter
    titleInput.focus();
    await userEvent.type(titleInput, 'Test Book');
    await userEvent.keyboard('{Enter}');
    
    // Should focus next field, not submit
    expect(authorInput).toHaveFocus();
  });

  test('has proper ARIA labels', () => {
    render(<BookForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByLabelText(/title/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('aria-describedby');
  });
});
```

## Security Testing

### Input Validation

**Example: XSS Prevention**
```typescript
describe('Security', () => {
  test('sanitizes user input', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert');
  });

  test('validates authentication tokens', async () => {
    const invalidToken = 'invalid.jwt.token';
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid JWT' }
    });

    const result = await authService.validateSession();
    expect(result.data?.isValid).toBe(false);
  });
});
```

## Test Data Management

### Mock Data Factory

**Example: Islamic Book Data**
```typescript
export const createMockBook = (overrides = {}) => ({
  id: faker.string.uuid(),
  title: faker.helpers.arrayElement([
    'Sahih Bukhari',
    'Sahih Muslim',
    'Tafsir Ibn Kathir',
    'Riyadh as-Salihin'
  ]),
  author: faker.helpers.arrayElement([
    'Imam Bukhari',
    'Imam Muslim',
    'Ibn Kathir',
    'Imam Nawawi'
  ]),
  category: faker.helpers.arrayElement([
    'quran', 'hadith', 'fiqh', 'tafsir', 'seerah'
  ]),
  isbn: faker.helpers.replaceSymbols('978-#-###-#####-#'),
  language: faker.helpers.arrayElement(['arabic', 'english', 'urdu']),
  is_available: faker.datatype.boolean(),
  is_featured: faker.datatype.boolean(),
  created_at: faker.date.past().toISOString(),
  ...overrides
});
```

## Continuous Integration

### GitHub Actions

**Example: Test Workflow**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run type checking
      run: npx tsc --noEmit
      
    - name: Run tests
      run: npm run test:coverage
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

## Test Coverage Goals

### Coverage Targets
- **Statements**: 85%
- **Branches**: 80%
- **Functions**: 85%
- **Lines**: 85%

### Critical Path Coverage
- Authentication flows: 100%
- Data validation: 100%
- Security functions: 100%
- Core business logic: 95%

## Best Practices

### Writing Effective Tests
1. **Descriptive Names**: Test names should clearly describe what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
3. **Single Responsibility**: Each test should verify one specific behavior
4. **Independent Tests**: Tests should not depend on each other
5. **Realistic Data**: Use realistic test data that reflects actual usage

### Islamic Context Testing
1. **Terminology Validation**: Verify correct Islamic terms are used
2. **Cultural Sensitivity**: Test for appropriate cultural context
3. **Arabic Text Support**: Ensure proper handling of Arabic text
4. **Calendar Integration**: Test Hijri date calculations and conversions
5. **Prayer Time Accuracy**: Verify prayer time calculations

### Debugging Tests
```bash
# Run tests in debug mode
npm run test -- --inspect-brk

# Run specific test with verbose output
npm run test -- --verbose BookForm.test.tsx

# Run tests with DOM debugging
npm run test -- --environment jsdom-debug
```

## Conclusion

This comprehensive testing strategy ensures the IDARAH WALI UL ASER Islamic Library Management System meets the highest standards of quality, security, and cultural appropriateness. Regular testing and continuous improvement of the test suite are essential for maintaining system reliability and user trust.
