import { faker } from '@faker-js/faker';
import { Book, BookCategory, User } from '../types';

const categories: BookCategory[] = ['quran', 'hadith', 'fiqh', 'history', 'tafsir', 'biography'];

// Islamic book cover images by category
const categoryImages = {
  quran: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop', // Islamic calligraphy
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', // Quran pages
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop', // Islamic art
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop', // Arabic calligraphy
  ],
  hadith: [
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop', // Islamic manuscript
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', // Arabic text
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop', // Calligraphy
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop', // Islamic art
  ],
  fiqh: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', // Islamic books
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop', // Manuscript
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop', // Arabic calligraphy
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop', // Islamic design
  ],
  history: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop', // Historical Islamic art
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop', // Ancient manuscript
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', // Historical text
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop', // Islamic architecture
  ],
  tafsir: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', // Quranic commentary
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop', // Arabic calligraphy
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop', // Islamic manuscript
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop', // Islamic art
  ],
  biography: [
    'https://images.unsplash.com/photo-1564287531351-815cc2d36011?w=400&h=600&fit=crop', // Islamic calligraphy
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=600&fit=crop', // Historical manuscript
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', // Islamic text
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=600&fit=crop', // Islamic design
  ]
};

const bookTitles = {
  quran: ['Farhang Lugat e Quran', 'Quran Aur Mustashqeen', 'Qurani Qisse', 'Maarif Quran o Iteat', 'Al-Quran Al-Kareem'],
  hadith: ['Hadis e Ghadeer', 'Hadis e Saqlib Hanif Sanafi', 'Hadis Ghadeer ke Mukhtalif Asanid', 'Sahih Hadith Collections', 'Imam Hussain Ki Shahadat (Sahaih Hadith)'],
  fiqh: ['Fiqh e Masail', 'Ahkam e Zindagi', 'Ahkam Namaz e Jumma', 'Namaz, Roza', 'Hajj ke Masail', 'Fiqh e Islami', 'Namwar Fiqh wa Asool'],
  history: ['Waqa e Karbala', 'Karbala Ek Salfi Qalam se', 'Islam wa Iran Ke Taqabli Khidmat', 'Tareekh e Islam', 'Islamic Civilization'],
  tafsir: ['Anwar Ghadeer', 'Mutla Anwar', 'Nahjul Khitaba', 'Tafsir Al-Quran', 'Munara Hidayat'],
  biography: ['Imam Ali Ibn Abi Talib', 'Ahlibayt ke Shia', 'Hayat aur Karname', 'Seerah an-Nabi', 'Ashab-e-Rasool']
};

const authors = [
  'Dr Mahdi Hamzus Salman', 'Hajj Wa Ziyarat Research Center', 'Sitad e Ghadeer Qom', 'Prop. Muharin Abbas Shushtari',
  'Ayatullah Imam Khamnai', 'Sayued Mahmud TabaTabai', 'Daftar e Hafdahum', 'Wilayat Publications', 'Austad Mohsin Karaiti',
  'Mohd Taqi Rehbar', 'Dr. Mohd Hassan Zamani', 'Khusro Qasim', 'Jawad Aamili', 'Manzar Hakim Wadi',
  'Syed Mehraj Rizei', 'Ali bin Hussain Khurasani', 'Shaheed Murtazai Muthari', 'Syed Abbas Zaidi', 'Hassan Ramzan Khurasani',
  'Sheikh Ali Bin Muhammad Maliki', 'Mahdi Akbarnejad', 'Syed Hussain Mohd Tehrani', 'Nasir Makarim Shirazi',
  'Sheikh Mohd Hadi Yousufi', 'Hameed Raza Mazahiri', 'Mohd Mahdi Asifi', 'Mohd Ibrahim Karimi', 'Syed Akhtar Mahdi Rizwi',
  'Sheikh Hussain Tehrani', 'Ayatullah Jafar Subhani', 'Mohd Ismail Salfi Marhoom', 'Syed Abid Abbas Zaidi', 'Abbas Ali Zarae',
  'Hussain Falah Zadah', 'Jafar Sajani', 'Qazi Syed Nurallah Tastari', 'Syed Shahid Jamal Rizwi Gopalpuri', 'Saleh Qanari',
  'Ali Asgar Ridhwani', 'Mohd Hussain TabaTabai', 'Zahid Ali Hindi', 'Syed Shahwar Hussain Naqwi', 'Ali Reza Jafari',
  'Syed Ali Akhtar Rizwi', 'Ali Asgar Qaimi', 'Misbah Yazdi', 'Syed Salman Nadwi', 'Mohd Sadi Mihr'
];

