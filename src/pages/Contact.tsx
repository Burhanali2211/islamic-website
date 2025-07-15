import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Contact() {
  const { state } = useApp();

  return (
    <div className="p-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('contact')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We welcome your inquiries, suggestions, and collaboration proposals. Whether you seek guidance on Islamic matters or wish to contribute to our mission, please reach out to us.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input type="text" id="name" className="w-full pl-4 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20" placeholder="Your Name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input type="email" id="email" className="w-full pl-4 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
              <select id="subject" className="w-full pl-4 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20">
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="research">Research Collaboration</option>
                <option value="donation">Book Donation</option>
                <option value="guidance">Scholarly Guidance</option>
                <option value="technical">Technical Support</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea id="message" rows={5} className="w-full pl-4 pr-4 py-3 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="w-full neomorph-button px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition-transform flex items-center justify-center space-x-2">
              <Send className="h-5 w-5" />
              <span>{t('sendMessage')}</span>
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="neomorph-icon p-3 rounded-xl mt-1">
                  <MapPin className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Our Address</h4>
                  <p className="text-gray-600 dark:text-gray-400">Idarah Islamic Library<br/>Knowledge Quarter, Islamic City<br/>Global Community</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="neomorph-icon p-3 rounded-xl mt-1">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Email Us</h4>
                  <p className="text-gray-600 dark:text-gray-400">contact@idarah-maktabah.org<br/>admin@idarah-maktabah.org</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="neomorph-icon p-3 rounded-xl mt-1">
                  <Phone className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Call Us</h4>
                  <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-ILAM<br/>+1 (555) 123-4526</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card h-64 rounded-3xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798821472!2d-74.2598654534744!3d40.69767006276383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1672851239893!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
