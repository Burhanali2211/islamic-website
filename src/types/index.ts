export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  description: string;
  coverImage: string;
  language: 'en' | 'ar' | 'ur';
  fileUrl: string;
  fileType: 'pdf' | 'epub';
  publishedDate: string;
  pages: number;
  downloadCount: number;
  rating: number;
  tags: string[];
}

export type BookCategory = 'quran' | 'hadith' | 'fiqh' | 'history' | 'tafsir' | 'biography';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'teacher';
  avatar: string;
  joinDate: string;
  bookmarks: string[];
  recentReads: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  studentIds: string[];
  category: BookCategory;
}

export interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

export interface IslamicDate {
  hijri: string;
  gregorian: string;
  month: string;
  day: number;
  year: number;
}

export type Theme = 'light' | 'dark';
