import React from 'react';
import { BookOpen, Mail, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { state } = useApp();

  return (
    <footer className="glass-footer backdrop-blur-xl bg-white/85 dark:bg-gray-900/85 border-t border-white/20 dark:border-gray-700/30 mt-20 islamic-pattern">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-islamic-gradient">
                  IDARAH WALI UL ASER
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ilm Ki Roshni</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              IDARAH WALI UL ASER ek mazhabi tanẓeem hai jo 2005 mein Banpora Chattergam, Kashmir mein qāim kī gaī. Hum Islam kī aseel ta'līmāt, khāss taur par Imam Hussain (AS) kē paighām aur qurbāniyoṅ ko mahfūẓ rakhne aur phailāne kē liye waqf haiṅ.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm">contact@idarahwaliulaser.org</span>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <p className="font-medium">Banpora Chattergam 191113</p>
                <p>Kashmir, India</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Saree Rawabit</span>
            </h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"><span>Bayt</span></a></li>
              <li><a href="/library" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"><span>Maktabah</span></a></li>
              <li><a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"><span>Haqiqat</span></a></li>
              <li><a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"><span>Rabita</span></a></li>
            </ul>
          </div>

          {/* Islamic Sciences */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>Ulum al-Islamiyyah</span>
            </h4>
            <ul className="space-y-2">
              <li><a href="/library?category=quran" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Qur'an</a></li>
              <li><a href="/library?category=hadith" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Hadith</a></li>
              <li><a href="/library?category=fiqh" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Fiqh</a></li>
              <li><a href="/library?category=history" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">Tareekh</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="text-center mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
              "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
              "Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of the Fire." - Quran 2:201
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center space-x-1">
              <span>© {new Date().getFullYear()} IDARAH WALI UL ASER CHATTERGAM. Designed with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for the community of Kashmir.</span>
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-500 dark:text-gray-500 text-xs">Founded 2005 by Aga Syed Mustafa Al Hussaini Al Hamadani</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
