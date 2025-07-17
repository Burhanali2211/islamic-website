import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award } from 'lucide-react';

const leadershipTeam = [
  { name: 'Dr. Abdullah Khan', role: 'Founder & Director', image: 'https://picsum.photos/200/200?random=20', quote: 'Our goal is to make authentic knowledge universally accessible.' },
  { name: 'Aisha Siddiqui', role: 'Chief Operating Officer', image: 'https://picsum.photos/200/200?random=21', quote: 'We strive for operational excellence to serve our community better.' },
  { name: 'Omar Al-Faruq', role: 'Head of Acquisitions', image: 'https://picsum.photos/200/200?random=22', quote: 'Curating the most reliable and impactful texts is our primary focus.' },
];

export function Foundation() {

  return (
    <div className="p-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Shield className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          The Foundation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          The dedicated team ensuring the integrity, growth, and sustainability of The Islamic Library project.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-3xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Guiding Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="neomorph-icon p-4 rounded-full inline-block">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Authenticity</h3>
            <p className="text-gray-600 dark:text-gray-400">Upholding the highest standards of scholarly verification for all our resources.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="neomorph-icon p-4 rounded-full inline-block">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-400">Ensuring our library is open and available to everyone, regardless of background or location.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="neomorph-icon p-4 rounded-full inline-block">
              <Award className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400">Striving for excellence in technology, user experience, and community service.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Leadership Team
        </h2>
        <div className="space-y-12">
          {leadershipTeam.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8"
            >
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 flex-shrink-0" />
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-lg text-green-600 dark:text-green-400 mb-4">{member.role}</p>
                <blockquote className="text-gray-600 dark:text-gray-300 italic border-l-4 border-green-500 pl-4">
                  "{member.quote}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
