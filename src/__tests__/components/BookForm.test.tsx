import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BookForm } from '../../components/forms/BookForm';
import { SupabaseProvider } from '../../context/SupabaseContext';
import { mockBook } from '../../test/setup';
import { vi } from 'vitest';

const mockSupabaseContext = {
  state: {
    user: { id: 'test-user', email: 'admin@test.com' },
    profile: { full_name: 'Test Admin', role: 'admin' },
    books: [],
    isLoading: false,
    error: null
  },
  addBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn()
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SupabaseProvider value={mockSupabaseContext as any}>
        {component}
      </SupabaseProvider>
    </BrowserRouter>
  );
};

describe('BookForm', () => {
  const user = userEvent.setup();
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders form fields correctly for new book', () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/isbn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pages/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publisher/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publication year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/featured book/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/available/i)).toBeInTheDocument();
  });

  test('renders form with initial data for editing', () => {
    renderWithProviders(
      <BookForm 
        initialData={mockBook}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByDisplayValue(mockBook.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockBook.author)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockBook.isbn)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/author is required/i)).toBeInTheDocument();
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates ISBN format', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const isbnInput = screen.getByLabelText(/isbn/i);
    await user.type(isbnInput, 'invalid-isbn');

    const submitButton = screen.getByRole('button', { name: /add book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid isbn format/i)).toBeInTheDocument();
    });
  });

  test('validates publication year', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const yearInput = screen.getByLabelText(/publication year/i);
    await user.type(yearInput, '2050');

    const submitButton = screen.getByRole('button', { name: /add book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/publication year cannot be in the future/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    // Fill in required fields
    await user.type(screen.getByLabelText(/title/i), 'Test Book');
    await user.type(screen.getByLabelText(/author/i), 'Test Author');
    await user.selectOptions(screen.getByLabelText(/category/i), 'quran');
    await user.type(screen.getByLabelText(/isbn/i), '978-0123456789');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.selectOptions(screen.getByLabelText(/language/i), 'english');
    await user.type(screen.getByLabelText(/pages/i), '200');
    await user.type(screen.getByLabelText(/publisher/i), 'Test Publisher');
    await user.type(screen.getByLabelText(/publication year/i), '2023');

    const submitButton = screen.getByRole('button', { name: /add book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Book',
        author: 'Test Author',
        category: 'quran',
        isbn: '978-0123456789',
        description: 'Test description',
        language: 'english',
        pages: 200,
        publisher: 'Test Publisher',
        publication_year: 2023,
        is_featured: false,
        is_available: true
      });
    });
  });

  test('handles cancel button click', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('shows loading state', () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /adding.../i })).toBeDisabled();
  });

  test('handles Islamic categories correctly', () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    
    // Check that Islamic categories are available
    expect(screen.getByRole('option', { name: /quran/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /hadith/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /fiqh/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /tafsir/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /seerah/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /aqeedah/i })).toBeInTheDocument();
  });

  test('auto-saves form data', async () => {
    const mockAutoSave = vi.fn();
    
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
        autoSave={true}
        onAutoSave={mockAutoSave}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test');

    // Wait for auto-save debounce
    await waitFor(() => {
      expect(mockAutoSave).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  test('handles form reset', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test Book');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(titleInput).toHaveValue('');
  });

  test('displays character count for description', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'Test description');

    expect(screen.getByText(/16 \/ 1000/)).toBeInTheDocument();
  });

  test('handles keyboard shortcuts', async () => {
    renderWithProviders(
      <BookForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    // Test Ctrl+S for save
    await user.keyboard('{Control>}s{/Control}');
    
    // Should trigger form submission if valid
    // (This would need proper form validation to work)
  });
});
