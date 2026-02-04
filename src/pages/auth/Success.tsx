
import React from 'react';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';

interface SuccessProps {
  onTrackOrder: () => void;
  onGoHome: () => void;
}

const Success: React.FC<SuccessProps> = ({ onTrackOrder, onGoHome }) => {
  return (
    <div className="flex-1 bg-white flex items-center justify-center py-20 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="size-24 bg-green-50 rounded-full flex items-center justify-center text-primary mb-8 relative">
           <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
           <CheckCircle2 className="size-14 relative z-10" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 font-display uppercase tracking-tight mb-4">Thanh toán thành công!</h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          Cảm ơn bạn đã đồng hành cùng <span className="text-primary font-black">XẤU MÃ</span> để cứu nông sản. Đơn hàng <span className="font-bold text-gray-900">#XM-99218</span> đã được gửi đến nhà vườn.
        </p>

        <div className="w-full p-8 bg-gray-50 rounded-[40px] border border-gray-100 mb-10 flex flex-col gap-4">
           <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Mã đơn hàng:</span>
              <span className="text-gray-900 font-black">#XM-99218</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tổng thanh toán:</span>
              <span className="text-primary font-black">169.100đ</span>
           </div>
           <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Phương thức:</span>
              <span className="text-gray-900 font-black uppercase">Ví Xấu Mã</span>
           </div>
        </div>

        <div className="flex flex-col w-full gap-4">
           <button 
             onClick={onTrackOrder}
             className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95"
           >
              <Package className="size-5" /> THEO DÕI ĐƠN HÀNG
           </button>
           <button 
             onClick={onGoHome}
             className="w-full py-5 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:text-gray-900 transition-all"
           >
              <Home className="size-5" /> QUAY LẠI TRANG CHỦ
           </button>
        </div>

        <div className="mt-12 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-4 text-left">
           <div className="size-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
              <ShoppingBag className="size-5" />
           </div>
           <p className="text-[11px] text-blue-900 font-bold leading-relaxed italic">
              Bạn nhận được <span className="text-blue-600">50 Điểm Xanh</span> từ đơn hàng này. Dùng điểm để đổi voucher cho lần mua tới nhé!
           </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
