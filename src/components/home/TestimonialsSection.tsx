import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { IslamicAvatar } from '../ui/IslamicAvatar';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ahmad Hassan',
      role: 'Maktab Student',
      quote: 'The digital library has transformed my learning experience. Access to authentic Islamic texts has deepened my understanding of our faith.',
      rating: 5
    },
    {
      name: 'Dr. Fatima Zahra',
      role: 'Islamic Scholar',
      quote: 'IDARAH WALI UL ASER provides invaluable resources for Islamic research. The collection is comprehensive and authentic.',
      rating: 5
    },
    {
      name: 'Syed Mohsin Ali',
      role: 'Community Member',
      quote: 'This organization has been a beacon of knowledge in our community. Their dedication to preserving Islamic teachings is commendable.',
      rating: 5
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Community Voices
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
            Hear from students, scholars, and community members who have benefited from our Islamic educational resources and programs.
          </p>
        </motion.div>

        {/* Mobile-optimized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl text-center hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4 sm:mb-6">
                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3 sm:mb-4 opacity-60" />
                <IslamicAvatar name={testimonial.name} size="lg" className="mx-auto" />
              </div>

              <div className="flex justify-center text-yellow-500 mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                ))}
              </div>

              <blockquote className="text-gray-600 dark:text-gray-400 italic mb-4 sm:mb-6 flex-grow leading-relaxed text-sm sm:text-base">
                "{testimonial.quote}"
              </blockquote>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{testimonial.name}</h4>
                <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm font-medium">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
