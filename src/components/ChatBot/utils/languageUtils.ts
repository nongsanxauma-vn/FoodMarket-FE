/**
 * Language Utilities for ChatBot
 * Handle language detection and localization
 */

export type SupportedLanguage = 'vi' | 'en';

const LANGUAGE_STORAGE_KEY = 'chatbot_preferred_language';

/**
 * Get user's preferred language from various sources
 */
export function getUserPreferredLanguage(): SupportedLanguage {
  // 1. Check localStorage for saved preference
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage;
  if (savedLanguage && ['vi', 'en'].includes(savedLanguage)) {
    return savedLanguage;
  }

  // 2. Check browser language
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'vi';
  
  // Map browser language codes to supported languages
  if (browserLanguage.startsWith('en')) {
    return 'en';
  }
  
  if (browserLanguage.startsWith('vi')) {
    return 'vi';
  }

  // 3. Default to Vietnamese
  return 'vi';
}

/**
 * Set user's preferred language
 */
export function setUserPreferredLanguage(language: SupportedLanguage): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

/**
 * Get localized text for common UI elements
 */
export function getLocalizedText(key: string, language?: SupportedLanguage): string {
  const lang = language || getUserPreferredLanguage();
  
  const texts: Record<string, Record<SupportedLanguage, string>> = {
    // Common UI
    loading: {
      vi: 'Đang tải...',
      en: 'Loading...'
    },
    error: {
      vi: 'Lỗi',
      en: 'Error'
    },
    retry: {
      vi: 'Thử lại',
      en: 'Retry'
    },
    cancel: {
      vi: 'Hủy',
      en: 'Cancel'
    },
    close: {
      vi: 'Đóng',
      en: 'Close'
    },
    send: {
      vi: 'Gửi',
      en: 'Send'
    },
    
    // ChatBot specific
    chatbot_title: {
      vi: 'Trợ lý AI',
      en: 'AI Assistant'
    },
    chatbot_placeholder: {
      vi: 'Nhập tin nhắn...',
      en: 'Type a message...'
    },
    chatbot_welcome: {
      vi: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      en: 'Hello! How can I help you?'
    },
    chatbot_typing: {
      vi: 'Đang trả lời...',
      en: 'Typing...'
    },
    chatbot_offline: {
      vi: 'Chatbot hiện không khả dụng',
      en: 'Chatbot is currently unavailable'
    },
    
    // Error messages
    network_error: {
      vi: 'Lỗi kết nối mạng',
      en: 'Network connection error'
    },
    server_error: {
      vi: 'Lỗi máy chủ',
      en: 'Server error'
    },
    timeout_error: {
      vi: 'Hết thời gian chờ',
      en: 'Request timeout'
    },
    auth_error: {
      vi: 'Lỗi xác thực',
      en: 'Authentication error'
    },
    
    // Suggestions
    suggest_products: {
      vi: 'Tìm sản phẩm',
      en: 'Find products'
    },
    suggest_orders: {
      vi: 'Kiểm tra đơn hàng',
      en: 'Check orders'
    },
    suggest_support: {
      vi: 'Liên hệ hỗ trợ',
      en: 'Contact support'
    },
    suggest_help: {
      vi: 'Trợ giúp',
      en: 'Help'
    }
  };

  return texts[key]?.[lang] || texts[key]?.vi || key;
}

/**
 * Detect language from text content
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) {
    return getUserPreferredLanguage();
  }

  // Simple heuristic: check for Vietnamese characters
  const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  
  if (vietnameseChars.test(text)) {
    return 'vi';
  }

  // Check for common English words
  const commonEnglishWords = /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|over|after)\b/i;
  
  if (commonEnglishWords.test(text)) {
    return 'en';
  }

  // Default to user preference
  return getUserPreferredLanguage();
}

/**
 * Format numbers according to language locale
 */
export function formatNumber(number: number, language?: SupportedLanguage): string {
  const lang = language || getUserPreferredLanguage();
  
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format currency according to language locale
 */
export function formatCurrency(amount: number, language?: SupportedLanguage): string {
  const lang = language || getUserPreferredLanguage();
  
  if (lang === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

/**
 * Format date according to language locale
 */
export function formatDate(date: Date, language?: SupportedLanguage): string {
  const lang = language || getUserPreferredLanguage();
  
  const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Format relative time according to language locale
 */
export function formatRelativeTime(date: Date, language?: SupportedLanguage): string {
  const lang = language || getUserPreferredLanguage();
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return lang === 'vi' ? 'Vừa xong' : 'Just now';
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return lang === 'vi' 
      ? `${minutes} phút trước`
      : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return lang === 'vi'
      ? `${hours} giờ trước`
      : `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) {
    return lang === 'vi'
      ? `${days} ngày trước`
      : `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // For older dates, use full date format
  return formatDate(date, lang);
}

/**
 * Get language-specific suggestions for different user roles
 */
export function getRoleSuggestions(role: 'BUYER' | 'SHOP_OWNER' | 'SHIPPER', language?: SupportedLanguage): string[] {
  const lang = language || getUserPreferredLanguage();

  const suggestions = {
    BUYER: {
      vi: [
        'Tìm sản phẩm rau củ tươi',
        'Kiểm tra đơn hàng của tôi',
        'Sản phẩm nào đang khuyến mãi?',
        'Làm sao để liên hệ shop?',
        'Hướng dẫn thanh toán'
      ],
      en: [
        'Find fresh vegetables',
        'Check my orders',
        'What products are on sale?',
        'How to contact shops?',
        'Payment instructions'
      ]
    },
    SHOP_OWNER: {
      vi: [
        'Cách quản lý sản phẩm',
        'Xem doanh thu hôm nay',
        'Cập nhật thông tin shop',
        'Hướng dẫn sử dụng hệ thống',
        'Quản lý đơn hàng'
      ],
      en: [
        'How to manage products',
        'View today\'s revenue',
        'Update shop information',
        'System usage guide',
        'Manage orders'
      ]
    },
    SHIPPER: {
      vi: [
        'Đơn hàng cần giao gần đây',
        'Cách cập nhật trạng thái giao hàng',
        'Xem lịch sử giao hàng',
        'Liên hệ hỗ trợ',
        'Hướng dẫn sử dụng app'
      ],
      en: [
        'Nearby delivery orders',
        'How to update delivery status',
        'View delivery history',
        'Contact support',
        'App usage guide'
      ]
    }
  };

  return suggestions[role][lang];
}

/**
 * Get localized suggestions based on context and user preferences
 */
export function getLocalizedSuggestions(
  context: {
    userRole?: 'BUYER' | 'SHOP_OWNER' | 'SHIPPER';
    conversationHistory?: string[];
    currentTopic?: string;
  },
  language?: SupportedLanguage
): string[] {
  const lang = language || getUserPreferredLanguage();
  
  // If user role is provided, get role-specific suggestions
  if (context.userRole) {
    return getRoleSuggestions(context.userRole, lang);
  }

  // Default general suggestions
  const generalSuggestions = {
    vi: [
      'Tôi cần tìm sản phẩm',
      'Kiểm tra đơn hàng',
      'Hướng dẫn sử dụng',
      'Liên hệ hỗ trợ',
      'Câu hỏi thường gặp'
    ],
    en: [
      'I need to find products',
      'Check my order',
      'Usage guide',
      'Contact support',
      'Frequently asked questions'
    ]
  };

  return generalSuggestions[lang];
}

/**
 * Validate if a language is supported
 */
export function isSupportedLanguage(language: string): language is SupportedLanguage {
  return ['vi', 'en'].includes(language);
}