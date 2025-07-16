import React from 'react';
import { BookCard } from './BookCard';
import { useSupabaseApp } from '../context/SupabaseContext';
import { Book } from '../types';

interface BookGridProps {
  viewMode?: 'grid' | 'list';
}

export function BookGrid({ viewMode = 'grid' }: BookGridProps) {
  const { state } = useSupabaseApp();

  const filteredBooks = React.useMemo(() => {
    let books = state.books;

    // Filter by category
    if (state.selectedCategory && state.selectedCategory !== 'all') {
      books = books.filter(book => book.category === state.selectedCategory);
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return books;
  }, [state.books, state.selectedCategory, state.searchQuery]);

  if (state.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 sm:h-56 lg:h-64 mb-4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No books found. Try adjusting your search or category filter.
        </p>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid'
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
    : "flex flex-col space-y-6";

  return (
    <div className={gridClasses}>
      {filteredBooks.map((book) => (
        <BookCard key={book.id} book={book} viewMode={viewMode} />
      ))}
    </div>
  );
}
