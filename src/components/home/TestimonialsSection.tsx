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
    <section className="section-padding bg-surface-elevated">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
            Community Voices
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Hear from students, scholars, and community members who have benefited from our Islamic educational resources and programs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="authentic-card p-8 rounded-2xl text-center hover:shadow-medium transition-all duration-300"
            >
              <div className="mb-6">
                <Quote className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-4 opacity-60" />
                <IslamicAvatar name={testimonial.name} size="lg" className="mx-auto" />
              </div>

              <div className="flex justify-center text-gold-500 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>

              <blockquote className="text-secondary italic mb-6 flex-grow leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div>
                <h4 className="font-semibold text-primary mb-1">{testimonial.name}</h4>
                <p className="text-accent text-sm font-medium">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
