import React, { useState, useEffect } from 'react';
import {
  Package, Clock, Truck, CheckCircle2, XCircle, Eye,
  ArrowLeft, RefreshCw, AlertCircle, Filter, Search
} from 'lucide-react';
import { orderService, OrderResponse, OrderItemResponse } from '../../services/order.service';
import { authService } from '../../services/auth.service';
import { reviewService } from '../../services/review.service';
import { Star, Camera, X, Loader2 } from 'lucide-react';

interface MyOrdersProps {
  onBack: () => void;
  onViewTracking: (orderId: number) => void;
}

type OrderStatusFilter = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

const MyOrders: React.FC<MyOrdersProps> = ({ onBack, onViewTracking }) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Review state
  const [selectedItem, setSelectedItem] = useState<OrderItemResponse | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userInfo = await authService.getMyInfo();
      if (!userInfo.result) {
        console.error('No user info found');
        return;
      }

      console.log('Fetching orders for user:', userInfo.result.id);

      // Sử dụng getOrdersByUserId thay vì getAllOrders
      const response = await orderService.getOrdersByUserId(userInfo.result.id);

      console.log('Orders response:', response);

      if (response.result) {
        // Filter orders by current user
        const myOrders = response.result.filter(
          order => order.items && order.items.length > 0
        );
        setOrders(myOrders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);

      // Hiển thị lỗi cho user
      if (error.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        alert('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedItem) return;
    try {
      setSubmittingReview(true);
      const res = await reviewService.createReview({
        orderDetailId: selectedItem.orderDetailId,
        ratingStar: rating,
        comment: comment
      }, evidence || undefined);

      if (res.result) {
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
        setShowReviewModal(false);
        setSelectedItem(null);
        setRating(5);
        setComment('');
        setEvidence(null);
        fetchOrders(); // Refresh to update UI if needed
      }
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      alert(err.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any; bg: string }> = {
      PENDING: { label: 'Chờ duyệt', color: 'text-yellow-600', icon: Clock, bg: 'bg-yellow-50' },
      PAID: { label: 'Đã thanh toán', color: 'text-blue-600', icon: Clock, bg: 'bg-blue-50' },
      CONFIRMED: { label: 'Đã duyệt', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' },
      SHIPPING: { label: 'Đang giao', color: 'text-blue-600', icon: Truck, bg: 'bg-blue-50' },
      DELIVERED: { label: 'Đã giao', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' },
      CANCELLED: { label: 'Đã hủy', color: 'text-red-600', icon: XCircle, bg: 'bg-red-50' },
      FAILED: { label: 'Thất bại', color: 'text-red-600', icon: XCircle, bg: 'bg-red-50' },
    };
    return configs[status] || configs.PENDING;
  };

  const canTrack = (status: string) => {
    return ['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(status);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'ALL' || order.status === filter;
    const matchesSearch = searchQuery === '' ||
      order.id.toString().includes(searchQuery) ||
      order.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
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
            onClick={onBack}
            className="size-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-gray-900">Đơn Hàng Của Tôi</h1>
            <p className="text-gray-400 font-bold text-sm mt-1">
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo mã đơn hoặc tên người nhận..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['ALL', 'PENDING', 'PAID', 'CONFIRMED', 'SHIPPING', 'DELIVERED'] as OrderStatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${filter === status
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                >
                  {status === 'ALL' ? 'Tất cả' : getStatusConfig(status).label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400">Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-16 text-center">
            <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 mx-auto">
              <Package className="size-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-8">
              {filter !== 'ALL'
                ? `Không tìm thấy đơn hàng với trạng thái "${getStatusConfig(filter).label}"`
                : 'Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên nhé!'
              }
            </p>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const trackable = canTrack(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Order Header */}
                  <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className={`size-12 ${statusConfig.bg} rounded-2xl flex items-center justify-center ${statusConfig.color}`}>
                        <StatusIcon className="size-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-gray-900">Đơn hàng #{order.id}</h3>
                          <span className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.color} text-xs font-black rounded-full uppercase`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold mt-1">
                          Đặt lúc: {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng tiền</p>
                      <p className="text-2xl font-black text-primary">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      {/* Delivery Info */}
                      <div className="space-y-3">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Thông tin giao hàng</p>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-gray-900">{order.recipientName}</p>
                          <p className="text-sm text-gray-600">{order.recipientPhone}</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          Sản phẩm ({order.items?.length || 0})
                        </p>
                        <div className="space-y-2">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm py-1">
                              <span className="text-gray-600">{item.productName} x{item.quantity}</span>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-gray-900">{item.unitPrice.toLocaleString('vi-VN')}đ</span>
                                {order.status === 'DELIVERED' && (
                                  <button
                                    onClick={() => { setSelectedItem(item); setShowReviewModal(true); }}
                                    className="text-primary font-black text-[10px] uppercase tracking-wider hover:underline"
                                  >
                                    Đánh giá
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {(order.items?.length || 0) > 3 && (
                            <p className="text-xs text-gray-400 italic">
                              +{(order.items?.length || 0) - 3} sản phẩm khác
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Ghi chú</p>
                        <p className="text-sm text-gray-700">{order.note}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">Phương thức:</span>
                        <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-black rounded-full uppercase">
                          {order.paymentMethod || 'WALLET'}
                        </span>
                      </div>

                      {trackable ? (
                        <button
                          onClick={() => onViewTracking(order.id)}
                          className="px-6 py-3 bg-primary text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                        >
                          <Eye className="size-4" />
                          Theo dõi đơn hàng
                        </button>
                      ) : order.status === 'PENDING' || order.status === 'PAID' ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-yellow-50 text-yellow-700 rounded-2xl border border-yellow-100">
                          <AlertCircle className="size-4" />
                          <span className="text-sm font-bold">Đang chờ shop duyệt</span>
                        </div>
                      ) : (
                        <div className="px-6 py-3 bg-gray-50 text-gray-400 rounded-2xl">
                          <span className="text-sm font-bold">Không thể theo dõi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Đánh giá sản phẩm</h3>
                <p className="text-gray-400 font-bold text-sm mt-1">{selectedItem.productName}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              {/* Rating */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Độ hài lòng của bạn</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`size-10 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Nhận xét của bạn</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé..."
                  className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-medium outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Evidence Upload */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Hình ảnh thực tế (không bắt buộc)</p>
                <div className="flex items-center gap-4">
                  <label className="size-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                    <Camera className="size-6 text-gray-300 group-hover:text-primary transition-colors" />
                    <span className="text-[8px] font-black text-gray-300 mt-1 uppercase group-hover:text-primary">Tải lên</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                    />
                  </label>
                  {evidence && (
                    <div className="relative size-20 rounded-2xl overflow-hidden border border-gray-100 group">
                      <img
                        src={URL.createObjectURL(evidence)}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setEvidence(null)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleReviewSubmit}
                disabled={submittingReview || !comment.trim()}
                className="w-full py-5 bg-primary text-white font-black rounded-[24px] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submittingReview ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  'Gửi đánh giá ngay'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
