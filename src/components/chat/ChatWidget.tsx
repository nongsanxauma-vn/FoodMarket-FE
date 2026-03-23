/**
 * ChatWidget - Widget chat dạng chatbot có thể mở/đóng
 * Hiển thị icon floating và khung chat nhỏ
 */
import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, X, Minimize2 } from 'lucide-react';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import type { Conversation } from '../../types/chat';

const ADMIN_USER_ID = 1;
const SUPPORT_CENTER_NAME = 'Trung tâm hỗ trợ';

// Inline styles for animations
const chatWidgetStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideOutDown {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
  }

  @keyframes chatWidgetPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .chat-widget-enter {
    animation: slideInUp 0.3s ease-out forwards;
  }

  .chat-widget-exit {
    animation: slideOutDown 0.2s ease-in forwards;
  }

  .chat-widget-button-pulse {
    animation: chatWidgetPulse 2s ease-in-out infinite;
  }

  .chat-widget-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .chat-widget-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-widget-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }

  .chat-widget-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  @media (max-width: 768px) {
    .chat-widget-container {
      width: 100vw !important;
      height: calc(100vh - 60px) !important;
      max-width: 100vw !important;
      bottom: 0 !important;
      right: 0 !important;
      border-radius: 0 !important;
      top: 60px !important;
    }
  }

  .chat-widget-z-index {
    z-index: 999 !important;
  }

  @media (min-width: 769px) {
    .chat-widget-button-desktop {
      bottom: 1.5rem;
      right: 1.5rem;
    }
    
    .chat-widget-button-chatbot {
      bottom: 6rem;
      right: 1.5rem;
    }
  }
`;

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Lấy userId
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authService.getMyInfo();
        if (res.result?.id) setCurrentUserId(Number(res.result.id));
      } catch {
        const cached = authService.getUserInfo();
        if (cached?.id) setCurrentUserId(Number(cached.id));
      }
    };
    loadUser();
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingConversations(true);
    try {
      const convs = await chatService.getConversations();
      
      const adminConv = convs.find(c => c.otherUserId === ADMIN_USER_ID);
      
      if (!adminConv) {
        const supportConv: Conversation = {
          id: -1,
          roomKey: '',
          otherUserId: ADMIN_USER_ID,
          otherUserName: SUPPORT_CENTER_NAME,
          otherUserRole: 'ADMIN',
          lastMessage: 'Bắt đầu trò chuyện với trung tâm hỗ trợ',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
        };
        setConversations([supportConv, ...convs]);
      } else {
        const updatedAdminConv = { ...adminConv, otherUserName: SUPPORT_CENTER_NAME };
        const otherConvs = convs.filter(c => c.otherUserId !== ADMIN_USER_ID);
        setConversations([updatedAdminConv, ...otherConvs]);
      }

      // Tính tổng unread
      const total = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      setUnreadTotal(total);
    } catch (e) {
      console.error('[ChatWidget] load error:', e);
    } finally {
      setLoadingConversations(false);
    }
  }, [currentUserId]);

  // Load unread count định kỳ ngay cả khi widget đóng
  useEffect(() => {
    if (!currentUserId) return;
    
    const loadUnreadCount = async () => {
      try {
        const convs = await chatService.getConversations();
        const total = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setUnreadTotal(total);
      } catch (e) {
        console.error('[ChatWidget] load unread error:', e);
      }
    };
    
    // Load ngay lập tức
    loadUnreadCount();
    
    // Reload mỗi 15 giây
    const interval = setInterval(loadUnreadCount, 15000);
    
    return () => clearInterval(interval);
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId !== null && isOpen) {
      loadConversations();
      
      // Tự động reload conversations mỗi 30 giây khi widget mở
      const interval = setInterval(() => {
        loadConversations();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [currentUserId, isOpen, loadConversations]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelected(conv);
    setConversations((prev) =>
      prev.map((c) => (c.otherUserId === conv.otherUserId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Lắng nghe sự kiện mở chat từ các component khác (ProductDetail, ShopProducts, etc.)
  useEffect(() => {
    const handleOpenChat = (event: any) => {
      const { userId, userName } = event.detail;
      if (!userId) return;

      setIsOpen(true);
      
      // Tìm trong danh sách hiện có
      const existing = conversations.find(c => c.otherUserId === userId);
      if (existing) {
        setSelected(existing);
      } else {
        // Tạo ghost conversation nếu chưa có
        setSelected({
          id: 0,
          roomKey: '',
          otherUserId: userId,
          otherUserName: userName || 'Chủ shop',
          otherUserRole: 'SHOP_OWNER',
          lastMessage: '',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
        });
      }
    };

    window.addEventListener('open-chat-with-user', handleOpenChat);
    return () => window.removeEventListener('open-chat-with-user', handleOpenChat);
  }, [conversations]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    // Không reset selected khi đóng, để giữ trạng thái khi mở lại
  };

  const handleMinimize = () => {
    setIsOpen(false);
    // Không reset selected khi minimize
  };

  if (!currentUserId) return null;

  return (
    <>
      {/* Inject styles */}
      <style>{chatWidgetStyles}</style>
      
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="chat-widget-button-desktop fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 chat-widget-z-index chat-widget-button-pulse"
          style={{ width: '56px', height: '56px' }}
          aria-label="Mở chat"
        >
          <MessageSquare className="size-6" />
          {unreadTotal > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {unreadTotal > 9 ? '9+' : unreadTotal}
            </span>
          )}
        </button>
      )}

      {/* Chat Widget Window */}
      {isOpen && (
        <div className="chat-widget-container chat-widget-enter chat-widget-z-index fixed bottom-6 right-6 w-full max-w-[420px] h-[550px] bg-white shadow-2xl rounded-2xl flex overflow-hidden border border-gray-200">
          {/* Sidebar */}
          <div className={`${selected ? 'hidden md:flex' : 'flex'} w-full md:w-full shrink-0 flex-col border-r border-gray-100`}>
            {/* Header with close button */}
            <div className="p-4 border-b border-gray-100 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900 uppercase tracking-tight">Tin nhắn</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {conversations.length} cuộc trò chuyện
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMinimize}
                    className="size-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
                    aria-label="Thu nhỏ"
                  >
                    <Minimize2 className="size-4" />
                  </button>
                  <button
                    onClick={handleToggle}
                    className="size-8 hover:bg-red-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                    aria-label="Đóng"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Conversation List or Chat Window */}
            {selected ? (
              <div className="flex-1 overflow-hidden">
                <ChatWindow
                  conversation={selected}
                  currentUserId={currentUserId}
                  onBack={() => setSelected(null)}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden chat-widget-scrollbar">
                <ChatSidebar
                  conversations={conversations}
                  loading={loadingConversations}
                  selectedId={selected?.otherUserId ?? null}
                  onSelect={handleSelectConversation}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
