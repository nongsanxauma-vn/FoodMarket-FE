import React, { useState, useEffect } from 'react';
import { Landmark, TrendingUp, History, Search, Bell, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Filter, Download, Percent, Loader2, AlertCircle } from 'lucide-react';
import { walletService, WithdrawRequestResponse } from '../../services';

const AdminWallet: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<WithdrawRequestResponse[]>([]);
  const [history, setHistory] = useState<WithdrawRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        walletService.getAllPendingWithdrawRequests(),
        walletService.getAllWithdrawRequests()
      ]);

      if (pendingRes.result) setPendingRequests(pendingRes.result);
      if (historyRes.result) setHistory(historyRes.result);
    } catch (err) {
      console.error('Failed to fetch admin wallet data', err);
      // It might fail if the token expires or network issue, but we shouldn't crash
      setError('Mất kết nối tải dữ liệu hoặc chưa có dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    if (!window.confirm(`Bạn có chắc muốn phê duyệt giải ngân yêu cầu #${id}?`)) return;

    try {
      setIsProcessing(true);
      await walletService.confirmWithdrawSuccess(id, 'Đã giải ngân thành công qua Admin');
      alert(`Đã phê duyệt yêu cầu #${id}`);
      fetchData(); // Reload
    } catch (err: any) {
      alert(err?.data?.message || 'Có lỗi khi duyệt yêu cầu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenReject = (id: number) => {
    setRejectId(id);
    setIsRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!rejectId || !rejectNote.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setIsProcessing(true);
      await walletService.rejectWithdraw(rejectId, rejectNote);
      alert(`Đã từ chối yêu cầu #${rejectId}`);
      setIsRejectModalOpen(false);
      setRejectNote('');
      setRejectId(null);
      fetchData(); // Reload
    } catch (err: any) {
      alert(err?.data?.message || 'Có lỗi khi từ chối yêu cầu');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu admin ví...</p>
      </div>
    );
  }

  // Caculate total amount
  const totalWithdrawn = history.filter(h => h.status === 'SUCCESS').reduce((sum, h) => sum + h.amount, 0);

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 relative">
      {/* Top Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'TỔNG YÊU CẦU CHỜ DUYỆT', value: `${pendingRequests.length} Yêu cầu`, sub: 'Đang cần xử lý', icon: Landmark, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'TỔNG LỊCH SỬ GIAO DỊCH', value: `${history.length} Giao dịch`, sub: 'Tất cả trạng thái', icon: History, color: 'text-gray-500', bg: 'bg-gray-100' },
          { label: 'TỔNG TIỀN ĐÃ GIẢI NGÂN', value: `${totalWithdrawn.toLocaleString('vi-VN')}đ`, sub: 'Giao dịch thành công', icon: Percent, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8 group">
            <div className={`size-20 ${stat.bg} ${stat.color} rounded-[32px] flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="size-10" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-display">{stat.value}</h3>
              <p className={`text-[10px] font-bold mt-1 ${stat.color} opacity-80 uppercase tracking-widest`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold">
          <AlertCircle className="size-6" />
          {error}
        </div>
      )}

      {/* Withdrawal Queue */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Hàng đợi yêu cầu rút tiền</h4>
          </div>
          <button className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">Lọc yêu cầu</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Yêu cầu / Chủ ví</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số tiền yêu cầu</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài khoản ngân hàng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày yêu cầu</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-10 text-center text-gray-400 font-bold">Không có yêu cầu rút tiền nào đang chờ duyệt.</td>
                </tr>
              ) : pendingRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                        #{req.id}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">Ví ID: {req.walletId}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Shop ID: {req.shopOwnerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-black text-orange-600">{(req.amount || 0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{req.bankName || 'Chưa cung cấp'}</span>
                      <span className="text-xs font-bold text-gray-600 font-mono">{req.bankAccountNumber || '...'}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{req.bankAccountHolder || '...'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[10px] font-bold text-gray-400">
                    {req.processedAt ? new Date(req.processedAt).toLocaleString('vi-VN') : 'Đang chờ'}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleApprove(req.id)} disabled={isProcessing} className="px-6 py-3 bg-[#38703d] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#2d5a31] transition-all disabled:opacity-50">Phê duyệt</button>
                      <button onClick={async () => { try { setIsProcessing(true); await walletService.createWithdrawQr(req.id); alert(`Đã tạo QR cho yêu cầu #${req.id}`); fetchData(); } catch (err: any) { alert(err?.data?.message || 'Có lỗi khi tạo QR'); } finally { setIsProcessing(false); } }} disabled={isProcessing} className="px-6 py-3 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100 disabled:opacity-50">Tạo QR</button>
                      <button onClick={() => handleOpenReject(req.id)} disabled={isProcessing} className="px-6 py-3 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 disabled:opacity-50">Từ chối</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="size-6 text-gray-400" />
            <h4 className="font-black text-gray-800 uppercase tracking-tight">LỊCH SỬ GIẢI NGÂN / TỪ CHỐI</h4>
          </div>
          <button className="text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-widest hover:text-gray-900">
            Tải sao kê <Download className="size-4" />
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã YC</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop / Ví</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số tiền</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ghi chú & Ngân hàng</th>
              <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-10 py-10 text-center text-gray-400 font-bold">Không có lịch sử giao dịch.</td>
              </tr>
            ) : history.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-10 py-5 text-[10px] font-bold text-gray-500 uppercase">#{tx.id}</td>
                <td className="px-6 py-5 text-sm font-black text-gray-700">Shop ID: {tx.shopOwnerId}</td>
                <td className="px-6 py-5 text-center text-sm font-black text-gray-900">{(tx.amount || 0).toLocaleString('vi-VN')}đ</td>
                <td className="px-6 py-5 text-[11px] font-bold text-gray-400">{tx.processedAt ? new Date(tx.processedAt).toLocaleString('vi-VN') : 'N/A'}</td>
                <td className="px-6 py-5">
                  <p className="text-xs font-bold text-gray-600">{tx.bankName} - {tx.bankAccountNumber}</p>
                  {tx.adminNote && <p className="text-[10px] text-gray-400 mt-1 italic">Note: {tx.adminNote}</p>}
                </td>
                <td className="px-10 py-5 text-right">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'bg-green-50 text-emerald-600' :
                    tx.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium italic">Hiển thị toàn bộ lịch sử</p>
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Từ chối Yêu Cầu #{rejectId}</h3>
            <p className="text-sm text-gray-500 mb-6">Xin vui lòng nhập lý do từ chối để thông báo cho người dùng.</p>

            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none mb-6"
              placeholder="Lý do từ chối (VD: Thông tin tài khoản sai lệch...)"
            />

            <div className="flex gap-4">
              <button
                disabled={isProcessing}
                onClick={submitReject}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50"
              >
                XÁC NHẬN TỪ CHỐI
              </button>
              <button
                onClick={() => { setIsRejectModalOpen(false); setRejectNote(''); setRejectId(null); }}
                disabled={isProcessing}
                className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWallet;
