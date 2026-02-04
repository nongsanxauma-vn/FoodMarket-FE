
import React from 'react';
import { ShieldCheck, UserCheck, CheckCircle, Search, Bell, Info, ChevronLeft, ChevronRight, FileText, Landmark } from 'lucide-react';

const KYCApproval: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Duyệt Hồ Sơ Nông Dân (KYC)</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Xác minh danh tính người bán để đảm bảo chất lượng nông sản XẤU MÃ.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 pr-10">
              <div className="size-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                 <span className="material-symbols-outlined">assignment_ind</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CHỜ DUYỆT</p>
                 <h4 className="text-xl font-black text-gray-900">42</h4>
              </div>
           </div>
           <div className="bg-white p-4 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 pr-10">
              <div className="size-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                 <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ĐÃ DUYỆT HÔM NAY</p>
                 <h4 className="text-xl font-black text-gray-900">15</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách hồ sơ</h4>
              <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full">Hiện có 42 hồ sơ</span>
           </div>
           <div className="flex items-center gap-4">
              <button className="size-10 flex items-center justify-center text-gray-300 hover:text-gray-900"><span className="material-symbols-outlined">filter_list</span></button>
              <button className="size-10 flex items-center justify-center text-gray-300 hover:text-gray-900"><span className="material-symbols-outlined">more_vert</span></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nông dân</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khu vực</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sản phẩm chủ lực</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày gửi</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Nguyễn Văn An', id: 'ND-88912', area: 'Lâm Đồng', main: 'Sầu riêng, Bơ', date: '14/10/2023 09:30', status: 'CHỜ DUYỆT', color: 'text-blue-600' },
                { name: 'Trần Thị Bé', id: 'ND-22105', area: 'Tiền Giang', main: 'Thanh long, Khóm', date: '14/10/2023 08:15', status: 'ĐANG XEM XÉT', color: 'text-orange-500' },
                { name: 'Lê Hoàng Nam', id: 'ND-00122', area: 'Bình Phước', main: 'Điều, Tiêu', date: '13/10/2023 16:45', status: 'CHỜ DUYỆT', color: 'text-blue-600' },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={`https://picsum.photos/seed/k${i}/80/80`} className="size-11 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-gray-600">{p.area}</td>
                  <td className="px-6 py-6 text-center">
                    <span className="px-4 py-1.5 bg-green-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-tight">{p.main}</span>
                  </td>
                  <td className="px-6 py-6 text-[11px] font-bold text-gray-400">{p.date}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                       <span className={`size-2 rounded-full bg-current ${p.color}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${p.color}`}>{p.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="px-6 py-2.5 bg-gray-50 text-gray-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-gray-100 transition-colors">Xem chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-medium italic">* Ưu tiên xử lý các hồ sơ đã chờ trên 24 giờ.</p>
           <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-400">Trước</button>
              <button className="size-9 bg-[#38703d] text-white rounded-xl text-xs font-black">1</button>
              <button className="size-9 border border-gray-100 rounded-xl text-xs font-black text-gray-400">2</button>
              <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-400">Sau</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 rounded-[40px] overflow-hidden relative shadow-lg h-[400px]">
            <img src="https://picsum.photos/seed/farmer_evidence/800/800" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
               <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest">Ảnh thực tế khiếu nại (Tham khảo)</span>
            </div>
         </div>
         <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-12">
            <div className="flex items-center gap-4 mb-8">
               <div className="size-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Info className="size-6" />
               </div>
               <div className="flex-1">
                 <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Lưu ý khi duyệt nông dân</h4>
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">QUY CHUẨN HỆ THỐNG</button>
               </div>
            </div>
            
            <div className="space-y-8">
               <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">KIỂM TRA CHỨNG TỪ</p>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                    "Yêu cầu ảnh chụp CMND/CCCD và Giấy chứng nhận quyền sử dụng đất hoặc xác nhận hộ nông dân từ địa phương."
                  </p>
               </div>
               <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">MÔ TẢ SẢN PHẨM</p>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                    "Sản phẩm nông sản 'Xấu Mã' vẫn phải đảm bảo an toàn vệ sinh thực phẩm và không bị hư hỏng, thối rữa bên trong."
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default KYCApproval;
