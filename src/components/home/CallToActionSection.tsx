import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function CallToActionSection() {
  const { state } = useApp();

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Islamic Knowledge Journey
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Become part of our growing community dedicated to preserving and sharing authentic Islamic knowledge and the teachings of Imam Hussain (AS).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/library">
              <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto">
                <span>Explore Maktabah</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link to="/learning-center">
              <button className="bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-800 transition-colors w-full sm:w-auto">
                Join Maktab Wali Ul Aser
              </button>
            </Link>
            <Link to="/contact">
              <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-green-600 transition-colors w-full sm:w-auto">
                Contact Us
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
