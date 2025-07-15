import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Star } from 'lucide-react';

export function PromotionalBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 islamic-pattern"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/4 right-20 w-12 h-12 border border-white/20 rotate-45 animate-pulse delay-500"></div>
      <div className="absolute bottom-1/4 left-20 w-12 h-12 border border-white/20 rotate-45 animate-pulse delay-1500"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-white"
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                ✨ Discover Islamic Knowledge
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Join Our Digital
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Maktabah
                </span>
              </h2>
              <p className="text-lg text-green-100 mb-8 leading-relaxed">
                Access thousands of authentic Islamic books, join our learning community, 
                and embark on a journey of spiritual and intellectual growth with IDARAH WALI UL ASER.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">1000+</div>
                <div className="text-green-100 text-sm">Islamic Books</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">2.8K+</div>
                <div className="text-green-100 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1">4.8</div>
                <div className="text-green-100 text-sm">Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/library">
                <button className="w-full sm:w-auto bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Explore Maktabah</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/about">
                <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 hover:scale-105">
                  Learn About Us
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Banner Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-3xl blur-3xl"></div>
              
              {/* Banner Image */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <img
                  src="/web-banner.png"
                  alt="IDARAH WALI UL ASER Web Banner"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full animate-bounce delay-500"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
