/**
 * Virtual scrolling hook for optimizing large message lists
 * Only renders visible items to improve performance
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface VirtualScrollingOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside visible area
  totalItems: number;
}

export interface VirtualScrollingResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number[];
  scrollTop: number;
  totalHeight: number;
  offsetY: number;
}

/**
 * Hook for implementing virtual scrolling
 * @param options - Virtual scrolling configuration
 * @returns Virtual scrolling state and utilities
 */
export function useVirtualScrolling({
  itemHeight,
  containerHeight,
  overscan = 5,
  totalItems
}: VirtualScrollingOptions): VirtualScrollingResult & {
  onScroll: (scrollTop: number) => void;
} {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = totalItems * itemHeight;

  const startIndex = useMemo(() => {
    const index = Math.floor(scrollTop / itemHeight);
    return Math.max(0, index - overscan);
  }, [scrollTop, itemHeight, overscan]);

  const endIndex = useMemo(() => {
    const index = Math.min(
      totalItems - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return Math.max(startIndex, index);
  }, [scrollTop, containerHeight, itemHeight, overscan, totalItems, startIndex]);

  const visibleItems = useMemo(() => {
    const items: number[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push(i);
    }
    return items;
  }, [startIndex, endIndex]);

  const offsetY = startIndex * itemHeight;

  const onScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return {
    startIndex,
    endIndex,
    visibleItems,
    scrollTop,
    totalHeight,
    offsetY,
    onScroll
  };
}

/**
 * Hook for auto-scrolling to bottom with performance optimization
 * @param dependency - Dependency to trigger auto-scroll
 * @param enabled - Whether auto-scroll is enabled
 * @returns Scroll to bottom function
 */
export function useAutoScroll(
  dependency: any,
  enabled: boolean = true
): (element: HTMLElement | null) => void {
  const scrollToBottom = useCallback((element: HTMLElement | null) => {
    if (!element || !enabled) return;

    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });
  }, [enabled]);

  return scrollToBottom;
}

/**
 * Hook for lazy loading with intersection observer
 * @param threshold - Intersection threshold (0-1)
 * @returns Intersection observer ref and loading state
 */
export function useLazyLoading(threshold: number = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') return null;

    return new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold }
    );
  }, [threshold]);

  useEffect(() => {
    if (!observer || !element) return;

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [observer, element]);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  return { ref, isIntersecting };
}