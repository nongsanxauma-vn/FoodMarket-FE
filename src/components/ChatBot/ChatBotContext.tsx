import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { chatBotService } from '../../services/chatbot.service';
import { ChatMessage, ProductSuggestion } from './chatbot.types';

// ===== SUGGESTIONS MẶC ĐỊNH =====
const DEFAULT_SUGGESTIONS = [
  'Shop có những loại rau gì?',
  'Tôi muốn lên kế hoạch ăn uống 3 ngày',
  'Chính sách giao hàng như thế nào?',
  'Sản phẩm nào đang có khuyến mãi?'
];

// ===== STATE =====
interface ChatBotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
}

const initialState: ChatBotState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  suggestions: DEFAULT_SUGGESTIONS
};

// ===== ACTIONS =====
type Action =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_SUGGESTIONS'; payload: string[] };

function reducer(state: ChatBotState, action: Action): ChatBotState {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        )
      };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [], error: null };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    default:
      return state;
  }
}

// ===== CONTEXT =====
interface ChatBotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  toggleChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
  selectSuggestion: (suggestion: string) => void;
  dismissError: () => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

// ===== PROVIDER =====
interface ChatBotProviderProps {
  children: React.ReactNode;
  userId?: number;
}

export function ChatBotProvider({ children, userId }: ChatBotProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Load lịch sử chat khi mount
  useEffect(() => {
    if (!userId) return;
    loadHistory();
  }, [userId]);

  const toggleChat = useCallback(() => {
    dispatch({ type: 'TOGGLE_CHAT' });
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    // Thêm tin nhắn user ngay lập tức
    const userMsg: ChatMessage = {
      id: generateId(),
      content: trimmed,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await chatBotService.sendMessage(trimmed);

      // Cập nhật status user message
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: { id: userMsg.id, updates: { status: 'sent' } }
      });

      // Thêm tin nhắn bot kèm sản phẩm gợi ý
      const botMsg: ChatMessage = {
        id: generateId(),
        content: response.reply,
        sender: 'bot',
        timestamp: new Date(response.timestamp),
        status: 'sent',
        suggestedProducts: response.suggestedProducts ?? []
      };

      dispatch({ type: 'ADD_MESSAGE', payload: botMsg });

    } catch (error: any) {
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: { id: userMsg.id, updates: { status: 'error' } }
      });
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadHistory = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const history = await chatBotService.getHistory();

      const messages: ChatMessage[] = history.map(item => ({
        id: String(item.id),
        content: item.content,
        sender: item.role === 'USER' ? 'user' : 'bot',
        timestamp: new Date(item.createdAt),
        status: 'sent' as const
      }));

      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Không thể tải lịch sử chat.'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearHistory = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await chatBotService.clearHistory();
      dispatch({ type: 'CLEAR_MESSAGES' });
      dispatch({ type: 'SET_SUGGESTIONS', payload: DEFAULT_SUGGESTIONS });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Không thể xóa lịch sử chat.'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const selectSuggestion = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  const dismissError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  return (
    <ChatBotContext.Provider value={{
      ...state,
      toggleChat,
      sendMessage,
      clearHistory,
      loadHistory,
      selectSuggestion,
      dismissError
    }}>
      {children}
    </ChatBotContext.Provider>
  );
}

export function useChatBotContext() {
  const context = useContext(ChatBotContext);
  if (!context) throw new Error('useChatBotContext phải dùng trong ChatBotProvider');
  return context;
}