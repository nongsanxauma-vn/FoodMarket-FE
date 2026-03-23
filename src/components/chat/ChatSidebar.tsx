/**
 * ChatSidebar - Danh sách hội thoại (Inbox)
 */
import React from 'react';
import { MessageSquare, Search, Loader2 } from 'lucide-react';
import type { Conversation } from '../../types/chat';

interface ChatSidebarProps {
  conversations: Conversation[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (conv: Conversation) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const formatTime = (isoStr: string): string => {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin}ph`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}g`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  } catch {
    return '';
  }
};

const getRoleLabel = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'BUYER': return 'Khách hàng';
    case 'SHOP_OWNER': return 'Chủ shop';
    case 'FARMER': return 'Nông dân';
    default: return role;
  }
};

const getInitial = (name: string) => (name || '?').charAt(0).toUpperCase();

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  loading,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  const filtered = conversations.filter((c) =>
    c.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Search & Header (Simplified) */}
      <div className="p-4 border-b border-gray-100 bg-white">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-300" />
          <input
            type="text"
            placeholder="Tìm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-300 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>


      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-300">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest">Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
            <div className="size-16 bg-gray-50 rounded-3xl flex items-center justify-center">
              <MessageSquare className="size-8 text-gray-200" />
            </div>
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
              {searchQuery ? 'Không tìm thấy' : 'Chưa có tin nhắn nào'}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {filtered.map((conv) => {
              const isSelected = selectedId === conv.otherUserId;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv)}
                  className={`w-full flex items-center gap-4 px-5 py-4 transition-all text-left group relative ${
                    isSelected
                      ? 'bg-primary/5 border-r-4 border-primary'
                      : 'hover:bg-gray-50 border-r-4 border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {getInitial(conv.otherUserName)}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-black truncate ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                        {conv.otherUserName}
                      </p>
                      <span className="text-[10px] font-bold text-gray-400 shrink-0 ml-2">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {getRoleLabel(conv.otherUserRole)}
                      </span>
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-700' : 'text-gray-400 font-medium'}`}>
                        {conv.lastMessage || 'Bắt đầu cuộc trò chuyện'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
