
import React from 'react';
import { Gavel, Search, Clock, CheckCircle2, XCircle, ChevronRight, User, ShoppingBag, MessageSquare, ShieldCheck, Download, ZoomIn, AlertTriangle } from 'lucide-react';

const Disputes: React.FC = () => {
  return (
    <div className="flex h-full animate-in fade-in duration-500 overflow-hidden">
      {/* List Sidebar */}
      <div className="w-96 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách khiếu nại</h4>
            <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest">Mới nhất</span>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {[
              { id: '#AG-8821', title: 'Cải Bó Xôi Organic (2kg)', price: '450.000đ', label: 'RAU LÁ (ƯU TIÊN 6H)', color: 'border-l-4 border-emerald-500', time: '02:45 còn lại', isHot: true },
              { id: '#AG-9921', title: 'Sầu Riêng Ri6 - Loại 1 (5kg)', price: '1.250.000đ', label: 'TRÁI CÂY', status: 'Đang xử lý' },
              { id: '#AG-7730', title: 'Khoai Lang Mật Đà Lạt', price: '320.000đ', label: 'CỦ QUẢ', status: 'Chờ phản hồi' },
            ].map((item, i) => (
              <div key={i} className={`p-6 bg-white rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:border-primary/20 transition-all ${item.color || ''}`}>
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.label}</span>
                    <span className="text-[10px] font-bold text-gray-400">{item.id}</span>
                 </div>
                 <h4 className="font-black text-gray-900 text-sm mb-1">{item.title}</h4>
                 <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-black text-gray-600">{item.price}</span>
                    {item.isHot ? (
                       <div className="flex items-center gap-1 text-red-500 text-[10px] font-black">
                          <Clock className="size-3" /> {item.time}
                       </div>
                    ) : (
                       <span className="text-[10px] font-bold text-gray-400">{item.status}</span>
                    )}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Main Evidence View */}
      <div className="flex-1 flex flex-col bg-gray-50/30 overflow-hidden">
         <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
               <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
                     <div className="px-8 py-4 bg-gray-900 text-white flex items-center justify-between">
                        <h5 className="text-[10px] font-black uppercase tracking-widest opacity-70">BẰNG CHỨNG NHẬN HÀNG (BUYER)</h5>
                        <div className="flex gap-2">
                           <button className="size-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"><ZoomIn className="size-4" /></button>
                           <button className="size-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"><Download className="size-4" /></button>
                        </div>
                     </div>
                     <div className="flex-1 relative bg-black flex items-center justify-center">
                        <img src="https://picsum.photos/seed/dispute_detail/800/1200" className="max-h-full object-contain" />
                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                           <div className="size-8 bg-red-500 rounded-full flex items-center justify-center text-white"><AlertTriangle className="size-4" /></div>
                           <p className="text-[11px] text-white/90 font-medium italic">Phát hiện dập nát, chảy nước, mùi chua.</p>
                        </div>
                     </div>
                     <div className="p-4 flex gap-4 overflow-x-auto bg-gray-900">
                        <img src="https://picsum.photos/seed/ev1/120/120" className="size-16 rounded-xl object-cover border-2 border-primary" />
                        <img src="https://picsum.photos/seed/ev2/120/120" className="size-16 rounded-xl object-cover opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'CHỜ XỬ LÝ', value: '14 Đơn', icon: Clock, color: 'text-orange-600 bg-orange-50' },
                      { label: 'ĐÃ GIẢI QUYẾT', value: '1,240', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
                      { label: 'T.GIAN TB (TRÁI CÂY)', value: '18.5h', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className={`size-10 rounded-xl flex items-center justify-center ${s.color}`}>
                           <s.icon className="size-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                           <h4 className="text-xl font-black text-gray-900">{s.value}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="size-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                           <AlertTriangle className="size-6" />
                        </div>
                        <h4 className="font-black text-gray-800 uppercase tracking-tight">Chi tiết khiếu nại</h4>
                     </div>

                     <div className="flex-1 space-y-10 relative">
                        <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-100" />
                        <div className="relative flex gap-6">
                           <div className="size-6 bg-orange-500 rounded-full border-4 border-white shadow-sm shrink-0" />
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-black text-gray-900 uppercase">Người mua (Buyer)</span>
                                 <span className="text-[10px] text-gray-400 font-bold tracking-widest">14:20 - 20/05</span>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                 <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                                   "Trái bị nứt vỏ và có dấu hiệu dập nát, mùi chua nồng ngay khi mở thùng. Yêu cầu hoàn tiền do chất lượng không đạt 'Loại 1'."
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="relative flex gap-6">
                           <div className="size-6 bg-blue-500 rounded-full border-4 border-white shadow-sm shrink-0" />
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs font-black text-gray-900 uppercase">Người bán (Seller)</span>
                                 <span className="text-[10px] text-gray-400 font-bold tracking-widest">16:45 - 20/05</span>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                 <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                                   "Shop cam kết hàng gửi đi là hàng mới. Có thể do đơn vị vận chuyển làm rơi hoặc nhiệt độ cao trong thùng xe gây hỏng. Mong Admin xem xét giảm % hoàn tiền."
                                 </p>
                              </div>
                           </div>
                        </div>
                        
                        <div className="mt-auto pt-10 border-t border-gray-50 flex flex-col gap-8">
                           <div className="text-center">
                              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">QUYẾT ĐỊNH CỦA ADMIN</p>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <button className="w-full py-5 bg-[#38703d] text-white font-black rounded-2xl shadow-xl shadow-[#38703d]/20">HOÀN TIỀN 100%</button>
                              <div className="grid grid-cols-2 gap-4">
                                 <button className="py-4 bg-green-50 text-primary font-black rounded-2xl border border-primary/20">HOÀN 50%</button>
                                 <button className="py-4 bg-red-50 text-red-500 font-black rounded-2xl border border-red-100">TỪ CHỐI</button>
                              </div>
                           </div>
                           <p className="text-[10px] text-gray-400 font-medium italic text-center">Hành động này sẽ gửi thông báo đến cả hai bên và đóng tranh chấp.</p>
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

// Add fix: Export default
export default Disputes;
