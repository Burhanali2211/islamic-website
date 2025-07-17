import React from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Search, BookOpen, Edit, Trash2 } from 'lucide-react';

export function Notes() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState('all');

  const notes = [
    {
      id: 1,
      title: 'Key Points from Tafsir Ibn Kathir',
      content: 'Important interpretations of Surah Al-Baqarah verses 1-10. The concept of guidance for the righteous...',
      book: 'Tafsir Ibn Kathir',
      tags: ['tafsir', 'quran', 'guidance'],
      date: '2024-01-15',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      title: 'Hadith Authentication Methods',
      content: 'Scholar methods for verifying hadith authenticity. Chain of narration importance...',
      book: 'Hadith Sciences',
      tags: ['hadith', 'methodology', 'authentication'],
      date: '2024-01-14',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Islamic Golden Age Timeline',
      content: 'Major achievements during the Abbasid Caliphate period. Scientific and cultural developments...',
      book: 'Islamic History',
      tags: ['history', 'timeline', 'achievements'],
      date: '2024-01-13',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Fiqh of Prayer (Salah)',
      content: 'Detailed notes on prayer requirements, conditions, and various rulings...',
      book: 'Fiqh As-Sunnah',
      tags: ['fiqh', 'prayer', 'worship'],
      date: '2024-01-12',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const tags = ['all', 'tafsir', 'hadith', 'fiqh', 'history', 'quran', 'methodology'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Study Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize and review your study notes
          </p>
        </div>
        <button className="neomorph-button px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Note</span>
        </button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-3xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                    : 'neomorph-button hover:scale-105'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="glass-card p-6 rounded-3xl hover:scale-105 transition-transform relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${note.color}`}></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <StickyNote className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{note.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {note.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {note.content}
            </p>

            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{note.book}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <StickyNote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No notes found. Start taking notes to organize your learning!
          </p>
        </motion.div>
      )}
    </div>
  );
}
