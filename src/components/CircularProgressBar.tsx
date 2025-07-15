import React from 'react';

interface CircularProgressBarProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgressBar({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  color = 'text-green-500'
}: CircularProgressBarProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-300`}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
