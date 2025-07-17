import React, { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Upload, 
  X, 
  Calendar,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Minus
} from 'lucide-react';

// Enhanced Input Component with validation and animations
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    label, 
    error, 
    success, 
    hint, 
    icon, 
    rightIcon, 
    loading, 
    showCharCount, 
    maxLength,
    validationRules,
    className = '',
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);
    const currentValue = props.value as string || '';
    const charCount = currentValue.length;

    const validateInput = (value: string) => {
      if (!validationRules) return null;

      if (validationRules.required && !value.trim()) {
        return 'This field is required';
      }

      if (validationRules.minLength && value.length < validationRules.minLength) {
        return `Minimum ${validationRules.minLength} characters required`;
      }

      if (validationRules.maxLength && value.length > validationRules.maxLength) {
        return `Maximum ${validationRules.maxLength} characters allowed`;
      }

      if (validationRules.pattern && !validationRules.pattern.test(value)) {
        return 'Invalid format';
      }

      if (validationRules.custom) {
        return validationRules.custom(value);
      }

      return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const validationError = validateInput(value);
      setInternalError(validationError);
      
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const displayError = error || internalError;
    const hasError = !!displayError;
    const hasSuccess = !!success && !hasError;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {validationRules?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full px-4 py-3 border rounded-xl transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                : hasSuccess
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
              }
              ${focused ? 'ring-4' : ''}
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            maxLength={maxLength}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {(displayError || success || hint || showCharCount) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-1"
            >
              {displayError && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{displayError}</span>
                </div>
              )}
              
              {success && !hasError && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>{success}</span>
                </div>
              )}
              
              {hint && !hasError && !success && (
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                  <Info className="h-4 w-4" />
                  <span>{hint}</span>
                </div>
              )}
              
              {showCharCount && maxLength && (
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                  {charCount}/{maxLength}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

// Enhanced Password Input
interface PasswordInputProps extends Omit<EnhancedInputProps, 'type'> {
  showStrengthMeter?: boolean;
  strengthRules?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showStrengthMeter = false,
  strengthRules = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');

  const calculateStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= (strengthRules.minLength || 8),
      uppercase: strengthRules.requireUppercase ? /[A-Z]/.test(password) : true,
      lowercase: strengthRules.requireLowercase ? /[a-z]/.test(password) : true,
      numbers: strengthRules.requireNumbers ? /\d/.test(password) : true,
      special: strengthRules.requireSpecialChars ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
    };

    Object.values(checks).forEach(check => {
      if (check) score += 20;
    });

    return { score, checks };
  };

  useEffect(() => {
    if (showStrengthMeter && props.value) {
      const { score } = calculateStrength(props.value as string);
      setStrength(score);
      
      if (score < 40) setStrengthText('Weak');
      else if (score < 60) setStrengthText('Fair');
      else if (score < 80) setStrengthText('Good');
      else setStrengthText('Strong');
    }
  }, [props.value, showStrengthMeter, strengthRules]);

  return (
    <div className="space-y-2">
      <EnhancedInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
      
      {showStrengthMeter && props.value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Password Strength:</span>
            <span className={`font-medium ${
              strength < 40 ? 'text-red-500' :
              strength < 60 ? 'text-yellow-500' :
              strength < 80 ? 'text-blue-500' :
              'text-green-500'
            }`}>
              {strengthText}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                strength < 40 ? 'bg-red-500' :
                strength < 60 ? 'bg-yellow-500' :
                strength < 80 ? 'bg-blue-500' :
                'bg-green-500'
              }`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Textarea Component
interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => string | null;
  };
}

export const EnhancedTextarea = forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({
    label,
    error,
    success,
    hint,
    showCharCount,
    maxLength,
    autoResize = false,
    validationRules,
    className = '',
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);
    const currentValue = props.value as string || '';
    const charCount = currentValue.length;

    const validateInput = (value: string) => {
      if (!validationRules) return null;

      if (validationRules.required && !value.trim()) {
        return 'This field is required';
      }

      if (validationRules.minLength && value.length < validationRules.minLength) {
        return `Minimum ${validationRules.minLength} characters required`;
      }

      if (validationRules.maxLength && value.length > validationRules.maxLength) {
        return `Maximum ${validationRules.maxLength} characters allowed`;
      }

      if (validationRules.custom) {
        return validationRules.custom(value);
      }

      return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const validationError = validateInput(value);
      setInternalError(validationError);

      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }

      if (props.onChange) {
        props.onChange(e);
      }
    };

    const displayError = error || internalError;
    const hasError = !!displayError;
    const hasSuccess = !!success && !hasError;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {validationRules?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none
            ${hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : hasSuccess
              ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
            }
            ${focused ? 'ring-4' : ''}
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          maxLength={maxLength}
        />

        <AnimatePresence>
          {(displayError || success || hint || showCharCount) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-1"
            >
              {displayError && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{displayError}</span>
                </div>
              )}

              {success && !hasError && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>{success}</span>
                </div>
              )}

              {hint && !hasError && !success && (
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
                  <Info className="h-4 w-4" />
                  <span>{hint}</span>
                </div>
              )}

              {showCharCount && maxLength && (
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                  {charCount}/{maxLength}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';

// File Upload Component
interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFileSelect?: (files: File[]) => void;
  error?: string;
  hint?: string;
  preview?: boolean;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  maxSize = 10,
  onFileSelect,
  error,
  hint,
  preview = false,
  disabled = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
    onFileSelect?.(validFiles);

    if (preview) {
      const newPreviews: string[] = [];
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target?.result as string);
            if (newPreviews.length === validFiles.length) {
              setPreviews(newPreviews);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onFileSelect?.(newFiles);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
          ${dragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : error
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) handleFileSelect(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept || '';
            input.multiple = multiple;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFileSelect(target.files);
            };
            input.click();
          }
        }}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {dragOver ? 'Drop files here' : 'Upload files'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop files here, or click to browse
          </div>
          {maxSize && (
            <div className="text-xs text-gray-400 mt-1">
              Maximum file size: {maxSize}MB
            </div>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {preview && previews[index] && (
                  <img src={previews[index]} alt="Preview" className="w-10 h-10 object-cover rounded" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
          <Info className="h-4 w-4" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
};

// Enhanced Select Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface EnhancedSelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  disabled = false,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : [])
  );

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange?.(newValues.join(','));
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = multiple
    ? selectedValues.length > 0
      ? `${selectedValues.length} selected`
      : placeholder
    : selectedOption?.label || placeholder;

  return (
    <div className="relative space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            w-full px-4 py-3 text-left border rounded-xl transition-all duration-200
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
            }
            ${isOpen ? 'ring-4 ring-blue-500/20' : ''}
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:border-gray-400 dark:hover:border-gray-500
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption || selectedValues.length > 0 ? '' : 'text-gray-500 dark:text-gray-400'}>
              {displayText}
            </span>
            <div className="flex items-center space-x-2">
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            >
              {searchable && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
              
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                      ${selectedValues.includes(option.value) 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-900 dark:text-white'
                      }
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {option.icon && <span>{option.icon}</span>}
                      <span>{option.label}</span>
                      {multiple && selectedValues.includes(option.value) && (
                        <CheckCircle className="h-4 w-4 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
                
                {filteredOptions.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                    No options found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-sm">
          <Info className="h-4 w-4" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
};
