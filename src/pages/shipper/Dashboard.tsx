
import React, { useState } from 'react';
/* Fix: Import missing CheckCircle2 icon from lucide-react */
import { 
  Bell, 
  MapPin, 
  ChevronRight, 
  Wallet, 
  History, 
  Navigation, 
  Zap, 
  Clock, 
  Bike,
  Package,
  Map as MapIcon,
  ArrowRight,
  User,
  LogOut,
  ShieldCheck,
  Star,
  Award,
  Truck,
  CreditCard,
  Settings,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface ShipperDashboardProps {
  onLogout: () => void;
}

const ShipperDashboard: React.FC<ShipperDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Đơn hàng mới');
  const [radius, setRadius] = useState('2km');

  const availableOrders = [
    {
      id: 'ORD-101',
      time: '5 phút trước',
      price: '25.000đ',
      pickup: {
        name: 'Vườn Nông Dân A',
        address: 'Đường Nguyễn Văn Linh, Quận 7',
        distance: '0.8km'
      },
      delivery: {
        name: 'Chung cư Sunrise City',
        address: '23 Nguyễn Hữu Thọ',
        distance: '1.5km từ điểm lấy'
      }
    },
    {
      id: 'ORD-102',
      time: '12 phút trước',
      price: '32.000đ',
      pickup: {
        name: 'HTX Rau Sạch Củ Chi',
        address: 'Điểm gom hàng Q.10',
        distance: '1.2km'
      },
      delivery: {
        name: 'Hẻm 45 Lý Thái Tổ',
        address: 'Phường 1, Quận 3',
        distance: '2.8km từ điểm lấy'
      }
    },
    {
      id: 'ORD-103',
      time: 'Vừa xong',
      price: '18.000đ',
      pickup: {
        name: 'Vườn Cô Sáu',
        address: 'Chợ Phạm Thế Hiển, Q.8',
        distance: '0.5km'
      },
      delivery: {
        name: 'Số 12 Dương Bá Trạc',
        address: 'Phường 2, Quận 8',
        distance: '0.9km từ điểm lấy'
      }
    }
  ];

  const renderProfile = () => (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="size-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-blue-100">
            <img src="https://picsum.photos/seed/shipper_avatar/200/200" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center">
             <ShieldCheck className="size-5" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
           <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-3xl font-black text-gray-900">Anh Hùng Shipper</h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full w-fit mx-auto md:mx-0">ĐỐI TÁC TIN CẬY</span>
           </div>
           <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã Shipper</span>
                 <span className="text-sm font-bold text-gray-700">SP-2024-8821</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khu vực</span>
                 <span className="text-sm font-bold text-gray-700">Quận 7, TP.HCM</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đánh giá</span>
                 <span className="text-sm font-bold text-gray-700 flex items-center gap-1">4.9 <Star className="size-3 text-yellow-500 fill-yellow-500" /></span>
              </div>
           </div>
        </div>
        <button className="px-8 py-3 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">Sửa thông tin</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Bike className="size-5" />
               </div>
               <h4 className="font-black text-gray-800 uppercase tracking-tight">Phương tiện</h4>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Loại xe:</span>
                  <span className="text-sm font-black text-gray-900">Xe máy cá nhân</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Biển số:</span>
                  <span className="text-sm font-black text-gray-900">59-G1 123.45</span>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-primary" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Hồ sơ xe đã phê duyệt</span>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <Award className="size-5" />
               </div>
               <h4 className="font-black text-gray-800 uppercase tracking-tight">Hiệu suất tháng</h4>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Tổng đơn:</span>
                  <span className="text-sm font-black text-gray-900">156 đơn</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Tỉ lệ hoàn thành:</span>
                  <span className="text-sm font-black text-emerald-500">99.2%</span>
               </div>
               <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[99%]" />
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                  <CreditCard className="size-5" />
               </div>
               <h4 className="font-black text-gray-800 uppercase tracking-tight">Thanh toán</h4>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Liên kết ngân hàng:</span>
                  <span className="text-sm font-black text-gray-900">MB BANK</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Số tài khoản:</span>
                  <span className="text-sm font-black text-gray-900 font-mono">**** 8899</span>
               </div>
               <button className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">Quản lý ví & thu nhập</button>
            </div>
         </div>
      </div>

      <div className="bg-gray-900 rounded-[48px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="size-16 bg-white/10 rounded-[28px] flex items-center justify-center text-primary">
               <ShieldCheck className="size-8" />
            </div>
            <div>
               <h4 className="text-xl font-black uppercase tracking-tight leading-tight">Chứng chỉ <br/>vận chuyển xanh</h4>
               <p className="text-xs opacity-50 font-bold mt-1 uppercase">Cấp bởi hệ thống Xấu Mã</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform">Xem chứng chỉ số</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-background animate-in fade-in duration-500 min-h-screen">
      {/* Shipper Top Header (Brand + Logout) */}
      <div className="bg-[#1a4d2e] text-white px-4 md:px-10 lg:px-40 py-4 flex items-center justify-between sticky top-0 z-[50] shadow-xl">
         <div className="flex items-center gap-3">
            <div className="size-10 bg-white rounded-xl flex items-center justify-center text-[#1a4d2e]">
               <Bike className="size-6 fill-current" />
            </div>
            <div>
               <h2 className="text-xl font-black tracking-tighter uppercase leading-none">XẤU MÃ SHIPPER</h2>
               <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mt-1">Hệ thống vận chuyển thông minh</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button className="size-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all relative">
               <Bell className="size-5" />
               <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#1a4d2e]"></span>
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('Hồ sơ cá nhân')}>
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black">Anh Hùng</p>
                  <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Đang trực tuyến</p>
               </div>
               <img src="https://picsum.photos/seed/shipper_avatar/80/80" className="size-10 rounded-xl object-cover border-2 border-white/20 group-hover:border-white transition-all shadow-md" />
            </div>
            <button 
              onClick={onLogout}
              className="size-10 bg-red-500/20 text-red-200 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-inner"
              title="Đăng xuất"
            >
               <LogOut className="size-5" />
            </button>
         </div>
      </div>

      {/* Shipper Sub Header / Navigation */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[72px] z-40 px-4 md:px-10 lg:px-40">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            {['Đơn hàng mới', 'Đơn đang giao', 'Lịch sử thu nhập', 'Hồ sơ cá nhân'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 text-sm font-black uppercase tracking-tight transition-all border-b-4 relative flex items-center gap-2 ${
                  activeTab === tab ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab === 'Đơn hàng mới' && <Zap className={`size-4 ${activeTab === tab ? 'fill-primary' : ''}`} />}
                {tab === 'Hồ sơ cá nhân' && <User className="size-4" />}
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 py-4 border-l border-gray-50 pl-10 hidden md:flex">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
               <Wallet className="size-4 text-primary" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">VÍ SHIPPER:</span>
               <span className="text-sm font-black text-gray-900">1.250.000đ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12 pb-24">
        {activeTab === 'Hồ sơ cá nhân' ? (
          renderProfile()
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <h1 className="text-4xl font-black text-gray-900 font-display uppercase tracking-tighter">{activeTab}</h1>
                <p className="text-gray-400 font-bold mt-1 uppercase text-xs tracking-widest">Hôm nay bạn đã giao 12 đơn thành công</p>
              </div>
              
              {activeTab === 'Đơn hàng mới' && (
                <div className="flex items-center gap-4 bg-white p-2 rounded-[28px] border border-gray-100 shadow-sm">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">BÁN KÍNH:</span>
                   <div className="flex gap-1">
                      {['2km', '5km', '10km'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRadius(r)}
                          className={`px-5 py-2 rounded-2xl text-xs font-black transition-all ${
                            radius === r ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Order Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {availableOrders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-8">
                      <div className={`px-3 py-1 rounded-lg flex items-center gap-1.5 ${idx === 2 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                         <Clock className="size-3" />
                         <span className="text-[10px] font-black uppercase tracking-tight">{order.time}</span>
                      </div>
                      <span className="text-2xl font-black text-primary">{order.price}</span>
                   </div>

                   <div className="space-y-8 relative">
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-50 border-l border-dashed border-gray-200" />
                      
                      <div className="relative flex items-start gap-5">
                        <div className="size-5 bg-orange-100 border-2 border-white rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm">
                           <div className="size-1.5 bg-orange-500 rounded-full" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">LẤY HÀNG</p>
                           <h4 className="text-sm font-black text-gray-900">{order.pickup.name}</h4>
                           <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{order.pickup.address} ({order.pickup.distance})</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-5">
                        <div className="size-5 bg-blue-100 border-2 border-white rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm">
                           <div className="size-1.5 bg-blue-500 rounded-full" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">GIAO HÀNG</p>
                           <h4 className="text-sm font-black text-gray-900">{order.delivery.name}</h4>
                           <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{order.delivery.address}</p>
                           <p className="text-[10px] text-primary font-bold italic mt-1">{order.delivery.distance}</p>
                        </div>
                      </div>
                   </div>

                   <button className="mt-10 w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 group">
                      Nhận đơn này <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                   
                   <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
                </div>
              ))}
            </div>

            {/* Heatmap Section */}
            <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm p-12">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Khu vực đang nóng</h2>
                     <div className="size-3 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 italic">Nhu cầu cao tại khu vực Quận 7 & Quận 8</p>
               </div>
               
               <div className="relative aspect-[21/9] w-full rounded-[40px] overflow-hidden bg-gray-100 border border-gray-100">
                  <img src="https://picsum.photos/seed/heatmap/1200/500" className="w-full h-full object-cover grayscale opacity-60" />
                  <div className="absolute inset-0 bg-black/5" />
                  
                  {/* Demand Hotspot */}
                  <div className="absolute top-1/2 left-1/3 flex items-center justify-center">
                     <div className="size-32 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse border border-red-500/30">
                        <div className="size-20 bg-red-500/40 rounded-full flex items-center justify-center border border-red-500/50">
                           <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">NHIỀU ĐƠN</span>
                        </div>
                     </div>
                  </div>

                  <button className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black shadow-2xl border border-white/20 hover:bg-white transition-all uppercase tracking-widest">
                     <MapIcon className="size-4 text-primary" /> Xem bản đồ nhiệt
                  </button>
               </div>
            </div>
          </>
        )}
      </div>

      {/* Shipper Footer */}
      <footer className="bg-[#1a4d2e] text-white py-12 px-4 md:px-10 lg:px-40 mt-12">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="size-8 bg-white rounded-xl flex items-center justify-center text-[#1a4d2e]">
               <Bike className="size-5 fill-current" />
             </div>
             <h2 className="text-xl font-black tracking-tighter uppercase">XẤU MÃ SHIPPER</h2>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-10">
             <a href="#" className="text-xs font-bold text-green-100/60 hover:text-white transition-colors uppercase tracking-widest">Trung tâm hỗ trợ</a>
             <a href="#" className="text-xs font-bold text-green-100/60 hover:text-white transition-colors uppercase tracking-widest">Quy tắc ứng xử</a>
             <a href="#" className="text-xs font-bold text-green-100/60 hover:text-white transition-colors uppercase tracking-widest">Biểu phí thu nhập</a>
          </nav>

          <p className="text-[10px] text-green-100/40 font-medium italic">© 2024 XẤU MÃ. Hệ thống vận chuyển thông minh.</p>
        </div>
      </footer>
    </div>
  );
};

export default ShipperDashboard;
