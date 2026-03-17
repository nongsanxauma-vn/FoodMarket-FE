/**
 * useSuggestions Hook
 * Hook for smart suggestions functionality
 */

import { useCallback } from 'react';
import { useChatBotContext } from '../ChatBotContext';
import { UseSuggestionsReturn } from '../types';

/**
 * Suggestions management hook
 * Provides functionality for managing chat suggestions
 */
export function useSuggestions(): UseSuggestionsReturn {
  const context = useChatBotContext();

  // Set suggestions (replace current suggestions)
  const setSuggestions = useCallback((suggestions: string[]) => {
    // This would need to be implemented in the context reducer
    // For now, we'll log this as it's not directly supported by the current context
    console.warn('setSuggestions not directly supported. Suggestions are managed by the AI service.');
  }, []);

  // Add a single suggestion
  const addSuggestion = useCallback((suggestion: string) => {
    // This would need to be implemented in the context reducer
    // For now, we'll log this as it's not directly supported by the current context
    console.warn('addSuggestion not directly supported. Suggestions are managed by the AI service.');
  }, []);

  // Clear all suggestions
  const clearSuggestions = useCallback(() => {
    // This would need to be implemented in the context reducer
    // For now, we'll log this as it's not directly supported by the current context
    console.warn('clearSuggestions not directly supported. Suggestions are managed by the AI service.');
  }, []);

  return {
    suggestions: context.suggestions,
    setSuggestions,
    addSuggestion,
    clearSuggestions
  };
}