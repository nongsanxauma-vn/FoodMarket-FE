
import React, { useEffect, useState } from 'react';
import { UserX, Search, Bell, ShieldAlert, Zap, AlertCircle, Lock, Unlock, History, MoreHorizontal, Filter, Download, ChevronRight, XCircle, Loader2 } from 'lucide-react';
import { userService, UserResponse } from '../../services';
import Pagination, { PageInfo } from '../../components/ui/Pagination';

const PAGE_SIZE = 10;

const BadBuyers: React.FC = () => {
  const [buyers, setBuyers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  useEffect(() => {
    const fetchBuyers = async () => {
      setLoading(true);
      try {
        const res = await userService.getAllUsersPaged(page, PAGE_SIZE);
        const allUsers = res.result?.content || [];
        if (res.result) {
          setPageInfo({
            page: res.result.page,
            size: res.result.size,
            totalElements: res.result.totalElements,
            totalPages: res.result.totalPages,
            first: res.result.first,
            last: res.result.last,
          });
        }
        const buyerList = allUsers.filter((u: UserResponse) => u.roleName === 'BUYER');
        setBuyers(buyerList);
      } catch (err) {
        console.error('Failed to load buyers', err);
        setError('Không thể tải danh sách người mua.');
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, [page]);

  const handleBlock = async (userId: number) => {
    if (!window.confirm('Bạn có chắc muốn khóa tài khoản này?')) return;
    setProcessing(userId);
    try {
      await userService.deactivateUser(userId);
      setBuyers(prev => prev.map(b => b.id === userId ? { ...b, status: 'DEACTIVATED' } : b));
    } catch (err: any) {
      alert(err?.data?.message || 'Không thể khóa tài khoản');
    } finally {
      setProcessing(null);
    }
  };

  const handleUnblock = async (userId: number) => {
    setProcessing(userId);
    try {
      await userService.activateUser(userId);
      setBuyers(prev => prev.map(b => b.id === userId ? { ...b, status: 'ACTIVE' } : b));
    } catch (err: any) {
      alert(err?.data?.message || 'Không thể mở khóa tài khoản');
    } finally {
      setProcessing(null);
    }
  };

  const blockedBuyers = buyers.filter(b => b.status === 'DEACTIVATED' || b.status === 'INACTIVE');
  const activeBuyers = buyers.filter(b => b.status === 'ACTIVE');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải danh sách người mua...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'TỔNG TÀI KHOẢN BỊ KHÓA', value: blockedBuyers.length.toLocaleString(), sub: 'Đã bị vô hiệu hóa', icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'ĐANG HOẠT ĐỘNG', value: activeBuyers.length.toLocaleString(), sub: 'Tài khoản bình thường', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'TỔNG NGƯỜI MUA', value: buyers.length.toLocaleString(), sub: 'Tất cả trạng thái', icon: Unlock, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6 group">
            <div className={`size-16 ${stat.bg} ${stat.color} rounded-[28px] flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="size-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-display">{stat.value}</h3>
              <p className={`text-[10px] font-bold mt-1 ${stat.color} opacity-80`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle className="size-5" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Buyers Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <h4 className="font-black text-gray-800 uppercase tracking-tight">DANH SÁCH NGƯỜI MUA ({buyers.length})</h4>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Filter className="size-3" /> Lọc</button>
              <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Download className="size-3" /> Xuất</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {buyers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-10 text-center text-gray-400 font-bold">Không có người mua nào.</td>
                </tr>
              ) : buyers.map((user, i) => {
                const isBlocked = user.status === 'DEACTIVATED' || user.status === 'INACTIVE';
                return (
                  <tr key={user.id} className={`hover:bg-gray-50/30 transition-colors ${isBlocked ? 'bg-red-50/20' : ''}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          {isBlocked ? <Lock className="size-5 text-red-500" /> : <span className="material-symbols-outlined">person</span>}
                        </div>
                        <div>
                          <p className={`text-sm font-black ${isBlocked ? 'text-red-700' : 'text-gray-900'}`}>{user.fullName || user.username || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center text-xs font-bold text-gray-600">{user.email || 'N/A'}</td>
                    <td className="px-6 py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${isBlocked ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                        }`}>{user.status || 'N/A'}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        {isBlocked ? (
                          <button onClick={() => handleUnblock(user.id)} disabled={processing === user.id} className="px-6 py-2 border border-blue-100 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-50 transition-colors disabled:opacity-50">Mở khóa</button>
                        ) : (
                          <button onClick={() => handleBlock(user.id)} disabled={processing === user.id} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline disabled:opacity-50">CHẶN</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">Hiển thị {buyers.length} người mua</p>
          </div>
          {pageInfo && <Pagination pageInfo={pageInfo} onPageChange={setPage} className="px-8" />}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <Zap className="size-6 text-orange-500" />
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Quy tắc tự động khóa</h4>
            </div>
            <div className="space-y-8">
              {[
                { id: 1, text: 'Tự động gắn cờ Cảnh báo khi người mua có 2 đơn "bom" (hủy hàng khi giao) trong 30 ngày.' },
                { id: 2, text: 'Tự động Khóa tài khoản 7 ngày nếu phát sinh đơn bom thứ 3.' },
                { id: 3, text: 'Khóa vĩnh viễn đối với tài khoản có tỉ lệ nhận hàng < 30% sau 10 đơn hàng đầu tiên.' },
              ].map((rule) => (
                <div key={rule.id} className="flex gap-4">
                  <span className="size-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{rule.id}</span>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">{rule.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">Điều chỉnh cấu hình quy tắc</button>
          </div>

          <div className="bg-gray-900 rounded-[40px] p-10 flex flex-col gap-8 text-white">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-orange-400">campaign</span>
              <h4 className="font-black uppercase tracking-tight">Thao tác quản trị viên</h4>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Gửi cảnh báo hàng loạt', sub: 'Áp dụng cho đối tượng 2 đơn bom', icon: ShieldAlert, color: 'text-orange-400' },
                { label: 'Quét tài khoản ảo', sub: 'Hệ thống AI nhận diện theo IP/SĐT', icon: XCircle, color: 'text-red-400' },
                { label: 'Lịch sử mở khóa', sub: 'Xem lại các trường hợp được ân xá', icon: History, color: 'text-blue-400' },
              ].map((action, i) => (
                <button key={i} className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all text-left">
                  <div className={`size-10 ${action.color} bg-white/10 rounded-2xl flex items-center justify-center`}>
                    <action.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-tight">{action.label}</p>
                    <p className="text-[10px] opacity-40 font-bold mt-1 uppercase tracking-widest">{action.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadBuyers;
