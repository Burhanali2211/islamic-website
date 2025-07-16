import React from 'react';
import { motion } from 'framer-motion';
import { School, Book, Users, Star, GraduationCap } from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';

const courses = [
  { title: 'Quranic Tafsir', instructor: 'Dr. Yusuf Ahmed', duration: '12 Weeks', level: 'Intermediate', icon: Book },
  { title: 'Hadith Studies', instructor: 'Sheikh Ali Hassan', duration: '8 Weeks', level: 'Beginner', icon: Book },
  { title: 'Islamic Jurisprudence (Fiqh)', instructor: 'Dr. Fatima Khan', duration: '16 Weeks', level: 'Advanced', icon: Book },
];

const faculty = [
  { name: 'Dr. Yusuf Ahmed', expertise: 'Tafsir & Quranic Sciences', image: 'https://picsum.photos/200/200?random=30' },
  { name: 'Dr. Fatima Khan', expertise: 'Fiqh & Usul al-Fiqh', image: 'https://picsum.photos/200/200?random=31' },
  { name: 'Sheikh Ali Hassan', expertise: 'Hadith & Seerah', image: 'https://picsum.photos/200/200?random=32' },
];

export function Darsgah() {
  const { state } = useSupabaseApp();

  const testimonials = [
    { name: 'Ahmed Hassan', quote: t('testimonials.student1.quote'), image: 'https://i.pravatar.cc/150?u=student1' },
    { name: 'Fatima Zahra', quote: t('testimonials.researcher1.quote'), image: 'https://i.pravatar.cc/150?u=researcher1' },
  ];

  return (
    <div className="p-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <School className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          The Darsgah (Educational Center)
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Nurturing the next generation of scholars and knowledgeable Muslims through structured, authentic Islamic education.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 rounded-3xl text-center hover:scale-105 transition-transform"
              >
                <div className="neomorph-icon p-4 rounded-full inline-block mb-4">
                  <Icon className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">with {course.instructor}</p>
                <div className="flex justify-around text-sm text-gray-500 dark:text-gray-500">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>
                <button className="mt-6 neomorph-button px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform">
                  Learn More
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Esteemed Faculty</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {faculty.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-6 rounded-3xl text-center"
            >
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-800" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h4>
              <p className="text-green-600 dark:text-green-400">{member.expertise}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Words from Our Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <div className="flex text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-600 dark:text-gray-300 italic">
                "{testimonial.quote}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
