
import React from 'react';
import { Bell, Clock, ShoppingCart, Info, TrendingUp, CheckCircle2, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';

const FarmerNotifications: React.FC = () => {
  const notifications = [
    { id: 1, title: 'Đơn hàng mới #ORD-5521', content: 'Khách hàng Nguyễn Thị Thu Hà vừa đặt 2 sản phẩm từ vườn của bạn.', time: '10 phút trước', type: 'order', isRead: false },
    { id: 2, title: 'Biến động thị trường: Giá Cà Chua tăng 15%', content: 'Nhu cầu thị trường đang tăng cao, hãy cân nhắc điều chỉnh giá bán hoặc tăng lượng hàng.', time: '2 giờ trước', type: 'market', isRead: false },
    { id: 3, title: 'Xác minh KYC thành công', content: 'Tài khoản của bạn đã được Admin phê duyệt. Bạn có thể bắt đầu đăng bán sản phẩm ngay.', time: '1 ngày trước', type: 'system', isRead: true },
    { id: 4, title: 'Lưu ý vận chuyển: Rau lá héo nhanh', content: 'Hãy đảm bảo đóng gói kỹ bằng túi khí để giữ độ ẩm cho rau cải khi giao đi xa.', time: '3 ngày trước', type: 'info', isRead: true },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900 uppercase tracking-tight">Thông báo của bạn</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Cập nhật tin nhắn hệ thống, đơn hàng và biến động thị trường.</p>
        </div>
        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Đánh dấu tất cả đã đọc</button>
      </div>

      <div className="max-w-4xl space-y-4">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-8 group hover:shadow-md transition-all relative overflow-hidden ${!n.isRead ? 'border-primary/20 bg-primary/5' : ''}`}
          >
             {!n.isRead && <div className="absolute top-8 right-8 size-2.5 bg-primary rounded-full shadow-lg shadow-primary/40" />}
             
             <div className={`size-16 rounded-[24px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${
                n.type === 'order' ? 'bg-blue-50 text-blue-500' : 
                n.type === 'market' ? 'bg-orange-50 text-orange-500' : 
                n.type === 'system' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'
             }`}>
                {n.type === 'order' && <ShoppingCart className="size-8" />}
                {n.type === 'market' && <TrendingUp className="size-8" />}
                {n.type === 'system' && <CheckCircle2 className="size-8" />}
                {n.type === 'info' && <Info className="size-8" />}
             </div>

             <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <h4 className="text-xl font-black text-gray-900 leading-tight">{n.title}</h4>
                   <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">• {n.time}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                   {n.content}
                </p>
                <div className="flex items-center gap-6">
                   <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                      Xem chi tiết <ChevronRight className="size-3" />
                   </button>
                   <button className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                      <Trash2 className="size-3" /> Xóa
                   </button>
                </div>
             </div>

             <button className="absolute top-8 right-12 text-gray-200 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="size-6" />
             </button>
          </div>
        ))}

        <div className="pt-8 text-center">
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Đã hiển thị toàn bộ 4 thông báo mới nhất</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerNotifications;
