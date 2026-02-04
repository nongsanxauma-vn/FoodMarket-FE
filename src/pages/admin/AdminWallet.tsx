
import React from 'react';
import { Landmark, TrendingUp, History, Search, Bell, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Filter, Download, Percent } from 'lucide-react';

const AdminWallet: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      {/* Top Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'TỔNG SỐ DƯ VÍ SÀN (ESCROW)', value: '2,450,000,000đ', sub: 'Đang tạm giữ chờ giải ngân', icon: Landmark, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'HOA HỒNG ĐÃ THU (3%)', value: '73,500,000đ', sub: '+4.2% so với tháng trước', icon: Percent, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'TỔNG TIỀN ĐÃ GIẢI NGÂN', value: '1,820,000,000đ', sub: 'Kể từ đầu tháng này', icon: History, color: 'text-gray-500', bg: 'bg-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8 group">
            <div className={`size-20 ${stat.bg} ${stat.color} rounded-[32px] flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="size-10" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-display">{stat.value}</h3>
              <p className={`text-[10px] font-bold mt-1 ${stat.color} opacity-80 uppercase tracking-widest`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Withdrawal Queue */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Hàng đợi yêu cầu rút tiền</h4>
           </div>
           <button className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">Lọc yêu cầu</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên shop</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số tiền yêu cầu</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số dư khả dụng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài khoản ngân hàng</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày yêu cầu</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: 'Vườn Sầu Riêng Bảy Tèo', id: 'SHOP-8821', amount: '15,000,000đ', balance: '42,500,000đ', bank: 'VIETCOMBANK', acc: '0071000123xxx', date: '22/05/2024 14:30' },
                { name: 'Nông Sản Sạch Miền Đông', id: 'SHOP-4412', amount: '8,200,000đ', balance: '12,100,000đ', bank: 'AGRIBANK', acc: '6200205567xxx', date: '22/05/2024 11:15' },
              ].map((req, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={`https://picsum.photos/seed/shop${i}/80/80`} className="size-11 rounded-xl object-cover border border-gray-100" />
                      <div>
                        <p className="text-sm font-black text-gray-900">{req.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {req.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-black text-gray-900">{req.amount}</td>
                  <td className="px-6 py-6 text-center text-xs font-bold text-gray-400">{req.balance}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{req.bank}</span>
                       <span className="text-xs font-bold text-gray-600 font-mono">{req.acc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[10px] font-bold text-gray-400">{req.date}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button className="px-6 py-3 bg-[#38703d] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#2d5a31] transition-all">Phê duyệt</button>
                       <button className="px-6 py-3 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100">Từ chối</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <History className="size-6 text-gray-400" />
              <h4 className="font-black text-gray-800 uppercase tracking-tight">LỊCH SỬ GIẢI NGÂN (THÁNG 05/2024)</h4>
           </div>
           <button className="text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-widest hover:text-gray-900">
             Tải sao kê <Download className="size-4" />
           </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã giao dịch</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop nhận tiền</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Số tiền</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày hoàn tất</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngân hàng</th>
              <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { id: '#WD-20240522-01', shop: 'Dâu Tây Đà Lạt Farm', amount: '5,400,000đ', date: '22/05/2024 09:40', bank: 'MB Bank - xxxx1234' },
              { id: '#WD-20240521-99', shop: 'Trái Cây Miền Tây Export', amount: '21,000,000đ', date: '21/05/2024 16:20', bank: 'Techcombank - xxxx8899' },
              { id: '#WD-20240521-82', shop: 'Hợp Tác Xã Rau Củ Quả', amount: '12,650,000đ', date: '21/05/2024 14:10', bank: 'BIDV - xxxx5522' },
            ].map((tx, i) => (
              <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase">{tx.id}</td>
                <td className="px-6 py-5 text-sm font-black text-gray-700">{tx.shop}</td>
                <td className="px-6 py-5 text-center text-sm font-black text-gray-900">{tx.amount}</td>
                <td className="px-6 py-5 text-[11px] font-bold text-gray-400">{tx.date}</td>
                <td className="px-6 py-5 text-xs font-bold text-gray-600">{tx.bank}</td>
                <td className="px-10 py-5 text-right">
                   <span className="px-3 py-1 bg-green-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">COMPLETED</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-8 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-medium italic">Hiển thị 10 trong tổng số 42 giao dịch gần nhất</p>
           <div className="flex items-center gap-2">
              <button className="size-8 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ChevronLeft className="size-5" /></button>
              <button className="size-8 bg-[#38703d] text-white rounded-lg text-xs font-black">1</button>
              <button className="size-8 border border-gray-100 rounded-lg text-xs font-black text-gray-400">2</button>
              <button className="size-8 border border-gray-100 rounded-lg text-xs font-black text-gray-400">3</button>
              <button className="size-8 border border-gray-100 rounded-lg flex items-center justify-center text-gray-300"><ChevronRight className="size-5" /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default AdminWallet;
