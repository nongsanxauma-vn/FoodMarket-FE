/**
 * ChatPage - Fullscreen chat (không bên trong MainLayout)
 * Cả Buyer và Farmer đều dùng trang này.
 * Layout: header cố định + {sidebar | chat window} chiếm phần còn lại
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import type { Conversation } from '../../types/chat';

const HEADER_H = 60; // px
const ADMIN_USER_ID = 6; // ID của Admin trong database - cần cập nhật theo thực tế
const SUPPORT_CENTER_NAME = 'Trung tâm hỗ trợ';

const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const openWithUserIdParam = searchParams.get('userId');
  const openWithUserNameParam = searchParams.get('userName') || 'Người dùng';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Lấy userId từ localStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authService.getMyInfo();
        if (res.result?.id) setCurrentUserId(Number(res.result.id));
      } catch {
        // fallback: đọc cached info
        const cached = authService.getUserInfo();
        if (cached?.id) setCurrentUserId(Number(cached.id));
      }
    };
    loadUser();
  }, []);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const convs = await chatService.getConversations();
      
      // Tìm conversation với Admin
      const adminConv = convs.find(c => c.otherUserId === ADMIN_USER_ID);
      
      // Nếu chưa có conversation với Admin, tạo một conversation để hiển thị
      if (!adminConv) {
        const supportConv: Conversation = {
          id: -1, // ID giả để phân biệt
          roomKey: '',
          otherUserId: ADMIN_USER_ID,
          otherUserName: SUPPORT_CENTER_NAME,
          otherUserRole: 'ADMIN',
          lastMessage: 'Bắt đầu trò chuyện với trung tâm hỗ trợ',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
        };
        // Ghim Admin lên đầu
        setConversations([supportConv, ...convs]);
      } else {
        // Cập nhật tên Admin thành "Trung tâm hỗ trợ"
        const updatedAdminConv = { ...adminConv, otherUserName: SUPPORT_CENTER_NAME };
        const otherConvs = convs.filter(c => c.otherUserId !== ADMIN_USER_ID);
        // Ghim Admin lên đầu
        setConversations([updatedAdminConv, ...otherConvs]);
      }

      if (openWithUserIdParam) {
        const targetId = Number(openWithUserIdParam);
        const existing = convs.find((c) => c.otherUserId === targetId);
        if (existing) {
          setSelected(existing);
        } else {
          // Tạo placeholder conversation
          const placeholder: Conversation = {
            id: 0,
            roomKey: '',
            otherUserId: targetId,
            otherUserName: openWithUserNameParam,
            otherUserRole: 'SHOP_OWNER',
            lastMessage: '',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
          };
          setSelected(placeholder);
          setConversations((prev) =>
            prev.some((c) => c.otherUserId === targetId) ? prev : [placeholder, ...prev]
          );
        }
      }
    } catch (e) {
      console.error('[ChatPage] load error:', e);
    } finally {
      setLoadingConversations(false);
    }
  }, [openWithUserIdParam, openWithUserNameParam]);

  useEffect(() => {
    if (currentUserId !== null) loadConversations();
  }, [currentUserId, loadConversations]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelected(conv);
    setConversations((prev) =>
      prev.map((c) => (c.otherUserId === conv.otherUserId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Trên mobile: ẩn sidebar khi đang xem 1 cuộc chat
  const mobileShowDetail = selected !== null;

  return (
    <div
      className="flex flex-col bg-gray-50"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      {/* ──────────── TOP HEADER ──────────── */}
      <header
        className="shrink-0 bg-[#1a4d2e] text-white flex items-center gap-3 px-4 shadow-lg"
        style={{ height: HEADER_H }}
      >
        <button
          onClick={() => navigate(-1)}
          className="size-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="size-9 bg-white/10 rounded-xl flex items-center justify-center">
          <MessageSquare className="size-5" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-tight leading-none">Tin nhắn</p>
          <p className="text-[9px] font-bold text-green-300 uppercase tracking-widest">
            Chat trực tiếp
          </p>
        </div>
      </header>

      {/* ──────────── BODY (flex-row, chiếm phần còn lại) ──────────── */}
      <div className="flex flex-1 min-h-0">
        {/* ── SIDEBAR (conversation list) ── */}
        <div
          className={`
            flex-col border-r border-gray-200 bg-white
            w-full md:w-80 lg:w-96 shrink-0
            ${mobileShowDetail ? 'hidden md:flex' : 'flex'}
          `}
        >
          {currentUserId !== null && (
            <ChatSidebar
              conversations={conversations}
              loading={loadingConversations}
              selectedId={selected?.otherUserId ?? null}
              onSelect={handleSelectConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </div>

        {/* ── CHAT WINDOW ── */}
        <div
          className={`
            flex-1 flex flex-col min-h-0 min-w-0
            ${mobileShowDetail ? 'flex' : 'hidden md:flex'}
          `}
        >
          {selected && currentUserId !== null ? (
            <ChatWindow
              conversation={selected}
              currentUserId={currentUserId}
              onBack={() => setSelected(null)}
            />
          ) : (
            // Empty state (desktop khi chưa chọn)
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
              <div className="size-20 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-center">
                <MessageSquare className="size-9 text-gray-200" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-700 uppercase tracking-tight">
                  Chọn một cuộc trò chuyện
                </p>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  Chọn từ danh sách bên trái để bắt đầu nhắn tin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
