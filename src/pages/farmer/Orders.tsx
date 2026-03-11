import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, XCircle, User, AlertTriangle, X, Loader2, AlertCircle, Trash2, PackageCheck, PackageX } from 'lucide-react';
import { orderService, OrderResponse } from '../../services';

interface OrdersProps {
  onPrepareOrder?: (orderId: string) => void;
}

const Orders: React.FC<OrdersProps> = ({ onPrepareOrder }) => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getAllOrders();
      if (res.result) {
        setOrders(res.result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Mất kết nối tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenCancelModal = (orderId: number) => {
    setCancellingOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingOrderId) return;
    try {
      setIsProcessing(true);
      await orderService.updateOrder(cancellingOrderId, { status: 'CANCELLED' });
      alert(`Đã hủy đơn hàng #${cancellingOrderId}`);
      setShowCancelModal(false);
      setCancellingOrderId(null);
      fetchOrders();
    } catch (err: any) {
      console.error('[Orders] Cancel error:', err);
      alert(err?.data?.message || 'Có lỗi khi hủy đơn hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN đơn hàng #${orderId} không? Dữ liệu không thể phục hồi.`)) return;
    try {
      setIsProcessing(true);
      await orderService.deleteOrder(orderId);
      alert(`Đã xóa vĩnh viễn đơn hàng #${orderId}`);
      fetchOrders();
    } catch (err: any) {
      console.error('[Orders] Delete error:', err);
      alert(err?.data?.message || 'Có lỗi khi xóa đơn hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Farmer xác nhận đơn hàng: PENDING → CONFIRMED (hoặc PAID → CONFIRMED với đơn QR)
   * Đúng với state machine: CONFIRMED = "đang chuẩn bị hàng" trên hệ thống thực tế.
   * Shipper sau đó sẽ acceptOrder() → đổi thành SHIPPING.
   */
  const handleConfirmOrder = async (orderId: number) => {
    if (!window.confirm(`Xác nhận chuẩn bị đơn hàng #${orderId}?`)) return;
    try {
      setIsProcessing(true);
      const updateData = { status: 'CONFIRMED' };
      console.log('[Orders] Farmer confirms order → CONFIRMED:', updateData);
      await orderService.updateOrder(orderId, updateData);
      alert(`Đã xác nhận đơn hàng #${orderId} — Đang chuẩn bị hàng!`);
      if (onPrepareOrder) onPrepareOrder(orderId.toString());
      fetchOrders();
    } catch (err: any) {
      console.error('[Orders] Update error:', err);
      alert(err?.data?.message || 'Có lỗi khi xác nhận đơn hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  // Tabs — Thêm "Đang chuẩn bị" (CONFIRMED) và "Thất bại" (FAILED)
  const tabs = [
    { label: 'Tất cả', statuses: [] },
    { label: 'Chờ xác nhận', statuses: ['PENDING', 'PAID'] },  // PAID (QR) cũng chờ Farmer xác nhận
    { label: 'Đang chuẩn bị', statuses: ['CONFIRMED'] },
    { label: 'Đang giao', statuses: ['SHIPPING'] },
    { label: 'Đã giao', statuses: ['DELIVERED'] },
    { label: 'Đã hủy', statuses: ['CANCELLED'] },
    { label: 'Thất bại', statuses: ['FAILED'] },
  ];

  const getFilteredOrders = () => {
    const activeTabDef = tabs.find(t => t.label === activeTab);
    if (!activeTabDef || activeTabDef.statuses.length === 0) return orders;
    return orders.filter(o => activeTabDef.statuses.includes(o.status));
  };

  const filteredOrders = getFilteredOrders();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4 w-full">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Quản Lý Đơn Hàng</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Theo dõi và xử lý các đơn hàng nông sản của bạn.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="Tìm mã đơn, khách hàng..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64 shadow-sm" />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
          </div>
          <button className="size-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 relative shadow-sm hover:text-primary transition-colors">
            <span className="material-symbols-outlined fill-1">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold">
          <AlertCircle className="size-6" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-2 border-b border-gray-50 flex items-center gap-8 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const count = tab.statuses.length === 0
              ? orders.length
              : orders.filter(o => tab.statuses.includes(o.status)).length;

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`py-5 text-xs font-black whitespace-nowrap transition-all border-b-2 ${activeTab === tab.label ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="p-8 space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
              Không tìm thấy đơn hàng nào.
            </div>
          ) : filteredOrders.map(order => {
            // Phân loại trạng thái đơn hàng theo đúng state machine
            const isPending = order.status === 'PENDING';    // COD chờ Farmer xác nhận
            const isPaid = order.status === 'PAID';          // QR đã thanh toán, chờ Farmer xác nhận
            const isConfirmed = order.status === 'CONFIRMED'; // Farmer đã xác nhận, đang chuẩn bị hàng
            const isShipping = order.status === 'SHIPPING';  // Shipper đang giao
            const isDelivered = order.status === 'DELIVERED'; // Đã giao thành công
            const isCancelled = order.status === 'CANCELLED'; // Đã hủy
            const isFailed = order.status === 'FAILED';       // Giao thất bại / boom hàng

            // Các đơn chờ Farmer nhấn "Chuẩn bị hàng" (COD dạng PENDING, QR dạng PAID)
            const needsFarmerConfirm = isPending || isPaid;

            return (
              <div key={order.id} className={`bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all ${isDelivered || isCancelled || isFailed ? 'opacity-80' : ''}`}>
                <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm font-black text-primary">#ORD-{order.id}</span>
                    <span className="text-[11px] text-gray-400 font-bold">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>

                    {/* ---- Badges trạng thái ---- */}
                    {isPending && (
                      <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase rounded-md">Chờ xác nhận</span>
                    )}
                    {isPaid && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-md">✅ Đã thanh toán QR</span>
                    )}
                    {isConfirmed && (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black uppercase rounded-md">🔄 Đang chuẩn bị</span>
                    )}
                    {isShipping && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] font-black uppercase rounded-md">🚚 Đang giao</span>
                    )}
                    {isDelivered && (
                      <span className="px-2 py-0.5 bg-green-50 text-emerald-600 text-[10px] font-black uppercase rounded-md">✅ Đã giao</span>
                    )}
                    {isCancelled && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-md">Đã hủy</span>
                    )}
                    {isFailed && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-md">⚠️ Giao thất bại</span>
                    )}

                    {/* Badge phương thức thanh toán */}
                    {order.paymentMethod && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-md">{order.paymentMethod}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-black text-gray-900">{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  {/* Thông tin khách hàng + sản phẩm */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <User className="size-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">{order.recipientName}</h4>
                        <p className="text-[11px] text-gray-400 font-bold">{order.recipientPhone} • {order.shippingAddress}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chi tiết sản phẩm</p>
                      <div className="flex flex-wrap gap-3">
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                            <img src={`https://picsum.photos/seed/item${item.productId}/40/40`} className="size-10 rounded-xl object-cover bg-white" />
                            <div>
                              <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                              <p className="text-[10px] text-gray-400 font-bold">{item.quantity} x {(item.unitPrice || 0).toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.note && (
                        <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-xl font-medium border border-yellow-100">
                          <span className="font-bold">Ghi chú:</span> {order.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action panel bên phải */}
                  <div className="w-full md:w-80 flex flex-col gap-3 justify-center">

                    {/* Chờ Farmer xác nhận: PENDING (COD) hoặc PAID (QR đã trả tiền) */}
                    {needsFarmerConfirm && (
                      <>
                        {isPaid && (
                          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                            <p className="text-xs font-black text-blue-700">💳 Khách đã thanh toán QR</p>
                            <p className="text-[10px] text-blue-500 font-bold mt-0.5">Hãy xác nhận và bắt đầu chuẩn bị hàng</p>
                          </div>
                        )}
                        <button
                          disabled={isProcessing}
                          onClick={() => handleConfirmOrder(order.id)}
                          className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 disabled:opacity-50"
                        >
                          <CheckCircle2 className="size-5" /> Chuẩn bị hàng
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="py-3 border border-gray-100 text-gray-600 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                            <Truck className="size-4" /> Liên hệ KH
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleOpenCancelModal(order.id)}
                            className="py-3 border border-red-50 text-red-500 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                          >
                            <XCircle className="size-4" /> Hủy đơn
                          </button>
                        </div>
                      </>
                    )}

                    {/* CONFIRMED: Farmer đã xác nhận, đang chờ Shipper nhận đơn */}
                    {isConfirmed && (
                      <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100 text-center">
                        <PackageCheck className="size-8 text-purple-600 mx-auto mb-3" />
                        <p className="text-sm font-black text-purple-700">Đang chuẩn bị hàng</p>
                        <p className="text-[11px] text-purple-500 font-bold mt-1">Chờ Shipper nhận đơn và lấy hàng</p>
                      </div>
                    )}

                    {/* SHIPPING: Shipper đang trên đường giao */}
                    {isShipping && (
                      <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                        <Truck className="size-8 text-blue-500 mx-auto mb-3" />
                        <p className="text-sm font-black text-blue-700">Đơn hàng đang giao</p>
                        <p className="text-[11px] text-blue-500 font-bold mt-1">Shipper đang trên đường đến khách hàng</p>
                      </div>
                    )}

                    {/* DELIVERED: Giao thành công */}
                    {isDelivered && (
                      <div className="p-6 bg-green-50/50 rounded-[32px] border border-primary/10 text-center w-full">
                        <CheckCircle2 className="size-8 text-primary mx-auto mb-3" />
                        <p className="text-sm font-black text-primary">Giao hàng thành công</p>
                      </div>
                    )}

                    {/* FAILED: Giao thất bại / boom hàng */}
                    {isFailed && (
                      <div className="flex flex-col gap-3 h-full justify-center">
                        <div className="p-5 bg-red-50 rounded-3xl border border-red-100 text-center w-full">
                          <PackageX className="size-8 text-red-500 mx-auto mb-3" />
                          <p className="text-sm font-black text-red-700">Giao hàng thất bại</p>
                          <p className="text-[11px] text-red-500 font-bold mt-1">Khách không nhận hàng hoặc shipper giao lỗi</p>
                        </div>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleDeleteOrder(order.id)}
                          className="w-full py-3 border border-red-200 text-red-500 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="size-4" /> Xóa vĩnh viễn
                        </button>
                      </div>
                    )}

                    {/* CANCELLED: Đã hủy */}
                    {isCancelled && (
                      <div className="flex flex-col gap-3 h-full justify-center">
                        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-center w-full">
                          <XCircle className="size-6 text-red-500 mx-auto mb-2" />
                          <p className="text-xs font-black text-red-600">Đơn hàng đã hủy</p>
                        </div>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleDeleteOrder(order.id)}
                          className="w-full py-3 border border-red-200 text-red-500 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="size-4" /> Xóa vĩnh viễn
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[440px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <div className="size-14 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                  <AlertTriangle className="size-8" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 font-display">Xác nhận hủy đơn hàng</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                Bạn có chắc chắn muốn hủy đơn hàng <span className="text-primary font-black">#{cancellingOrderId}</span>? Hành động này không thể hoàn tác và sẽ thông báo cho khách hàng ngay lập tức.
              </p>

              <div className="w-full flex flex-col gap-3 mt-10">
                <button
                  disabled={isProcessing}
                  onClick={handleConfirmCancel}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-500/20 transform active:scale-[0.98] disabled:opacity-50"
                >
                  XÁC NHẬN HỦY ĐƠN
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-2xl transition-all disabled:opacity-50"
                >
                  Quay lại
                </button>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => setShowCancelModal(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
