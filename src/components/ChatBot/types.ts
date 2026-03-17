/**
 * AI ChatBot Types
 * TypeScript interfaces for AI Chatbot functionality
 */

import { SupportedLanguage } from './utils/languageUtils';

// Core Message Types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'system' | 'action';
  status: 'sending' | 'sent' | 'delivered' | 'failed';
  metadata?: {
    productId?: number;
    orderId?: number;
    actionType?: string;
    retryCount?: number;
    maxRetries?: number;
    retryable?: boolean;
    queued?: boolean;
    actions?: ChatAction[];
  };
}

// Chat Context Types
export interface ChatContext {
  userId: number;
  userRole: 'BUYER' | 'SHOP_OWNER' | 'SHIPPER';
  sessionId: string;
  conversationHistory: ChatMessage[];
  userPreferences?: {
    language: 'vi' | 'en';
    categories: string[];
    location?: string;
  };
  currentPage?: string;
  recentProducts?: number[];
  recentOrders?: number[];
  // User profile data for personalization
  userProfile?: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    shopName?: string;
    description?: string;
    ratingAverage?: number;
    status: string;
    kycStatus?: string;
    orderHistory?: OrderSummary[];
    favoriteCategories?: string[];
    purchasePatterns?: PurchasePattern[];
  };
}

// Supporting types for user profile personalization
export interface OrderSummary {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemCount: number;
  categories: string[];
}

export interface PurchasePattern {
  category: string;
  frequency: number;
  averageAmount: number;
  lastPurchase: string;
}

// AI Response Types
export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: ChatAction[];
  context?: ChatContext;
}

export interface ChatAction {
  type: 'view_product' | 'track_order' | 'add_to_cart' | 'contact_support';
  label: string;
  data: any;
}

export interface AIResponse {
  message: string;
  confidence: number;
  intent: string;
  entities: {
    productName?: string;
    orderId?: string;
    category?: string;
    action?: string;
  };
  suggestions: string[];
  actions: ChatAction[];
  needsHumanSupport: boolean;
}

// Backend API Response Types (matching existing pattern)
export interface ChatHistoryResponse {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string; // ISO datetime string
  type: 'text' | 'suggestion' | 'system';
  metadata?: {
    productId?: number;
    orderId?: number;
    actionType?: string;
  };
}

// Service Interface
export interface ChatBotService {
  sendMessage(message: string, context?: ChatContext): Promise<ChatResponse>;
  getChatHistory(): Promise<ChatHistoryResponse[]>;
  clearChatHistory(): Promise<void>;
  getSuggestions(context?: ChatContext): string[];
  // User profile personalization methods
  buildUserProfileContext(userId: number): Promise<ChatContext['userProfile'] | undefined>;
  sendMessageWithPersonalization(message: string, context?: ChatContext): Promise<ChatResponse>;
  // Language support methods
  switchLanguage(language: SupportedLanguage): void;
  getCurrentLanguage(): SupportedLanguage;
  getContextualSuggestions(lastMessage: string, userRole: string, language?: SupportedLanguage): string[];
}

// React Component Props
export interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
  userId?: number;
  userRole?: 'BUYER' | 'SHOP_OWNER' | 'SHIPPER';
}

export interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onLoadMore: () => void;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export interface SuggestionsPanelProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  isVisible: boolean;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
  onActionClick?: (action: ChatAction) => void;
}

export interface TypingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

// Context Types
export interface ChatBotContextType {
  // State
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: import('./utils/errorUtils').ChatBotError | null;
  isOnline: boolean;
  syncStatus: import('./utils/offlineUtils').SyncStatus;
  
  // Actions
  toggleChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  
  // Suggestions
  suggestions: string[];
  selectSuggestion: (suggestion: string) => void;
  
  // Offline support
  syncOfflineMessages: () => Promise<void>;
  getOfflineStatus: () => import('./utils/offlineUtils').SyncStatus;
  clearOfflineQueue: () => void;
  
  // Error handling
  getErrorMessage: (error: import('./utils/errorUtils').ChatBotError) => {
    message: string;
    suggestions: string[];
    actions: Array<{ type: string; label: string; }>;
  };
  dismissError: () => void;
}

// Hook Return Types
export interface UseChatBotReturn extends ChatBotContextType {}

export interface UseMessagesReturn {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export interface UseSuggestionsReturn {
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  addSuggestion: (suggestion: string) => void;
  clearSuggestions: () => void;
}