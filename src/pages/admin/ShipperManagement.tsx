
import React from 'react';
import { 
  Users, 
  Zap, 
  ClipboardCheck, 
  CheckCircle2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  History, 
  Lock, 
  Unlock, 
  Truck, 
  Bike,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ShipperManagement: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'TỔNG SỐ SHIPPER', value: '156', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'ĐANG HOẠT ĐỘNG', value: '82', icon: Zap, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'HỒ SƠ CHỜ DUYỆT', value: '14', icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50', badge: '14 hồ sơ mới' },
          { label: 'GIAO THÀNH CÔNG', value: '98.5%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-display">{stat.value}</h3>
            </div>
            <div className={`size-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="size-7" />
            </div>
          </div>
        ))}
      </div>

      {/* Approval Queue */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <ClipboardCheck className="size-5" />
             </div>
             <h4 className="font-black text-gray-800 uppercase tracking-tight">Hàng đợi duyệt Shipper mới</h4>
          </div>
          <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">14 hồ sơ mới</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại xe</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khu vực hoạt động</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Lê Minh Tuấn', vehicle: 'Xe máy', area: 'Quận 7, TP.HCM', icon: Bike },
                { name: 'Hoàng Văn Thái', vehicle: 'Xe tải (1.5T)', area: 'Bình Chánh, TP.HCM', icon: Truck },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Users className="size-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <item.icon className="size-4 text-gray-400" /> {item.vehicle}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-600">{item.area}</td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex items-center justify-end gap-6">
                       <button className="text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase">Xem hồ sơ</button>
                       <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Duyệt</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Shipper List */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
          <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách Shipper toàn hệ thống</h4>
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <input type="text" placeholder="Tìm tên, ID shipper..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
            </div>
            <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none cursor-pointer">
              <option>Tất cả khu vực</option>
            </select>
            <div className="relative">
               <select className="px-8 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none cursor-pointer appearance-none pr-12">
                 <option>Trạng thái</option>
               </select>
               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipper</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương tiện</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hiệu suất</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Phạm Hùng Anh', id: 'SP-8821', plate: '59-G1 123.45', type: 'Xe máy', rating: '4.9', completion: '99.2%', status: 'Đang trực', color: 'text-green-500 bg-green-50', avatar: 'https://picsum.photos/seed/s1/80/80' },
                { name: 'Nguyễn Thúy Vy', id: 'SP-9012', plate: '62-A 889.22', type: 'Xe tải', rating: '4.7', completion: '94.5%', status: 'Nghỉ', color: 'text-gray-400 bg-gray-50', avatar: 'https://picsum.photos/seed/s2/80/80' },
                { name: 'Trần Quốc Bảo', id: 'SP-4451', plate: '59-X1 005.12', type: 'Xe máy', rating: '3.2', completion: '72.0%', status: 'Đang bị khóa', color: 'text-red-500 bg-red-50', avatar: 'https://picsum.photos/seed/s3/80/80', isLocked: true },
              ].map((shipper, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={shipper.avatar} className="size-12 rounded-[18px] object-cover shadow-sm border border-gray-100" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{shipper.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {shipper.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-800">{shipper.plate}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{shipper.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-black text-gray-800">{shipper.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold italic">Hoàn thành: {shipper.completion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 w-fit ${shipper.color}`}>
                       <span className="size-2 bg-current rounded-full" />
                       <span className="text-[10px] font-black uppercase tracking-wider">{shipper.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                       <button className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                          <History className="size-5" />
                       </button>
                       {shipper.isLocked ? (
                         <button className="px-6 py-2.5 bg-green-50 text-green-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-green-100 transition-colors">Mở khóa</button>
                       ) : (
                         <button className="px-6 py-2.5 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-colors">Khóa</button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hiển thị 10 trong tổng số 156 đối tác</p>
           <div className="flex items-center gap-3">
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50">
                 <ChevronLeft className="size-6" />
              </button>
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50">
                 <ChevronRight className="size-6" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default ShipperManagement;
