import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, Eye } from 'lucide-react';

const teamMembers = [
  { name: 'Shabir Ahmad', role: 'Chairman', image: '/shabir ahmad.jpg' },
  { name: 'Bashir Ahmad', role: 'Finance Manager', image: '/bashir.jpg' },
  { name: 'Irfan Hussain', role: 'Supervisor', image: '/irfan.jpg' },
  { name: 'Mudasir Ahmad', role: 'Organizer', image: '/mudasir.jpg' },
  { name: 'Showkat Ahmad', role: 'Secretary', image: '/showkat.jpg' },
  { name: 'Abbas Ali', role: 'Media Consultant', image: '/abbas ali.jpg' },
  { name: 'Bilal Ahmad', role: 'Social Media Manager', image: '/bilal ahmad.jpg' },
  { name: 'Zeeshan Ali', role: 'Media In-charge', image: '/zeeshan ali.jpg' },
];

export function About() {

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-12 lg:space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4 sm:mb-6 shadow-lg">
          <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
          About IDARAH WALI UL ASER
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
          IDARAH WALI UL ASER is a religious organization established in 2005 in Banpora Chattergam, Kashmir. We are dedicated to preserving and spreading the authentic teachings of Islam, particularly the message and sacrifices of Imam Hussain (AS). Currently operated by a devoted community, we run both a digital library and Maktab Wali Ul Aser school.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <div className="glass-card p-6 sm:p-8 rounded-3xl text-center group hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6 group-hover:shadow-lg transition-shadow">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Hamāra Maqsad</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Logoṅ ko Imam Hussain (AS) kē haqīqī 'ilm aur unke muqaddas mission se raushan karnā, āj kī nasl ko aseel Islāmī ta'līm dēnā aur Islāmī 'ulūm kī daulat-mand wirāsat ko mahfūẓ rakhnā.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl text-center group hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6 group-hover:shadow-lg transition-shadow">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Hamārā Tassawwur</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Kashmir mein Islāmī 'ilm aur rūhānī taraqqi ka ek pēsh-qadām markaz bannā, ek aisī jamā'at banānā jahāṅ Imam Hussain (AS) kī ta'līmāt raḥm, 'adl aur akhlāqī kamāl kī raushan misal hoṅ.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl text-center group hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6 group-hover:shadow-lg transition-shadow">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Story</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Established as a humble effort to preserve and spread Islamic knowledge, our organization has become a comprehensive treasury of Islamic literature serving the global Muslim community.
          </p>
        </div>
      </motion.div>

      {/* Founder Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 sm:p-8 lg:p-12 rounded-3xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Bānī-e-Idarah
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              <strong className="text-green-600 dark:text-green-400">Aga Syed Mustafa Al Hussaini Al Hamadani</strong> nē 2005 mein is Idarah kī buniyād rakhī thī. Unka maqsad logoṅ ko 'ilm kī raushan karnā aur Imam Hussain (AS) kē haqīqī 'ilm sē āgāh karnā thā.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Hamārā hadaf Imam Hussain (AS) kī qurbāniyoṅ kē haqīqī maqsad ko samjhānā aur Karbala kī muqaddas zamīn par unke 'aẓīm mission ko ujāgar karnā hai.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <Users className="h-24 w-24 sm:h-32 sm:w-32 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Hamārī Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-6 rounded-3xl hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto border-4 border-white dark:border-gray-800 shadow-lg group-hover:shadow-xl transition-shadow"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{member.name}</h4>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
