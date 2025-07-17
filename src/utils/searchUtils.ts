// Advanced search and filtering utilities
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

// Types for search and filter operations
export type FilterOperator = 
  | 'eq' // equals
  | 'neq' // not equals
  | 'gt' // greater than
  | 'gte' // greater than or equal
  | 'lt' // less than
  | 'lte' // less than or equal
  | 'like' // LIKE operator (case sensitive)
  | 'ilike' // ILIKE operator (case insensitive)
  | 'in' // IN operator
  | 'is' // IS operator
  | 'fts' // Full Text Search
  | 'cs' // Contains (for arrays)
  | 'cd' // Contained by (for arrays)
  | 'sl' // Starts with
  | 'sw' // Starts with (case insensitive)
  | 'ew' // Ends with
  | 'ew' // Ends with (case insensitive)
  | 'between'; // Between two values

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any; // For 'between' operator
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface SearchOptions {
  filters?: FilterCondition[];
  sort?: SortOption[];
  pagination?: PaginationOptions;
  searchTerm?: string;
  searchFields?: string[];
  fullTextSearch?: boolean;
  caseSensitive?: boolean;
}

// Apply filters to Supabase query
export function applyFilters<T>(
  query: PostgrestFilterBuilder<T>,
  filters: FilterCondition[]
): PostgrestFilterBuilder<T> {
  let filteredQuery = query;

  filters.forEach(filter => {
    const { field, operator, value, valueEnd } = filter;

    switch (operator) {
      case 'eq':
        filteredQuery = filteredQuery.eq(field, value);
        break;
      case 'neq':
        filteredQuery = filteredQuery.neq(field, value);
        break;
      case 'gt':
        filteredQuery = filteredQuery.gt(field, value);
        break;
      case 'gte':
        filteredQuery = filteredQuery.gte(field, value);
        break;
      case 'lt':
        filteredQuery = filteredQuery.lt(field, value);
        break;
      case 'lte':
        filteredQuery = filteredQuery.lte(field, value);
        break;
      case 'like':
        filteredQuery = filteredQuery.like(field, `%${value}%`);
        break;
      case 'ilike':
        filteredQuery = filteredQuery.ilike(field, `%${value}%`);
        break;
      case 'in':
        filteredQuery = filteredQuery.in(field, Array.isArray(value) ? value : [value]);
        break;
      case 'is':
        filteredQuery = filteredQuery.is(field, value);
        break;
      case 'fts':
        // Full text search
        filteredQuery = filteredQuery.textSearch(field, value, {
          type: 'websearch',
          config: 'english'
        });
        break;
      case 'cs':
        // Contains (for arrays)
        filteredQuery = filteredQuery.contains(field, value);
        break;
      case 'cd':
        // Contained by (for arrays)
        filteredQuery = filteredQuery.containedBy(field, value);
        break;
      case 'sl':
        // Starts with (case sensitive)
        filteredQuery = filteredQuery.like(field, `${value}%`);
        break;
      case 'sw':
        // Starts with (case insensitive)
        filteredQuery = filteredQuery.ilike(field, `${value}%`);
        break;
      case 'ew':
        // Ends with (case sensitive)
        filteredQuery = filteredQuery.like(field, `%${value}`);
        break;
      case 'ew':
        // Ends with (case insensitive)
        filteredQuery = filteredQuery.ilike(field, `%${value}`);
        break;
      case 'between':
        // Between two values
        if (valueEnd !== undefined) {
          filteredQuery = filteredQuery.gte(field, value).lte(field, valueEnd);
        }
        break;
    }
  });

  return filteredQuery;
}

// Apply sorting to Supabase query
export function applySorting<T>(
  query: PostgrestFilterBuilder<T>,
  sort: SortOption[]
): PostgrestFilterBuilder<T> {
  if (!sort || sort.length === 0) {
    return query;
  }

  // Convert sort options to format expected by Supabase
  const orderBy = sort.map(option => {
    return {
      column: option.field,
      ascending: option.direction === 'asc'
    };
  });

  return query.order(orderBy[0].column, {
    ascending: orderBy[0].ascending,
    nullsFirst: false,
    foreignTable: undefined
  });
}

