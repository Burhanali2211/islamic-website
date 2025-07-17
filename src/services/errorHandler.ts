// Enhanced Error Handling Service
import { supabase } from '../lib/supabase';

export interface ErrorDetails {
  code?: string;
  message: string;
  details?: any;
  timestamp: number;
  userId?: string;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorResponse {
  success: boolean;
  error?: ErrorDetails;
  retryable?: boolean;
  retryAfter?: number;
}

class ErrorHandler {
  private errorLog: ErrorDetails[] = [];
  private readonly MAX_LOG_SIZE = 100;

  // ============================================================================
  // ERROR CLASSIFICATION
  // ============================================================================

  classifyError(error: any): ErrorDetails {
    const timestamp = Date.now();
    let severity: ErrorDetails['severity'] = 'medium';
    let retryable = false;
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';

    // Supabase specific errors
    if (error?.code) {
      code = error.code;
      message = error.message || message;

      switch (error.code) {
        case 'PGRST116': // No rows returned
          severity = 'low';
          message = 'No data found';
          break;
        case 'PGRST301': // Row Level Security violation
          severity = 'high';
          message = 'Access denied - insufficient permissions';
          break;
        case '23505': // Unique constraint violation
          severity = 'medium';
          message = 'This record already exists';
          break;
        case '23503': // Foreign key violation
          severity = 'medium';
          message = 'Cannot delete - record is referenced by other data';
          break;
        case '42P01': // Table does not exist
          severity = 'critical';
          message = 'Database configuration error';
          break;
        case 'PGRST204': // No content
          severity = 'low';
          message = 'Operation completed successfully';
          break;
        default:
          if (error.code.startsWith('23')) {
            severity = 'medium';
            message = 'Data validation error';
          } else if (error.code.startsWith('42')) {
            severity = 'high';
            message = 'Database schema error';
          }
      }
    }

    // Network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
      severity = 'medium';
      message = 'Network connection error - please check your internet connection';
      retryable = true;
      code = 'NETWORK_ERROR';
    }

    // Authentication errors
    if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
      severity = 'high';
      message = 'Authentication error - please sign in again';
      code = 'AUTH_ERROR';
    }

    // Rate limiting
    if (error?.status === 429) {
      severity = 'medium';
      message = 'Too many requests - please wait a moment';
      retryable = true;
      code = 'RATE_LIMIT';
    }

    // Server errors
    if (error?.status >= 500) {
      severity = 'high';
      message = 'Server error - please try again later';
      retryable = true;
      code = 'SERVER_ERROR';
    }

    return {
      code,
      message,
      details: error,
      timestamp,
      severity
    };
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  async handleError(error: any, context?: string, userId?: string): Promise<ErrorResponse> {
    const errorDetails = this.classifyError(error);
    errorDetails.context = context;
    errorDetails.userId = userId;

    // Log error
    this.logError(errorDetails);

    // Report critical errors
    if (errorDetails.severity === 'critical') {
      await this.reportCriticalError(errorDetails);
    }

    // Determine if retryable
    const retryable = this.isRetryable(errorDetails);
    const retryAfter = this.getRetryDelay(errorDetails);

    return {
      success: false,
      error: errorDetails,
      retryable,
      retryAfter
    };
  }

  // ============================================================================
  // ERROR LOGGING
  // ============================================================================

  private logError(error: ErrorDetails): void {
    // Add to in-memory log
    this.errorLog.unshift(error);
    
    // Keep log size manageable
    if (this.errorLog.length > this.MAX_LOG_SIZE) {
      this.errorLog = this.errorLog.slice(0, this.MAX_LOG_SIZE);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${error.severity.toUpperCase()}]`);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('Context:', error.context);
      console.error('Details:', error.details);
      console.groupEnd();
    }

    // Store in localStorage for persistence
    try {
      const storedErrors = JSON.parse(localStorage.getItem('idarah_error_log') || '[]');
      storedErrors.unshift(error);
      localStorage.setItem('idarah_error_log', JSON.stringify(storedErrors.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  private async reportCriticalError(error: ErrorDetails): Promise<void> {
    try {
      // In a real application, you might send this to an error reporting service
      // For now, we'll just log it to the database if possible
      await supabase
        .from('error_logs')
        .insert({
          code: error.code,
          message: error.message,
          details: error.details,
          context: error.context,
          user_id: error.userId,
          severity: error.severity,
          created_at: new Date(error.timestamp).toISOString()
        });
    } catch (reportError) {
      console.error('Failed to report critical error:', reportError);
    }
  }

  // ============================================================================
  // RETRY LOGIC
  // ============================================================================

  private isRetryable(error: ErrorDetails): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'RATE_LIMIT',
      'SERVER_ERROR',
      'PGRST001', // Connection error
      'PGRST003'  // Timeout
    ];

    return retryableCodes.includes(error.code || '');
  }

  private getRetryDelay(error: ErrorDetails): number {
    switch (error.code) {
      case 'RATE_LIMIT':
        return 60000; // 1 minute
      case 'NETWORK_ERROR':
        return 5000; // 5 seconds
      case 'SERVER_ERROR':
        return 30000; // 30 seconds
      default:
        return 10000; // 10 seconds
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getErrorLog(): ErrorDetails[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
    localStorage.removeItem('idarah_error_log');
  }

  getStoredErrorLog(): ErrorDetails[] {
    try {
      return JSON.parse(localStorage.getItem('idarah_error_log') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Get user-friendly error message
  getUserMessage(error: ErrorDetails): string {
    const islamicPhrases = [
      'SubhanAllah, there seems to be a technical issue.',
      'Alhamdulillah, we are working to resolve this.',
      'InshaAllah, please try again in a moment.',
      'May Allah make it easy for us to fix this issue.'
    ];

    const baseMessage = error.message;
    const islamicPhrase = islamicPhrases[Math.floor(Math.random() * islamicPhrases.length)];

    return `${islamicPhrase} ${baseMessage}`;
  }

  // Create error notification
  createErrorNotification(error: ErrorDetails): {
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
    duration?: number;
  } {
    let type: 'error' | 'warning' | 'info' = 'error';
    let duration = 5000;

    switch (error.severity) {
      case 'low':
        type = 'info';
        duration = 3000;
        break;
      case 'medium':
        type = 'warning';
        duration = 5000;
        break;
      case 'high':
      case 'critical':
        type = 'error';
        duration = 8000;
        break;
    }

    return {
      title: 'System Notification',
      message: this.getUserMessage(error),
      type,
      duration
    };
  }

  // Retry with exponential backoff
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        const errorDetails = this.classifyError(error);
        if (!this.isRetryable(errorDetails)) {
          break;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

export const errorHandler = new ErrorHandler();
