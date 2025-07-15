import React from 'react';
import { BookOpen, Mail, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { state } = useApp();

  return (
    <footer className="glass-footer backdrop-blur-xl bg-white/85 dark:bg-gray-900/85 border-t border-white/20 dark:border-gray-700/30 mt-12 sm:mt-16 lg:mt-20 islamic-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 sm:p-3 rounded-xl shadow-lg self-start sm:self-auto">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-islamic-gradient">
                  IDARAH WALI UL ASER
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Ilm Ki Roshni</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md leading-relaxed text-center sm:text-left">
              IDARAH WALI UL ASER ek mazhabi tanẓeem hai jo 2005 mein Banpora Chattergam, Kashmir mein qāim kī gaī. Hum Islam kī aseel ta'līmāt, khāss taur par Imam Hussain (AS) kē paighām aur qurbāniyoṅ ko mahfūẓ rakhne aur phailāne kē liye waqf haiṅ.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-gray-600 dark:text-gray-400 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-400 self-start sm:self-auto" />
                <span className="text-xs sm:text-sm break-all">contact@idarahwaliulaser.org</span>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center sm:text-left">
                <p className="font-medium">Banpora Chattergam 191113</p>
                <p>Kashmir, India</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Saree Rawabit</span>
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center justify-center sm:justify-start space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation"><span>Bayt</span></a></li>
              <li><a href="/library" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center justify-center sm:justify-start space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation"><span>Maktabah</span></a></li>
              <li><a href="/about" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center justify-center sm:justify-start space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation"><span>Haqiqat</span></a></li>
              <li><a href="/contact" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center justify-center sm:justify-start space-x-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation"><span>Rabita</span></a></li>
            </ul>
          </div>

          {/* Islamic Sciences */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center justify-center sm:justify-start space-x-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>Ulum al-Islamiyyah</span>
            </h4>
            <ul className="space-y-2">
              <li><a href="/library?category=quran" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors block p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation">Qur'an</a></li>
              <li><a href="/library?category=hadith" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors block p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation">Hadith</a></li>
              <li><a href="/library?category=fiqh" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors block p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation">Fiqh</a></li>
              <li><a href="/library?category=history" className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors block p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 touch-manipulation">Tareekh</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base italic px-2">
              "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm mt-1 px-2">
              "Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of the Fire." - Quran 2:201
            </p>
          </div>
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center sm:space-x-1 text-center sm:text-left">
              <span>© {new Date().getFullYear()} IDARAH WALI UL ASER CHATTERGAM.</span>
              <span className="flex items-center justify-center sm:justify-start space-x-1 mt-1 sm:mt-0">
                <span>Designed with</span>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
                <span>for the community of Kashmir.</span>
              </span>
            </p>
            <div className="text-center md:text-right">
              <span className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm block">Founded 2005 by</span>
              <span className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm block">Aga Syed Mustafa Al Hussaini Al Hamadani</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
