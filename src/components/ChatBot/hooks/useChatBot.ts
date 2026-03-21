import { useChatBotContext } from '../ChatBotContext';

export function useChatBot() {
  const context = useChatBotContext();

  return {
    isOpen: context.isOpen,
    messages: context.messages,
    isLoading: context.isLoading,
    error: context.error,
    suggestions: context.suggestions,
    toggleChat: context.toggleChat,
    sendMessage: context.sendMessage,
    clearHistory: context.clearHistory,
    loadHistory: context.loadHistory,
    selectSuggestion: context.selectSuggestion
  };
}