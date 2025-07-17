import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  ToggleRight,
  Save,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { FilterCondition, FilterOperator, SortOption, SearchOptions } from '../../utils/searchUtils';

interface AdvancedSearchProps {
  onSearch: (options: SearchOptions) => void;
  onReset: () => void;
  searchFields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
  sortFields: Array<{
    key: string;
    label: string;
  }>;
  savedSearches?: Array<{
    id: string;
    name: string;
    options: SearchOptions;
  }>;
  onSaveSearch?: (name: string, options: SearchOptions) => void;
  onDeleteSearch?: (id: string) => void;
  className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onReset,
  searchFields,
  sortFields,
  savedSearches = [],
  onSaveSearch,
  onDeleteSearch,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  // Filter operators based on field type
  const getOperatorsForType = (type: string): Array<{ value: FilterOperator; label: string }> => {
    const baseOperators = [
      { value: 'eq' as FilterOperator, label: 'Equals' },
      { value: 'neq' as FilterOperator, label: 'Not Equals' }
    ];

    switch (type) {
      case 'text':
        return [
          ...baseOperators,
          { value: 'like', label: 'Contains' },
          { value: 'ilike', label: 'Contains (case insensitive)' },
          { value: 'sw', label: 'Starts with' },
          { value: 'ew', label: 'Ends with' }
        ];
      case 'number':
      case 'date':
        return [
          ...baseOperators,
          { value: 'gt', label: 'Greater than' },
          { value: 'gte', label: 'Greater than or equal' },
          { value: 'lt', label: 'Less than' },
          { value: 'lte', label: 'Less than or equal' },
          { value: 'between', label: 'Between' }
        ];
      case 'boolean':
        return [
          { value: 'eq', label: 'Is' },
          { value: 'neq', label: 'Is not' }
        ];
      case 'select':
        return [
          ...baseOperators,
          { value: 'in', label: 'In' }
        ];
      default:
        return baseOperators;
    }
  };

  const addFilter = () => {
    const newFilter: FilterCondition = {
      field: searchFields[0]?.key || '',
      operator: 'eq',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const addSort = () => {
    const newSort: SortOption = {
      field: sortFields[0]?.key || '',
      direction: 'asc'
    };
    setSortOptions([...sortOptions, newSort]);
  };

  const updateSort = (index: number, updates: Partial<SortOption>) => {
    const newSortOptions = [...sortOptions];
    newSortOptions[index] = { ...newSortOptions[index], ...updates };
    setSortOptions(newSortOptions);
  };

  const removeSort = (index: number) => {
    setSortOptions(sortOptions.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const options: SearchOptions = {
      searchTerm: searchTerm || undefined,
      searchFields: searchFields.map(field => field.key),
      filters: filters.length > 0 ? filters : undefined,
      sort: sortOptions.length > 0 ? sortOptions : undefined,
      caseSensitive: false
    };
    onSearch(options);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters([]);
    setSortOptions([]);
    onReset();
  };

  const handleSaveSearch = () => {
    if (!saveSearchName.trim() || !onSaveSearch) return;

    const options: SearchOptions = {
      searchTerm: searchTerm || undefined,
      searchFields: searchFields.map(field => field.key),
      filters: filters.length > 0 ? filters : undefined,
      sort: sortOptions.length > 0 ? sortOptions : undefined
    };

    onSaveSearch(saveSearchName, options);
    setSaveSearchName('');
    setShowSaveDialog(false);
  };

  const loadSavedSearch = (savedSearch: any) => {
    const { options } = savedSearch;
    setSearchTerm(options.searchTerm || '');
    setFilters(options.filters || []);
    setSortOptions(options.sort || []);
    onSearch(options);
  };

  const getFieldType = (fieldKey: string) => {
    return searchFields.find(field => field.key === fieldKey)?.type || 'text';
  };

  const getFieldOptions = (fieldKey: string) => {
    return searchFields.find(field => field.key === fieldKey)?.options || [];
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Advanced Search
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Search and filter with advanced options
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Advanced Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Saved Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {savedSearches.map((savedSearch) => (
                      <div key={savedSearch.id} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button
                          onClick={() => loadSavedSearch(savedSearch)}
                          className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                          {savedSearch.name}
                        </button>
                        {onDeleteSearch && (
                          <button
                            onClick={() => onDeleteSearch(savedSearch.id)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Filters
                  </h4>
                  <button
                    onClick={addFilter}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Filter</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {filters.map((filter, index) => {
                    const fieldType = getFieldType(filter.field);
                    const operators = getOperatorsForType(fieldType);
                    const fieldOptions = getFieldOptions(filter.field);

                    return (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {/* Field */}
                        <select
                          value={filter.field}
                          onChange={(e) => updateFilter(index, { field: e.target.value })}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                        >
                          {searchFields.map(field => (
                            <option key={field.key} value={field.key}>
                              {field.label}
                            </option>
                          ))}
                        </select>

                        {/* Operator */}
                        <select
                          value={filter.operator}
                          onChange={(e) => updateFilter(index, { operator: e.target.value as FilterOperator })}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                        >
                          {operators.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>

                        {/* Value */}
                        {fieldType === 'select' ? (
                          <select
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                          >
                            <option value="">Select...</option>
                            {fieldOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : fieldType === 'boolean' ? (
                          <select
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value === 'true' })}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                          >
                            <option value="">Select...</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : (
                          <input
                            type={fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text'}
                            value={filter.value}
                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                            placeholder="Value"
                          />
                        )}

                        {/* End Value (for between operator) */}
                        {filter.operator === 'between' && (
                          <input
                            type={fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text'}
                            value={filter.valueEnd || ''}
                            onChange={(e) => updateFilter(index, { valueEnd: e.target.value })}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                            placeholder="End value"
                          />
                        )}

                        {/* Remove */}
                        <button
                          onClick={() => removeFilter(index)}
                          className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Sorting
                  </h4>
                  <button
                    onClick={addSort}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Sort</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {sortOptions.map((sort, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {/* Field */}
                      <select
                        value={sort.field}
                        onChange={(e) => updateSort(index, { field: e.target.value })}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                      >
                        {sortFields.map(field => (
                          <option key={field.key} value={field.key}>
                            {field.label}
                          </option>
                        ))}
                      </select>

                      {/* Direction */}
                      <select
                        value={sort.direction}
                        onChange={(e) => updateSort(index, { direction: e.target.value as 'asc' | 'desc' })}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>

                      {/* Remove */}
                      <button
                        onClick={() => removeSort(index)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Apply Search</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>

                {onSaveSearch && (
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Search</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Search Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Save Search
              </h3>
              <input
                type="text"
                placeholder="Enter search name..."
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  disabled={!saveSearchName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
