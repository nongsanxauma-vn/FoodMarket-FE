
import React from 'react';
import { Plus, Search, Filter, Edit3, EyeOff, Trash2, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Products: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Quản Lý Sản Phẩm</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Bạn đang quản lý 24 sản phẩm nông sản.</p>
        </div>
        <button onClick={() => onNavigate('add-product')} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
          <Plus className="size-5" /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm tên sản phẩm, mã SKU..." className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-600 outline-none">
            <option>Tất cả danh mục</option>
          </select>
          <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-600 outline-none">
            <option>Trạng thái</option>
          </select>
          <button className="size-11 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter className="size-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Danh mục</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Giá/KG</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Tồn kho</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Hạn sử dụng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Xà lách thủy canh', sku: 'SKU: XL-001', cat: 'Rau lá', price: '35.000đ', stock: '45 kg', expiry: 'Còn 2 ngày', status: 'Đang bán', image: 'https://picsum.photos/seed/let1/80/80', critical: true },
                { name: 'Cà rốt hữu cơ', sku: 'SKU: CR-082', cat: 'Củ quả', price: '28.000đ', stock: '120 kg', expiry: '15/10', status: 'Đang bán', image: 'https://picsum.photos/seed/car1/80/80' },
                { name: 'Cà chua chín cây', sku: 'SKU: CC-992', cat: 'Củ quả', price: '42.000đ', stock: '0 kg', expiry: 'Đã hết hạn', status: 'Hết hàng', image: 'https://picsum.photos/seed/tom1/80/80', out: true },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={p.image} className="size-12 rounded-2xl object-cover shadow-sm" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase">{p.cat}</span>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-black text-gray-800">{p.price}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                       <span className={`text-sm font-black ${p.out ? 'text-red-500' : 'text-gray-800'}`}>{p.stock}</span>
                       <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.out ? 'bg-red-500' : 'bg-primary'}`} style={{ width: p.out ? '0%' : '60%' }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {p.critical ? (
                      <div className="flex items-center justify-center gap-1 text-red-500">
                        <AlertTriangle className="size-3" />
                        <span className="text-[10px] font-black">{p.expiry}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400">{p.expiry === '15/10' ? `Hạn dùng: ${p.expiry}` : p.expiry}</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${p.out ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-600'}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                       <button className="size-9 bg-gray-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors">
                          <Edit3 className="size-4" />
                       </button>
                       <button className="size-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <EyeOff className="size-4" />
                       </button>
                       <button className="size-9 bg-gray-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
                          <Trash2 className="size-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hiển thị 1-10 của 24 sản phẩm</p>
           <div className="flex items-center gap-2">
              <button className="size-9 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
                 <ChevronLeft className="size-5" />
              </button>
              <button className="size-9 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-black">1</button>
              <button className="size-9 border border-gray-100 rounded-xl flex items-center justify-center text-sm font-black text-gray-400 hover:bg-gray-50">2</button>
              <button className="size-9 border border-gray-100 rounded-xl flex items-center justify-center text-sm font-black text-gray-400 hover:bg-gray-50">3</button>
              <button className="size-9 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50">
                 <ChevronRight className="size-5" />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Đang kinh doanh', value: '18 sản phẩm', icon: CheckCircle, color: 'text-primary bg-primary/5' },
          { label: 'Sắp hết hạn (3 ngày)', value: '4 sản phẩm', icon: Clock, color: 'text-red-500 bg-red-50/50' },
          { label: 'Chờ phê duyệt', value: '2 sản phẩm', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50/50' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
             <div className={`size-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="size-7" />
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className={`text-xl font-black ${stat.color.split(' ')[0]}`}>{stat.value}</h4>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add fix: Export default
export default Products;
