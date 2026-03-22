/**
 * ChatBot Service
 * Chỉ gọi đúng 3 API của BE
 */

import { httpClient } from './http.client';

// ===== TYPES =====
export interface ChatRequest {
  message: string;
  userApiKey?: string;
}

export interface ProductSuggestion {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface ChatResponse {
  reply: string;
  timestamp: string;
  suggestedProducts: ProductSuggestion[];
}

export interface ChatHistoryItem {
  id: number;
  role: 'USER' | 'BOT';
  content: string;
  createdAt: string;
}

// ===== SERVICE =====
export const chatBotService = {

  /**
   * Gửi tin nhắn → nhận reply + sản phẩm gợi ý
   * POST /chatbot/chat
   */
  async sendMessage(message: string, userApiKey?: string): Promise<ChatResponse> {
    if (!message || !message.trim()) {
      throw new Error('Tin nhắn không được để trống');
    }

    if (message.length > 2000) {
      throw new Error('Tin nhắn không được vượt quá 2000 ký tự');
    }

    const body: ChatRequest = {
      message: message.trim(),
      userApiKey: userApiKey || undefined
    };

    const response = await httpClient.post<ChatResponse>('/chatbot/chat', body);
    return response.result;
  },

  /**
   * Lấy lịch sử chat của user hiện tại
   * GET /chatbot/history
   */
  async getHistory(): Promise<ChatHistoryItem[]> {
    const response = await httpClient.get<ChatHistoryItem[]>('/chatbot/history');
    return response.result ?? [];
  },

  /**
   * Xóa toàn bộ lịch sử chat
   * DELETE /chatbot/history
   */
  async clearHistory(): Promise<void> {
    await httpClient.delete<void>('/chatbot/history');
  }
};