// Apply pagination to Supabase query
export function applyPagination<T>(
  query: PostgrestFilterBuilder<T>,
  pagination: PaginationOptions
): PostgrestFilterBuilder<T> {
  const { page, pageSize } = pagination;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  return query.range(start, end);
}

// Apply search term to Supabase query
export function applySearchTerm<T>(
  query: PostgrestFilterBuilder<T>,
  searchTerm: string,
  searchFields: string[],
  options: {
    fullTextSearch?: boolean;
    caseSensitive?: boolean;
  } = {}
): PostgrestFilterBuilder<T> {
  if (!searchTerm || !searchFields || searchFields.length === 0) {
    return query;
  }

  const { fullTextSearch = false, caseSensitive = false } = options;

  if (fullTextSearch) {
    // Use full text search if available
    const ftsField = searchFields[0]; // Use first field for FTS
    return query.textSearch(ftsField, searchTerm, {
      type: 'websearch',
      config: 'english'
    });
  } else {
    // Use OR conditions for each field
    let filteredQuery = query;
    const likeOperator = caseSensitive ? 'like' : 'ilike';
    const searchValue = `%${searchTerm}%`;

    // Create OR filter for each search field
    const orFilters = searchFields.map(field => {
      return `${field}.${likeOperator}.${searchValue}`;
    }).join(',');

    // Apply OR filter
    filteredQuery = filteredQuery.or(orFilters);

    return filteredQuery;
  }
}

// Apply all search options to Supabase query
export function applySearchOptions<T>(
  query: PostgrestFilterBuilder<T>,
  options: SearchOptions
): PostgrestFilterBuilder<T> {
  let filteredQuery = query;

  // Apply filters
  if (options.filters && options.filters.length > 0) {
    filteredQuery = applyFilters(filteredQuery, options.filters);
  }

  // Apply search term
  if (options.searchTerm && options.searchFields && options.searchFields.length > 0) {
    filteredQuery = applySearchTerm(
      filteredQuery,
      options.searchTerm,
      options.searchFields,
      {
        fullTextSearch: options.fullTextSearch,
        caseSensitive: options.caseSensitive
      }
    );
  }

  // Apply sorting
  if (options.sort && options.sort.length > 0) {
    filteredQuery = applySorting(filteredQuery, options.sort);
  }

  // Apply pagination
  if (options.pagination) {
    filteredQuery = applyPagination(filteredQuery, options.pagination);
  }

  return filteredQuery;
}

