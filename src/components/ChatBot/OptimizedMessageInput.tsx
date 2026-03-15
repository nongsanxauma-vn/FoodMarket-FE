/**
 * Optimized Message Input Component
 * Features debounced suggestions and performance optimizations
 */

import React, { useState, useCallback, useRef, memo } from 'react';
import { useDebounce, useDebouncedCallback } from './hooks/useDebounce';
import { useThrottle } from './hooks/useMemoryManagement';

export interface OptimizedMessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  onSuggestionRequest?: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_LENGTH = 2000;
const DEBOUNCE_DELAY = 300;
const TYPING_THROTTLE_DELAY = 1000;

/**
 * Optimized message input with debounced suggestions and performance features
 */
const OptimizedMessageInput: React.FC<OptimizedMessageInputProps> = memo(({
  onSendMessage,
  onTyping,
  onSuggestionRequest,
  disabled = false,
  placeholder = 'Type your message...',
  maxLength = MAX_LENGTH,
  className = '',
  style = {}
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Debounced value for suggestions
  const debouncedInputValue = useDebounce(inputValue, DEBOUNCE_DELAY);

  // Throttled typing indicator
  const throttledTypingIndicator = useThrottle((isTyping: boolean) => {
    onTyping?.(isTyping);
  }, TYPING_THROTTLE_DELAY);

  // Debounced suggestion request
  const debouncedSuggestionRequest = useDebouncedCallback(
    (query: string) => {
      if (query.trim().length > 2) {
        onSuggestionRequest?.(query);
      }
    },
    DEBOUNCE_DELAY,
    [onSuggestionRequest]
  );

  // Handle input change with optimizations
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    
    // Enforce max length
    if (value.length > maxLength) {
      return;
    }

    setInputValue(value);
    
    // Throttled typing indicator
    throttledTypingIndicator(value.length > 0);
  }, [maxLength, throttledTypingIndicator]);

  // Handle suggestion requests when debounced value changes
  React.useEffect(() => {
    if (debouncedInputValue && !isComposing) {
      debouncedSuggestionRequest(debouncedInputValue);
    }
  }, [debouncedInputValue, isComposing, debouncedSuggestionRequest]);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || disabled || isComposing) {
      return;
    }

    onSendMessage(trimmedValue);
    setInputValue('');
    
    // Reset typing indicator
    onTyping?.(false);
    
    // Focus back to input
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [inputValue, disabled, isComposing, onSendMessage, onTyping]);

  // Handle key press
  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Handle composition events (for IME input)
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  // Auto-resize textarea
  const handleTextareaResize = useCallback(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    // Reset height to calculate new height
    textarea.style.height = 'auto';
    
    // Set new height based on scroll height
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Resize on input change
  React.useEffect(() => {
    handleTextareaResize();
  }, [inputValue, handleTextareaResize]);

  const canSend = inputValue.trim().length > 0 && !disabled && !isComposing;
  const remainingChars = maxLength - inputValue.length;

  return (
    <div
      className={`optimized-message-input ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        ...style
      }}
    >
      {/* Input container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            width: '100%',
            minHeight: '40px',
            maxHeight: '120px',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#000',
            backgroundColor: disabled ? '#f5f5f5' : '#fff',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007bff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ddd';
          }}
        />
        
        {/* Character counter */}
        {remainingChars < 100 && (
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '12px',
              fontSize: '11px',
              color: remainingChars < 20 ? '#ff4444' : '#666'
            }}
          >
            {remainingChars} characters remaining
          </div>
        )}
      </div>

      {/* Send button */}
      <button
        onClick={handleSendMessage}
        disabled={!canSend}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: canSend ? '#007bff' : '#ccc',
          color: 'white',
          cursor: canSend ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          if (canSend) {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }
        }}
        onMouseLeave={(e) => {
          if (canSend) {
            e.currentTarget.style.backgroundColor = '#007bff';
          }
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
        </svg>
      </button>
    </div>
  );
});

OptimizedMessageInput.displayName = 'OptimizedMessageInput';

export default OptimizedMessageInput;
