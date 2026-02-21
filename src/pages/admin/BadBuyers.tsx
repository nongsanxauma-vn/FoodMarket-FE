
import React from 'react';
/* Fix: Import missing ChevronRight and XCircle icons from lucide-react */
import { UserX, Search, Bell, ShieldAlert, Zap, AlertCircle, Lock, Unlock, History, MoreHorizontal, Filter, Download, ChevronRight, XCircle } from 'lucide-react';

const BadBuyers: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'TỔNG TÀI KHOẢN BỊ KHÓA', value: '1,284', sub: 'Lý do: Bom hàng > 3 lần', icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'CẢNH BÁO ĐANG GỬI', value: '452', sub: 'Đã vi phạm 1-2 lần', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'YÊU CẦU MỞ KHÓA', value: '12', sub: 'Đang chờ xem xét lý do', icon: Unlock, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6 group">
            <div className={`size-16 ${stat.bg} ${stat.color} rounded-[28px] flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="size-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-display">{stat.value}</h3>
              <p className={`text-[10px] font-bold mt-1 ${stat.color} opacity-80`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
            <h4 className="font-black text-gray-800 uppercase tracking-tight">DANH SÁCH ĐEN (BLACKLIST)</h4>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Filter className="size-3" /> Lọc</button>
              <button className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Download className="size-3" /> Xuất báo cáo</button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số đơn bom</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tỉ lệ nhận</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'van_hau_99', phone: '0392****88', bombs: '08 đơn', rate: '35%', rateColor: 'bg-red-500', isWarned: true },
                { name: 'lan_anh_sg', phone: '0901****22', bombs: '05 đơn', rate: '52%', rateColor: 'bg-orange-400', isWarned: true, isBlocked: false },
                { name: 'hung_bom_66 (Đã khóa)', phone: '0773****11', bombs: '12 đơn', rate: '12%', rateColor: 'bg-red-600', isBlocked: true },
              ].map((user, i) => (
                <tr key={i} className={`hover:bg-gray-50/30 transition-colors ${user.isBlocked ? 'bg-red-50/20' : ''}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        {user.isBlocked ? <Lock className="size-5 text-red-500" /> : <span className="material-symbols-outlined">person</span>}
                      </div>
                      <div>
                        <p className={`text-sm font-black ${user.isBlocked ? 'text-red-700' : 'text-gray-900'}`}>{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SĐT: {user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-lg uppercase tracking-widest">{user.bombs}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-xs font-black text-gray-900">{user.rate}</span>
                       <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${user.rateColor}`} style={{ width: user.rate }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                       {user.isWarned && !user.isBlocked && <AlertCircle className="size-5 text-orange-500" />}
                       {user.isBlocked ? (
                         <button className="px-6 py-2 border border-blue-100 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-blue-50 transition-colors">Mở khóa</button>
                       ) : (
                         <div className="flex items-center gap-3">
                            <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">CHẶN</button>
                            {user.name === 'lan_anh_sg' && <Lock className="size-4 text-blue-500" />}
                         </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-between">
             <p className="text-xs text-gray-400 font-medium">Hiển thị 3 trên 1,284 kết quả</p>
             <div className="flex items-center gap-2">
                <button className="size-8 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ChevronRight className="size-5 rotate-180" /></button>
                <button className="size-8 bg-[#38703d] text-white rounded-lg text-xs font-black">1</button>
                <button className="size-8 border border-gray-100 rounded-lg text-xs font-black text-gray-400">2</button>
                <button className="size-8 border border-gray-100 rounded-lg text-xs font-black text-gray-400">3</button>
                <button className="size-8 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ChevronRight className="size-5" /></button>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                 <Zap className="size-6 text-orange-500" />
                 <h4 className="font-black text-gray-800 uppercase tracking-tight">Quy tắc tự động khóa</h4>
              </div>
              <div className="space-y-8">
                {[
                  { id: 1, text: 'Tự động gắn cờ Cảnh báo khi người mua có 2 đơn "bom" (hủy hàng khi giao) trong 30 ngày.' },
                  { id: 2, text: 'Tự động Khóa tài khoản 7 ngày nếu phát sinh đơn bom thứ 3.' },
                  { id: 3, text: 'Khóa vĩnh viễn đối với tài khoản có tỉ lệ nhận hàng < 30% sau 10 đơn hàng đầu tiên.' },
                ].map((rule) => (
                  <div key={rule.id} className="flex gap-4">
                    <span className="size-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{rule.id}</span>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">{rule.text}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">Điều chỉnh cấu hình quy tắc</button>
           </div>

           <div className="bg-gray-900 rounded-[40px] p-10 flex flex-col gap-8 text-white">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-orange-400">campaign</span>
                 <h4 className="font-black uppercase tracking-tight">Thao tác quản trị viên</h4>
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Gửi cảnh báo hàng loạt', sub: 'Áp dụng cho đối tượng 2 đơn bom', icon: ShieldAlert, color: 'text-orange-400' },
                   { label: 'Quét tài khoản ảo', sub: 'Hệ thống AI nhận diện theo IP/SĐT', icon: XCircle, color: 'text-red-400' },
                   { label: 'Lịch sử mở khóa', sub: 'Xem lại các trường hợp được ân xá', icon: History, color: 'text-blue-400' },
                 ].map((action, i) => (
                   <button key={i} className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-5 hover:bg-white/10 transition-all text-left">
                      <div className={`size-10 ${action.color} bg-white/10 rounded-2xl flex items-center justify-center`}>
                         <action.icon className="size-5" />
                      </div>
                      <div>
                         <p className="text-xs font-black tracking-tight">{action.label}</p>
                         <p className="text-[10px] opacity-40 font-bold mt-1 uppercase tracking-widest">{action.sub}</p>
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="rounded-[40px] overflow-hidden relative shadow-lg h-[280px]">
              <img src="https://picsum.photos/seed/admin_footer/600/400" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-10">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Cảnh báo tranh chấp mới nhất</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default BadBuyers;
