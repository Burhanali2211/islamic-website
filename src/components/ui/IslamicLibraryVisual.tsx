import React from 'react';
import { motion } from 'framer-motion';

interface IslamicLibraryVisualProps {
  className?: string;
}

export function IslamicLibraryVisual({ className = '' }: IslamicLibraryVisualProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <svg
        viewBox="0 0 600 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="libraryBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          
          <linearGradient id="bookSpine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          
          <linearGradient id="bookSpine2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#b8941f" />
          </linearGradient>
          
          <linearGradient id="bookSpine3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="600" height="400" fill="url(#libraryBg)" />
        
        {/* Bookshelf structure */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Shelf 1 */}
          <rect x="50" y="100" width="500" height="8" fill="#8b5cf6" opacity="0.8" />
          
          {/* Books on shelf 1 */}
          <motion.g
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Book 1 */}
            <rect x="60" y="60" width="25" height="40" fill="url(#bookSpine)" />
            <rect x="60" y="60" width="3" height="40" fill="rgba(255,255,255,0.3)" />
            <text x="72" y="85" fontSize="6" fill="white" textAnchor="middle" transform="rotate(-90 72 85)">القرآن</text>
            
            {/* Book 2 */}
            <rect x="90" y="65" width="20" height="35" fill="url(#bookSpine2)" />
            <rect x="90" y="65" width="3" height="35" fill="rgba(255,255,255,0.3)" />
            <text x="100" y="87" fontSize="5" fill="white" textAnchor="middle" transform="rotate(-90 100 87)">حديث</text>
            
            {/* Book 3 */}
            <rect x="115" y="55" width="30" height="45" fill="url(#bookSpine3)" />
            <rect x="115" y="55" width="3" height="45" fill="rgba(255,255,255,0.3)" />
            <text x="130" y="82" fontSize="6" fill="white" textAnchor="middle" transform="rotate(-90 130 82)">فقه</text>
            
            {/* Book 4 */}
            <rect x="150" y="62" width="22" height="38" fill="#ef4444" />
            <rect x="150" y="62" width="3" height="38" fill="rgba(255,255,255,0.3)" />
            <text x="161" y="86" fontSize="5" fill="white" textAnchor="middle" transform="rotate(-90 161 86)">تفسير</text>
            
            {/* Book 5 */}
            <rect x="177" y="58" width="28" height="42" fill="#f59e0b" />
            <rect x="177" y="58" width="3" height="42" fill="rgba(255,255,255,0.3)" />
            <text x="191" y="84" fontSize="6" fill="white" textAnchor="middle" transform="rotate(-90 191 84)">سيرة</text>
          </motion.g>
        </motion.g>
        
        {/* Shelf 2 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <rect x="50" y="200" width="500" height="8" fill="#8b5cf6" opacity="0.8" />
          
          {/* Books on shelf 2 */}
          <motion.g
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* More books with different heights and colors */}
            <rect x="60" y="155" width="24" height="45" fill="#10b981" />
            <rect x="60" y="155" width="3" height="45" fill="rgba(255,255,255,0.3)" />
            
            <rect x="89" y="160" width="26" height="40" fill="#d4af37" />
            <rect x="89" y="160" width="3" height="40" fill="rgba(255,255,255,0.3)" />
            
            <rect x="120" y="150" width="22" height="50" fill="#6366f1" />
            <rect x="120" y="150" width="3" height="50" fill="rgba(255,255,255,0.3)" />
            
            <rect x="147" y="165" width="28" height="35" fill="#ef4444" />
            <rect x="147" y="165" width="3" height="35" fill="rgba(255,255,255,0.3)" />
            
            <rect x="180" y="158" width="25" height="42" fill="#f59e0b" />
            <rect x="180" y="158" width="3" height="42" fill="rgba(255,255,255,0.3)" />
          </motion.g>
        </motion.g>
        
        {/* Shelf 3 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <rect x="50" y="300" width="500" height="8" fill="#8b5cf6" opacity="0.8" />
          
          {/* Books on shelf 3 */}
          <motion.g
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <rect x="60" y="260" width="23" height="40" fill="#059669" />
            <rect x="60" y="260" width="3" height="40" fill="rgba(255,255,255,0.3)" />
            
            <rect x="88" y="255" width="27" height="45" fill="#b8941f" />
            <rect x="88" y="255" width="3" height="45" fill="rgba(255,255,255,0.3)" />
            
            <rect x="120" y="265" width="24" height="35" fill="#4f46e5" />
            <rect x="120" y="265" width="3" height="35" fill="rgba(255,255,255,0.3)" />
          </motion.g>
        </motion.g>
        
        {/* Islamic calligraphy element */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <circle cx="450" cy="200" r="60" fill="rgba(16, 185, 129, 0.1)" />
          <circle cx="450" cy="200" r="40" fill="rgba(16, 185, 129, 0.05)" />
          
          {/* Stylized Arabic calligraphy representation */}
          <path
            d="M420,190 Q440,180 460,190 Q470,200 460,210 Q440,220 420,210 Q410,200 420,190"
            fill="#10b981"
            opacity="0.7"
          />
          <path
            d="M430,200 Q445,195 455,205"
            stroke="#d4af37"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </motion.g>
        
        {/* Floating particles */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        >
          <circle cx="300" cy="80" r="2" fill="#10b981" />
          <circle cx="350" cy="120" r="1.5" fill="#d4af37" />
          <circle cx="400" cy="90" r="1" fill="#6366f1" />
          <circle cx="250" cy="320" r="1.5" fill="#ef4444" />
          <circle cx="320" cy="350" r="1" fill="#f59e0b" />
        </motion.g>
      </svg>
    </div>
  );
}
