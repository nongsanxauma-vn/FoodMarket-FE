
import React from 'react';
import { ShoppingCart, TrendingUp, Star, Wallet, Package, Clock, MoreVertical, Plus, Sparkles, Landmark, History, ChefHat } from 'lucide-react';

const FarmerDashboard: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Bảng Điều Khiển Nông Dân</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Chào buổi sáng, hôm nay bạn có 12 đơn hàng mới.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="Tìm kiếm nhanh..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64 shadow-sm" />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
          </div>
          <button className="size-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 relative shadow-sm">
            <span className="material-symbols-outlined fill-1">notifications</span>
            <span className="absolute top-2 right-2 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng đơn hàng', value: '1,250', trend: '+12%', icon: ShoppingCart },
          { label: 'Doanh thu tháng', value: '45.8M', trend: '+8%', icon: TrendingUp },
          { label: 'Chất lượng Shop', value: '98%', trend: 'Top 5%', icon: Star, bar: 98 },
          { label: 'Số dư khả dụng', value: '12.450.000đ', icon: Wallet, isPrimary: true, frozen: '1.2M' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group ${stat.isPrimary ? 'bg-primary text-white' : 'bg-white'}`}>
            <p className={`text-[11px] font-black uppercase tracking-widest ${stat.isPrimary ? 'text-white/70' : 'text-gray-400'}`}>{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-black font-display">{stat.value}</h3>
              {stat.trend && <span className={`text-[10px] font-bold ${stat.isPrimary ? 'text-white' : 'text-primary'}`}>{stat.trend}</span>}
            </div>
            {stat.bar && (
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${stat.bar}%` }} />
              </div>
            )}
            {stat.isPrimary && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-white/70">Bị đóng băng: {stat.frozen}</span>
                <button onClick={() => onNavigate('wallet')} className="bg-white text-primary text-[10px] font-black px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">Rút tiền</button>
              </div>
            )}
            <stat.icon className={`absolute -right-4 -bottom-4 size-20 opacity-5 ${stat.isPrimary ? 'text-white' : 'text-gray-400'}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Management Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Package className="size-5" />
                </div>
                <h4 className="font-black text-gray-800 uppercase tracking-tight">Quản lý sản phẩm</h4>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onNavigate('combo-builder')} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-2">
                  <ChefHat className="size-4" /> Tạo Combo
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-100">Quản lý hạn dùng</button>
                <button onClick={() => onNavigate('add-product')} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark">
                  <Plus className="size-4" /> Thêm sản phẩm
                </button>
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tồn kho</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Hạn sử dụng</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { name: 'Xà lách thủy canh', desc: 'Rau củ sạch', stock: '45kg', expiry: '2 ngày nữa', status: 'Đang bán', image: 'https://picsum.photos/seed/salad/40/40' },
                    { name: 'Cà rốt hữu cơ', desc: 'Củ quả', stock: '120kg', expiry: '15 ngày nữa', status: 'Đang bán', image: 'https://picsum.photos/seed/carrot/40/40' },
                  ].map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="size-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{p.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{p.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">{p.stock}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-full">{p.expiry}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="size-1.5 bg-primary rounded-full"></span>
                          <span className="text-[11px] font-bold text-gray-600">{p.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center ml-auto">
                          <MoreVertical className="size-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => onNavigate('products')} className="w-full py-4 text-primary text-xs font-bold hover:bg-primary/5 border-t border-gray-50 transition-all uppercase tracking-widest">Xem tất cả 24 sản phẩm</button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Landmark className="size-5" />
              </div>
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Chi tiết tài chính</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Số dư khả dụng</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">12.450.000đ</h3>
              </div>
              <div className="p-6 bg-yellow-50/50 rounded-2xl border border-yellow-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-yellow-600">Số dư đóng băng</p>
                <h3 className="text-2xl font-black text-yellow-700 mt-1">1.200.000đ</h3>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => onNavigate('wallet')} className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Landmark className="size-4" /> Rút tiền về ngân hàng
              </button>
              <button onClick={() => onNavigate('wallet')} className="flex-1 py-3 bg-white border border-gray-100 text-gray-600 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm">
                <History className="size-4" /> Lịch sử giao dịch
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Tool */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="font-black text-gray-800 uppercase tracking-tight">Blind Box Surplus</h4>
                <p className="text-[10px] text-gray-400 font-medium">Giải cứu nông sản dư thừa qua các hộp quà bí ẩn.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Chọn nông sản dư thừa</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Bắp cải', image: 'https://picsum.photos/seed/cabbage/60/60' },
                    { name: 'Cà chua', image: 'https://picsum.photos/seed/tomato/60/60' },
                    { name: 'Khoai tây', image: 'https://picsum.photos/seed/potato/60/60' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="size-16 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all relative">
                        <img src={item.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Mức giá combo</label>
                  <span className="text-primary font-black">59.000đ</span>
                </div>
                <input type="range" className="w-full accent-primary h-1.5 bg-gray-100 rounded-full" />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Số lượng vật phẩm</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 appearance-none bg-no-repeat bg-[right_12px_center]">
                  <option>3 - 5 loại nông sản</option>
                  <option>5 - 7 loại nông sản</option>
                </select>
              </div>

              <button className="w-full py-4 bg-primary text-white font-black rounded-[20px] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
                <Sparkles className="size-4" /> Tạo Combo Random
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default FarmerDashboard;
