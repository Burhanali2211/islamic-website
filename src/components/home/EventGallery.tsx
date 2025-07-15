import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventImage {
  src: string;
  title: string;
  description: string;
  category: 'program' | 'education' | 'community';
}

const eventImages: EventImage[] = [
  {
    src: '/Program 2024.jpg',
    title: 'Annual Program 2024',
    description: 'Our annual Islamic educational program bringing together scholars and students from across Kashmir.',
    category: 'program'
  },
  {
    src: '/Mudasir Speaking.jpg',
    title: 'Mudasir Ahmad Speaking',
    description: 'Our organizer Mudasir Ahmad delivering an inspiring speech about Islamic values and education.',
    category: 'education'
  },
  {
    src: '/Scholars from Town.jpg',
    title: 'Visiting Scholars',
    description: 'Distinguished Islamic scholars from various towns sharing their knowledge with our community.',
    category: 'education'
  },
  {
    src: '/Senior Girls Reciting.jpg',
    title: 'Senior Students Recitation',
    description: 'Senior female students beautifully reciting Quranic verses and Islamic poetry.',
    category: 'education'
  },
  {
    src: '/Students Reciting.jpg',
    title: 'Student Recitation',
    description: 'Young students participating in Quranic recitation and Islamic knowledge competitions.',
    category: 'education'
  },
  {
    src: '/Girl on Stage.jpg',
    title: 'Student Performance',
    description: 'A talented student presenting Islamic knowledge and cultural performance on stage.',
    category: 'education'
  },
  {
    src: '/Organizers.jpg',
    title: 'Event Organizers',
    description: 'Our dedicated team of organizers working together to make our programs successful.',
    category: 'community'
  },
  {
    src: '/Giving Water.jpg',
    title: 'Community Service',
    description: 'Serving water to participants, embodying the Islamic values of hospitality and service.',
    category: 'community'
  }
];

export function EventGallery() {
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image: EventImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % eventImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(eventImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + eventImages.length) % eventImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(eventImages[prevIndex]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'program': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'education': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'community': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Events & Activities
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Glimpses from our educational programs, community gatherings, and Islamic events that bring together 
            scholars, students, and community members in the spirit of learning and brotherhood.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {eventImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(image.category)}`}>
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </span>
                    <h3 className="text-white font-semibold text-sm mb-1">{image.title}</h3>
                    <p className="text-gray-200 text-xs line-clamp-2">{image.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedImage.category)}`}>
                      {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedImage.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
