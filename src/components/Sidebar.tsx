
import React from 'react';
import { AppRole } from '../types';
/* Fix: Import missing icons CheckCircle and Edit3 from lucide-react */
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wallet, 
  UserCircle, 
  Gift, 
  LogOut, 
  ShieldCheck, 
  Store, 
  Gavel, 
  Users, 
  Truck,
  Leaf,
  ChevronRight,
  CheckCircle,
  Edit3
} from 'lucide-react';

interface SidebarProps {
  role: AppRole;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, currentPath, onNavigate }) => {
  const farmerMenu = [
    { name: 'Tổng quan', icon: LayoutDashboard, id: 'overview' },
    { name: 'Sản phẩm', icon: Package, id: 'products' },
    { name: 'Đơn hàng', icon: ShoppingCart, id: 'orders' },
    { name: 'Blind Box Tool', icon: Gift, id: 'blind-box' },
    { name: 'Hồ sơ cá nhân', icon: UserCircle, id: 'profile' },
    { name: 'Ví tiền', icon: Wallet, id: 'wallet' },
  ];

  const adminMenu = [
    { name: 'Bảng điều khiển', icon: LayoutDashboard, id: 'admin-overview' },
    { name: 'Duyệt KYC', icon: ShieldCheck, id: 'admin-kyc' },
    { name: 'Giám sát cửa hàng', icon: Store, id: 'admin-stores' },
    { name: 'Tranh chấp', icon: Gavel, id: 'admin-disputes' },
    { name: 'Quản lý Shipper', icon: Truck, id: 'admin-shippers' },
    { name: 'Người mua xấu', icon: Users, id: 'admin-bad-buyers' },
  ];

  const menu = role === AppRole.ADMIN ? adminMenu : farmerMenu;

  return (
    <aside className="w-80 bg-white border-r border-gray-100 flex flex-col justify-between p-8 h-full shadow-sm z-50">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary size-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Leaf className="size-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black leading-none font-display text-gray-900 tracking-tight">XẤU MÃ</h1>
            <p className="text-gray-400 text-[10px] font-bold mt-1 tracking-widest uppercase">Nông Trại Xanh</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = currentPath === item.id || (currentPath === 'add-product' && item.id === 'products');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary/5 text-primary shadow-sm border border-primary/10' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`size-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                <span className={`text-sm font-black ${isActive ? 'text-primary' : 'text-gray-500'}`}>{item.name}</span>
                {isActive && <div className="ml-auto size-1.5 bg-primary rounded-full shadow-sm" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-gray-50/80 rounded-3xl p-5 border border-gray-100 flex items-center gap-4 relative group cursor-pointer hover:bg-white transition-all">
          <div className="relative">
            <img 
              className="size-12 rounded-2xl border-2 border-white shadow-sm object-cover" 
              src="https://picsum.photos/seed/farmer_ba/100/100" 
              alt="User" 
            />
            <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-sm">
               <CheckCircle className="size-3 text-white fill-current" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">Bác Ba Nông Dân</p>
            <p className="text-[9px] text-primary uppercase tracking-widest font-black">Mức bạc: Thân thiện</p>
          </div>
          <button className="ml-auto size-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
             <Edit3 className="size-3" />
          </button>
        </div>

        <button className="w-full py-4 px-6 text-xs font-black text-gray-400 border border-gray-100 rounded-3xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-3 group">
          <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">logout</span> 
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
