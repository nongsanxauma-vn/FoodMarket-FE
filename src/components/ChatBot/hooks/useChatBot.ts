/**
 * useChatBot Hook
 * Main hook for ChatBot functionality
 */

import { useChatBotContext } from '../ChatBotContext';
import { UseChatBotReturn } from '../types';

/**
 * Main ChatBot hook that provides access to all ChatBot functionality
 * This is the primary hook that components should use to interact with the ChatBot
 */
export function useChatBot(): UseChatBotReturn {
  const context = useChatBotContext();
  
  return {
    // State
    isOpen: context.isOpen,
    messages: context.messages,
    isLoading: context.isLoading,
    error: context.error,
    suggestions: context.suggestions,

    // Actions
    toggleChat: context.toggleChat,
    sendMessage: context.sendMessage,
    clearHistory: context.clearHistory,
    loadHistory: context.loadHistory,
    selectSuggestion: context.selectSuggestion
  };
}