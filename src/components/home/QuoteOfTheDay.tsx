import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function QuoteOfTheDay() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Quote className="h-12 w-12 mx-auto text-green-400 mb-6 transform rotate-180" />
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 mb-6 italic">
            "The seeking of knowledge is obligatory for every Muslim."
          </blockquote>
          <cite className="text-lg text-gray-600 dark:text-gray-400 not-italic">
            — Prophet Muhammad (ﷺ), Sunan Ibn Majah
          </cite>
        </motion.div>
      </div>
    </section>
  );
}
