
import React from 'react';
import { AlertTriangle, Clock, Search, Filter, History, Lock, Bell, ChevronRight, Star, ShieldAlert } from 'lucide-react';

const ShopMonitoring: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-red-50 border border-red-100 rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="flex items-start gap-4 relative z-10">
               <div className="size-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <AlertTriangle className="size-6" />
               </div>
               <div className="flex-1">
                  <h3 className="text-xl font-black text-red-900 leading-tight">CẢNH BÁO HỆ THỐNG: SHOP CHẠM NGƯỠNG KHÓA (50 ĐÁNH GIÁ &lt; 3 SAO)</h3>
               </div>
            </div>
            <div className="mt-8 bg-white/50 backdrop-blur rounded-[32px] border border-red-100 p-8 relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-gray-900">Nông Sản Sạch Ba Rịa</h4>
                  <span className="text-xs font-black text-red-500">48/50 vi phạm</span>
               </div>
               <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-red-500" style={{ width: '92%' }} />
               </div>
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TỰ ĐỘNG KHÓA SAU</p>
                  <p className="text-2xl font-black text-red-500 font-mono tracking-widest">00 : 45 : 12</p>
               </div>
            </div>
            <div className="absolute top-0 right-0 size-64 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
         </div>

         <div className="bg-orange-50 border border-orange-100 rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="flex items-start gap-4 relative z-10">
               <div className="size-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Bell className="size-6" />
               </div>
               <div className="flex-1">
                  <h3 className="text-xl font-black text-orange-900 leading-tight">ĐANG THEO DÕI CHẶT CHẼ</h3>
               </div>
            </div>
            <div className="mt-8 bg-white/50 backdrop-blur rounded-[32px] border border-orange-100 p-8 relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-gray-900">Trái Cây Miền Tây Export</h4>
                  <span className="text-xs font-black text-orange-500">42/50 vi phạm</span>
               </div>
               <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-orange-500" style={{ width: '80%' }} />
               </div>
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TỰ ĐỘNG KHÓA SAU</p>
                  <p className="text-2xl font-black text-orange-500 font-mono tracking-widest">04 : 12 : 30</p>
               </div>
            </div>
            <div className="absolute top-0 right-0 size-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
         </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <Filter className="size-5 text-gray-400" />
             <h4 className="font-black text-gray-800 uppercase tracking-tight">Bộ lọc:</h4>
             <div className="flex items-center gap-3">
                <select className="px-6 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none">
                  <option>Tất cả khu vực</option>
                </select>
                <select className="px-6 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none">
                  <option>Mức độ rủi ro: Tất cả</option>
                </select>
                <select className="px-6 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none">
                  <option>Tỉ lệ hoàn hàng cao ({'>'}5%)</option>
                </select>
             </div>
          </div>
          <div className="relative w-full max-w-sm">
             <input type="text" placeholder="Tìm tên shop, chủ shop..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cửa hàng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chủ shop</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tổng đơn</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tỉ lệ khiếu nại</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Điểm uy tín</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Nông Sản Sạch Ba Rịa', id: 'SHP-2991-BR', owner: 'Lê Văn Hùng', total: '1,240', rate: '12.5%', rateColor: 'text-red-500 bg-red-50', trust: '32', trustColor: 'text-red-500', icon: 'storefront' },
                { name: 'Dalat Fresh Organics', id: 'SHP-8821-LD', owner: 'Hoàng Thu Trang', total: '3,510', rate: '1.2%', rateColor: 'text-emerald-500 bg-emerald-50', trust: '98', trustColor: 'text-emerald-500', icon: 'eco' },
                { name: 'Trái Cây Miền Tây Export', id: 'SHP-1102-TG', owner: 'Nguyễn Minh Đức', total: '890', rate: '8.4%', rateColor: 'text-orange-500 bg-orange-50', trust: '45', trustColor: 'text-orange-500', icon: 'local_mall' },
              ].map((shop, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined">{shop.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{shop.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {shop.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                       <img src={`https://picsum.photos/seed/o${i}/60/60`} className="size-8 rounded-full object-cover" />
                       <span className="text-xs font-bold text-gray-700">{shop.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-black text-gray-900">{shop.total}</td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1 rounded-lg text-[10px] font-black ${shop.rateColor}`}>{shop.rate}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className={`text-base font-black ${shop.trustColor}`}>{shop.trust} <span className="text-[10px] text-gray-300">/100</span></span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
                          <Bell className="size-5" />
                       </button>
                       <button className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                          <History className="size-5" />
                       </button>
                       <button className="px-6 py-2.5 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-colors">Khóa tạm thời</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-[10px] text-gray-400 font-bold italic">
             * Các shop có điểm uy tín dưới 30 hoặc &gt; 50 đánh giá tiêu cực sẽ bị hệ thống tự động khóa.
           </p>
           <div className="flex items-center gap-3">
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-xs font-black text-gray-400">1</button>
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-xs font-black text-gray-400">2</button>
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-xs font-black text-gray-400">3</button>
              <button className="px-4 py-2 border border-gray-100 rounded-2xl text-xs font-bold text-gray-300">...</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default ShopMonitoring;
