/**
 * ChatBot Provider
 * Main provider component that wraps the application with ChatBot context
 */

import React from 'react';
import { ChatBotProvider as ChatBotContextProvider } from './ChatBotContext';

interface ChatBotProviderProps {
  children: React.ReactNode;
  userId?: number;
  userRole?: 'BUYER' | 'SHOP_OWNER' | 'SHIPPER';
}

/**
 * ChatBot Provider Component
 * Provides ChatBot context to the entire application
 */
export function ChatBotProvider({ children, userId, userRole = 'BUYER' }: ChatBotProviderProps) {
  return (
    <ChatBotContextProvider userId={userId} userRole={userRole}>
      {children}
    </ChatBotContextProvider>
  );
}