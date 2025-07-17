import { z } from 'zod';

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  isbn: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  arabicText: /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\p{P}]+$/u,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
};

// Custom validation functions
export const CustomValidators = {
  // Validate Arabic text
  arabicText: (value: string) => {
    if (!value) return true;
    return ValidationPatterns.arabicText.test(value);
  },

  // Validate password strength
  strongPassword: (value: string, requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  }) => {
    const reqs = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      ...requirements
    };

    const checks = {
      length: value.length >= reqs.minLength,
      uppercase: reqs.requireUppercase ? /[A-Z]/.test(value) : true,
      lowercase: reqs.requireLowercase ? /[a-z]/.test(value) : true,
      numbers: reqs.requireNumbers ? /\d/.test(value) : true,
      special: reqs.requireSpecialChars ? /[!@#$%^&*(),.?":{}|<>]/.test(value) : true,
    };

    return Object.values(checks).every(Boolean);
  },

  // Validate file size
  fileSize: (file: File, maxSizeMB: number) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },

  // Validate file type
  fileType: (file: File, allowedTypes: string[]) => {
    return allowedTypes.some(type => {
      if (type.includes('/')) {
        return file.type === type;
      } else {
        return file.name.toLowerCase().endsWith(`.${type.toLowerCase()}`);
      }
    });
  },

  // Validate date range
  dateRange: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  },

  // Validate age
  age: (birthDate: string, minAge: number = 0, maxAge: number = 150) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= minAge && age - 1 <= maxAge;
    }
    
    return age >= minAge && age <= maxAge;
  },

  // Validate unique values in array
  uniqueArray: (values: any[]) => {
    return new Set(values).size === values.length;
  }
};

// Zod schemas for common form types
export const CommonSchemas = {
  // User registration schema
  userRegistration: z.object({
    full_name: z.string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be less than 100 characters'),
    name_arabic: z.string()
      .optional()
      .refine(val => !val || CustomValidators.arabicText(val), 'Please enter valid Arabic text'),
    email: z.string()
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .refine(val => CustomValidators.strongPassword(val), 
        'Password must contain uppercase, lowercase, number, and special character'),
    confirmPassword: z.string(),
    phone: z.string()
      .optional()
      .refine(val => !val || ValidationPatterns.phone.test(val), 'Please enter a valid phone number'),
    role: z.enum(['student', 'teacher', 'admin']),
    class_level: z.string().optional(),
    guardian_name: z.string().optional(),
    guardian_phone: z.string()
      .optional()
      .refine(val => !val || ValidationPatterns.phone.test(val), 'Please enter a valid guardian phone number'),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),

  // Book creation schema
  bookCreation: z.object({
    title: z.string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must be less than 200 characters'),
    title_arabic: z.string()
      .optional()
      .refine(val => !val || CustomValidators.arabicText(val), 'Please enter valid Arabic text'),
    author_name: z.string()
      .min(2, 'Author name must be at least 2 characters')
      .max(100, 'Author name must be less than 100 characters'),
    author_arabic: z.string()
      .optional()
      .refine(val => !val || CustomValidators.arabicText(val), 'Please enter valid Arabic text'),
    category: z.enum([
      'quran', 'hadith', 'fiqh', 'tafsir', 'aqeedah', 'seerah', 'history',
      'biography', 'dua', 'islamic_law', 'arabic_language', 'islamic_ethics',
      'comparative_religion', 'islamic_philosophy', 'sufism', 'general'
    ]),
    subcategory: z.string().optional(),
    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must be less than 1000 characters'),
    description_arabic: z.string()
      .optional()
      .refine(val => !val || CustomValidators.arabicText(val), 'Please enter valid Arabic text'),
    language: z.enum(['ar', 'en', 'ur', 'fa', 'tr']),
    isbn: z.string()
      .optional()
      .refine(val => !val || ValidationPatterns.isbn.test(val), 'Please enter a valid ISBN'),
    publisher: z.string().optional(),
    publisher_arabic: z.string()
      .optional()
      .refine(val => !val || CustomValidators.arabicText(val), 'Please enter valid Arabic text'),
    published_date: z.string().optional(),
    pages: z.number()
      .min(1, 'Pages must be at least 1')
      .max(10000, 'Pages must be less than 10,000'),
    physical_copies: z.number()
      .min(0, 'Physical copies cannot be negative')
      .max(1000, 'Physical copies must be less than 1,000'),
    is_featured: z.boolean().optional(),
  }),

  // Borrowing record schema
  borrowingRecord: z.object({
    user_id: z.string().min(1, 'Borrower is required'),
    book_id: z.string().min(1, 'Book is required'),
    due_date: z.string()
      .min(1, 'Due date is required')
      .refine(val => {
        const dueDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate >= today;
      }, 'Due date must be today or in the future'),
    notes: z.string()
      .max(500, 'Notes must be less than 500 characters')
      .optional(),
  }),

  // Contact form schema
  contactForm: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z.string()
      .email('Please enter a valid email address'),
    subject: z.string()
      .min(5, 'Subject must be at least 5 characters')
      .max(200, 'Subject must be less than 200 characters'),
    message: z.string()
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message must be less than 2000 characters'),
  }),

  // Settings form schema
  settingsForm: z.object({
    site_name: z.string()
      .min(3, 'Site name must be at least 3 characters')
      .max(100, 'Site name must be less than 100 characters'),
    site_description: z.string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
    contact_email: z.string()
      .email('Please enter a valid email address'),
    contact_phone: z.string()
      .optional()
      .refine(val => !val || ValidationPatterns.phone.test(val), 'Please enter a valid phone number'),
    max_books_per_user: z.number()
      .min(1, 'Must allow at least 1 book per user')
      .max(50, 'Cannot exceed 50 books per user'),
    borrowing_period_days: z.number()
      .min(1, 'Borrowing period must be at least 1 day')
      .max(365, 'Borrowing period cannot exceed 365 days'),
    fine_per_day: z.number()
      .min(0, 'Fine cannot be negative')
      .max(1000, 'Fine per day cannot exceed 1000'),
    enable_notifications: z.boolean(),
    enable_fines: z.boolean(),
  }),
};

