/**
 * Message Utilities
 * Helper functions for message handling
 */

import { ChatMessage } from '../types';

/**
 * Generate unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create user message
 */
export function createUserMessage(content: string): Omit<ChatMessage, 'id' | 'timestamp'> {
  return {
    content,
    sender: 'user',
    type: 'text',
    status: 'sending'
  };
}

/**
 * Create AI message
 */
export function createAIMessage(content: string): Omit<ChatMessage, 'id' | 'timestamp'> {
  return {
    content,
    sender: 'ai',
    type: 'text',
    status: 'delivered'
  };
}

/**
 * Create system message
 */
export function createSystemMessage(content: string): Omit<ChatMessage, 'id' | 'timestamp'> {
  return {
    content,
    sender: 'ai',
    type: 'system',
    status: 'delivered'
  };
}

/**
 * Validate message content
 */
export function validateMessage(content: string): boolean {
  return content.trim().length > 0 && content.length <= 1000;
}

/**
 * Get message display time
 */
export function getMessageDisplayTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Vừa xong';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} phút trước`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} giờ trước`;
  }
  
  // More than 24 hours
  return timestamp.toLocaleDateString('vi-VN');
}