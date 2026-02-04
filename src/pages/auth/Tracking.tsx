
import React from 'react';
import { ChevronRight, MapPin, Truck, Box, CheckCircle2, Clock, Map, Phone, MessageSquare, ArrowLeft } from 'lucide-react';

interface TrackingProps {
  onBack: () => void;
}

const Tracking: React.FC<TrackingProps> = ({ onBack }) => {
  const steps = [
    { label: 'Đã đặt hàng', time: '14:20, 24/10', done: true, icon: Box },
    { label: 'Nhà vườn đang chuẩn bị', time: '14:45, 24/10', done: true, icon: Clock },
    { label: 'Shipper đang lấy hàng', time: '15:10, 24/10', active: true, icon: Truck },
    { label: 'Đang trên đường giao', time: 'Dự kiến: 16:00', icon: MapPin },
    { label: 'Giao hàng thành công', time: '--:--', icon: CheckCircle2 },
  ];

  return (
    <div className="flex-1 bg-background animate-in fade-in duration-500 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={onBack} className="size-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 font-display">Chi tiết hành trình</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Đơn hàng: #XM-99218 • Dự kiến nhận: 16:00 hôm nay</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-10">
               <div className="space-y-8 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100" />
                  
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-6">
                       <div className={`size-12 rounded-2xl flex items-center justify-center z-10 shadow-sm transition-all ${
                          step.done ? 'bg-primary text-white' : step.active ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-50 text-gray-300 border border-gray-100'
                       }`}>
                          <step.icon className="size-6" />
                       </div>
                       <div className="flex-1 pt-1">
                          <p className={`text-sm font-black uppercase tracking-tight ${step.done ? 'text-gray-900' : step.active ? 'text-blue-600' : 'text-gray-300'}`}>{step.label}</p>
                          <p className="text-[11px] font-bold text-gray-400 mt-1">{step.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Thông tin Shipper</h4>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <img src="https://picsum.photos/seed/shipper_val/100/100" className="size-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                     <div>
                        <p className="text-sm font-black text-gray-900">Trần Thế Hoàng</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">⭐ 4.9 • Biển số: 59-X1 123.45</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="size-11 bg-green-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                        <Phone className="size-5" />
                     </button>
                     <button className="size-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                        <MessageSquare className="size-5" />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-8 flex flex-col gap-8">
             <div className="relative aspect-[16/9] w-full rounded-[40px] overflow-hidden shadow-lg border border-gray-100 group bg-gray-100">
                <img src="https://picsum.photos/seed/tracking_map/1200/800" className="w-full h-full object-cover grayscale opacity-60" />
                <div className="absolute inset-0 bg-black/5" />
                
                {/* Mock Trackers */}
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center animate-bounce">
                   <div className="bg-white px-3 py-1.5 rounded-xl shadow-xl text-[10px] font-black uppercase mb-1">Vườn Chú Tư</div>
                   <div className="size-4 bg-primary border-4 border-white rounded-full shadow-lg" />
                </div>

                <div className="absolute top-1/2 left-1/2 flex flex-col items-center transition-all duration-1000">
                   <div className="size-10 bg-blue-500 border-4 border-white rounded-2xl shadow-xl flex items-center justify-center text-white rotate-45">
                      <Truck className="size-5 -rotate-45" />
                   </div>
                   <div className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-lg">Shipper đang di chuyển</div>
                </div>

                <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                   <div className="bg-white px-3 py-1.5 rounded-xl shadow-xl text-[10px] font-black uppercase mb-1">Địa chỉ của bạn</div>
                   <div className="size-5 bg-orange-500 border-4 border-white rounded-full shadow-lg" />
                </div>

                <button className="absolute bottom-8 right-8 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black shadow-2xl hover:bg-white transition-all uppercase tracking-widest border border-white/20">
                   <Map className="size-4 text-primary" /> Mở bản đồ trực tiếp
                </button>
             </div>

             <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
                <div className="flex items-center justify-between mb-8">
                   <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tóm tắt đơn hàng</h4>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 món • Tổng: 169.100đ</span>
                </div>
                <div className="grid grid-cols-3 gap-8">
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                      <img src="https://picsum.photos/seed/t1/60/60" className="size-12 rounded-xl object-cover" />
                      <div>
                         <p className="text-xs font-black text-gray-800">Cải Bệ Xanh</p>
                         <p className="text-[10px] text-gray-400 font-bold">1kg x 25k</p>
                      </div>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                      <img src="https://picsum.photos/seed/t2/60/60" className="size-12 rounded-xl object-cover" />
                      <div>
                         <p className="text-xs font-black text-gray-800">Cà Chua Bi</p>
                         <p className="text-[10px] text-gray-400 font-bold">500g x 45k</p>
                      </div>
                   </div>
                   <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                      <img src="https://picsum.photos/seed/t3/60/60" className="size-12 rounded-xl object-cover" />
                      <div>
                         <p className="text-xs font-black text-gray-800">Khoai Lang Mật</p>
                         <p className="text-[10px] text-gray-400 font-bold">2kg x 32k</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
