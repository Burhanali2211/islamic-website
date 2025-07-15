import React from 'react';

interface IslamicAvatarProps {
  name: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IslamicAvatar({ name, role, size = 'md', className = '' }: IslamicAvatarProps) {
  // Generate consistent colors based on name
  const getAvatarColors = (name: string) => {
    const colors = [
      { bg: '#10b981', text: '#ffffff' }, // Emerald
      { bg: '#d4af37', text: '#ffffff' }, // Gold
      { bg: '#6366f1', text: '#ffffff' }, // Indigo
      { bg: '#ef4444', text: '#ffffff' }, // Red
      { bg: '#f59e0b', text: '#ffffff' }, // Amber
      { bg: '#8b5cf6', text: '#ffffff' }, // Violet
      { bg: '#059669', text: '#ffffff' }, // Emerald dark
      { bg: '#b8941f', text: '#ffffff' }, // Gold dark
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-20 h-20 text-2xl';
      default:
        return 'w-12 h-12 text-base';
    }
  };

  const colors = getAvatarColors(name);
  const initials = getInitials(name);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${getSizeClasses()} rounded-full flex items-center justify-center font-semibold shadow-md`}
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
        }}
      >
        {initials}
      </div>
      
      {/* Role indicator for larger avatars */}
      {role && size === 'lg' && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
            {role}
          </span>
        </div>
      )}
    </div>
  );
}

// Predefined avatars for common roles
export function StudentAvatar({ name, className }: { name: string; className?: string }) {
  return <IslamicAvatar name={name} role="Student" className={className} />;
}

export function ScholarAvatar({ name, className }: { name: string; className?: string }) {
  return <IslamicAvatar name={name} role="Scholar" className={className} />;
}

export function CommunityAvatar({ name, className }: { name: string; className?: string }) {
  return <IslamicAvatar name={name} role="Community Member" className={className} />;
}
