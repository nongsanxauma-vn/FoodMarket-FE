/**
 * ChatWindow - Cửa sổ chat hiển thị lịch sử và input gửi tin nhắn
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, Loader2, ArrowLeft, AlertCircle, MessageSquare
} from 'lucide-react';
import { chatService } from '../../services/chat.service';
import type { ChatMessage, Conversation } from '../../types/chat';

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: number;
  onBack?: () => void; // dùng cho mobile view
}

const formatMsgTime = (isoStr: string) => {
  try {
    return new Date(isoStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};

const formatDateLabel = (isoStr: string) => {
  try {
    const d = new Date(isoStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Hôm nay';
    if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return ''; }
};

/** Group messages by date */
const groupByDate = (messages: ChatMessage[]): { label: string; msgs: ChatMessage[] }[] => {
  const groups: { label: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((m) => {
    const label = formatDateLabel(m.sentAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.msgs.push(m);
    } else {
      groups.push({ label, msgs: [m] });
    }
  });
  return groups;
};

const getInitial = (name: string) => (name || '?').charAt(0).toUpperCase();

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUserId, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  // Load lịch sử chat
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await chatService.getChatHistory(conversation.otherUserId);
        if (!cancelled) {
          setMessages(history);
          setTimeout(() => scrollToBottom(false), 100);
        }
        // Đánh dấu đã đọc
        await chatService.markAsRead(conversation.otherUserId);
      } catch (e) {
        if (!cancelled) setError('Không thể tải lịch sử chat');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [conversation.otherUserId]);

  // Kết nối WebSocket & subscribe
  useEffect(() => {
    chatService.connect(() => {
      setWsConnected(true);
      chatService.subscribeToConversation(currentUserId, conversation.otherUserId, (newMsg) => {
        setMessages((prev) => {
          // Tránh duplicate nếu optimistic update đã thêm
          if (prev.some((m) => m.id === newMsg.id && m.id !== 0)) return prev;
          return [...prev.filter((m) => m.id !== 0), newMsg];
        });
        setTimeout(() => scrollToBottom(), 50);
      });
    });

    return () => {
      chatService.unsubscribeFromConversation(currentUserId, conversation.otherUserId);
    };
  }, [conversation.otherUserId, currentUserId, scrollToBottom]);

  // Gửi tin nhắn
  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    const optimistic: ChatMessage = {
      id: 0, // placeholder
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: 'Bạn',
      content: text,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    setTimeout(() => scrollToBottom(), 50);

    try {
      chatService.sendMessage({ receiverId: conversation.otherUserId, content: text });
    } catch (e) {
      console.error('[Chat] Send error:', e);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, sending, conversation, currentUserId, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groups = groupByDate(messages);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="size-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft className="size-4" />
          </button>
        )}
        <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-sm text-primary shadow-sm">
          {getInitial(conversation.otherUserName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-900 truncate">{conversation.otherUserName}</p>
          <div className="flex items-center gap-2">
            <div className={`size-1.5 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {wsConnected ? 'Trực tuyến' : 'Đang kết nối...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-300">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest">Đang tải tin nhắn...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-500">
              <AlertCircle className="size-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="size-16 bg-white rounded-3xl border border-gray-100 flex items-center justify-center shadow-sm">
              <MessageSquare className="size-8 text-gray-200" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Chưa có tin nhắn</p>
              <p className="text-xs text-gray-300 mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {group.msgs.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                const isOptimistic = msg.id === 0;
                const prevMsg = group.msgs[idx - 1];
                const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

                return (
                  <div
                    key={`${msg.id}-${idx}`}
                    className={`flex items-end gap-2 mb-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar of other user */}
                    {!isMe && (
                      <div className="size-7 shrink-0 mb-1">
                        {showAvatar ? (
                          <div className="size-7 bg-primary/10 rounded-xl flex items-center justify-center font-black text-[10px] text-primary">
                            {getInitial(conversation.otherUserName)}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-opacity ${
                          isMe
                            ? `bg-primary text-white rounded-br-sm ${isOptimistic ? 'opacity-60' : 'opacity-100'}`
                            : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9px] font-bold text-gray-300 px-1">
                        {formatMsgTime(msg.sentAt)}
                        {isMe && isOptimistic && ' · Đang gửi...'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-300 outline-none font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="size-9 bg-primary rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:bg-primary/90 active:scale-95 transition-all shadow-sm shadow-primary/30"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
        <p className="text-[10px] text-gray-300 font-bold text-center mt-2">Enter để gửi</p>
      </div>
    </div>
  );
};

export default ChatWindow;
