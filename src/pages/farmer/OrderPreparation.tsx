import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Gift,
  Package
} from 'lucide-react';
import { orderService, OrderResponse } from '../../services';

interface OrderPreparationProps {
  orderId: string;
  onBack: () => void;
  onComplete: () => void;
}

const STATUS_MAP: Record<string, string> = {
  'PENDING': 'Chờ xử lý',
  'PAID': 'Đã thanh toán',
  'CONFIRMED': 'Đã xác nhận',
  'PREPARING': 'Đang chuẩn bị',
  'SHIPPING': 'Đang giao hàng',
  'DELIVERED': 'Đã giao',
  'COMPLETED': 'Đã hoàn thành',
  'CANCELLED': 'Đã hủy',
  'FAILED': 'Thất bại',
};

const OrderPreparation: React.FC<OrderPreparationProps> = ({ orderId, onBack, onComplete }) => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getAllOrders();
        const orders = Array.isArray(response.result) ? response.result : [response.result];
        const found = orders.find((o: OrderResponse) => String(o.id) === String(orderId));
        if (found) setOrder(found);
        else setError(`Không tìm thấy đơn hàng #${orderId}`);
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleConfirmShipment = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      onComplete();
    } catch (err: any) {
      setError(err?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 bg-background">
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <button onClick={onBack} className="mb-6 text-gray-500 hover:text-primary font-bold flex items-center gap-2">← Quay lại</button>
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-3 text-red-600 font-bold">
            <AlertCircle className="size-5" /> {error || 'Không tìm thấy đơn hàng'}
          </div>
        </div>
      </div>
    );
  }

  const orderItems = order.items || [];
  const totalPrice = order.totalAmount || 0;

  return (
    <div className="flex-1 bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="size-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">←</button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Chuẩn Bị Hàng</h1>
            <p className="text-sm text-gray-500">Đơn hàng #{order.id} • Trạng thái: {STATUS_MAP[order.status] || order.status}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 mb-8">
          <h2 className="text-lg font-black text-gray-900 mb-6">📦 Thông Tin Đơn Hàng</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Items */}
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase mb-4">Sản phẩm</p>
              <div className="space-y-3 mb-4">
                {orderItems.length > 0 ? orderItems.map((item: any, i: number) => {
                  const isMysteryBox = item.itemType === 'MYSTERY_BOX';
                  const fallbackImage = isMysteryBox
                    ? `https://picsum.photos/seed/box${item.mysteryBoxId}/80/80`
                    : `https://picsum.photos/seed/product${item.productId}/80/80`;

                  return (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      {/* ✅ Ảnh item — dùng imageUrl từ backend, fallback nếu null */}
                      <div className="size-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img
                          src={item.imageUrl || fallbackImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        />
                        {/* Badge túi mù */}
                        {isMysteryBox && (
                          <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center">
                            <Gift className="size-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Label loại item */}
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 flex items-center gap-1 text-primary">
                          {isMysteryBox
                            ? <><Gift className="size-3" /> Túi mù nông sản</>
                            : 'Nông sản'
                          }
                        </p>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {item.productName || `Sản phẩm #${i + 1}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.quantity} x {(item.unitPrice || item.price || 0).toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-primary">
                          {((item.quantity || 1) * (item.unitPrice || item.price || 0)).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-400 flex items-center gap-2">
                    <Package className="size-4" /> Không có chi tiết sản phẩm
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-2 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-green-700 uppercase">Tổng cộng:</span>
                  <span className="text-lg font-black text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase mb-4">Thông tin khách hàng</p>
              <div className="space-y-3">
                {[
                  { label: 'Tên', value: order.recipientName },
                  { label: 'Địa chỉ', value: order.shippingAddress },
                  { label: 'Số điện thoại', value: order.recipientPhone },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{label}</p>
                    <p className="text-sm font-bold text-gray-900">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleConfirmShipment}
            disabled={updating}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-primary/20"
          >
            {updating ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
            {updating ? 'Đang xử lý...' : 'Xác nhận hoàn tất chuẩn bị hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPreparation;