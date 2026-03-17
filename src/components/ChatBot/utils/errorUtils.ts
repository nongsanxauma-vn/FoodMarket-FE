/**
 * Error Handling Utilities for ChatBot
 * Comprehensive error handling with retry mechanisms and fallbacks
 */

import { SupportedLanguage } from './languageUtils';

// Error Types
export interface ChatBotError extends Error {
  code: string;
  status?: number;
  retryable: boolean;
  userMessage: string;
  originalError?: Error;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableStatuses: number[];
}

export interface NetworkStatus {
  isOnline: boolean;
  lastOnlineTime?: Date;
  connectionType?: string;
}

// Default retry configuration
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504]
};

// Error codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  OFFLINE_ERROR: 'OFFLINE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

/**
 * Create a ChatBot-specific error
 */
export function createChatBotError(
  code: string,
  message: string,
  userMessage: string,
  options: {
    status?: number;
    retryable?: boolean;
    originalError?: Error;
  } = {}
): ChatBotError {
  const error = new Error(message) as ChatBotError;
  error.code = code;
  error.status = options.status;
  error.retryable = options.retryable ?? false;
  error.userMessage = userMessage;
  error.originalError = options.originalError;
  return error;
}

/**
 * Parse and categorize errors from API responses
 */
export function parseApiError(error: any, language: SupportedLanguage = 'vi'): ChatBotError {
  // Network/Connection errors
  if (!navigator.onLine) {
    return createChatBotError(
      ERROR_CODES.OFFLINE_ERROR,
      'No internet connection',
      language === 'en' 
        ? 'You appear to be offline. Please check your internet connection.'
        : 'Bạn đang offline. Vui lòng kiểm tra kết nối internet.',
      { retryable: true, originalError: error }
    );
  }

  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return createChatBotError(
      ERROR_CODES.TIMEOUT_ERROR,
      'Request timeout',
      language === 'en'
        ? 'Request timed out. Please check your connection and try again.'
        : 'Yêu cầu hết thời gian chờ. Vui lòng kiểm tra kết nối và thử lại.',
      { status: 408, retryable: true, originalError: error }
    );
  }

  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return createChatBotError(
      ERROR_CODES.NETWORK_ERROR,
      'Network connection failed',
      language === 'en'
        ? 'Network connection failed. Please check your internet and try again.'
        : 'Kết nối mạng thất bại. Vui lòng kiểm tra internet và thử lại.',
      { retryable: true, originalError: error }
    );
  }

  // HTTP Status-based errors
  const status = error.status || error.response?.status;
  
  switch (status) {
    case 400:
      return createChatBotError(
        ERROR_CODES.VALIDATION_ERROR,
        'Invalid request',
        language === 'en'
          ? 'Invalid request. Please check your input and try again.'
          : 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin và thử lại.',
        { status, retryable: false, originalError: error }
      );

    case 401:
    case 403:
      return createChatBotError(
        ERROR_CODES.AUTH_ERROR,
        'Authentication failed',
        language === 'en'
          ? 'Authentication failed. Please log in again.'
          : 'Xác thực thất bại. Vui lòng đăng nhập lại.',
        { status, retryable: false, originalError: error }
      );

    case 429:
      return createChatBotError(
        ERROR_CODES.RATE_LIMIT_ERROR,
        'Too many requests',
        language === 'en'
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Quá nhiều yêu cầu. Vui lòng đợi một chút và thử lại.',
        { status, retryable: true, originalError: error }
      );

    case 500:
    case 502:
    case 503:
    case 504:
      return createChatBotError(
        ERROR_CODES.SERVER_ERROR,
        'Server error',
        language === 'en'
          ? 'Server is temporarily unavailable. Please try again later.'
          : 'Máy chủ tạm thời không khả dụng. Vui lòng thử lại sau.',
        { status, retryable: true, originalError: error }
      );

    default:
      // AI Service specific errors
      if (error.message?.includes('AI') || error.message?.includes('chatbot')) {
        return createChatBotError(
          ERROR_CODES.AI_SERVICE_ERROR,
          'AI service error',
          language === 'en'
            ? 'AI service is temporarily unavailable. Please try again later.'
            : 'Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.',
          { status, retryable: true, originalError: error }
        );
      }

      return createChatBotError(
        ERROR_CODES.UNKNOWN_ERROR,
        'Unknown error occurred',
        language === 'en'
          ? 'An unexpected error occurred. Please try again.'
          : 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
        { status, retryable: true, originalError: error }
      );
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error;

  for (let attempt = 1; attempt <= retryConfig.maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry for non-retryable errors
      const chatBotError = parseApiError(error);
      if (!chatBotError.retryable) {
        throw chatBotError;
      }

      // Don't retry on the last attempt
      if (attempt > retryConfig.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
        retryConfig.maxDelay
      );

      console.log(`Retry attempt ${attempt}/${retryConfig.maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw parseApiError(lastError);
}

/**
 * Network status monitoring
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private networkStatus: NetworkStatus = { isOnline: navigator.onLine };
  private listeners: ((status: NetworkStatus) => void)[] = [];

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.networkStatus = { 
        isOnline: true,
        lastOnlineTime: new Date(),
        connectionType: (navigator as any).connection?.effectiveType || 'unknown'
      };
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.networkStatus = { 
        isOnline: false,
        lastOnlineTime: this.networkStatus.lastOnlineTime
      };
      this.notifyListeners();
    });

    // Monitor connection type changes if available
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', () => {
        this.networkStatus = {
          ...this.networkStatus,
          connectionType: (navigator as any).connection.effectiveType
        };
        this.notifyListeners();
      });
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.networkStatus));
  }

  getStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  addListener(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

/**
 * Input validation and sanitization
 */
export function validateAndSanitizeInput(input: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  let sanitized = input;

  // Check for empty input
  if (!input || input.trim().length === 0) {
    errors.push('Input cannot be empty');
    return { isValid: false, sanitized: '', errors };
  }

  // Check length limits
  const MAX_LENGTH = 2000;
  if (input.length > MAX_LENGTH) {
    errors.push(`Input too long (max ${MAX_LENGTH} characters)`);
    sanitized = input.substring(0, MAX_LENGTH);
  }

  // Basic XSS prevention - remove script tags and dangerous attributes
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^>\s]+/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /eval\s*\(/i,
    /document\s*\.\s*cookie/i,
    /window\s*\.\s*location/i,
    /<\s*img[^>]*src\s*=\s*["']?javascript:/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      errors.push('Input contains potentially dangerous content');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Error logging with privacy protection
 */
export function logError(error: ChatBotError, context?: any): void {
  // Don't log in production or if user has opted out
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const logData = {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    status: error.status,
    retryable: error.retryable,
    userAgent: navigator.userAgent,
    url: window.location.href,
    // Remove sensitive data from context
    context: context ? sanitizeLogContext(context) : undefined
  };

  console.error('ChatBot Error:', logData);
}

/**
 * Remove sensitive information from log context
 */
function sanitizeLogContext(context: any): any {
  if (!context || typeof context !== 'object') {
    return context;
  }

  const sensitiveKeys = ['password', 'token', 'auth', 'key', 'secret', 'email', 'phone'];
  const sanitized = { ...context };

  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogContext(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Get user-friendly error message with fallback suggestions
 */
export function getErrorMessage(error: ChatBotError, language: SupportedLanguage = 'vi'): {
  message: string;
  suggestions: string[];
  actions: Array<{ type: string; label: string; }>;
} {
  const suggestions: string[] = [];
  const actions: Array<{ type: string; label: string; }> = [];

  // Add retry action for retryable errors
  if (error.retryable) {
    actions.push({
      type: 'retry',
      label: language === 'en' ? 'Try Again' : 'Thử Lại'
    });
  }

  // Error-specific suggestions and actions
  switch (error.code) {
    case ERROR_CODES.OFFLINE_ERROR:
      suggestions.push(
        ...(language === 'en' ? [
          'Check your internet connection',
          'Try connecting to a different network',
          'Contact your network administrator'
        ] : [
          'Kiểm tra kết nối internet',
          'Thử kết nối mạng khác',
          'Liên hệ quản trị viên mạng'
        ])
      );
      break;

    case ERROR_CODES.AUTH_ERROR:
      suggestions.push(
        ...(language === 'en' ? [
          'Log in to your account',
          'Check your credentials',
          'Reset your password if needed'
        ] : [
          'Đăng nhập vào tài khoản',
          'Kiểm tra thông tin đăng nhập',
          'Đặt lại mật khẩu nếu cần'
        ])
      );
      actions.push({
        type: 'login',
        label: language === 'en' ? 'Log In' : 'Đăng Nhập'
      });
      break;

    case ERROR_CODES.AI_SERVICE_ERROR:
      suggestions.push(
        ...(language === 'en' ? [
          'Try asking a simpler question',
          'Contact customer support',
          'Check our FAQ section'
        ] : [
          'Thử hỏi câu hỏi đơn giản hơn',
          'Liên hệ hỗ trợ khách hàng',
          'Xem mục câu hỏi thường gặp'
        ])
      );
      actions.push({
        type: 'contact_support',
        label: language === 'en' ? 'Contact Support' : 'Liên Hệ Hỗ Trợ'
      });
      break;

    case ERROR_CODES.RATE_LIMIT_ERROR:
      suggestions.push(
        ...(language === 'en' ? [
          'Wait a few moments before trying again',
          'Reduce the frequency of your requests'
        ] : [
          'Đợi một chút trước khi thử lại',
          'Giảm tần suất gửi yêu cầu'
        ])
      );
      break;

    default:
      suggestions.push(
        ...(language === 'en' ? [
          'Try refreshing the page',
          'Contact support if the problem persists',
          'Check our status page'
        ] : [
          'Thử làm mới trang',
          'Liên hệ hỗ trợ nếu vấn đề tiếp tục',
          'Kiểm tra trang trạng thái'
        ])
      );
      actions.push({
        type: 'refresh',
        label: language === 'en' ? 'Refresh Page' : 'Làm Mới Trang'
      });
      break;
  }

  return {
    message: error.userMessage,
    suggestions,
    actions
  };
}