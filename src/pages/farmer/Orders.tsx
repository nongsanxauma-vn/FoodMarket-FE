
import React, { useState } from 'react';
import { Search, Bell, MapPin, Truck, CheckCircle2, XCircle, ChevronRight, Navigation, FileText, User, AlertTriangle, X } from 'lucide-react';
import { OrderStatus } from '../../types';

interface OrdersProps {
  onPrepareOrder?: (orderId: string) => void;
}

const Orders: React.FC<OrdersProps> = ({ onPrepareOrder }) => {
  const [activeTab, setActiveTab] = useState('Đang giao (12)');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  
  const tabs = ['Tất cả (48)', 'Chờ xác nhận (5)', 'Đang giao (12)', 'Đã giao (28)', 'Đã hủy (3)'];

  const handleOpenCancelModal = (orderId: string) => {
    setCancellingOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Logic to cancel the order would go here
    console.log(`Order ${cancellingOrderId} cancelled.`);
    setShowCancelModal(false);
    setCancellingOrderId(null);
  };

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
          <button className="size-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 relative shadow-sm">
            <span className="material-symbols-outlined fill-1">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-2 border-b border-gray-50 flex items-center gap-12 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-5 text-xs font-black whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-6">
          {/* Order Item: Shipping State */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
            <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-primary">#ORD-5518</span>
                <span className="text-[11px] text-gray-400 font-bold">Bàn giao lúc: 10:15, 24/10/2023</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] font-black uppercase rounded-md">Đang giao</span>
                <span className="px-2 py-0.5 bg-orange-50 text-orange-500 text-[10px] font-black uppercase rounded-md">Tiền đang tạm giữ (Escrow)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <MapPin className="size-3" /> 5.8 km
                </div>
                <span className="text-base font-black text-gray-900">150.000đ</span>
              </div>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/user1/60/60" className="size-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Lê Văn Hùng</h4>
                    <p className="text-[11px] text-gray-400 font-bold">0934 *** 889 • Quận 1, TP.HCM</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chi tiết đơn hàng</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                    <img src="https://picsum.photos/seed/box1/40/40" className="size-10 rounded-xl object-cover" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Blind Box Rau Củ</p>
                      <p className="text-[10px] text-gray-400 font-bold">2 túi x 75.000đ</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 flex flex-col gap-4 border-l border-gray-100 md:pl-8">
                <div className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-widest">
                  <Truck className="size-4" /> Thông tin shipper
                </div>
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-sm font-black text-gray-900">Nguyễn Văn An</p>
                  <p className="text-[11px] text-gray-400 font-bold mt-1">📞 0901 234 567</p>
                  <p className="text-[10px] text-blue-400 font-bold italic mt-2">Sắp đến điểm giao hàng (còn 1.2km)</p>
                </div>
                <button className="w-full py-4 bg-primary/10 text-primary font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all shadow-md shadow-primary/5 group">
                  <Navigation className="size-4 group-hover:animate-bounce" /> Theo dõi hành trình
                </button>
              </div>
            </div>
          </div>

          {/* Order Item: Pending State */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
            <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-primary">#ORD-5521</span>
                <span className="text-[11px] text-gray-400 font-bold">Ngày đặt: 14:20, 24/10/2023</span>
                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase rounded-md">Chờ xác nhận</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <MapPin className="size-3" /> 3.2 km
                </div>
                <span className="text-base font-black text-gray-900">285.000đ</span>
              </div>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/user2/60/60" className="size-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Nguyễn Thị Thu Hà</h4>
                    <p className="text-[11px] text-gray-400 font-bold">0908 *** 123 • Quận 7, TP.HCM</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chi tiết sản phẩm</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <img src="https://picsum.photos/seed/prod1/40/40" className="size-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">Xà lách thủy canh</p>
                        <p className="text-[10px] text-gray-400 font-bold">2kg x 45.000đ</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <img src="https://picsum.photos/seed/prod2/40/40" className="size-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">Cà rốt hữu cơ</p>
                        <p className="text-[10px] text-gray-400 font-bold">3kg x 65.000đ</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center px-4 py-2 bg-primary/5 text-primary text-[10px] font-black rounded-2xl border border-primary/10">
                      +1 món khác
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 flex flex-col gap-3 justify-center">
                <button 
                  onClick={() => onPrepareOrder?.('ORD-5521')}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
                  <CheckCircle2 className="size-5" /> Chuẩn bị hàng
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 border border-gray-100 text-gray-600 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <Truck className="size-4" /> Liên hệ Shipper
                  </button>
                  <button 
                    onClick={() => handleOpenCancelModal('ORD-5521')}
                    className="py-3 border border-red-50 text-red-500 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                  >
                    <XCircle className="size-4" /> Hủy đơn
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Item: Delivered State */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all opacity-80">
            <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-gray-400">#ORD-5502</span>
                <span className="text-[11px] text-gray-400 font-bold">Ngày đặt: 08:30, 24/10/2023</span>
                <span className="px-2 py-0.5 bg-green-50 text-primary text-[10px] font-black uppercase rounded-md">Đã giao</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <MapPin className="size-3" /> 1.2 km
                </div>
                <span className="text-base font-black text-gray-900">520.000đ</span>
              </div>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/user3/60/60" className="size-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Trần Minh Quân</h4>
                    <p className="text-[11px] text-gray-400 font-bold">0911 *** 445 • Quận 7, TP.HCM</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chi tiết sản phẩm</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <img src="https://picsum.photos/seed/prod3/40/40" className="size-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">Khoai tây Đà Lạt</p>
                        <p className="text-[10px] text-gray-400 font-bold">10kg x 32.000đ</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-black rounded-2xl border border-gray-100">
                      +3 món khác
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 flex flex-col gap-4 justify-center items-center">
                 <div className="p-6 bg-green-50/50 rounded-[32px] border border-primary/10 text-center w-full">
                    <CheckCircle2 className="size-8 text-primary mx-auto mb-3" />
                    <p className="text-sm font-black text-primary">Giao hàng thành công</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Đã cộng tiền vào ví: +495.000đ</p>
                 </div>
                 <button className="text-xs font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                    <FileText className="size-3" /> Xem hóa đơn chi tiết
                 </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hiển thị 1-10 trong số 12 đơn đang giao</p>
          <div className="flex items-center gap-2">
            <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50">
               <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-10 bg-primary text-white rounded-2xl flex items-center justify-center text-sm font-black">1</button>
            <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-sm font-black text-gray-400 hover:bg-gray-50">2</button>
            <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50">
               <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[440px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
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
                  onClick={handleConfirmCancel}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-500/20 transform active:scale-[0.98]"
                >
                  XÁC NHẬN HỦY ĐƠN
                </button>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-2xl transition-all"
                >
                  Quay lại
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCancelModal(false)}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add fix: Export default
export default Orders;
