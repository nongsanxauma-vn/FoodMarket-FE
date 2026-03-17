/**
 * Storage Utilities
 * Helper functions for localStorage management
 */

import { ChatMessage, ChatContext } from '../types';

const STORAGE_PREFIX = 'chatbot_';

/**
 * Get storage key with prefix
 */
export function getStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Save chat messages to localStorage
 */
export function saveChatMessages(messages: ChatMessage[]): void {
  try {
    const key = getStorageKey('messages');
    localStorage.setItem(key, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat messages:', error);
  }
}

/**
 * Load chat messages from localStorage
 */
export function loadChatMessages(): ChatMessage[] {
  try {
    const key = getStorageKey('messages');
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return [];
    }
    
    const messages = JSON.parse(stored);
    
    // Convert timestamp strings back to Date objects
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load chat messages:', error);
    return [];
  }
}

/**
 * Save chat context to localStorage
 */
export function saveChatContext(context: ChatContext): void {
  try {
    const key = getStorageKey('context');
    localStorage.setItem(key, JSON.stringify(context));
  } catch (error) {
    console.error('Failed to save chat context:', error);
  }
}

/**
 * Load chat context from localStorage
 */
export function loadChatContext(): ChatContext | null {
  try {
    const key = getStorageKey('context');
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load chat context:', error);
    return null;
  }
}

/**
 * Clear all chat data from localStorage
 */
export function clearChatStorage(): void {
  try {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(STORAGE_PREFIX)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear chat storage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; available: number } {
  try {
    let used = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
        used += localStorage[key].length;
      }
    }
    
    // Estimate available space (5MB typical limit)
    const available = 5 * 1024 * 1024 - used;
    
    return { used, available };
  } catch {
    return { used: 0, available: 0 };
  }
}