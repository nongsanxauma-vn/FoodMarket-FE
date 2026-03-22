/**
 * Main ChatBot Component
 * Combines ChatBotButton and ChatBotModal for complete integration
 */

import React from 'react';
import { ChatBotButton } from './ChatBotButton';
import { ChatBotModal } from './ChatBotModal';
import { useChatBotContext } from './ChatBotContext';
import styles from './ChatBot.module.css';

interface ChatBotProps {
  className?: string;
  unreadCount?: number;
  title?: string;
}

/**
 * Main ChatBot Component
 * Provides the complete chatbot experience with button and modal
 */
export function ChatBot({ 
  className = '', 
  unreadCount = 0, 
  title = 'AI Assistant' 
}: ChatBotProps) {
  const { isOpen } = useChatBotContext();

  return (
    <div className={`${styles['chatbot-container']} ${className}`}>
      {/* Floating Chat Button */}
      <ChatBotButton 
        unreadCount={unreadCount} 
      />
      
      {/* Chat Modal */}
      {isOpen && (
        <ChatBotModal title={title} />
      )}
    </div>
  );
}