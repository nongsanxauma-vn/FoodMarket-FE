/**
 * ChatBot Context
 * React Context for managing chatbot state and actions with comprehensive error handling
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ChatMessage, ChatBotContextType, ChatContext } from './types';
import { chatBotService } from '../../services/chatbot.service';
import { 
  ChatBotError, 
  parseApiError, 
  withRetry, 
  NetworkMonitor, 
  validateAndSanitizeInput,
  logError,
  getErrorMessage,
  ERROR_CODES
} from './utils/errorUtils';
import { getUserPreferredLanguage } from './utils/languageUtils';
import { offlineUtils, OfflineMessage, SyncStatus } from './utils/offlineUtils';

// Local Storage Keys
const CHAT_STORAGE_KEY = 'foodmarket_chatbot_messages';
const CHAT_CONTEXT_KEY = 'foodmarket_chatbot_context';

// Action Types
type ChatBotAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ChatBotError | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }
  | { type: 'SET_NETWORK_STATUS'; payload: boolean }
  | { type: 'SET_SYNC_STATUS'; payload: SyncStatus }
  | { type: 'SET_RETRY_COUNT'; payload: { messageId: string; count: number } };

// State Interface
interface ChatBotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: ChatBotError | null;
  suggestions: string[];
  isOnline: boolean;
  syncStatus: SyncStatus;
  retryCount: Record<string, number>;
}

// Initial State
const initialState: ChatBotState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [],
  isOnline: navigator.onLine,
  syncStatus: {
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingMessages: 0,
    failedMessages: 0,
    isSyncing: false
  },
  retryCount: {}
};

// Reducer
function chatBotReducer(state: ChatBotState, action: ChatBotAction): ChatBotState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        error: null
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        )
      };
    
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], error: null, retryCount: {} };
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    
    case 'SET_NETWORK_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    
    case 'SET_RETRY_COUNT':
      return {
        ...state,
        retryCount: {
          ...state.retryCount,
          [action.payload.messageId]: action.payload.count
        }
      };
    
    default:
      return state;
  }
}

// Context
const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

// Provider Props
interface ChatBotProviderProps {
  children: React.ReactNode;
  userId?: number;
  userRole?: 'BUYER' | 'SHOP_OWNER' | 'SHIPPER';
}

// Provider Component
export function ChatBotProvider({ children, userId, userRole = 'BUYER' }: ChatBotProviderProps) {
  const [state, dispatch] = useReducer(chatBotReducer, initialState);
  const networkMonitor = NetworkMonitor.getInstance();
  const messageQueue = offlineUtils.messageQueue;
  const contextManager = offlineUtils.contextManager;

  // Network status and sync monitoring
  useEffect(() => {
    const unsubscribeNetwork = networkMonitor.addListener((status) => {
      dispatch({ type: 'SET_NETWORK_STATUS', payload: status.isOnline });
      
      // Trigger sync when coming back online
      if (status.isOnline) {
        syncOfflineMessages();
      }
    });

    const unsubscribeSync = messageQueue.addSyncListener((syncStatus) => {
      dispatch({ type: 'SET_SYNC_STATUS', payload: syncStatus });
    });

    return () => {
      unsubscribeNetwork();
      unsubscribeSync();
    };
  }, []);

  // Sync offline messages when network is restored
  const syncOfflineMessages = useCallback(async () => {
    if (!state.isOnline) return;

    try {
      await messageQueue.sync(async (message: string, context?: ChatContext) => {
        // Use the existing sendMessage logic but without UI updates
        return await chatBotService.sendMessageWithPersonalization(message, context);
      });
    } catch (error) {
      console.error('Failed to sync offline messages:', error);
    }
  }, [state.isOnline]);

  // Auto-sync on mount if online
  useEffect(() => {
    if (state.isOnline) {
      syncOfflineMessages();
    }
  }, [state.isOnline, syncOfflineMessages]);

  // Load messages from localStorage on mount with error handling
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        const messages: ChatMessage[] = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      }
    } catch (error) {
      console.error('Failed to load chat messages from localStorage:', error);
      const chatBotError = parseApiError(error, getUserPreferredLanguage());
      logError(chatBotError, { context: 'localStorage_load' });
    }
  }, []);

  // Save messages to localStorage whenever messages change with error handling
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state.messages));
    } catch (error) {
      console.error('Failed to save chat messages to localStorage:', error);
      const chatBotError = parseApiError(error, getUserPreferredLanguage());
      logError(chatBotError, { context: 'localStorage_save' });
    }
  }, [state.messages]);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Load initial suggestions based on user role and profile
  useEffect(() => {
    const loadPersonalizedSuggestions = async () => {
      // Get user's preferred language
      const preferredLanguage = chatBotService.getCurrentLanguage();
      
      let context: ChatContext = {
        userId: userId || 0,
        userRole,
        sessionId: generateSessionId(),
        conversationHistory: state.messages,
        userPreferences: {
          language: preferredLanguage,
          categories: [],
          location: undefined
        }
      };

      // Try to build user profile context for personalization
      if (userId && userId > 0) {
        try {
          const userProfile = await chatBotService.buildUserProfileContext(userId);
          if (userProfile) {
            context = { ...context, userProfile };
          }
        } catch (error) {
          console.warn('Could not load user profile for personalization:', error);
        }
      }
      
      const suggestions = chatBotService.getSuggestions(context);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    };

    loadPersonalizedSuggestions();
  }, [userId, userRole, generateSessionId]);

  // Toggle chat visibility
  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  // Send message to AI with comprehensive error handling and retry logic
  const sendMessage = useCallback(async (message: string) => {
    // Input validation and sanitization
    const validation = validateAndSanitizeInput(message);
    if (!validation.isValid) {
      const validationError = parseApiError(
        new Error(validation.errors.join(', ')),
        getUserPreferredLanguage()
      );
      dispatch({ type: 'SET_ERROR', payload: validationError });
      return;
    }

    const sanitizedMessage = validation.sanitized;
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      content: sanitizedMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    // Add user message immediately
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    // Check network status
    if (!state.isOnline) {
      // Add message to offline queue
      messageQueue.enqueue(userMessage, 'normal');
      
      // Generate offline response
      const offlineResponse = offlineUtils.generateOfflineResponse(getUserPreferredLanguage());
      dispatch({ type: 'ADD_MESSAGE', payload: offlineResponse });
      
      // Update user message status to queued
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { id: userMessage.id, updates: { status: 'sent', metadata: { ...userMessage.metadata, queued: true } } }
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      // Update message status to sent
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { id: userMessage.id, updates: { status: 'sent' } }
      });

      // Prepare context for AI with user profile and language
      const preferredLanguage = getUserPreferredLanguage();
      
      let context: ChatContext = {
        userId: userId || 0,
        userRole,
        sessionId: generateSessionId(),
        conversationHistory: [...state.messages, userMessage],
        userPreferences: {
          language: preferredLanguage,
          categories: [],
          location: undefined
        }
      };

      // Try to build user profile context for personalization
      if (userId && userId > 0) {
        try {
          const userProfile = await chatBotService.buildUserProfileContext(userId);
          if (userProfile) {
            context = { ...context, userProfile };
          }
        } catch (error) {
          console.warn('Could not load user profile for personalization:', error);
        }
      }

      // Send to AI service with retry mechanism
      const response = await withRetry(
        () => chatBotService.sendMessageWithPersonalization(sanitizedMessage, context),
        {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 5000,
          backoffMultiplier: 2,
          retryableStatuses: [408, 429, 500, 502, 503, 504]
        }
      );

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        content: response.message,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered',
        metadata: {
          actions: response.actions || []
        }
      };

      // Add AI response
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

      // Update suggestions if provided
      if (response.suggestions && response.suggestions.length > 0) {
        dispatch({ type: 'SET_SUGGESTIONS', payload: response.suggestions });
      }

      // Update user message status to delivered
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { id: userMessage.id, updates: { status: 'delivered' } }
      });

      // Reset retry count on success
      dispatch({ 
        type: 'SET_RETRY_COUNT', 
        payload: { messageId: userMessage.id, count: 0 }
      });

    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      // Parse and handle the error
      const chatBotError = parseApiError(error, getUserPreferredLanguage());
      logError(chatBotError, { 
        messageId: userMessage.id,
        userId,
        userRole,
        messageContent: sanitizedMessage.substring(0, 100) // Log first 100 chars only
      });

      // Update user message status to failed
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { id: userMessage.id, updates: { status: 'failed' } }
      });

      // Handle retryable errors
      if (chatBotError.retryable) {
        const currentRetryCount = state.retryCount[userMessage.id] || 0;
        const maxRetries = 3;

        if (currentRetryCount < maxRetries) {
          // Increment retry count
          dispatch({ 
            type: 'SET_RETRY_COUNT', 
            payload: { messageId: userMessage.id, count: currentRetryCount + 1 }
          });

          // Add retry metadata to message
          dispatch({ 
            type: 'UPDATE_MESSAGE', 
            payload: { 
              id: userMessage.id, 
              updates: { 
                metadata: { 
                  ...userMessage.metadata,
                  retryCount: currentRetryCount + 1,
                  maxRetries,
                  retryable: true
                }
              }
            }
          });
        }
      }

      // Set error with user-friendly message and suggestions
      dispatch({ type: 'SET_ERROR', payload: chatBotError });

    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [generateMessageId, generateSessionId, userId, userRole, state.messages, state.isOnline, state.retryCount]);

  // Retry failed message
  const retryMessage = useCallback(async (messageId: string) => {
    const message = state.messages.find(msg => msg.id === messageId);
    if (!message || message.sender !== 'user') {
      return;
    }

    // Reset message status and retry
    dispatch({ 
      type: 'UPDATE_MESSAGE', 
      payload: { id: messageId, updates: { status: 'sending' } }
    });

    await sendMessage(message.content);
  }, [state.messages, sendMessage]);

  // Load chat history from backend with error handling
  const loadHistory = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const historyResponse = await withRetry(
        () => chatBotService.getChatHistory(),
        { maxRetries: 2, baseDelay: 1000 }
      );
      
      // Convert backend response to ChatMessage format
      const messages: ChatMessage[] = historyResponse.map(item => ({
        id: item.id,
        content: item.content,
        sender: item.sender,
        timestamp: new Date(item.timestamp),
        type: item.type,
        status: 'delivered',
        metadata: item.metadata
      }));

      dispatch({ type: 'SET_MESSAGES', payload: messages });

    } catch (error: any) {
      console.error('Failed to load chat history:', error);
      const chatBotError = parseApiError(error, getUserPreferredLanguage());
      logError(chatBotError, { context: 'load_history', userId });
      dispatch({ type: 'SET_ERROR', payload: chatBotError });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userId]);

  // Clear chat history with error handling
  const clearHistory = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Clear from backend with retry
      await withRetry(
        () => chatBotService.clearChatHistory(),
        { maxRetries: 2, baseDelay: 1000 }
      );
      
      // Clear local state and storage
      dispatch({ type: 'CLEAR_MESSAGES' });
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_CONTEXT_KEY);

      // Reset suggestions to personalized defaults
      const preferredLanguage = getUserPreferredLanguage();
      
      let context: ChatContext = {
        userId: userId || 0,
        userRole,
        sessionId: generateSessionId(),
        conversationHistory: [],
        userPreferences: {
          language: preferredLanguage,
          categories: [],
          location: undefined
        }
      };

      // Try to build user profile context for personalization
      if (userId && userId > 0) {
        try {
          const userProfile = await chatBotService.buildUserProfileContext(userId);
          if (userProfile) {
            context = { ...context, userProfile };
          }
        } catch (error) {
          console.warn('Could not load user profile for personalization:', error);
        }
      }
      
      const suggestions = chatBotService.getSuggestions(context);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });

    } catch (error: any) {
      console.error('Failed to clear chat history:', error);
      const chatBotError = parseApiError(error, getUserPreferredLanguage());
      logError(chatBotError, { context: 'clear_history', userId });
      dispatch({ type: 'SET_ERROR', payload: chatBotError });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [generateSessionId, userId, userRole]);

  // Select suggestion
  const selectSuggestion = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  // Context value
  const contextValue: ChatBotContextType = {
    // State
    isOpen: state.isOpen,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    suggestions: state.suggestions,
    isOnline: state.isOnline,
    syncStatus: state.syncStatus,

    // Actions
    toggleChat,
    sendMessage,
    clearHistory,
    loadHistory,
    selectSuggestion,
    retryMessage,
    
    // Offline support
    syncOfflineMessages,
    getOfflineStatus: () => messageQueue.getStatus(),
    clearOfflineQueue: () => messageQueue.clear(),
    
    // Error handling utilities
    getErrorMessage: (error: ChatBotError) => getErrorMessage(error, getUserPreferredLanguage()),
    dismissError: () => dispatch({ type: 'SET_ERROR', payload: null })
  };

  return (
    <ChatBotContext.Provider value={contextValue}>
      {children}
    </ChatBotContext.Provider>
  );
}

// Hook to use ChatBot context
export function useChatBotContext(): ChatBotContextType {
  const context = useContext(ChatBotContext);
  if (context === undefined) {
    throw new Error('useChatBotContext must be used within a ChatBotProvider');
  }
  return context;
}