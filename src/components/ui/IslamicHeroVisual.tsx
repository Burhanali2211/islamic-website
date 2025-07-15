import React from 'react';
import { motion } from 'framer-motion';

interface IslamicHeroVisualProps {
  className?: string;
}

export function IslamicHeroVisual({ className = '' }: IslamicHeroVisualProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main geometric pattern */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
          </linearGradient>
          
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#b8941f" stopOpacity="0.8" />
          </linearGradient>
          
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background */}
        <rect width="800" height="600" fill="url(#emeraldGradient)" />
        
        {/* Islamic geometric patterns */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Central star pattern */}
          <g transform="translate(400, 300)">
            <motion.polygon
              points="0,-60 17.6,-18.5 60,-18.5 29.4,7.5 46.4,49.5 0,24 -46.4,49.5 -29.4,7.5 -60,-18.5 -17.6,-18.5"
              fill="url(#goldGradient)"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner circle */}
            <circle r="25" fill="rgba(255, 255, 255, 0.2)" />
            <circle r="15" fill="rgba(255, 255, 255, 0.3)" />
          </g>
        </motion.g>
        
        {/* Decorative corner elements */}
        <motion.g
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Top left corner */}
          <g transform="translate(80, 80)">
            <path
              d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40 Z"
              fill="rgba(255, 255, 255, 0.3)"
            />
            <path
              d="M0,0 L20,0 L20,4 L4,4 L4,20 L0,20 Z"
              fill="rgba(255, 255, 255, 0.5)"
            />
          </g>
        </motion.g>
        
        <motion.g
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {/* Bottom right corner */}
          <g transform="translate(720, 520) rotate(180)">
            <path
              d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40 Z"
              fill="rgba(255, 255, 255, 0.3)"
            />
            <path
              d="M0,0 L20,0 L20,4 L4,4 L4,20 L0,20 Z"
              fill="rgba(255, 255, 255, 0.5)"
            />
          </g>
        </motion.g>
        
        {/* Floating geometric elements */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          {/* Small decorative elements */}
          <circle cx="150" cy="150" r="3" fill="rgba(255, 255, 255, 0.6)" />
          <circle cx="650" cy="450" r="3" fill="rgba(255, 255, 255, 0.6)" />
          <circle cx="200" cy="450" r="2" fill="rgba(255, 255, 255, 0.4)" />
          <circle cx="600" cy="150" r="2" fill="rgba(255, 255, 255, 0.4)" />
          
          {/* Small geometric shapes */}
          <rect x="120" y="400" width="6" height="6" fill="rgba(212, 175, 55, 0.6)" transform="rotate(45 123 403)" />
          <rect x="670" y="200" width="6" height="6" fill="rgba(212, 175, 55, 0.6)" transform="rotate(45 673 203)" />
        </motion.g>
        
        {/* Central glow overlay */}
        <ellipse cx="400" cy="300" rx="200" ry="150" fill="url(#centerGlow)" />
        
        {/* Subtle texture overlay */}
        <rect width="800" height="600" fill="url(#centerGlow)" opacity="0.1" />
      </svg>
      
      {/* Text overlay area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="space-y-6"
          >
            {/* This will be filled by the parent component */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