// Form validation utility class
export class FormValidator {
  private errors: Record<string, string> = {};

  // Validate a single field
  validateField(fieldName: string, value: any, rules: any): boolean {
    try {
      rules.parse(value);
      delete this.errors[fieldName];
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors[fieldName] = error.errors[0]?.message || 'Invalid value';
      }
      return false;
    }
  }

  // Validate entire form
  validateForm(data: any, schema: z.ZodSchema): { isValid: boolean; errors: Record<string, string> } {
    try {
      schema.parse(data);
      this.errors = {};
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          this.errors[path] = err.message;
        });
      }
      return { isValid: false, errors: this.errors };
    }
  }

  // Get error for specific field
  getFieldError(fieldName: string): string | undefined {
    return this.errors[fieldName];
  }

  // Check if field has error
  hasFieldError(fieldName: string): boolean {
    return !!this.errors[fieldName];
  }

  // Clear all errors
  clearErrors(): void {
    this.errors = {};
  }

  // Clear specific field error
  clearFieldError(fieldName: string): void {
    delete this.errors[fieldName];
  }

  // Get all errors
  getAllErrors(): Record<string, string> {
    return { ...this.errors };
  }

  // Check if form has any errors
  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }
}

// Export a default validator instance
export const formValidator = new FormValidator();

// Utility functions for common validations
export const ValidationUtils = {
  // Check if email is already in use (would need API call)
  isEmailUnique: async (email: string): Promise<boolean> => {
    // This would make an API call to check email uniqueness
    // For now, return true as placeholder
    return true;
  },

  // Validate file upload
  validateFileUpload: (
    files: File[], 
    options: {
      maxSize?: number; // MB
      allowedTypes?: string[];
      maxFiles?: number;
    } = {}
  ): { isValid: boolean; errors: string[] } => {
    const { maxSize = 10, allowedTypes = [], maxFiles = 1 } = options;
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} file(s) allowed`);
    }

    files.forEach((file, index) => {
      if (!CustomValidators.fileSize(file, maxSize)) {
        errors.push(`File ${index + 1}: Size exceeds ${maxSize}MB limit`);
      }

      if (allowedTypes.length > 0 && !CustomValidators.fileType(file, allowedTypes)) {
        errors.push(`File ${index + 1}: Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  // Sanitize input to prevent XSS
  sanitizeInput: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  // Format validation error messages
  formatErrorMessage: (error: z.ZodError): string[] => {
    return error.errors.map(err => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });
  }
};