// Client-side filtering for in-memory data
export function filterData<T>(
  data: T[],
  options: SearchOptions
): T[] {
  let filteredData = [...data];

  // Apply filters
  if (options.filters && options.filters.length > 0) {
    filteredData = filteredData.filter(item => {
      return options.filters!.every(filter => {
        const { field, operator, value, valueEnd } = filter;
        const itemValue = getNestedValue(item, field);

        switch (operator) {
          case 'eq':
            return itemValue === value;
          case 'neq':
            return itemValue !== value;
          case 'gt':
            return itemValue > value;
          case 'gte':
            return itemValue >= value;
          case 'lt':
            return itemValue < value;
          case 'lte':
            return itemValue <= value;
          case 'like':
            return String(itemValue).includes(value);
          case 'ilike':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'in':
            return Array.isArray(value) ? value.includes(itemValue) : itemValue === value;
          case 'is':
            return (itemValue === null) === (value === null);
          case 'fts':
            // Simple full text search simulation
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'cs':
            // Contains (for arrays)
            return Array.isArray(itemValue) && itemValue.includes(value);
          case 'cd':
            // Contained by (for arrays)
            return Array.isArray(value) && value.includes(itemValue);
          case 'sl':
            // Starts with (case sensitive)
            return String(itemValue).startsWith(String(value));
          case 'sw':
            // Starts with (case insensitive)
            return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'ew':
            // Ends with (case sensitive)
            return String(itemValue).endsWith(String(value));
          case 'ew':
            // Ends with (case insensitive)
            return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'between':
            // Between two values
            return valueEnd !== undefined && itemValue >= value && itemValue <= valueEnd;
          default:
            return true;
        }
      });
    });
  }

  // Apply search term
  if (options.searchTerm && options.searchFields && options.searchFields.length > 0) {
    const searchTerm = options.caseSensitive
      ? options.searchTerm
      : options.searchTerm.toLowerCase();

    filteredData = filteredData.filter(item => {
      return options.searchFields!.some(field => {
        const fieldValue = getNestedValue(item, field);
        if (fieldValue === null || fieldValue === undefined) return false;

        const stringValue = String(fieldValue);
        return options.caseSensitive
          ? stringValue.includes(searchTerm)
          : stringValue.toLowerCase().includes(searchTerm);
      });
    });
  }

  // Apply sorting
  if (options.sort && options.sort.length > 0) {
    filteredData.sort((a, b) => {
      for (const sortOption of options.sort!) {
        const { field, direction } = sortOption;
        const aValue = getNestedValue(a, field);
        const bValue = getNestedValue(b, field);

        if (aValue === bValue) continue;

        const comparison = compareValues(aValue, bValue);
        return direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  }

  // Apply pagination
  if (options.pagination) {
    const { page, pageSize } = options.pagination;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    filteredData = filteredData.slice(start, end);
  }

  return filteredData;
}

// Helper function to get nested property value
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
}

// Helper function to compare values for sorting
function compareValues(a: any, b: any): number {
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Convert to string for other types
  return String(a).localeCompare(String(b));
}

// Create search URL parameters
export function createSearchParams(options: SearchOptions): URLSearchParams {
  const params = new URLSearchParams();

  if (options.searchTerm) {
    params.set('q', options.searchTerm);
  }

  if (options.filters && options.filters.length > 0) {
    options.filters.forEach((filter, index) => {
      params.set(`field${index}`, filter.field);
      params.set(`op${index}`, filter.operator);
      params.set(`val${index}`, String(filter.value));
      if (filter.valueEnd !== undefined) {
        params.set(`valEnd${index}`, String(filter.valueEnd));
      }
    });
    params.set('filterCount', String(options.filters.length));
  }

  if (options.sort && options.sort.length > 0) {
    options.sort.forEach((sort, index) => {
      params.set(`sortField${index}`, sort.field);
      params.set(`sortDir${index}`, sort.direction);
    });
    params.set('sortCount', String(options.sort.length));
  }

  if (options.pagination) {
    params.set('page', String(options.pagination.page));
    params.set('pageSize', String(options.pagination.pageSize));
  }

  return params;
}

// Parse search options from URL parameters
export function parseSearchParams(params: URLSearchParams): SearchOptions {
  const options: SearchOptions = {};

  // Parse search term
  const searchTerm = params.get('q');
  if (searchTerm) {
    options.searchTerm = searchTerm;
  }

  // Parse filters
  const filterCount = parseInt(params.get('filterCount') || '0', 10);
  if (filterCount > 0) {
    options.filters = [];
    for (let i = 0; i < filterCount; i++) {
      const field = params.get(`field${i}`);
      const operator = params.get(`op${i}`) as FilterOperator;
      const value = params.get(`val${i}`);
      const valueEnd = params.get(`valEnd${i}`);

      if (field && operator && value) {
        options.filters.push({
          field,
          operator,
          value,
          valueEnd: valueEnd || undefined
        });
      }
    }
  }

  // Parse sorting
  const sortCount = parseInt(params.get('sortCount') || '0', 10);
  if (sortCount > 0) {
    options.sort = [];
    for (let i = 0; i < sortCount; i++) {
      const field = params.get(`sortField${i}`);
      const direction = params.get(`sortDir${i}`) as 'asc' | 'desc';

      if (field && direction) {
        options.sort.push({
          field,
          direction
        });
      }
    }
  }

  // Parse pagination
  const page = parseInt(params.get('page') || '1', 10);
  const pageSize = parseInt(params.get('pageSize') || '10', 10);
  options.pagination = { page, pageSize };

  return options;
}
