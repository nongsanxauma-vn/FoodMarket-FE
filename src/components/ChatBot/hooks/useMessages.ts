/**
 * useMessages Hook
 * Hook for message management functionality
 */

import { useCallback } from 'react';
import { useChatBotContext } from '../ChatBotContext';
import { ChatMessage, UseMessagesReturn } from '../types';

/**
 * Messages management hook
 * Provides functionality for managing chat messages
 */
export function useMessages(): UseMessagesReturn {
  const context = useChatBotContext();

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add a new message
  const addMessage = useCallback((messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const message: ChatMessage = {
      ...messageData,
      id: generateMessageId(),
      timestamp: new Date()
    };

    // For now, we'll use the sendMessage from context for user messages
    // and let the context handle AI responses
    if (messageData.sender === 'user' && messageData.type === 'text') {
      context.sendMessage(messageData.content);
    }
  }, [context, generateMessageId]);

  // Update an existing message
  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    // This would need to be implemented in the context reducer
    // For now, we'll log this as it's not directly supported by the current context
    console.warn('updateMessage not directly supported. Use context actions instead.');
  }, []);

  // Remove a message
  const removeMessage = useCallback((id: string) => {
    // This would need to be implemented in the context reducer
    // For now, we'll log this as it's not directly supported by the current context
    console.warn('removeMessage not directly supported. Use context actions instead.');
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    context.clearHistory();
  }, [context]);

  return {
    messages: context.messages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages
  };
}