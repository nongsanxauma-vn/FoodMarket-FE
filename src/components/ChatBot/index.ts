/**
 * ChatBot Components Export
 * Main entry point for AI ChatBot components
 */

export { ChatBot } from './ChatBot';
export { ChatBotProvider } from './ChatBotProvider';
export { ChatBotButton } from './ChatBotButton';
export { ChatBotModal } from './ChatBotModal';
export { MessageBubble } from './MessageBubble';
export { SuggestionsPanel } from './SuggestionsPanel';
export { TypingIndicator } from './TypingIndicator';

// Performance Optimized Components
export { default as VirtualizedMessageList } from './VirtualizedMessageList';
export { default as OptimizedMessageInput } from './OptimizedMessageInput';

// Rename exports to be the primary ones if needed, or keep descriptive names
export { default as MessageList } from './VirtualizedMessageList';
export { default as MessageInput } from './OptimizedMessageInput';

// Hooks
export { useChatBot } from './hooks/useChatBot';
export { useMessages } from './hooks/useMessages';
export { useSuggestions } from './hooks/useSuggestions';

// Performance Hooks
export { useDebounce, useDebouncedCallback } from './hooks/useDebounce';
export { useVirtualScrolling, useAutoScroll } from './hooks/useVirtualScrolling';
export { useMessageMemoryManagement, useComponentCleanup, useThrottle } from './hooks/useMemoryManagement';
export { useLazyLoading, useIntersectionObserver, useScrollPreload, useLoadingTimeout } from './hooks/useLazyLoading';

// Accessibility Hooks
export { useFocusManagement, useKeyboardNavigation, useScreenReader, useHighContrast, useReducedMotion, useAriaLiveRegion } from './hooks/useAccessibility';

// Performance Utils
export { PerformanceMonitor, measureRenderTime, debounce, throttle, estimateMemoryUsage, isLowEndDevice, getOptimizedConfig } from './utils/performanceUtils';

// Accessibility Utils
export { ARIA_ROLES, ARIA_LABELS, KEYBOARD_SHORTCUTS, isFocusable, getFocusableElements, trapFocus, announceToScreenReader, prefersReducedMotion, isHighContrastMode, getAccessibleColors, validateAriaAttributes, generateAccessibleId, createAccessibleDescription, AccessibilityTester } from './utils/accessibilityUtils';

// Types
export type * from './chatbot.types';
