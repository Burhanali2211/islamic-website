import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Book, User, Theme, Course } from '../types';
import { generateMockBooks, generateMockUsers, mockUsers as defaultUsers } from '../utils/mockData';

interface AppState {
  books: Book[];
  users: User[];
  courses: Course[];
  currentUser: User | null;
  theme: Theme;
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  bookmarks: string[];
  recentReads: string[];
}

type AppAction =
  | { type: 'SET_DATA'; payload: { books: Book[], users: User[], courses: Course[] } }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_BOOKMARK'; payload: string }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'ADD_RECENT_READ'; payload: string }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string };

const initialState: AppState = {
  books: [],
  users: [],
  courses: [],
  currentUser: null,
  theme: 'light',
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: true,
  bookmarks: [],
  recentReads: []
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (role: User['role']) => void;
  logout: () => void;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload, isLoading: false };
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };

    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_BOOKMARK':
      return { ...state, bookmarks: [...state.bookmarks, action.payload] };
    case 'REMOVE_BOOKMARK':
      return { ...state, bookmarks: state.bookmarks.filter(id => id !== action.payload) };
    case 'ADD_RECENT_READ':
      return { ...state, recentReads: [action.payload, ...state.recentReads.filter(id => id !== action.payload)].slice(0, 10) };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return { ...state, books: state.books.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter(b => b.id !== action.payload) };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) dispatch({ type: 'SET_THEME', payload: savedTheme });

    const savedUser = localStorage.getItem('user');
    if (savedUser) dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });

    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) JSON.parse(savedBookmarks).forEach((id: string) => dispatch({ type: 'ADD_BOOKMARK', payload: id }));

    // Simulate fetching data
    setTimeout(() => {
      const mockBooks = generateMockBooks();
      const mockUsers = generateMockUsers();
      dispatch({ type: 'SET_DATA', payload: { books: mockBooks, users: mockUsers, courses: [] } });
    }, 500);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);



  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  }, [state.bookmarks]);
  
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('user', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.currentUser]);
  
  const login = (role: User['role']) => {
    const userToLogin = state.users.find(u => u.role === role) || defaultUsers[role];
    if (userToLogin) {
      dispatch({ type: 'LOGIN', payload: userToLogin });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
