import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Users, Star, ArrowRight, Quote as QuoteIcon } from 'lucide-react';
import { useSupabaseApp } from '../context/SupabaseContext';
import { BookCard } from '../components/BookCard';
import { Link } from 'react-router-dom';
import { AboutSection } from '../components/home/AboutSection';
import { DepartmentsSection } from '../components/home/DepartmentsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CallToActionSection } from '../components/home/CallToActionSection';
import { LatestNews } from '../components/home/LatestNews';
import { EventGallery } from '../components/home/EventGallery';
import { PromotionalBanner } from '../components/home/PromotionalBanner';

export function Home() {
  const { state } = useSupabaseApp();

  const featuredBooks = React.useMemo(() => {
    return [...state.books]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [state.books]);

  const stats = [
    { icon: BookOpen, label: 'Books', value: state.books.length, color: 'from-green-500 to-emerald-500', description: 'Islamic Books' },
    { icon: TrendingUp, label: 'Downloads', value: '15.2K', color: 'from-blue-500 to-cyan-500', description: 'Books Downloaded' },
    { icon: Users, label: 'Students', value: '2.8K', color: 'from-purple-500 to-pink-500', description: 'Registered Students' },
    { icon: Star, label: 'Rating', value: '4.8', color: 'from-gold to-yellow-500', description: 'Average Rating' },
  ];

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-20 md:space-y-32"
    >
      {/* Enhanced Hero Section */}
      <section className="relative h-[85vh] sm:h-[90vh] min-h-[600px] sm:min-h-[700px] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-fixed"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-950/60 via-green-950/75 to-green-950/90"></div>
          <div className="absolute inset-0 islamic-pattern opacity-20"></div>
        </div>

        {/* Decorative Islamic Elements - Hidden on mobile to prevent overflow */}
        <div className="hidden sm:block absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 border-2 border-gold/30 rounded-full animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 border-2 border-gold/30 rounded-full animate-pulse delay-1000"></div>
        <div className="hidden md:block absolute top-1/4 right-20 w-8 h-8 sm:w-12 sm:h-12 border border-gold/20 rotate-45 animate-pulse delay-500"></div>
        <div className="hidden md:block absolute bottom-1/4 left-20 w-8 h-8 sm:w-12 sm:h-12 border border-gold/20 rotate-45 animate-pulse delay-1500"></div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gold/20 to-green-500/20 rounded-full mb-8 backdrop-blur-sm border border-gold/30">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gold" />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight px-2"
              style={{textShadow: '0px 4px 20px rgba(0,0,0,0.8), 0px 2px 10px rgba(0,0,0,0.6)'}}
            >
              <span className="text-islamic-gradient">IDARAH</span>
              <br className="sm:hidden" />
              <span className="sm:ml-4">WALI UL ASER</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium mb-6 sm:mb-8 text-gold leading-relaxed px-2"
              style={{textShadow: '0px 3px 15px rgba(0,0,0,0.8), 0px 1px 8px rgba(0,0,0,0.6)'}}
            >
              Taqwa Ki Taraf Pehla Qadam
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 text-gray-100 max-w-4xl mx-auto leading-relaxed px-4 sm:px-2"
              style={{textShadow: '0px 2px 12px rgba(0,0,0,0.8), 0px 1px 6px rgba(0,0,0,0.6)'}}
            >
              Idarah Wali Ul Aser ko Aga Syed Mustafa Al Hussaini Al Hamadani ne 2005 mein ek Library ke taur par qayam kiya tha taake logon ko ilm ki roshni mil sake. Hamara maqsad Imam Hussain (AS) ke haqeeqi ilm aur Karbala ki muqaddas zameen par unki qurbaniyoṅ ke asli maqsad se logon ko roshan karna hai.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 sm:px-0"
          >
            <Link to="/library" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 flex items-center justify-center space-x-2 border border-green-400/30 backdrop-blur-sm min-h-[48px] touch-manipulation">
                <BookOpen className="h-5 w-5" />
                <span>Maktabah Dekhen</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>

            <Link to="/about" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-white border-2 border-gold/50 hover:bg-gold/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation">
                <QuoteIcon className="h-5 w-5" />
                <span>Haqiqat Janen</span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 lg:-mt-48 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:scale-105 transition-all duration-300 hover:-translate-y-2 group border border-white/20 dark:border-gray-700/30 overflow-hidden"
              >
                {/* Mobile-optimized layout: Always center content on mobile, then align left on larger screens */}
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left mb-3 sm:mb-4 space-y-3 sm:space-y-0">
                  <div className="flex-1 order-2 sm:order-1">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl transition-shadow order-1 sm:order-2 flex-shrink-0`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      
      <AboutSection />
      
      {/* Quote of the Day */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <QuoteIcon className="h-12 w-12 mx-auto text-gold mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 mb-6 italic">
              "Those who possess knowledge are the ones who are trustworthy. The pious people are the ones who strictly guard the religion, and the ones who act according to religious decrees are the masters of religion."
            </blockquote>
            <cite className="text-lg text-gray-600 dark:text-gray-400 not-italic">
              — Imam Jafar ibn Muhammad [AS]
            </cite>
          </motion.div>
        </div>
      </section>

      <DepartmentsSection />

      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Featured Books */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
              Recommended Books
            </h2>
            <Link to="/library" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center justify-center sm:justify-start space-x-1 text-sm sm:text-base">
              <span>All Islamic Sciences</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </motion.div>
      </section>
      
      <LatestNews />

      {/* Event Gallery */}
      <EventGallery />

      <TestimonialsSection />

      <CallToActionSection />
    </motion.div>
  );
}
