/**
 * Accessibility utilities for ChatBot
 * Provides tools for improving and validating accessibility
 */

/**
 * ARIA roles and properties for ChatBot components
 */
export const ARIA_ROLES = {
  DIALOG: 'dialog',
  LOG: 'log',
  ARTICLE: 'article',
  BUTTON: 'button',
  TEXTBOX: 'textbox',
  LISTBOX: 'listbox',
  OPTION: 'option',
  STATUS: 'status',
  ALERT: 'alert',
  GROUP: 'group'
} as const;

/**
 * Common ARIA labels for ChatBot
 */
export const ARIA_LABELS = {
  CHAT_DIALOG: 'Chat with AI assistant',
  CLOSE_CHAT: 'Close chat',
  MESSAGE_INPUT: 'Type your message',
  SEND_MESSAGE: 'Send message',
  MESSAGE_FROM_USER: 'Message from you',
  MESSAGE_FROM_AI: 'Message from AI assistant',
  TYPING_INDICATOR: 'AI is typing',
  SUGGESTIONS: 'Suggested responses',
  CHAT_HISTORY: 'Chat conversation history'
} as const;

/**
 * Keyboard shortcuts for ChatBot
 */
export const KEYBOARD_SHORTCUTS = {
  CLOSE_DIALOG: 'Escape',
  SEND_MESSAGE: 'Enter',
  NEW_LINE: 'Shift+Enter',
  NAVIGATE_UP: 'ArrowUp',
  NAVIGATE_DOWN: 'ArrowDown',
  SELECT_FIRST: 'Home',
  SELECT_LAST: 'End'
} as const;

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];

  return focusableSelectors.some(selector => element.matches(selector));
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
}

/**
 * Trap focus within a container
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement as HTMLElement;

  if (event.shiftKey) {
    // Shift + Tab (backward)
    if (activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab (forward)
    if (activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user is using high contrast mode
 */
export function isHighContrastMode(): boolean {
  // Check for Windows high contrast mode
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    return true;
  }

  // Check for forced colors (Windows high contrast)
  if (window.matchMedia('(forced-colors: active)').matches) {
    return true;
  }

  return false;
}

/**
 * Get appropriate color scheme for accessibility
 */
export function getAccessibleColors() {
  const isHighContrast = isHighContrastMode();

  if (isHighContrast) {
    return {
      background: 'Window',
      text: 'WindowText',
      border: 'WindowText',
      highlight: 'Highlight',
      highlightText: 'HighlightText',
      buttonFace: 'ButtonFace',
      grayText: 'GrayText'
    };
  }

  return {
    background: '#ffffff',
    text: '#333333',
    border: '#dddddd',
    highlight: '#007bff',
    highlightText: '#ffffff',
    buttonFace: '#f8f9fa',
    grayText: '#666666'
  };
}

/**
 * Validate ARIA attributes on an element
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = [];

  // Check for required ARIA attributes based on role
  const role = element.getAttribute('role');
  
  switch (role) {
    case 'dialog':
      if (!element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
        issues.push('Dialog must have aria-labelledby or aria-label');
      }
      if (!element.hasAttribute('aria-modal')) {
        issues.push('Dialog should have aria-modal="true"');
      }
      break;

    case 'button':
      if (!element.textContent?.trim() && !element.hasAttribute('aria-label')) {
        issues.push('Button must have visible text or aria-label');
      }
      break;

    case 'textbox':
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        issues.push('Textbox must have aria-label or aria-labelledby');
      }
      break;

    case 'listbox':
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        issues.push('Listbox must have aria-label or aria-labelledby');
      }
      break;
  }

  // Check for invalid ARIA attribute values
  const ariaExpanded = element.getAttribute('aria-expanded');
  if (ariaExpanded && !['true', 'false'].includes(ariaExpanded)) {
    issues.push('aria-expanded must be "true" or "false"');
  }

  const ariaHidden = element.getAttribute('aria-hidden');
  if (ariaHidden && !['true', 'false'].includes(ariaHidden)) {
    issues.push('aria-hidden must be "true" or "false"');
  }

  return issues;
}

/**
 * Generate unique ID for accessibility
 */
export function generateAccessibleId(prefix: string = 'chatbot'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create accessible description for complex UI elements
 */
export function createAccessibleDescription(
  element: HTMLElement,
  description: string
): string {
  const descriptionId = generateAccessibleId('desc');
  
  // Create description element
  const descElement = document.createElement('div');
  descElement.id = descriptionId;
  descElement.className = 'sr-only';
  descElement.style.position = 'absolute';
  descElement.style.left = '-10000px';
  descElement.style.width = '1px';
  descElement.style.height = '1px';
  descElement.style.overflow = 'hidden';
  descElement.textContent = description;
  
  // Add to DOM
  document.body.appendChild(descElement);
  
  // Link to element
  element.setAttribute('aria-describedby', descriptionId);
  
  return descriptionId;
}

/**
 * Accessibility testing utilities
 */
export const AccessibilityTester = {
  /**
   * Check color contrast ratio
   */
  checkColorContrast(foreground: string, background: string): number {
    // Simplified contrast calculation
    // In a real implementation, you'd use a proper color contrast library
    const getLuminance = (color: string): number => {
      // This is a simplified version - use a proper color library in production
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  },

  /**
   * Check if element has sufficient color contrast
   */
  hasSufficientContrast(element: HTMLElement): boolean {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    if (!color || !backgroundColor) return true; // Can't determine
    
    const contrast = this.checkColorContrast(color, backgroundColor);
    return contrast >= 4.5; // WCAG AA standard
  },

  /**
   * Check if element is keyboard accessible
   */
  isKeyboardAccessible(element: HTMLElement): boolean {
    return isFocusable(element) || element.hasAttribute('tabindex');
  },

  /**
   * Run accessibility audit on ChatBot
   */
  auditChatBot(container: HTMLElement): {
    issues: string[];
    warnings: string[];
    passed: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];
    const passed: string[] = [];

    // Check for dialog role and attributes
    const dialog = container.querySelector('[role="dialog"]');
    if (dialog) {
      const dialogIssues = validateAriaAttributes(dialog as HTMLElement);
      issues.push(...dialogIssues);
      
      if (dialogIssues.length === 0) {
        passed.push('Dialog has proper ARIA attributes');
      }
    } else {
      issues.push('ChatBot should have a dialog role');
    }

    // Check for keyboard navigation
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) {
      issues.push('No focusable elements found');
    } else {
      passed.push(`Found ${focusableElements.length} focusable elements`);
    }

    // Check for ARIA live regions
    const liveRegions = container.querySelectorAll('[aria-live]');
    if (liveRegions.length === 0) {
      warnings.push('Consider adding ARIA live regions for dynamic content');
    } else {
      passed.push('ARIA live regions found for screen reader announcements');
    }

    return { issues, warnings, passed };
  }
};