import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, RefreshCw, Clock, CheckCircle2, XCircle, 
  AlertCircle, Search, Package, MessageSquare, Info, 
  Eye, Gavel, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { returnService, ReturnRequestResponse, ReturnStatus } from '../../services/return.service';
import { globalShowAlert, globalShowConfirm } from '../../contexts/PopupContext';

const MyReturns: React.FC = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState<ReturnRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReturnStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequestResponse | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await returnService.getMyReturns();
      if (res.result) {
        setReturns(res.result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (err: any) {
      console.error('Failed to fetch returns:', err);
      globalShowAlert('Không thể tải danh sách yêu cầu. Vui lòng thử lại.', 'Lỗi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleDispute = async (id: number) => {
      if (!disputeReason.trim()) {
          globalShowAlert('Vui lòng nhập lý do khiếu nại', 'Nhắc nhở', 'warning');
          return;
      }

      try {
          setSubmittingDispute(true);
          const res = await returnService.dispute(id, disputeReason);
          if (res.result) {
              globalShowAlert('Đã gửi khiếu nại lên Admin thành công!', 'Thành công', 'success');
              setShowDisputeModal(false);
              setDisputeReason('');
              fetchReturns();
          }
      } catch (err: any) {
          globalShowAlert(err.message || 'Không thể gửi khiếu nại', 'Lỗi', 'error');
      } finally {
          setSubmittingDispute(false);
      }
  };

  const getStatusConfig = (status: ReturnStatus) => {
    const configs: Record<ReturnStatus, { label: string; color: string; icon: any; bg: string }> = {
      [ReturnStatus.PENDING]: { label: 'Chờ Shop duyệt', color: 'text-yellow-600', icon: Clock, bg: 'bg-yellow-50' },
      [ReturnStatus.SHOP_APPROVED]: { label: 'Shop đã đồng ý', color: 'text-blue-600', icon: CheckCircle2, bg: 'bg-blue-50' },
      [ReturnStatus.APPROVED]: { label: 'Chờ Admin duyệt hoàn tiền', color: 'text-indigo-600', icon: CheckCircle2, bg: 'bg-indigo-50' },
      [ReturnStatus.REJECTED]: { label: 'Đã từ chối', color: 'text-red-600', icon: XCircle, bg: 'bg-red-50' },
      [ReturnStatus.DISPUTED]: { label: 'Đang tranh chấp (Admin xử lý)', color: 'text-orange-600', icon: Gavel, bg: 'bg-orange-50' },
      [ReturnStatus.COMPLETED]: { label: 'Đã hoàn tiền', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' },
      [ReturnStatus.REFUND_PENDING]: { label: 'Admin đang tiến hành hoàn tiền', color: 'text-blue-600', icon: RefreshCw, bg: 'bg-blue-50' },
    };
    return configs[status];
  };

  const filteredReturns = returns.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = searchQuery === '' || 
      r.id.toString().includes(searchQuery) || 
      r.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="size-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Đổi Trả / Hoàn Tiền</h1>
            <p className="text-gray-400 font-bold text-sm mt-1">
              Theo dõi và quản lý các yêu cầu hoàn trả của bạn
            </p>
          </div>
          <button
            onClick={fetchReturns}
            disabled={loading}
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo mã yêu cầu hoặc tên sản phẩm..."
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] text-sm font-bold outline-none focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 transition-all"
                    />
                </div>
                <div>
                   <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[20px] text-sm font-bold outline-none focus:border-primary transition-all"
                   >
                       <option value="ALL">Tất cả trạng thái</option>
                       {Object.values(ReturnStatus).map(s => (
                           <option key={s} value={s}>{getStatusConfig(s).label}</option>
                       ))}
                   </select>
                </div>
            </div>
        </div>

        {/* Returns List */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400">Đang tải dữ liệu...</p>
            </div>
        ) : filteredReturns.length === 0 ? (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-20 text-center">
                 <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 mx-auto">
                    <Package className="size-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Chưa có yêu cầu nào</h3>
                <p className="text-gray-500 mb-8">Bạn có thể yêu cầu đổi trả tại mục "Đơn hàng của tôi" sau khi nhận được hàng.</p>
                <button 
                  onClick={() => navigate('/my-orders')}
                  className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    Đến đơn hàng của tôi
                </button>
            </div>
        ) : (
            <div className="space-y-6">
                {filteredReturns.map(req => {
                    const config = getStatusConfig(req.status);
                    const StatusIcon = config.icon;

                    return (
                        <div key={req.id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-primary/10">
                            {/* Card Header */}
                            <div className={`px-8 py-5 border-b border-gray-50 flex items-center justify-between ${config.bg}/30`}>
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 ${config.bg} rounded-2xl flex items-center justify-center ${config.color}`}>
                                        <StatusIcon className="size-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-gray-900">Yêu cầu #{req.id}</h3>
                                            <span className={`px-4 py-1.5 ${config.bg} ${config.color} text-[10px] font-black rounded-full uppercase tracking-wider`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-bold mt-1">Gửi lúc: {formatDate(req.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiền hoàn dự kiến</p>
                                    <p className="text-2xl font-black text-primary">{req.refundAmount?.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Product & Reason */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="size-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                                <Package className="size-8 text-primary/40" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-gray-900 truncate">{req.productName}</h4>
                                                <p className="text-sm text-gray-500 font-bold">Số lượng: {req.quantity} • Giá: {req.unitPrice.toLocaleString('vi-VN')}đ</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                                <FileText className="size-3" /> Lý do yêu cầu
                                            </div>
                                            <p className="p-5 bg-yellow-50/50 border border-yellow-100 rounded-3xl text-sm italic text-gray-700">
                                                "{req.reason}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    <div className="space-y-6">
                                        {/* Shop Response */}
                                        {req.shopResponse && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                                    <MessageSquare className="size-3" /> Phản hồi từ Shop
                                                </div>
                                                <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl text-sm text-gray-700">
                                                    {req.shopResponse}
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin Remark */}
                                        {req.adminRemark && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                                    <AlertCircle className="size-3" /> Ghi chú từ Admin
                                                </div>
                                                <div className="p-5 bg-green-50/50 border border-green-100 rounded-3xl text-sm text-gray-700">
                                                    {req.adminRemark}
                                                </div>
                                            </div>
                                        )}

                                        {!req.shopResponse && !req.adminRemark && (
                                              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                                  <Clock className="size-8 text-gray-300 mb-3" />
                                                  <p className="text-sm text-gray-400 font-bold">Đang chờ phản hồi từ các bên liên quan</p>
                                              </div>
                                        )}
                                    </div>
                                </div>

                                {/* Evidence Image */}
                                {req.evidence && (
                                    <div className="mt-8 pt-8 border-t border-gray-50">
                                         <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                                            <Eye className="size-3" /> Bằng chứng hình ảnh
                                        </div>
                                        <div className="relative group w-fit">
                                            <img 
                                                src={req.evidence} 
                                                alt="Evidence" 
                                                className="h-32 rounded-2xl border border-gray-100 hover:shadow-xl transition-all cursor-zoom-in"
                                                onClick={() => window.open(req.evidence, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none flex items-center justify-center">
                                                <Eye className="size-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Card Actions */}
                                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-end gap-3">
                                    {req.status === ReturnStatus.REJECTED && (
                                        <button 
                                            onClick={() => { setSelectedReturn(req); setShowDisputeModal(true); }}
                                            className="px-8 py-4 bg-orange-100 text-orange-600 font-black rounded-2xl border border-orange-200 hover:bg-orange-200 transition-all flex items-center gap-2"
                                        >
                                            <Gavel className="size-5" />
                                            Khiếu nại lên Admin
                                        </button>
                                    )}
                                    
                                    <button 
                                        className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                                    >
                                        <Info className="size-5" />
                                        Xem chi tiết đơn hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && selectedReturn && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Khiếu nại Admin</h3>
                            <p className="text-gray-400 font-bold text-sm mt-1">Yêu cầu Admin xem xét lại quyết định của Shop</p>
                        </div>
                        <button onClick={() => setShowDisputeModal(false)} className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                            <XCircle className="size-6" />
                        </button>
                    </div>

                    <div className="p-10 space-y-6">
                        <div className="p-5 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4">
                            <AlertCircle className="size-6 text-orange-500 shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-orange-800 font-bold">Lưu ý quan trọng</p>
                                <p className="text-xs text-orange-600 mt-1">Admin sẽ là người trung gian đưa ra quyết định cuối cùng dựa trên bằng chứng của cả hai bên. Vui lòng cung cấp lý do cụ thể.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Lý do khiếu nại</p>
                            <textarea 
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                                placeholder="Hãy giải thích tại sao quyết định của Shop chưa thỏa đáng..."
                                className="w-full h-40 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-medium outline-none focus:border-primary transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="p-10 bg-gray-50 border-t border-gray-100 flex gap-4">
                        <button 
                            onClick={() => setShowDisputeModal(false)}
                            className="flex-1 py-5 bg-white border border-gray-200 text-gray-500 font-black rounded-[24px] hover:bg-gray-100 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            onClick={() => handleDispute(selectedReturn.id)}
                            disabled={submittingDispute || !disputeReason.trim()}
                            className="flex-[2] py-5 bg-orange-500 text-white font-black rounded-[24px] shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {submittingDispute ? <RefreshCw className="size-5 animate-spin" /> : 'Gửi khiếu nại ngay'}
                        </button>
                    </div>
                </div>
          </div>
      )}
    </div>
  );
};

export default MyReturns;
