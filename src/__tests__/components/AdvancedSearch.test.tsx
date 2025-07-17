import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdvancedSearch } from '../../components/search/AdvancedSearch';
import { SupabaseProvider } from '../../context/SupabaseContext';
import { vi } from 'vitest';

const mockSupabaseContext = {
  state: {
    user: { id: 'test-user', email: 'user@test.com' },
    profile: { full_name: 'Test User', role: 'student' },
    books: [
      {
        id: '1',
        title: 'Sahih Bukhari',
        author: 'Imam Bukhari',
        category: 'hadith',
        language: 'arabic',
        publication_year: 850,
        is_available: true
      },
      {
        id: '2',
        title: 'Tafsir Ibn Kathir',
        author: 'Ibn Kathir',
        category: 'tafsir',
        language: 'arabic',
        publication_year: 1365,
        is_available: true
      }
    ],
    isLoading: false,
    error: null
  },
  searchBooks: vi.fn(),
  loadBooks: vi.fn()
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

describe('AdvancedSearch', () => {
  const user = userEvent.setup();
  const mockOnSearch = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders search form with all fields', () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/search query/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publication year from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publication year to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/available only/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/featured only/i)).toBeInTheDocument();
  });

  test('performs basic text search', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const searchInput = screen.getByLabelText(/search query/i);
    await user.type(searchInput, 'Bukhari');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      query: 'Bukhari',
      category: '',
      author: '',
      language: '',
      yearFrom: '',
      yearTo: '',
      availableOnly: false,
      featuredOnly: false
    });
  });

  test('performs category-based search', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'hadith');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'hadith'
      })
    );
  });

  test('performs year range search', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const yearFromInput = screen.getByLabelText(/publication year from/i);
    const yearToInput = screen.getByLabelText(/publication year to/i);

    await user.type(yearFromInput, '800');
    await user.type(yearToInput, '900');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        yearFrom: '800',
        yearTo: '900'
      })
    );
  });

  test('validates year range', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const yearFromInput = screen.getByLabelText(/publication year from/i);
    const yearToInput = screen.getByLabelText(/publication year to/i);

    await user.type(yearFromInput, '2000');
    await user.type(yearToInput, '1000');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/from year cannot be greater than to year/i)).toBeInTheDocument();
    });

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('handles available only filter', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const availableCheckbox = screen.getByLabelText(/available only/i);
    await user.click(availableCheckbox);

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        availableOnly: true
      })
    );
  });

  test('handles featured only filter', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const featuredCheckbox = screen.getByLabelText(/featured only/i);
    await user.click(featuredCheckbox);

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        featuredOnly: true
      })
    );
  });

  test('clears search form', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    // Fill in some fields
    const searchInput = screen.getByLabelText(/search query/i);
    await user.type(searchInput, 'test');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'hadith');

    // Clear the form
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(categorySelect).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalled();
  });

  test('shows loading state', () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /searching.../i })).toBeDisabled();
  });

  test('handles keyboard shortcuts', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    const searchInput = screen.getByLabelText(/search query/i);
    await user.type(searchInput, 'test');

    // Test Enter key for search
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalled();
  });

  test('displays search suggestions', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
        showSuggestions={true}
      />
    );

    const searchInput = screen.getByLabelText(/search query/i);
    await user.type(searchInput, 'Buk');

    await waitFor(() => {
      expect(screen.getByText(/Bukhari/i)).toBeInTheDocument();
    });
  });

  test('handles search history', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
        showHistory={true}
      />
    );

    // Perform a search
    const searchInput = screen.getByLabelText(/search query/i);
    await user.type(searchInput, 'Bukhari');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    // Check if search is added to history
    expect(screen.getByText(/recent searches/i)).toBeInTheDocument();
  });

  test('exports search results', async () => {
    const mockExport = vi.fn();
    
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        onExport={mockExport}
        isLoading={false}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export results/i });
    await user.click(exportButton);

    expect(mockExport).toHaveBeenCalled();
  });

  test('handles complex search combinations', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
      />
    );

    // Fill multiple fields
    await user.type(screen.getByLabelText(/search query/i), 'Islamic');
    await user.selectOptions(screen.getByLabelText(/category/i), 'fiqh');
    await user.type(screen.getByLabelText(/author/i), 'Ibn');
    await user.selectOptions(screen.getByLabelText(/language/i), 'arabic');
    await user.click(screen.getByLabelText(/available only/i));

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      query: 'Islamic',
      category: 'fiqh',
      author: 'Ibn',
      language: 'arabic',
      yearFrom: '',
      yearTo: '',
      availableOnly: true,
      featuredOnly: false
    });
  });

  test('handles search result count display', async () => {
    renderWithProviders(
      <AdvancedSearch 
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        isLoading={false}
        resultCount={25}
      />
    );

    expect(screen.getByText(/25 results found/i)).toBeInTheDocument();
  });
});
