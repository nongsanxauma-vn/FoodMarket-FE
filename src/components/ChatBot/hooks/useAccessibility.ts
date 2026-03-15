/**
 * Accessibility hooks for ChatBot
 * Provides keyboard navigation, focus management, and screen reader support
 */

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for managing focus within a modal or dialog
 * @param isOpen - Whether the modal is open
 * @param closeOnEscape - Whether to close on Escape key
 * @param onClose - Function to call when closing
 * @returns Focus management utilities
 */
export function useFocusManagement(
  isOpen: boolean,
  closeOnEscape: boolean = true,
  onClose?: () => void
) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Get all focusable elements
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  // Update focusable element refs
  const updateFocusableElements = useCallback(() => {
    const elements = getFocusableElements();
    firstFocusableRef.current = elements[0] || null;
    lastFocusableRef.current = elements[elements.length - 1] || null;
  }, [getFocusableElements]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        if (closeOnEscape && onClose) {
          event.preventDefault();
          onClose();
        }
        break;

      case 'Tab':
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

        if (event.shiftKey) {
          // Shift + Tab (backward)
          if (currentIndex <= 0) {
            event.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
          }
        } else {
          // Tab (forward)
          if (currentIndex >= focusableElements.length - 1) {
            event.preventDefault();
            focusableElements[0].focus();
          }
        }
        break;
    }
  }, [isOpen, closeOnEscape, onClose, getFocusableElements]);

  // Set up focus management when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Update focusable elements
      updateFocusableElements();
      
      // Focus first element after a brief delay
      setTimeout(() => {
        if (firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        }
      }, 100);

      // Add keyboard listener
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      // Remove keyboard listener
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, updateFocusableElements]);

  return {
    containerRef,
    updateFocusableElements,
    focusFirst: () => firstFocusableRef.current?.focus(),
    focusLast: () => lastFocusableRef.current?.focus()
  };
}

/**
 * Hook for keyboard navigation within a list
 * @param items - Array of items
 * @param onSelect - Function to call when item is selected
 * @returns Keyboard navigation utilities
 */
export function useKeyboardNavigation<T>(
  items: T[],
  onSelect?: (item: T, index: number) => void
) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;

      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => prev <= 0 ? items.length - 1 : prev - 1);
        break;

      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setActiveIndex(items.length - 1);
        break;

      case 'Enter':
      case ' ':
        if (activeIndex >= 0 && onSelect) {
          event.preventDefault();
          onSelect(items[activeIndex], activeIndex);
        }
        break;

      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  }, [items, activeIndex, onSelect]);

  // Set up keyboard listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset active index when items change
  useEffect(() => {
    setActiveIndex(-1);
  }, [items]);

  return {
    containerRef,
    activeIndex,
    setActiveIndex,
    resetActiveIndex: () => setActiveIndex(-1)
  };
}

/**
 * Hook for screen reader announcements
 * @returns Announcement utilities
 */
export function useScreenReader() {
  const announcementRef = useRef<HTMLDivElement>(null);

  // Create announcement element if it doesn't exist
  useEffect(() => {
    if (!announcementRef.current) {
      const element = document.createElement('div');
      element.setAttribute('aria-live', 'polite');
      element.setAttribute('aria-atomic', 'true');
      element.style.position = 'absolute';
      element.style.left = '-10000px';
      element.style.width = '1px';
      element.style.height = '1px';
      element.style.overflow = 'hidden';
      document.body.appendChild(element);
      announcementRef.current = element;
    }

    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return;

    announcementRef.current.setAttribute('aria-live', priority);
    announcementRef.current.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  return { announce };
}

/**
 * Hook for high contrast mode detection
 * @returns High contrast state and utilities
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check for high contrast mode
    const checkHighContrast = () => {
      // Method 1: Check for Windows high contrast mode
      if (window.matchMedia) {
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        setIsHighContrast(highContrastQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => {
          setIsHighContrast(e.matches);
        };
        
        highContrastQuery.addEventListener('change', handleChange);
        return () => highContrastQuery.removeEventListener('change', handleChange);
      }

      // Method 2: Check for forced colors (Windows high contrast)
      if (window.matchMedia) {
        const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
        setIsHighContrast(forcedColorsQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => {
          setIsHighContrast(e.matches);
        };
        
        forcedColorsQuery.addEventListener('change', handleChange);
        return () => forcedColorsQuery.removeEventListener('change', handleChange);
      }
    };

    const cleanup = checkHighContrast();
    return cleanup;
  }, []);

  return { isHighContrast };
}

/**
 * Hook for reduced motion preference
 * @returns Reduced motion state
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { prefersReducedMotion };
}

/**
 * Hook for managing ARIA live regions
 * @param initialMessage - Initial message for the live region
 * @returns Live region utilities
 */
export function useAriaLiveRegion(initialMessage: string = '') {
  const [message, setMessage] = useState(initialMessage);
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  const updateMessage = useCallback((newMessage: string, newPriority: 'polite' | 'assertive' = 'polite') => {
    setMessage(newMessage);
    setPriority(newPriority);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  return {
    message,
    priority,
    updateMessage,
    clearMessage
  };
}