
import React from 'react';
/* Fix: Import missing Info icon from lucide-react */
import { MapPin, Truck, Wallet, ShieldCheck, CreditCard, ChevronRight, Lock, Map, Zap, Info } from 'lucide-react';

interface CheckoutProps {
  onComplete: () => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onComplete, onBack }) => {
  return (
    <div className="flex-1 bg-background animate-in fade-in duration-500 pb-20">
      {/* Mini Nav Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-10 lg:px-40 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <button onClick={onBack} className="hover:text-primary">GIỎ HÀNG</button>
               <ChevronRight className="size-3" />
               <span className="text-primary">THANH TOÁN & VẬN CHUYỂN</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-primary text-[10px] font-black rounded-full">
               <ShieldCheck className="size-3" />
               THANH TOÁN AN TOÀN (ESCROW)
            </div>
            <div className="flex items-center gap-3">
               <div className="size-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <img src="https://picsum.photos/seed/buyer/80/80" className="w-full h-full object-cover" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase leading-none">NGƯỜI MUA</p>
                  <p className="text-xs font-bold text-gray-900">Nguyễn Văn A</p>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main Config */}
         <div className="lg:col-span-8 flex flex-col gap-10">
            <h2 className="text-4xl font-black text-gray-900 font-display">Thanh Toán & Vận Chuyển</h2>

            {/* Address */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                       <MapPin className="size-5" />
                    </div>
                    <h4 className="font-black text-gray-800 uppercase tracking-tight">Địa chỉ nhận hàng</h4>
                  </div>
                  <button className="text-[11px] font-black text-primary uppercase hover:underline">Thay đổi</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-6">
                     <div className="p-6 bg-green-50/30 rounded-[32px] border-2 border-dashed border-primary/20 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">VỊ TRÍ HIỆN TẠI CỦA BẠN</span>
                        </div>
                        <p className="text-sm font-black text-gray-900 leading-relaxed">
                           285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh
                        </p>
                        <p className="text-[11px] text-gray-400 font-bold italic">Ghi chú: Nhà riêng (Giao giờ hành chính)</p>
                     </div>
                     <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại người nhận</label>
                        <input type="text" defaultValue="090 * * * 123" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black outline-none" />
                     </div>
                  </div>
                  <div className="relative aspect-video rounded-[32px] overflow-hidden group shadow-lg border border-gray-100">
                     <img src="https://picsum.photos/seed/mapview/600/400" className="w-full h-full object-cover grayscale opacity-40" />
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4 bg-white/40 backdrop-blur-sm">
                        <MapPin className="size-12 text-primary" />
                        <div>
                           <p className="text-xs font-black text-gray-900 uppercase">Khám phá vị trí</p>
                           <p className="text-[10px] text-gray-500 font-medium">Đang định vị chính xác...</p>
                        </div>
                        <button className="px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-full uppercase shadow-lg shadow-primary/20">Mở bản đồ</button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Shipping Calc */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-10">
               <div className="flex items-center gap-3">
                  <div className="size-10 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                    <Truck className="size-5" />
                  </div>
                  <h4 className="font-black text-gray-800 uppercase tracking-tight">Tính phí vận chuyển</h4>
               </div>

               <div className="relative pl-8 space-y-12">
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-100" />
                  
                  <div className="relative flex items-center justify-between">
                     <div className="size-4 bg-primary rounded-full border-4 border-white shadow-sm absolute -left-[26px]" />
                     <div>
                        <h5 className="text-xs font-black text-gray-900 uppercase">Vườn Hữu Cơ Đà Lạt</h5>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">Cải bẹ xanh, Cà chua bi</p>
                     </div>
                     <span className="text-[11px] font-black text-gray-400">12.5 km</span>
                  </div>

                  <div className="relative flex items-center justify-between">
                     <div className="size-4 bg-primary rounded-full border-4 border-white shadow-sm absolute -left-[26px]" />
                     <div>
                        <h5 className="text-xs font-black text-gray-900 uppercase">Nhà Vườn Hóc Môn</h5>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">Khoai lang mật</p>
                     </div>
                     <span className="text-[11px] font-black text-gray-400">4.2 km</span>
                  </div>

                  <div className="relative flex items-center justify-between">
                     <div className="size-4 bg-orange-500 rounded-full border-4 border-white shadow-sm absolute -left-[26px]" />
                     <div>
                        <h5 className="text-xs font-black text-gray-900 uppercase">Điểm nhận hàng (Bạn)</h5>
                     </div>
                     <span className="px-3 py-1 bg-green-50 text-primary text-[9px] font-black rounded-full uppercase">Tối ưu lộ trình</span>
                  </div>
               </div>

               <div className="mt-6 p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-12 flex-1">
                     <div className="flex flex-col">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TỔNG QUÃNG ĐƯỜNG</p>
                        <h4 className="text-3xl font-black text-gray-900">16.7 km</h4>
                     </div>
                     <div className="size-10 flex items-center justify-center text-gray-200">
                        <span className="material-symbols-outlined text-3xl">close</span>
                     </div>
                     <div className="flex flex-col">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ĐƠN GIÁ/KM</p>
                        <h4 className="text-3xl font-black text-gray-900">3.000đ</h4>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest">PHÍ VẬN CHUYỂN</p>
                     <h4 className="text-4xl font-black text-primary tracking-tight">50.100đ</h4>
                  </div>
               </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-10">
               <div className="flex items-center gap-3">
                  <div className="size-10 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                    <CreditCard className="size-5" />
                  </div>
                  <h4 className="font-black text-gray-800 uppercase tracking-tight">Phương thức thanh toán</h4>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white border-2 border-primary rounded-[32px] flex items-center gap-6 relative shadow-sm cursor-pointer">
                     <div className="absolute top-4 right-4">
                        <div className="size-6 bg-primary rounded-full flex items-center justify-center">
                           <div className="size-2.5 bg-white rounded-full" />
                        </div>
                     </div>
                     <div className="size-14 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                        <Wallet className="size-7" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h5 className="text-sm font-black text-gray-900 uppercase">Ví Sàn XẤU MÃ</h5>
                           <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded-md uppercase">KHUYÊN DÙNG</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold">Thanh toán nhanh, hoàn tiền tức thì nếu có sự cố.</p>
                        <p className="text-xs font-black text-primary mt-2 uppercase">Số dư: 1.250.000đ</p>
                     </div>
                  </div>

                  <div className="p-8 bg-white border-2 border-gray-50 rounded-[32px] flex items-center gap-6 group hover:border-primary/20 transition-all cursor-pointer">
                     <div className="size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-3xl">account_balance</span>
                     </div>
                     <div>
                        <h5 className="text-sm font-black text-gray-900 uppercase mb-1">Chuyển khoản Ngân hàng</h5>
                        <p className="text-[10px] text-gray-500 font-bold">Quét mã VietQR để thanh toán từ mọi ứng dụng ngân hàng.</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-start gap-4">
                  <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                     <ShieldCheck className="size-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">CAM KẾT BẢO VỆ</p>
                     <p className="text-xs font-bold text-blue-900 leading-relaxed italic">
                        Thanh toán của bạn sẽ được sàn tạm giữ an toàn cho đến khi nhận hàng thành công và xác nhận hài lòng (Escrow Protection).
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Summary Side Panel */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8 sticky top-32">
               <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Xác nhận đơn hàng</h4>
               
               <div className="space-y-4">
                  {[
                    { name: 'Cải Bệ Xanh (1kg)', price: '25.000đ' },
                    { name: 'Cà Chua Bi (500g)', price: '45.000đ' },
                    { name: 'Khoai Lạng Mật (2kg)', price: '64.000đ' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-500">
                       <span>{item.name}</span>
                       <span className="text-gray-900 font-black">{item.price}</span>
                    </div>
                  ))}
               </div>

               <div className="space-y-4 pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                     <span>Tiền hàng (3 món)</span>
                     <span className="text-gray-900 font-black">134.000đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                     <div className="flex items-center gap-1">
                        Phí vận chuyển <Info className="size-3 text-gray-300" />
                     </div>
                     <span className="text-gray-900 font-black">50.100đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-red-500">
                     <span>Giảm giá voucher</span>
                     <span className="font-black">-15.000đ</span>
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TỔNG CỘNG</p>
                     <h3 className="text-4xl font-black text-primary tracking-tight">169.100đ</h3>
                     <p className="text-[9px] text-gray-400 font-bold italic mt-1">(Đã bao gồm VAT)</p>
                  </div>
               </div>

               <button 
                onClick={onComplete}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98]"
               >
                  <Lock className="size-5" /> XÁC NHẬN THANH TOÁN
               </button>

               <div className="flex flex-col items-center gap-6 mt-4">
                  <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed">
                     Bằng cách nhấn xác nhận, bạn đồng ý với <a href="#" className="text-primary font-bold">Điều khoản dịch vụ</a> của XẤU MÃ.
                  </p>
                  <div className="flex gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                     <CreditCard className="size-6" />
                     <Wallet className="size-6" />
                     <Zap className="size-6" />
                     <div className="px-2 py-0.5 bg-gray-800 text-white text-[8px] font-black rounded">VietQR</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Checkout;
