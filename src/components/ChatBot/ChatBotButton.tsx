/**
 * ChatBot Button Component
 * Floating action button to toggle chat interface
 */

import React from 'react';
import { useChatBotContext } from './ChatBotContext';
import styles from './ChatBot.module.css';

interface ChatBotButtonProps {
  unreadCount?: number;
  className?: string;
}

export function ChatBotButton({ unreadCount = 0, className = '' }: ChatBotButtonProps) {
  const { isOpen, toggleChat } = useChatBotContext();
  if (isOpen) return null;

  return (
    <button
      onClick={toggleChat}
      className={`
        ${styles['chatbot-button']}
        ${isOpen ? styles['is-open'] : ''}
        ${className}
      `}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      title={isOpen ? 'Close chat' : 'Open chat'}
    >
      {/* Chat Icon */}
      <svg
        className={styles['chatbot-button-icon']}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isOpen ? (
          // Close icon (X)
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          // Chat bubble icon
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        )}
      </svg>

      {/* Notification Badge */}
      {unreadCount > 0 && !isOpen && (
        <span
          className={styles['chatbot-notification-badge']}
          aria-label={`${unreadCount} unread messages`}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {/* Screen Reader Text */}
      <span className={styles['chatbot-sr-only']}>
        {isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      </span>
    </button>
  );
}