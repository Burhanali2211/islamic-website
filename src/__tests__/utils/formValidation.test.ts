import { describe, test, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateISBN,
  validatePhoneNumber,
  validateYear,
  validateBookForm,
  validateUserForm,
  validateBorrowingForm,
  sanitizeInput,
  formatValidationErrors
} from '../../utils/formValidation';

describe('formValidation utilities', () => {
  describe('validateEmail', () => {
    test('validates correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'admin@idarah-wali-ul-aser.org',
        'student123@university.edu'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    test('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..double.dot@domain.com',
        'user@domain',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    test('handles edge cases', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
      expect(validateEmail('   ')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MySecure@Pass2023',
        'Islamic#Library456',
        'Admin$Dashboard789'
      ];

      strongPasswords.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    test('rejects weak passwords', () => {
      const weakPasswords = [
        { password: '123', expectedErrors: ['too short', 'no uppercase', 'no lowercase', 'no special'] },
        { password: 'password', expectedErrors: ['no uppercase', 'no numbers', 'no special'] },
        { password: 'PASSWORD', expectedErrors: ['no lowercase', 'no numbers', 'no special'] },
        { password: 'Password', expectedErrors: ['no numbers', 'no special'] },
        { password: 'Pass123', expectedErrors: ['no special'] }
      ];

      weakPasswords.forEach(({ password, expectedErrors }) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    test('provides detailed error messages', () => {
      const result = validatePassword('weak');
      
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('validateISBN', () => {
    test('validates correct ISBN-10 formats', () => {
      const validISBN10 = [
        '0123456789',
        '0-123-45678-9',
        '0 123 45678 9'
      ];

      validISBN10.forEach(isbn => {
        expect(validateISBN(isbn)).toBe(true);
      });
    });

    test('validates correct ISBN-13 formats', () => {
      const validISBN13 = [
        '9780123456789',
        '978-0-123-45678-9',
        '978 0 123 45678 9'
      ];

      validISBN13.forEach(isbn => {
        expect(validateISBN(isbn)).toBe(true);
      });
    });

    test('rejects invalid ISBN formats', () => {
      const invalidISBNs = [
        '123456789', // Too short
        '01234567890', // Too long for ISBN-10
        '97801234567890', // Too long for ISBN-13
        'abcd-efgh-ijkl', // Non-numeric
        '978-0-123-45678-0', // Invalid check digit
        ''
      ];

      invalidISBNs.forEach(isbn => {
        expect(validateISBN(isbn)).toBe(false);
      });
    });
  });

  describe('validatePhoneNumber', () => {
    test('validates international phone formats', () => {
      const validPhones = [
        '+1234567890',
        '+91-9876543210',
        '+44 20 7946 0958',
        '+92 300 1234567' // Pakistan format
      ];

      validPhones.forEach(phone => {
        expect(validatePhoneNumber(phone)).toBe(true);
      });
    });

    test('validates local phone formats', () => {
      const validLocalPhones = [
        '(555) 123-4567',
        '555-123-4567',
        '5551234567',
        '0300-1234567' // Pakistan local format
      ];

      validLocalPhones.forEach(phone => {
        expect(validatePhoneNumber(phone)).toBe(true);
      });
    });

    test('rejects invalid phone formats', () => {
      const invalidPhones = [
        '123', // Too short
        'abc-def-ghij', // Non-numeric
        '+', // Just plus sign
        '++1234567890', // Double plus
        ''
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhoneNumber(phone)).toBe(false);
      });
    });
  });

  describe('validateYear', () => {
    test('validates reasonable year ranges', () => {
      const currentYear = new Date().getFullYear();
      const validYears = [
        600, // Early Islamic period
        1400, // Medieval period
        2000, // Modern era
        currentYear
      ];

      validYears.forEach(year => {
        expect(validateYear(year)).toBe(true);
      });
    });

    test('rejects invalid years', () => {
      const currentYear = new Date().getFullYear();
      const invalidYears = [
        0,
        -100,
        currentYear + 1, // Future year
        10000 // Too far in future
      ];

      invalidYears.forEach(year => {
        expect(validateYear(year)).toBe(false);
      });
    });
  });

  describe('validateBookForm', () => {
    test('validates complete book form', () => {
      const validBookData = {
        title: 'Sahih Bukhari',
        author: 'Imam Bukhari',
        category: 'hadith',
        isbn: '978-0123456789',
        description: 'Collection of authentic hadiths',
        language: 'arabic',
        pages: 500,
        publisher: 'Islamic Publications',
        publication_year: 850,
        is_featured: false,
        is_available: true
      };

      const result = validateBookForm(validBookData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('identifies missing required fields', () => {
      const incompleteBookData = {
        title: '',
        author: 'Imam Bukhari',
        category: '',
        isbn: 'invalid-isbn'
      };

      const result = validateBookForm(incompleteBookData);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toContain('Title is required');
      expect(result.errors.category).toContain('Category is required');
      expect(result.errors.isbn).toContain('Invalid ISBN format');
    });

    test('validates Islamic categories', () => {
      const bookWithInvalidCategory = {
        title: 'Test Book',
        author: 'Test Author',
        category: 'invalid-category',
        isbn: '978-0123456789'
      };

      const result = validateBookForm(bookWithInvalidCategory);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toContain('Invalid category');
    });

    test('validates page count', () => {
      const bookWithInvalidPages = {
        title: 'Test Book',
        author: 'Test Author',
        category: 'quran',
        pages: -10
      };

      const result = validateBookForm(bookWithInvalidPages);
      expect(result.isValid).toBe(false);
      expect(result.errors.pages).toContain('Pages must be a positive number');
    });
  });

  describe('validateUserForm', () => {
    test('validates complete user form', () => {
      const validUserData = {
        full_name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        password: 'SecurePass123!',
        role: 'student',
        phone: '+92-300-1234567'
      };

      const result = validateUserForm(validUserData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('validates Islamic names', () => {
      const validIslamicNames = [
        'Muhammad Abdullah',
        'Fatima Zahra',
        'Ali ibn Abi Talib',
        'Khadija bint Khuwaylid'
      ];

      validIslamicNames.forEach(name => {
        const userData = {
          full_name: name,
          email: 'test@example.com',
          password: 'SecurePass123!',
          role: 'student'
        };

        const result = validateUserForm(userData);
        expect(result.isValid).toBe(true);
      });
    });

    test('validates user roles', () => {
      const validRoles = ['student', 'teacher', 'admin'];
      
      validRoles.forEach(role => {
        const userData = {
          full_name: 'Test User',
          email: 'test@example.com',
          password: 'SecurePass123!',
          role: role
        };

        const result = validateUserForm(userData);
        expect(result.isValid).toBe(true);
      });

      // Test invalid role
      const invalidRoleData = {
        full_name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123!',
        role: 'invalid-role'
      };

      const result = validateUserForm(invalidRoleData);
      expect(result.isValid).toBe(false);
      expect(result.errors.role).toContain('Invalid role');
    });
  });

  describe('validateBorrowingForm', () => {
    test('validates borrowing form', () => {
      const validBorrowingData = {
        user_id: 'user-123',
        book_id: 'book-456',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      const result = validateBorrowingForm(validBorrowingData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('rejects past due dates', () => {
      const pastDueDateData = {
        user_id: 'user-123',
        book_id: 'book-456',
        due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
      };

      const result = validateBorrowingForm(pastDueDateData);
      expect(result.isValid).toBe(false);
      expect(result.errors.due_date).toContain('Due date cannot be in the past');
    });

    test('validates maximum borrowing period', () => {
      const tooLongBorrowingData = {
        user_id: 'user-123',
        book_id: 'book-456',
        due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
      };

      const result = validateBorrowingForm(tooLongBorrowingData);
      expect(result.isValid).toBe(false);
      expect(result.errors.due_date).toContain('Maximum borrowing period is 30 days');
    });
  });

  describe('sanitizeInput', () => {
    test('removes dangerous characters', () => {
      const dangerousInputs = [
        '<script>alert("xss")</script>',
        'DROP TABLE users;',
        '"><img src=x onerror=alert(1)>',
        'javascript:alert(1)'
      ];

      dangerousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('DROP TABLE');
      });
    });

    test('preserves safe content', () => {
      const safeInputs = [
        'Muhammad ibn Abdullah',
        'Tafsir al-Quran al-Azeem',
        'Published in 1365 AH',
        'Email: admin@library.org'
      ];

      safeInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe(input);
      });
    });

    test('handles Arabic text correctly', () => {
      const arabicText = 'محمد رسول الله';
      const sanitized = sanitizeInput(arabicText);
      expect(sanitized).toBe(arabicText);
    });
  });

  describe('formatValidationErrors', () => {
    test('formats single field errors', () => {
      const errors = {
        email: ['Invalid email format']
      };

      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('Email: Invalid email format');
    });

    test('formats multiple field errors', () => {
      const errors = {
        title: ['Title is required'],
        author: ['Author is required'],
        isbn: ['Invalid ISBN format', 'ISBN already exists']
      };

      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('Title: Title is required');
      expect(formatted).toContain('Author: Author is required');
      expect(formatted).toContain('ISBN: Invalid ISBN format, ISBN already exists');
    });

    test('handles empty errors object', () => {
      const errors = {};
      const formatted = formatValidationErrors(errors);
      expect(formatted).toBe('');
    });

    test('capitalizes field names correctly', () => {
      const errors = {
        full_name: ['Name is required'],
        publication_year: ['Invalid year']
      };

      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('Full Name:');
      expect(formatted).toContain('Publication Year:');
    });
  });
});
