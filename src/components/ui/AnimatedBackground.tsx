import React from 'react';
import { useSupabaseApp } from '../../context/SupabaseContext';

export function AnimatedBackground() {
  const { state } = useSupabaseApp();

  return (
    <div className="fixed inset-0 -z-10">
      {/* Clean, professional background */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.15) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Minimal geometric accent */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5 dark:opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor" className="text-emerald-600" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      {/* Bottom left accent */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5 dark:opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="islamic-pattern-2" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
              <rect x="7" y="7" width="1" height="1" fill="currentColor" className="text-gold" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#islamic-pattern-2)" />
        </svg>
      </div>
    </div>
  );
}
