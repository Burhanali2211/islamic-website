import React, { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

// Simple Input Component
interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const EnhancedInput = forwardRef<HTMLInputElement, SimpleInputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

// Simple Textarea Component
interface SimpleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const EnhancedTextarea = forwardRef<HTMLTextAreaElement, SimpleTextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

// Simple Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const EnhancedSelect: React.FC<SimpleSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  placeholder = 'Select an option',
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            dark:bg-gray-700 dark:border-gray-600 dark:text-white
            ${error ? 'border-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
    </div>
  );
};
