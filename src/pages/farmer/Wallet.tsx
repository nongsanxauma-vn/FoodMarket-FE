
import React from 'react';
import { Landmark, ArrowUpRight, ArrowDownRight, MoreVertical, Calendar, Bell, History, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const Wallet: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Ví Tiền & Tài Chính</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Quản lý thu nhập và theo dõi lịch sử yêu cầu rút tiền.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="size-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 relative shadow-sm">
             <Bell className="size-5" />
             <span className="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white rounded-full"></span>
           </button>
           <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
              <span className="text-xs font-bold text-gray-800">24/05/2024</span>
              <Calendar className="size-4 text-primary" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Main Wallet View */}
         <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 p-8 sm:p-10 bg-gradient-to-br from-primary to-primary-dark rounded-[40px] text-white shadow-xl shadow-primary/20 relative overflow-hidden group min-h-[280px] flex flex-col justify-center">
                  <div className="relative z-10">
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/70">Số dư khả dụng</p>
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2 mb-8">
                       <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none">12.450.000</h3>
                       <span className="text-lg sm:text-xl font-bold text-white/60">VND</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-white/60 uppercase">Tổng thu nhập tháng</p>
                          <p className="text-base sm:text-lg font-black mt-1">45.800.000đ</p>
                       </div>
                       <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-white/60 uppercase">Rút thành công</p>
                          <p className="text-base sm:text-lg font-black mt-1">32.150.000đ</p>
                       </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="absolute bottom-10 right-10 size-16 bg-white/10 rounded-2xl transform rotate-12 group-hover:rotate-45 transition-transform duration-700" />
               </div>

               <div className="flex flex-col gap-6">
                  <div className="flex-1 p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <div className="size-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary">
                           <Landmark className="size-6" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SỐ DƯ ĐÃ GIẢI NGÂN</p>
                     </div>
                     <div className="mt-4">
                        <h4 className="text-xl sm:text-2xl font-black text-primary truncate">32.150.000 <span className="text-sm font-bold opacity-60">VND</span></h4>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">Tổng số tiền đã được chuyển về tài khoản ngân hàng của bạn.</p>
                     </div>
                  </div>
                  <div className="flex-1 p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                     <div className="flex justify-between items-start">
                        <div className="size-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                           <span className="material-symbols-outlined text-3xl">lock</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SỐ DƯ ĐÓNG BĂNG 🔒</p>
                     </div>
                     <div className="mt-4">
                        <h4 className="text-xl sm:text-2xl font-black text-yellow-600 truncate">1.200.000 <span className="text-sm font-bold opacity-60">VND</span></h4>
                        <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                           <div className="h-full bg-yellow-400" style={{ width: '30%' }} />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
               <div className="px-10 py-4 border-b border-gray-50 flex items-center gap-12">
                  <button className="py-4 text-xs font-black text-primary border-b-2 border-primary flex items-center gap-2">
                     <History className="size-4" /> Lịch sử giao dịch
                  </button>
                  <button className="py-4 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2">
                     <ArrowDownRight className="size-4" /> Lịch sử rút tiền
                  </button>
               </div>

               <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="flex items-center gap-3 font-black text-gray-800 uppercase tracking-tight">
                        <span className="material-symbols-outlined text-primary">analytics</span> Biến động số dư gần đây
                     </h4>
                     <button className="px-4 py-2 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 hover:bg-gray-50 uppercase tracking-widest">
                        <ArrowDownRight className="size-3 rotate-45" /> Tải báo cáo
                     </button>
                  </div>

                  <div className="space-y-4">
                     {[
                       { id: '#ORD-99218', desc: 'Bán Xà lách thủy canh (x10kg)', type: 'BÁN HÀNG', amount: '+436.500đ', status: 'Hoàn thành', time: '24/05/2024', positive: true },
                       { id: 'Rút tiền về MB Bank', desc: 'Yêu cầu: #WDR-1029', type: 'RÚT TIỀN', amount: '-5.000.000đ', status: 'Đang xử lý', time: '24/05/2024', pending: true },
                       { id: 'Rút tiền về MB Bank', desc: 'Yêu cầu: #WDR-1011', type: 'RÚT TIỀN', amount: '-2.000.000đ', status: 'Đã nhận', time: '20/05/2024' },
                     ].map((item, i) => (
                       <div key={i} className="group p-6 hover:bg-gray-50/50 rounded-3xl border border-transparent hover:border-gray-100 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 items-center gap-4 md:gap-8 w-full">
                             <div className="flex flex-col gap-1">
                                <p className="text-sm font-black text-gray-900">{item.id}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                             </div>
                             <div className="text-left md:text-center">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${item.positive ? 'bg-green-50 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                   {item.type}
                                </span>
                             </div>
                             <div className="text-right flex-1 flex flex-col items-end">
                                <p className={`text-sm font-black ${item.positive ? 'text-primary' : 'text-gray-900'}`}>{item.amount}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{item.time}</p>
                             </div>
                          </div>
                          <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-4">
                             <MoreVertical className="size-4 text-gray-400" />
                          </button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
         
         <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
               <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tài khoản ngân hàng</h4>
               <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                  <div className="size-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                     <Landmark className="size-5" />
                  </div>
                  <div className="flex-1">
                     <p className="text-xs font-black text-gray-900 uppercase">MB Bank</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">**** 8899</p>
                  </div>
               </div>
               <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-primary/20 transition-all">
                  + Thêm tài khoản
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default Wallet;
