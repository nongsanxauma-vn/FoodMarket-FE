/**
 * Lazy loading hooks for chat history and content
 * Optimizes initial load time and memory usage
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '../chatbot.types';

export interface LazyLoadingOptions {
  pageSize?: number;
  preloadThreshold?: number; // Distance from top to trigger preload
  maxRetries?: number;
  retryDelay?: number;
}

export interface LazyLoadingState {
  items: ChatMessage[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  totalLoaded: number;
}

/**
 * Hook for lazy loading chat history with pagination
 * @param loadFunction - Function to load more items
 * @param options - Lazy loading configuration
 * @returns Lazy loading state and controls
 */
export function useLazyLoading(
  loadFunction: (page: number, pageSize: number) => Promise<ChatMessage[]>,
  options: LazyLoadingOptions = {}
) {
  const {
    pageSize = 20,
    preloadThreshold = 100,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<LazyLoadingState>({
    items: [],
    isLoading: false,
    hasMore: true,
    error: null,
    totalLoaded: 0
  });

  const currentPageRef = useRef(0);
  const retryCountRef = useRef(0);
  const loadingRef = useRef(false);

  // Load more items
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !state.hasMore) {
      return;
    }

    loadingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newItems = await loadFunction(currentPageRef.current, pageSize);
      
      setState(prev => ({
        ...prev,
        items: [...newItems, ...prev.items], // Prepend for chat history
        isLoading: false,
        hasMore: newItems.length === pageSize,
        totalLoaded: prev.totalLoaded + newItems.length
      }));

      currentPageRef.current += 1;
      retryCountRef.current = 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        
        // Retry after delay
        setTimeout(() => {
          loadingRef.current = false;
          loadMore();
        }, retryDelay * retryCountRef.current);
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
      }
    } finally {
      if (retryCountRef.current === 0) {
        loadingRef.current = false;
      }
    }
  }, [loadFunction, pageSize, maxRetries, retryDelay, state.hasMore]);

  // Reset loading state
  const reset = useCallback(() => {
    setState({
      items: [],
      isLoading: false,
      hasMore: true,
      error: null,
      totalLoaded: 0
    });
    currentPageRef.current = 0;
    retryCountRef.current = 0;
    loadingRef.current = false;
  }, []);

  // Retry loading
  const retry = useCallback(() => {
    retryCountRef.current = 0;
    loadMore();
  }, [loadMore]);

  return {
    ...state,
    loadMore,
    reset,
    retry
  };
}

/**
 * Hook for intersection observer-based lazy loading
 * @param callback - Function to call when element intersects
 * @param options - Intersection observer options
 * @returns Ref to attach to trigger element
 */
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up intersection observer
  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbackRef.current();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options]);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  return ref;
}

/**
 * Hook for preloading content based on scroll position
 * @param containerRef - Ref to scroll container
 * @param onPreload - Function to call for preloading
 * @param threshold - Distance from top to trigger preload
 */
export function useScrollPreload(
  containerRef: React.RefObject<HTMLElement>,
  onPreload: () => void,
  threshold: number = 100
) {
  const onPreloadRef = useRef(onPreload);
  const lastScrollTopRef = useRef(0);

  // Update callback ref
  useEffect(() => {
    onPreloadRef.current = onPreload;
  }, [onPreload]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;
      
      // Only trigger when scrolling up (loading older messages)
      if (scrollTop < lastScrollTopRef.current && scrollTop <= threshold) {
        onPreloadRef.current();
      }
      
      lastScrollTopRef.current = scrollTop;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, threshold]);
}

/**
 * Hook for managing loading states with timeout
 * @param timeout - Timeout in milliseconds
 * @returns Loading state and controls
 */
export function useLoadingTimeout(timeout: number = 10000) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setHasTimedOut(false);
    
    timeoutRef.current = setTimeout(() => {
      setHasTimedOut(true);
      setIsLoading(false);
    }, timeout);
  }, [timeout]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setHasTimedOut(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    hasTimedOut,
    startLoading,
    stopLoading
  };
}