/**
 * Memory management hooks for optimizing large conversations
 * Handles cleanup and memory-efficient data structures
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChatMessage } from '../chatbot.types';
export interface MemoryManagementOptions {
  maxMessages?: number;
  cleanupInterval?: number; // in milliseconds
  enableAutoCleanup?: boolean;
}

/**
 * Hook for managing message memory with automatic cleanup
 * @param messages - Array of chat messages
 * @param options - Memory management configuration
 * @returns Optimized messages and cleanup utilities
 */
export function useMessageMemoryManagement(
  messages: ChatMessage[],
  options: MemoryManagementOptions = {}
) {
  const {
    maxMessages = 1000,
    cleanupInterval = 300000, // 5 minutes
    enableAutoCleanup = true
  } = options;

  const [optimizedMessages, setOptimizedMessages] = useState<ChatMessage[]>(messages);
  const cleanupTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);


  // Cleanup old messages when limit is exceeded
  const cleanupMessages = useCallback((messageList: ChatMessage[]) => {
    if (messageList.length <= maxMessages) return messageList;

    // Keep the most recent messages
    const recentMessages = messageList.slice(-maxMessages);

    // Log cleanup for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`ChatBot: Cleaned up ${messageList.length - recentMessages.length} old messages`);
    }

    return recentMessages;
  }, [maxMessages]);

  // Update optimized messages when input changes
  useEffect(() => {
    const cleaned = cleanupMessages(messages);
    setOptimizedMessages(cleaned);
  }, [messages, cleanupMessages]);

  // Auto cleanup timer
  useEffect(() => {
    if (!enableAutoCleanup) return;

    cleanupTimerRef.current = setInterval(() => {
      setOptimizedMessages(current => cleanupMessages(current));
    }, cleanupInterval);

    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, [enableAutoCleanup, cleanupInterval, cleanupMessages]);

  // Manual cleanup function
  const manualCleanup = useCallback(() => {
    setOptimizedMessages(current => cleanupMessages(current));
  }, [cleanupMessages]);

  // Memory usage estimation
  const memoryUsage = useMemo(() => {
    const estimatedSize = optimizedMessages.reduce((total, message) => {
      return total + (message.content?.length || 0) + 100; // Base overhead per message
    }, 0);

    return {
      messageCount: optimizedMessages.length,
      estimatedBytes: estimatedSize,
      estimatedKB: Math.round(estimatedSize / 1024)
    };
  }, [optimizedMessages]);

  return {
    messages: optimizedMessages,
    memoryUsage,
    manualCleanup
  };
}

/**
 * Hook for managing component cleanup and preventing memory leaks
 * @returns Cleanup utilities
 */
export function useComponentCleanup() {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const abortControllersRef = useRef<Set<AbortController>>(new Set());

  // Register timeout for cleanup
  const registerTimeout = useCallback((timeout: NodeJS.Timeout) => {
    timeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  // Register interval for cleanup
  const registerInterval = useCallback((interval: NodeJS.Timeout) => {
    intervalsRef.current.add(interval);
    return interval;
  }, []);

  // Register abort controller for cleanup
  const registerAbortController = useCallback((controller: AbortController) => {
    abortControllersRef.current.add(controller);
    return controller;
  }, []);

  // Cleanup all registered resources
  const cleanup = useCallback(() => {
    // Clear timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();

    // Clear intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current.clear();

    // Abort controllers
    abortControllersRef.current.forEach(controller => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    abortControllersRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    registerTimeout,
    registerInterval,
    registerAbortController,
    cleanup
  };
}

/**
 * Hook for throttling expensive operations
 * @param callback - Function to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    if (timeSinceLastCall >= delay) {
      lastCallRef.current = now;
      return callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - timeSinceLastCall);
    }
  }, [callback, delay]) as T;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}