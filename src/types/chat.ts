/**
 * Chat Types
 * Tương ứng với BE DTOs:
 * - ConversationResponse.java
 * - ChatMessageResponse.java
 * - ChatMessageRequest.java
 */

export interface Conversation {
  id: number;
  roomKey: string;

  // Người còn lại trong cuộc hội thoại (không phải mình)
  otherUserId: number;
  otherUserName: string;
  otherUserRole: string;

  lastMessage: string;
  lastMessageAt: string; // ISO datetime string
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string; // ISO datetime string
  isRead: boolean;
}

/** Body gửi qua WebSocket (/app/chat.send) */
export interface ChatMessageRequest {
  receiverId: number;
  content: string;
}
