import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, Eye } from 'lucide-react';
import { OptimizedImage } from '../ui/OptimizedImage';

export function AboutSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                <OptimizedImage
                  src="/web-banner.png"
                  alt="IDARAH WALI UL ASER - Islamic Educational Institution"
                  className="w-full h-96 lg:h-[500px] object-contain rounded-2xl"
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
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                  About IDARAH WALI UL ASER
                </h2>
                <p className="text-lg text-secondary leading-relaxed">
                  IDARAH WALI UL ASER is a religious organization founded in 2005 in Banpora Chattergam, Kashmir.
                  We are dedicated to preserving and sharing the authentic teachings of Islam, particularly the
                  noble message and sacrifices of Imam Hussain (AS).
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Our Mission</h4>
                    <p className="text-secondary">To enlighten people with the true knowledge of Imam Hussain (AS) and his sacred mission, bringing innovative and authentic Islamic education to the youth of today.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Our Vision</h4>
                    <p className="text-secondary">To become a leading center of Islamic knowledge and spiritual growth in Kashmir, creating a community where the teachings of Imam Hussain (AS) inspire compassion and justice.</p>
                  </div>
                </div>
              </div>

              <Link to="/about">
                <button className="btn-primary flex items-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
