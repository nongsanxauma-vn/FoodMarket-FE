
import React from 'react';
import { Order, OrderStatus } from '../types';
import { MOCK_ORDERS } from '../constants.tsx';
// Added ShoppingCart to the imported icons from lucide-react to fix the "Cannot find name 'ShoppingCart'" error
import { CheckCircle2, Truck, XCircle, ChevronRight, Wallet, TrendingUp, Star, ShoppingCart } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black font-display uppercase tracking-tight">Quản Lý Đơn Hàng</h2>
          <p className="text-[#678371] text-sm">Hôm nay bạn có 12 đơn hàng mới cần xử lý.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20">
          <span className="size-2 bg-primary rounded-full animate-pulse"></span>
          <span className="text-sm font-bold uppercase tracking-wider">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng đơn hàng', value: '1,250', trend: '+12%', icon: ShoppingCart, color: 'accent-gold' },
          { label: 'Doanh thu tháng', value: '45.8M', trend: '+8%', icon: TrendingUp, color: 'primary' },
          { label: 'Chất lượng Shop', value: '98%', trend: 'Top 5%', icon: Star, color: 'primary' },
          { label: 'Số dư khả dụng', value: '12.4Mđ', trend: 'Withdraw', icon: Wallet, color: 'primary', isAccent: true },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border border-[#dde4df] shadow-sm relative overflow-hidden group ${stat.isAccent ? 'bg-primary text-white' : 'bg-white'}`}>
             <p className={`text-xs font-bold uppercase tracking-widest ${stat.isAccent ? 'text-white/80' : 'text-[#678371]'}`}>{stat.label}</p>
             <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-3xl font-black font-display">{stat.value}</h3>
                <span className={`text-xs font-bold ${stat.isAccent ? 'text-white' : 'text-primary'}`}>{stat.trend}</span>
             </div>
             <stat.icon className={`absolute -right-2 -bottom-2 size-16 opacity-10 group-hover:scale-110 transition-transform ${stat.isAccent ? 'text-white' : 'text-gray-400'}`} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-8 border-b border-[#dde4df] overflow-x-auto pb-px">
          {['Tất cả (48)', 'Chờ xác nhận (5)', 'Đang giao (12)', 'Đã giao (28)', 'Đã hủy (3)'].map((tab, i) => (
            <button key={i} className={`px-2 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-[#678371] hover:text-primary'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-[#dde4df] shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1">
                <div className="p-4 bg-background-light/50 border-b border-[#dde4df] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-primary">#{order.id}</span>
                    <span className="text-xs text-[#678371]">Ngày đặt: {order.date}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      order.status === OrderStatus.PENDING ? 'bg-accent-gold/20 text-yellow-700' : 'bg-info/20 text-info'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-sm font-black">{order.total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img className="size-12 rounded-full border border-primary/20" src={`https://picsum.photos/seed/${order.id}/48/48`} alt="Customer" />
                      <div>
                        <p className="text-sm font-bold">{order.customer.name}</p>
                        <p className="text-xs text-[#678371]">{order.customer.phone} • {order.customer.address}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-[#678371] tracking-wider">Chi tiết sản phẩm</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-background-light px-3 py-2 rounded-lg border border-[#dde4df]">
                             <div>
                                <p className="text-xs font-bold">{item.name}</p>
                                <p className="text-[10px] text-[#678371]">{item.quantity} x {item.price.toLocaleString('vi-VN')}đ</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 p-6 bg-background-light/30 flex flex-col justify-center gap-3 border-l border-[#dde4df]">
                <button className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  <CheckCircle2 className="size-5" /> Chuẩn bị hàng
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2 border border-info/30 text-info font-bold text-xs rounded-xl hover:bg-info/5 flex items-center justify-center gap-1">
                    <Truck className="size-4" /> Ship
                  </button>
                  <button className="py-2 border border-danger/30 text-danger font-bold text-xs rounded-xl hover:bg-danger/5 flex items-center justify-center gap-1">
                    <XCircle className="size-4" /> Hủy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
