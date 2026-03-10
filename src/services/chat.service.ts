/**
 * Chat Service
 * Xử lý REST APIs và WebSocket cho tính năng chat.
 *
 * REST:
 *   GET  /chat/conversations         → danh sách hội thoại
 *   GET  /chat/history/{otherUserId} → lịch sử chat
 *   PATCH /chat/read/{otherUserId}   → đánh dấu đã đọc
 *
 * WebSocket:
 *   Connect: /api/v1/ws (SockJS)
 *   Send: /app/chat.send { receiverId, content }
 *   Subscribe: /topic/chat.{minId}_{maxId}
 */

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { httpClient } from './http.client';
import { API_BASE_URL, TOKEN_KEY } from './api.config';
import type { Conversation, ChatMessage, ChatMessageRequest } from '../types/chat';

class ChatService {
  private stompClient: Client | null = null;
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

  // ==================== REST APIs ====================

  /** Lấy danh sách tất cả hội thoại của user hiện tại */
  async getConversations(): Promise<Conversation[]> {
    const res = await httpClient.get<Conversation[]>('/chat/conversations');
    return res.result ?? [];
  }

  /** Lấy lịch sử chat với 1 user cụ thể */
  async getChatHistory(otherUserId: number): Promise<ChatMessage[]> {
    const res = await httpClient.get<ChatMessage[]>(`/chat/history/${otherUserId}`);
    return res.result ?? [];
  }

  /** Đánh dấu đã đọc toàn bộ tin nhắn trong conversation */
  async markAsRead(otherUserId: number): Promise<void> {
    await httpClient.patch(`/chat/read/${otherUserId}`);
  }

  // ==================== WebSocket ====================

  /** Kết nối WebSocket, gọi onConnected khi sẵn sàng */
  connect(onConnected: () => void, onError?: (err: any) => void): void {
    if (this.stompClient?.connected) {
      onConnected();
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const baseUrl = API_BASE_URL.endsWith('/api/v1')
      ? API_BASE_URL.slice(0, -7)
      : API_BASE_URL;

    const client = new Client({
      webSocketFactory: () => new (SockJS as any)(`${baseUrl}/api/v1/ws`),
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: () => {
        console.log('[Chat WS] Connected');
        onConnected();
      },
      onDisconnect: () => {
        console.log('[Chat WS] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[Chat WS] STOMP error:', frame.headers['message']);
        if (onError) onError(frame);
      },
    });

    client.activate();
    this.stompClient = client;
  }

  /** Gửi tin nhắn qua WebSocket */
  sendMessage(request: ChatMessageRequest): void {
    if (!this.stompClient?.connected) {
      console.warn('[Chat WS] Not connected, cannot send message');
      return;
    }
    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(request),
    });
  }

  /**
   * Subscribe vào topic của conversation với 1 user.
   * Room key = min(myId, otherId)_max(myId, otherId)
   */
  subscribeToConversation(
    myId: number,
    otherUserId: number,
    onMessage: (msg: ChatMessage) => void
  ): void {
    if (!this.stompClient) {
      console.warn('[Chat WS] Client not initialized');
      return;
    }

    const roomKey = `${Math.min(myId, otherUserId)}_${Math.max(myId, otherUserId)}`;
    const topic = `/topic/chat.${roomKey}`;

    // Tránh subscribe trùng
    if (this.subscriptions.has(topic)) {
      return;
    }

    const sub = this.stompClient.subscribe(topic, (msg) => {
      try {
        const data: ChatMessage = JSON.parse(msg.body);
        onMessage(data);
      } catch (e) {
        console.error('[Chat WS] Parse error:', e);
      }
    });

    this.subscriptions.set(topic, sub);
    console.log(`[Chat WS] Subscribed to ${topic}`);
  }

  /** Hủy subscribe khỏi 1 conversation */
  unsubscribeFromConversation(myId: number, otherUserId: number): void {
    const roomKey = `${Math.min(myId, otherUserId)}_${Math.max(myId, otherUserId)}`;
    const topic = `/topic/chat.${roomKey}`;
    const sub = this.subscriptions.get(topic);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`[Chat WS] Unsubscribed from ${topic}`);
    }
  }

  /** Ngắt kết nối WebSocket */
  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  /** Kiểm tra đã kết nối chưa */
  get isConnected(): boolean {
    return !!this.stompClient?.connected;
  }
}

// Singleton — dùng chung toàn app
export const chatService = new ChatService();