const bookDescriptions = {
  quran: [
    "A comprehensive lexicon of Quranic terms and their meanings, essential for deep understanding of the Holy Quran.",
    "An exploration of the Quran's impact on scholarly discourse and its interpretation through the ages.",
    "A collection of Quranic stories and parables with their moral lessons and contemporary relevance.",
    "A detailed study of the Quran's guidance and its application in daily life for the believers.",
    "The authentic text of the Holy Quran with careful translation and explanatory notes."
  ],
  hadith: [
    "A collection of authentic hadith regarding the event of Ghadeer and its significance in Islamic history.",
    "Critical examination of hadith chains of narration with verification of authenticity and context.",
    "A compilation of various narrations about Ghadeer from different sources and their scholarly analysis.",
    "Authentic hadith collections with commentary on their application in contemporary Muslim life.",
    "Verified hadith accounts of Imam Hussain's martyrdom with historical context and significance."
  ],
  fiqh: [
    "A comprehensive guide to practical Islamic jurisprudence addressing contemporary issues.",
    "Detailed explanations of Islamic rulings concerning daily life matters for practicing Muslims.",
    "Specific rulings and guidance regarding the Friday prayer and its importance in Islamic practice.",
    "Essential guidance on prayer and fasting according to Islamic jurisprudence with practical examples.",
    "A detailed guide for pilgrims performing Hajj with all necessary rulings and recommendations."
  ],
  history: [
    "A detailed account of the events at Karbala with historical accuracy and spiritual significance.",
    "A unique perspective on the tragedy of Karbala from diverse scholarly viewpoints.",
    "A comparative study of Islam's influence on Iranian civilization and culture through history.",
    "A chronological account of Islamic history from the Prophet's time to contemporary developments.",
    "An exploration of Islamic civilization's contributions to science, art, and global culture."
  ],
  tafsir: [
    "Illuminating commentary on selected verses with focus on spiritual enlightenment and guidance.",
    "A comprehensive exegesis of the Quran with linguistic analysis and contextual understanding.",
    "Collection of sermons and discourses explaining Quranic wisdom and its practical application.",
    "Classical interpretation of the Quran with insights from traditional and contemporary scholars.",
    "A beacon of Quranic guidance addressing modern challenges with timeless wisdom."
  ],
  biography: [
    "A detailed biography of Imam Ali ibn Abi Talib exploring his life, teachings, and legacy.",
    "An exploration of the followers of Ahlul Bayt and their contributions to Islamic scholarship.",
    "Biographies of notable Islamic personalities and their impact on Islamic thought and practice.",
    "A comprehensive account of the Prophet Muhammad's life with authentic narrations and context.",
    "Detailed accounts of the Prophet's companions and their roles in establishing Islamic society."
  ]
};

const islamicTags = [
  'Ilm', 'Taqwa', 'Aqeedah', 'Fiqh', 'Hadith', 'Tafsir', 'Seerah', 'Tasawwuf',
  'Akhlaq', 'Adab', 'Ibadah', 'Muamalat', 'Ulum al-Quran', 'Usul al-Fiqh',
  'Tarikh', 'Falsafa', 'Mantiq', 'Lugha', 'Balagha', 'Tajweed'
];

export function generateMockBooks(count = 48): Book[] {
  const books: Book[] = [];

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const book: Book = {
      id: faker.string.uuid(),
      title: faker.helpers.arrayElement(bookTitles[category]),
      author: faker.helpers.arrayElement(authors),
      category,
      description: faker.helpers.arrayElement(bookDescriptions[category]),
      coverImage: faker.helpers.arrayElement(categoryImages[category]),
      language: faker.helpers.arrayElement(['en', 'ar', 'ur']),
      fileUrl: faker.internet.url(),
      fileType: faker.helpers.arrayElement(['pdf', 'epub']),
      publishedDate: faker.date.past({ years: 20 }).toISOString(),
      pages: faker.number.int({ min: 100, max: 1000 }),
      downloadCount: faker.number.int({ min: 100, max: 50000 }),
      rating: parseFloat(faker.number.float({ min: 3.5, max: 5, multipleOf: 0.1 }).toFixed(1)),
      tags: faker.helpers.arrayElements(islamicTags, { min: 2, max: 4 })
    };
    books.push(book);
  }

  return books;
}

export const mockUsers: Record<User['role'], User> = {
  user: {
    id: 'user-123',
    name: 'Muhammad Ahmad',
    email: 'talib@idarah-maktabah.org',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=student',
    joinDate: faker.date.past({ years: 1 }).toISOString(),
    bookmarks: [],
    recentReads: []
  },
  teacher: {
    id: 'teacher-456',
    name: 'Ustadha Khadijah Zahra',
    email: 'muallim@idarah-maktabah.org',
    role: 'teacher',
    avatar: 'https://i.pravatar.cc/150?u=teacher',
    joinDate: faker.date.past({ years: 3 }).toISOString(),
    bookmarks: [],
    recentReads: []
  },
  admin: {
    id: 'admin-789',
    name: 'Syed Abdullah Hussain',
    email: 'nazim@idarah-maktabah.org',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    joinDate: faker.date.past({ years: 5 }).toISOString(),
    bookmarks: [],
    recentReads: []
  }
};

export function generateMockUsers(count = 50): User[] {
  const users: User[] = Object.values(mockUsers);
  
  for (let i = 0; i < count - 3; i++) {
    const role = faker.helpers.arrayElement(['user', 'teacher'] as const);
    const user: User = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role,
      avatar: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
      joinDate: faker.date.past({ years: 4 }).toISOString(),
      bookmarks: [],
      recentReads: []
    };
    users.push(user);
  }
  return users;
}
