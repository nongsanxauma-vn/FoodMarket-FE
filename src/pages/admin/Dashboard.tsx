
import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Gavel, 
  TrendingDown, 
  UserCheck, 
  Search, 
  Bell, 
  Clock, 
  Lock,
  ChevronRight,
  UserX,
  CheckCircle2,
  XCircle,
  LogOut
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      {/* Top Admin Action Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6 flex-1 max-w-xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
              <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, tài khoản, khiếu nại..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all relative">
              <Bell className="size-6" />
              <span className="absolute top-3 right-3 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>
           </button>
           <div className="h-8 w-px bg-gray-100 mx-2" />
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black text-gray-900">Admin Hệ Thống</p>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Root Access</p>
              </div>
              <img src="https://picsum.photos/seed/admin_avatar/100/100" className="size-11 rounded-2xl object-cover border-2 border-white shadow-sm" alt="avatar" />
           </div>
        </div>
      </div>

      {/* Top Bar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'CHỜ DUYỆT KYC', value: '42', trend: '+12% tăng so với tháng trước', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'CẢNH BÁO SHOP', value: '18', trend: '+4 mới cần xử lý ngay', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'TRANH CHẤP MỞ', value: '07', trend: '-30% giảm đáng kể', icon: Gavel, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'TỈ LỆ HOÀN HÀNG', value: '2.4%', trend: 'Ổn định trong ngưỡng an toàn', icon: TrendingDown, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative group">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 font-display">{stat.value}</h3>
            <p className={`text-[10px] font-bold mt-2 ${stat.color}`}>{stat.trend}</p>
            <div className={`absolute top-6 right-6 size-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="size-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KYC Queue & Dispute Spotlight */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Hàng đợi xác minh KYC (Nông dân)</h4>
              <button className="text-xs font-black text-primary hover:underline uppercase">Xem tất cả</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nông dân</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khu vực</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chứng từ</th>
                  <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'Nguyễn Văn An', id: '068092xxxx', area: 'Lâm Đồng', docs: ['id', 'file'] },
                  { name: 'Trần Thị Bé', id: '072095xxxx', area: 'Tiền Giang', docs: ['file'] },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-4">
                        <img src={`https://picsum.photos/seed/k${i}/80/80`} className="size-10 rounded-full object-cover" />
                        <span className="text-sm font-bold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-600">{item.area}</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        {item.docs.map(d => (
                          <div key={d} className="size-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">{d === 'id' ? 'badge' : 'description'}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-5 text-right">
                       <button className="px-6 py-2 bg-blue-50 text-blue-600 text-xs font-black rounded-xl hover:bg-blue-100 transition-colors">Duyệt</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[420px]">
            <div className="md:w-1/2 relative">
               <img src="https://picsum.photos/seed/dispute1/600/600" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <div className="absolute bottom-6 left-6 text-white">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest">Ảnh thực tế khiếu nại</span>
                  <p className="text-[10px] font-bold mt-2 opacity-80 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">photo_camera</span> Bằng chứng nhận hàng - Đơn #AG-9921
                  </p>
               </div>
            </div>
            <div className="md:w-1/2 p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Gavel className="size-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Xử lý tranh chấp</span>
                  </div>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded-md">ƯU TIÊN CAO</span>
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</h4>
                <h3 className="text-xl font-black text-gray-900 mb-4">Sầu Riêng Ri6 - Loại 1 (5kg)</h3>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 italic leading-relaxed">
                    "Trái bị nứt vỏ và có dấu hiệu dập nát, mùi chua nồng ngay khi mở thùng. Yêu cầu hoàn tiền do chất lượng không đạt 'Loại 1'."
                  </p>
                </div>
                <div className="mt-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số tiền hoàn</p>
                   <p className="text-2xl font-black text-red-500">1,250,000đ</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[#38703d] text-white font-black rounded-2xl text-sm shadow-xl shadow-[#38703d]/20">Phê duyệt hoàn tiền</button>
                <button className="flex-1 py-4 bg-red-50 text-red-500 font-black rounded-2xl text-sm border border-red-100">Từ chối</button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Widgets */}
        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center gap-3 mb-8">
                 <AlertTriangle className="size-6 text-red-500" />
                 <h4 className="font-black text-gray-800 uppercase tracking-tight">Giám sát shop (Tín nhiệm thấp)</h4>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Nông Sản Sạch Ba Rịa', reason: '58/50 đánh giá 1 sao', time: '01 : 42 : 05', progress: 85 },
                  { name: 'Trái Cây Miền Tây Export', reason: '52/50 đánh giá 1 sao', time: '04 : 12 : 30', progress: 95 },
                ].map((shop, i) => (
                  <div key={i} className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 relative group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-black text-gray-900">{shop.name}</p>
                        <p className="text-[10px] text-red-500 font-black mt-1 uppercase">{shop.reason}</p>
                      </div>
                      <div className="size-10 bg-red-500 text-white rounded-xl flex items-center justify-center">
                         <Lock className="size-5" />
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                       <div className="h-full bg-red-500" style={{ width: `${shop.progress}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tự động khóa sau</span>
                       <span className="text-sm font-black text-red-500 font-mono tracking-widest">{shop.time}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <h4 className="font-black text-gray-800 uppercase tracking-tight mb-8">Danh sách "Bom hàng"</h4>
              <div className="space-y-6">
                {[
                  { name: 'van_hau_99', phone: '0392xxxx88', count: '08' },
                  { name: 'lan_anh_sg', phone: '0901xxxx22', count: '05' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-gray-100 rounded-full" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">SĐT: {user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="size-8 bg-red-50 text-red-500 text-xs font-black rounded-lg flex items-center justify-center">{user.count}</span>
                       <button className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest">Chặn</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic mt-8 border-t border-gray-50 pt-6 leading-relaxed">
                * Hệ thống tự động gắn cờ tài khoản khi tỉ lệ nhận &lt; 70% trong 3 tháng gần nhất.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default AdminDashboard;
