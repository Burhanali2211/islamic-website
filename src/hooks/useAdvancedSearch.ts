import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SearchOptions, 
  FilterCondition, 
  SortOption,
  createSearchParams,
  parseSearchParams,
  filterData,
  applySearchOptions
} from '../utils/searchUtils';
import { supabase } from '../lib/supabase';

export interface UseAdvancedSearchOptions<T> {
  data?: T[];
  tableName?: string;
  defaultSort?: SortOption[];
  defaultFilters?: FilterCondition[];
  pageSize?: number;
  enableUrlSync?: boolean;
  enableLocalStorage?: boolean;
  storageKey?: string;
}

export interface SearchState<T> {
  data: T[];
  filteredData: T[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchOptions: SearchOptions;
}

export interface SearchActions {
  search: (options: SearchOptions) => void;
  reset: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  addFilter: (filter: FilterCondition) => void;
  removeFilter: (index: number) => void;
  updateFilter: (index: number, updates: Partial<FilterCondition>) => void;
  addSort: (sort: SortOption) => void;
  removeSort: (index: number) => void;
  updateSort: (index: number, updates: Partial<SortOption>) => void;
  setSearchTerm: (term: string) => void;
}

export function useAdvancedSearch<T = any>(
  options: UseAdvancedSearchOptions<T> = {}
): SearchState<T> & SearchActions {
  const {
    data = [],
    tableName,
    defaultSort = [],
    defaultFilters = [],
    pageSize: initialPageSize = 20,
    enableUrlSync = true,
    enableLocalStorage = true,
    storageKey = 'advanced_search'
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize search options from URL or localStorage
  const initialSearchOptions = useMemo(() => {
    if (enableUrlSync && searchParams.toString()) {
      return parseSearchParams(searchParams);
    }
    
    if (enableLocalStorage) {
      const saved = localStorage.getItem(`${storageKey}_${tableName || 'default'}`);
      if (saved) {
        try {
          return JSON.parse(saved) as SearchOptions;
        } catch {
          // Ignore parsing errors
        }
      }
    }
    
    return {
      filters: defaultFilters,
      sort: defaultSort,
      pagination: { page: 1, pageSize: initialPageSize }
    };
  }, [searchParams, enableUrlSync, enableLocalStorage, storageKey, tableName, defaultFilters, defaultSort, initialPageSize]);

  // State
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(initialSearchOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredData, setFilteredData] = useState<T[]>([]);

  // Sync search options to URL
  useEffect(() => {
    if (enableUrlSync) {
      const params = createSearchParams(searchOptions);
      setSearchParams(params, { replace: true });
    }
  }, [searchOptions, enableUrlSync, setSearchParams]);

  // Sync search options to localStorage
  useEffect(() => {
    if (enableLocalStorage) {
      localStorage.setItem(
        `${storageKey}_${tableName || 'default'}`,
        JSON.stringify(searchOptions)
      );
    }
  }, [searchOptions, enableLocalStorage, storageKey, tableName]);

  // Perform search
  const performSearch = useCallback(async (options: SearchOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      if (tableName) {
        // Server-side search using Supabase
        let query = supabase.from(tableName).select('*', { count: 'exact' });
        
        // Apply search options to query
        query = applySearchOptions(query, options);
        
        const { data: result, error: queryError, count } = await query;
        
        if (queryError) {
          throw new Error(queryError.message);
        }
        
        setFilteredData(result || []);
        setTotalCount(count || 0);
      } else {
        // Client-side search using provided data
        const filtered = filterData(data, options);
        setFilteredData(filtered);
        setTotalCount(filtered.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setFilteredData([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [tableName, data]);

  // Execute search when options change
  useEffect(() => {
    performSearch(searchOptions);
  }, [searchOptions, performSearch]);

  // Actions
  const search = useCallback((options: SearchOptions) => {
    setSearchOptions({
      ...options,
      pagination: { page: 1, pageSize: searchOptions.pagination?.pageSize || initialPageSize }
    });
  }, [searchOptions.pagination?.pageSize, initialPageSize]);

  const reset = useCallback(() => {
    const resetOptions: SearchOptions = {
      filters: defaultFilters,
      sort: defaultSort,
      pagination: { page: 1, pageSize: initialPageSize }
    };
    setSearchOptions(resetOptions);
  }, [defaultFilters, defaultSort, initialPageSize]);

  const setPage = useCallback((page: number) => {
    setSearchOptions(prev => ({
      ...prev,
      pagination: { ...prev.pagination!, page }
    }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setSearchOptions(prev => ({
      ...prev,
      pagination: { page: 1, pageSize: size }
    }));
  }, []);

  const addFilter = useCallback((filter: FilterCondition) => {
    setSearchOptions(prev => ({
      ...prev,
      filters: [...(prev.filters || []), filter],
      pagination: { ...prev.pagination!, page: 1 }
    }));
  }, []);

  const removeFilter = useCallback((index: number) => {
    setSearchOptions(prev => ({
      ...prev,
      filters: prev.filters?.filter((_, i) => i !== index),
      pagination: { ...prev.pagination!, page: 1 }
    }));
  }, []);

  const updateFilter = useCallback((index: number, updates: Partial<FilterCondition>) => {
    setSearchOptions(prev => ({
      ...prev,
      filters: prev.filters?.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      ),
      pagination: { ...prev.pagination!, page: 1 }
    }));
  }, []);

  const addSort = useCallback((sort: SortOption) => {
    setSearchOptions(prev => ({
      ...prev,
      sort: [...(prev.sort || []), sort]
    }));
  }, []);

  const removeSort = useCallback((index: number) => {
    setSearchOptions(prev => ({
      ...prev,
      sort: prev.sort?.filter((_, i) => i !== index)
    }));
  }, []);

  const updateSort = useCallback((index: number, updates: Partial<SortOption>) => {
    setSearchOptions(prev => ({
      ...prev,
      sort: prev.sort?.map((sort, i) => 
        i === index ? { ...sort, ...updates } : sort
      )
    }));
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setSearchOptions(prev => ({
      ...prev,
      searchTerm: term || undefined,
      pagination: { ...prev.pagination!, page: 1 }
    }));
  }, []);

  return {
    // State
    data,
    filteredData,
    isLoading,
    error,
    totalCount,
    currentPage: searchOptions.pagination?.page || 1,
    pageSize: searchOptions.pagination?.pageSize || initialPageSize,
    searchOptions,
    
    // Actions
    search,
    reset,
    setPage,
    setPageSize,
    addFilter,
    removeFilter,
    updateFilter,
    addSort,
    removeSort,
    updateSort,
    setSearchTerm
  };
}

// Hook for managing saved searches
export function useSavedSearches(storageKey: string = 'saved_searches') {
  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string;
    name: string;
    options: SearchOptions;
    createdAt: string;
  }>>([]);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch {
        // Ignore parsing errors
      }
    }
  }, [storageKey]);

  // Save to localStorage when savedSearches changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(savedSearches));
  }, [savedSearches, storageKey]);

  const saveSearch = useCallback((name: string, options: SearchOptions) => {
    const newSearch = {
      id: `search_${Date.now()}`,
      name,
      options,
      createdAt: new Date().toISOString()
    };
    setSavedSearches(prev => [newSearch, ...prev]);
  }, []);

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  }, []);

  const updateSearch = useCallback((id: string, updates: { name?: string; options?: SearchOptions }) => {
    setSavedSearches(prev => prev.map(search => 
      search.id === id ? { ...search, ...updates } : search
    ));
  }, []);

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    updateSearch
  };
}

// Hook for search suggestions/autocomplete
export function useSearchSuggestions(
  tableName: string,
  field: string,
  searchTerm: string,
  enabled: boolean = true
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select(field)
          .ilike(field, `%${searchTerm}%`)
          .limit(10);

        if (error) throw error;

        const uniqueSuggestions = Array.from(
          new Set(data?.map(item => item[field]).filter(Boolean))
        ) as string[];

        setSuggestions(uniqueSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [tableName, field, searchTerm, enabled]);

  return { suggestions, isLoading };
}
