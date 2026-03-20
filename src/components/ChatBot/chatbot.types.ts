// chatbot.types.ts

export interface ProductSuggestion {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    status: 'sending' | 'sent' | 'error';
    type?: 'text' | 'system';           // ← thêm lại type (optional)
    metadata?: Record<string, any>;     // ← thêm lại metadata (optional)
    suggestedProducts?: ProductSuggestion[];
}

export interface SuggestionsPanelProps {
    suggestions: string[];
    onSelectSuggestion: (suggestion: string) => void;
    isVisible?: boolean;
    hasHistory?: boolean; 
}

export interface TypingIndicatorProps {
    isVisible: boolean;
    message?: string;
}

export interface MessageBubbleProps {
    message: ChatMessage;
}