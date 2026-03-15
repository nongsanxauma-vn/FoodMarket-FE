import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Download, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
      fetchData();
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
      fetchData();
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

  // Calculate statistics from real data
  const totalWithdrawn = history.filter(h => h.status === 'SUCCESS').reduce((sum, h) => sum + h.amount, 0);
  const totalPending = pendingRequests.reduce((sum, req) => sum + req.amount, 0);
  const totalRejected = history.filter(h => h.status === 'REJECTED').reduce((sum, h) => sum + h.amount, 0);
  const totalProcessing = history.filter(h => h.status === 'PENDING').reduce((sum, h) => sum + h.amount, 0);
  
  // Calculate platform statistics (these would ideally come from a dedicated admin API)
  // For now, we calculate from available data
  const totalBalance = totalWithdrawn + totalPending; // Simplified calculation
  const platformCommission = Math.floor(totalWithdrawn * 0.03); // Assuming 3% commission
  const shippingFees = Math.floor(totalWithdrawn * 0.01); // Assuming 1% shipping fee
  const shopFunds = totalPending; // Money waiting to be withdrawn

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Ví Sàn</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Xuất báo cáo
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-sm">
            Nạp tiền hệ thống
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-semibold mb-6">
          <AlertCircle className="size-5" />
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng đã giải ngân</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalWithdrawn.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-400">đ</span>
          </h3>
          <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
            <TrendingUp className="size-3" />
            Đã thanh toán thành công
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hoa hồng sàn (ước tính)</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {platformCommission.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-400">đ</span>
          </h3>
          <p className="text-xs text-blue-600 font-semibold">~3% từ giao dịch</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phí ship (ước tính)</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {shippingFees.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-400">đ</span>
          </h3>
          <p className="text-xs text-gray-500 font-semibold">~1% từ giao dịch</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Đang chờ xử lý</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalPending.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-400">đ</span>
          </h3>
          <p className="text-xs text-purple-600 font-semibold">{pendingRequests.length} yêu cầu</p>
        </div>
      </div>

      {/* Withdrawal Queue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Wallet className="size-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Hàng đợi yêu cầu rút tiền</h3>
          </div>
          <button className="text-xs font-bold text-primary hover:underline">Xử lý hàng loạt</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mã / Chủ ví
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Phân loại
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Số tiền yêu cầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Thông tin ngân hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Wallet className="size-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">Không có thêm yêu cầu nào đang chờ xử lý.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">SHOP-{req.shopOwnerId}</span>
                        <span className="text-xs text-gray-400">Ví ID: {req.walletId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-bold bg-purple-50 text-purple-600 rounded-md">
                        SHOP
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {(req.amount || 0).toLocaleString('vi-VN')} <span className="font-normal">đ</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs leading-tight">
                        <p className="font-bold text-gray-700">{req.bankAccountNumber || '...'}</p>
                        <p className="text-gray-400 uppercase">{req.bankName || 'Chưa cung cấp'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {req.processedAt ? new Date(req.processedAt).toLocaleString('vi-VN') : 'Đang chờ'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          DUYỆT
                        </button>
                        <button
                          onClick={() => handleOpenReject(req.id)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-white border border-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          TỪ CHỐI
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="size-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Lịch sử giao dịch chi tiết</h3>
          </div>
          <div className="flex items-center gap-2">
            <select className="text-xs font-semibold border-gray-200 rounded-lg bg-gray-50 px-3 py-2 focus:ring-primary focus:border-primary">
              <option>Tất cả giao dịch</option>
              <option>Thành công</option>
              <option>Từ chối</option>
              <option>Đang xử lý</option>
            </select>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Download className="size-4" />
              TẢI SAO KÊ
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Mã GD</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Đối tác</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <svg className="size-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-500">Không có lịch sử giao dịch.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-900">#{tx.id}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600">
                        <span className="size-1.5 rounded-full bg-purple-600"></span>
                        RÚT TIỀN
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-600">SHOP-{tx.shopOwnerId}</td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-gray-900">
                      {tx.status === 'SUCCESS' ? '-' : ''}{(tx.amount || 0).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {tx.processedAt ? new Date(tx.processedAt).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          tx.status === 'SUCCESS'
                            ? 'bg-green-50 text-green-600'
                            : tx.status === 'REJECTED'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {tx.status === 'SUCCESS' ? 'THÀNH CÔNG' : tx.status === 'REJECTED' ? 'TỪ CHỐI' : 'ĐANG XỬ LÝ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 max-w-[200px] truncate">
                      {tx.adminNote || `${tx.bankName} - ${tx.bankAccountNumber}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            Hiển thị {history.length} giao dịch
          </span>
          <div className="flex gap-1">
            <button className="size-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:bg-gray-50">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="size-8 flex items-center justify-center rounded border border-primary bg-primary/10 text-primary font-bold text-xs">
              1
            </button>
            <button className="size-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold text-xs">
              2
            </button>
            <button className="size-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:bg-gray-50">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Từ chối Yêu Cầu #{rejectId}</h3>
            <p className="text-sm text-gray-500 mb-6">Xin vui lòng nhập lý do từ chối để thông báo cho người dùng.</p>

            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none mb-6"
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
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectNote('');
                  setRejectId(null);
                }}
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
