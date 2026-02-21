import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Phone, 
  MapPin, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

interface OrderPreparationProps {
  orderId: string;
  onBack: () => void;
  onComplete: () => void;
}

const OrderPreparation: React.FC<OrderPreparationProps> = ({ orderId, onBack, onComplete }) => {
  const [hasVehicle, setHasVehicle] = useState(false);
  const [selectedShipperId, setSelectedShipperId] = useState<string | null>(null);
  const [shipmentMethod, setShipmentMethod] = useState<'self' | 'shipper' | null>(null);

  // Scroll to top when component loads
  useEffect(() => {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
  }, [orderId]);

  // Mock shipper data
  const nearbyShippers = [
    {
      id: 'shipper-1',
      name: 'Anh Minh - Shipper',
      rating: 4.8,
      reviews: 142,
      distance: '0.8 km',
      phone: '0868 123 456',
      vehicle: 'Honda Wave Blue',
      status: 'Có sẵn',
      avgDeliveryTime: '20 phút'
    },
    {
      id: 'shipper-2',
      name: 'Chị Lan - Shipper',
      rating: 4.9,
      reviews: 215,
      distance: '1.2 km',
      phone: '0912 789 012',
      vehicle: 'Xe máy SH',
      status: 'Có sẵn',
      avgDeliveryTime: '25 phút'
    },
    {
      id: 'shipper-3',
      name: 'Anh Hoa - Shipper',
      rating: 4.7,
      reviews: 98,
      distance: '1.5 km',
      phone: '0901 234 567',
      vehicle: 'Xe tải nhỏ',
      status: 'Bận',
      avgDeliveryTime: '35 phút'
    }
  ];

  // Mock order data
  const order = {
    id: orderId,
    items: [
      { name: 'Cải bẹ xanh', quantity: 2, unit: 'kg', price: 25000 },
      { name: 'Cà chua', quantity: 3, unit: 'kg', price: 35000 }
    ],
    weight: '5 kg',
    subtotal: 155000,
    shippingFee: 25000,
    total: 180000,
    buyer: {
      name: 'Nguyễn Văn A',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '0987 654 321'
    }
  };

  return (
    <div className="flex-1 bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={onBack}
            className="size-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Chuẩn Bị Hàng</h1>
            <p className="text-sm text-gray-500">Đơn hàng #{order.id}</p>
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
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.quantity} {item.unit} × {item.price.toLocaleString('vi-VN')}đ/kg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{(item.quantity * item.price).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Summary */}
              <div className="space-y-2 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600 uppercase">Tạm tính:</span>
                  <span className="text-sm font-bold text-gray-900">{order.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600 uppercase">Phí vận chuyển:</span>
                  <span className="text-sm font-bold text-gray-900">{order.shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="h-px bg-green-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-green-700 uppercase">Tổng cộng:</span>
                  <span className="text-lg font-black text-primary">{order.total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-900">⚖️ Tổng trọng lượng: <span className="text-blue-600">{order.weight}</span></p>
              </div>
            </div>

            {/* Buyer Info */}
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase mb-4">Thông tin khách hàng</p>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Tên</p>
                  <p className="text-sm font-bold text-gray-900">{order.buyer.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Địa chỉ</p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{order.buyer.address}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Số điện thoại</p>
                  <p className="text-sm font-bold text-gray-900">{order.buyer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-8 mb-8">
          <p className="text-sm font-bold text-gray-500 uppercase mb-6">🚗 Phương tiện vận chuyển</p>
          
          <div className="space-y-4">
            <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-green-50 cursor-pointer transition-all group"
              onClick={() => {
                setHasVehicle(true);
                setShipmentMethod('self');
                setSelectedShipperId(null);
              }}>
              <input 
                type="radio" 
                checked={shipmentMethod === 'self'} 
                onChange={() => {}}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">Tôi có phương tiện giao hàng</p>
                <p className="text-xs text-gray-500 mt-1">Tự vận chuyển đến khách hoặc liên hệ shipper</p>
              </div>
              <Truck className="size-5 text-gray-400 group-hover:text-primary transition-colors mt-1" />
            </label>

            <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-green-50 cursor-pointer transition-all group"
              onClick={() => {
                setHasVehicle(false);
                setShipmentMethod('shipper');
              }}>
              <input 
                type="radio" 
                checked={shipmentMethod === 'shipper'} 
                onChange={() => {}}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">Tôi không có phương tiện - Tìm shipper gần</p>
                <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ gợi ý shipper có sẵn trong bán kính gần</p>
              </div>
              <MessageCircle className="size-5 text-gray-400 group-hover:text-primary transition-colors mt-1" />
            </label>
          </div>
        </div>

        {/* Self Shipment Option */}
        {shipmentMethod === 'self' && (
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 mb-8 animate-in fade-in">
            <h3 className="text-lg font-black text-gray-900 mb-6">📋 Thông tin giao hàng tự vận chuyển</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-black text-gray-700 uppercase mb-2 block">Phương tiện</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm font-bold">
                  <option>Honda Wave - Xanh dương</option>
                  <option>Xe máy SH - Đen</option>
                  <option>Xe tải nhỏ</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-black text-gray-700 uppercase mb-2 block">Thời gian dự kiến giao hàng</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm font-bold"
                  defaultValue="14:30"
                />
              </div>

              <div>
                <label className="text-xs font-black text-gray-700 uppercase mb-2 block">Ghi chú cho khách hàng</label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm font-bold"
                  placeholder="VD: Giao tại cửa trước, chuông doorbell..."
                  rows={3}
                />
              </div>
            </div>

            <button 
              onClick={onComplete}
              className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl font-black transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="size-5" />
              Xác nhận giao hàng tự vận chuyển
            </button>
          </div>
        )}

        {/* Nearby Shippers */}
        {shipmentMethod === 'shipper' && (
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 mb-8 animate-in fade-in">
            <h3 className="text-lg font-black text-gray-900 mb-2">🚚 Shipper Có Sẵn Gần Bạn</h3>
            <p className="text-sm text-gray-500 mb-6">Chọn shipper để liên hệ và xác nhận giao hàng</p>
            
            <div className="space-y-4">
              {nearbyShippers.map((shipper) => (
                <div 
                  key={shipper.id}
                  onClick={() => setSelectedShipperId(shipper.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedShipperId === shipper.id 
                      ? 'border-primary bg-green-50' 
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-black text-gray-900">{shipper.name}</h4>
                        <span className={`px-2 py-1 text-[9px] font-black rounded-lg ${
                          shipper.status === 'Có sẵn' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {shipper.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                          <span>{shipper.rating} ({shipper.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          <span>{shipper.distance}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-600">
                          <span className="text-gray-400">Phương tiện:</span> {shipper.vehicle}
                        </p>
                        <p className="text-[10px] font-bold text-gray-600">
                          <span className="text-gray-400">Thời gian giao trung bình:</span> {shipper.avgDeliveryTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedShipperId === shipper.id && (
                    <div className="pt-4 border-t border-primary/20 space-y-3 mt-4">
                      <a 
                        href={`tel:${shipper.phone}`}
                        className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-3 rounded-xl font-black text-sm hover:bg-primary/90 transition-colors"
                      >
                        <Phone className="size-4" />
                        Gọi ngay: {shipper.phone}
                      </a>
                      <button 
                        onClick={onComplete}
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-black text-sm hover:bg-gray-200 transition-colors"
                      >
                        <CheckCircle2 className="size-4" />
                        Xác nhận liên hệ shipper này
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPreparation;
