import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, Eye } from 'lucide-react';
import { OptimizedImage } from '../ui/OptimizedImage';

export function AboutSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl blur-3xl opacity-30"></div>

              {/* Main image container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                <OptimizedImage
                  src="/web-banner.png"
                  alt="IDARAH WALI UL ASER - Islamic Educational Institution"
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-contain rounded-xl sm:rounded-2xl"
                />

                {/* Floating decorative elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center lg:text-left">
                  About IDARAH WALI UL ASER
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center lg:text-left">
                  IDARAH WALI UL ASER is a religious organization founded in 2005 in Banpora Chattergam, Kashmir.
                  We are dedicated to preserving and sharing the authentic teachings of Islam, particularly the
                  noble message and sacrifices of Imam Hussain (AS).
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 sm:mt-1">
                    <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">To enlighten people with the true knowledge of Imam Hussain (AS) and his sacred mission, bringing innovative and authentic Islamic education to the youth of today.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 sm:mt-1">
                    <Eye className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Our Vision</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">To become a leading center of Islamic knowledge and spiritual growth in Kashmir, creating a community where the teachings of Imam Hussain (AS) inspire compassion and justice.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-start">
                <Link to="/about">
                  <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2 text-sm sm:text-base">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
