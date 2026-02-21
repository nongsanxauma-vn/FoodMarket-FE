
import React from 'react';
import { AppRole } from '../../types/index';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wallet, 
  UserCircle, 
  Gift, 
  ShieldCheck, 
  Store, 
  Gavel, 
  Users, 
  Truck,
  Leaf,
  CheckCircle,
  LogOut,
  Bell,
  Newspaper,
  Send,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  role: AppRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, currentPath, onNavigate, onLogout }) => {
  const farmerMenu = [
    { name: 'Tổng quan', icon: LayoutDashboard, id: 'overview' },
    { name: 'Sản phẩm', icon: Package, id: 'products' },
    { name: 'Đơn hàng', icon: ShoppingCart, id: 'orders' },
    { name: 'Thông báo', icon: Bell, id: 'notifications' },
    { name: 'Blind Box Tool', icon: Gift, id: 'blind-box' },
    { name: 'Hồ sơ cá nhân', icon: UserCircle, id: 'profile' },
    { name: 'Ví tiền', icon: Wallet, id: 'wallet' },
  ];

  const adminMenu = [
    { name: 'Bảng điều khiển', icon: LayoutDashboard, id: 'admin-overview' },
    { name: 'Duyệt KYC', icon: ShieldCheck, id: 'admin-kyc' },
    { name: 'Duyệt Sản Phẩm', icon: Package, id: 'admin-products' },
    { name: 'Quản lý tin tức', icon: Newspaper, id: 'admin-news' },
    { name: 'Quản lý thông báo', icon: Send, id: 'admin-notifications' },
    { name: 'Giám sát cửa hàng', icon: Store, id: 'admin-stores' },
    { name: 'Tranh chấp', icon: Gavel, id: 'admin-disputes' },
    { name: 'Quản lý Shipper', icon: Truck, id: 'admin-shippers' },
    { name: 'Người mua xấu', icon: Users, id: 'admin-bad-buyers' },
    { name: 'Ví sàn', icon: Wallet, id: 'admin-wallet' },
  ];

  const menu = role === AppRole.ADMIN ? adminMenu : farmerMenu;

  return (
    <aside className="w-80 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm z-50">
      {/* Header Logo Area */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 px-2 cursor-pointer" onClick={() => onNavigate(role === AppRole.ADMIN ? 'admin-overview' : 'overview')}>
          <div className="bg-primary size-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
            <Leaf className="size-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black leading-none font-display text-gray-900 tracking-tight uppercase">XẤU MÃ</h1>
            <p className="text-gray-400 text-[9px] font-bold mt-1 tracking-widest uppercase">{role === AppRole.ADMIN ? 'HỆ THỐNG QUẢN TRỊ' : 'NÔNG TRẠI XANH'}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-1 custom-scrollbar">
        {menu.map((item) => {
          const isActive = currentPath === item.id || (currentPath === 'add-product' && item.id === 'products');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary/5 text-primary border border-primary/10' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <item.icon className={`size-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`} />
              <span className={`text-sm font-black ${isActive ? 'text-primary' : 'text-gray-500'}`}>{item.name}</span>
              {isActive && <ChevronRight className="ml-auto size-3 opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Area - Logout is HERE */}
      <div className="p-8 border-t border-gray-50 bg-white space-y-6">
        <div className="bg-gray-50/80 rounded-3xl p-4 border border-gray-100 flex items-center gap-4 group">
          <div className="relative shrink-0">
            <img 
              className="size-10 rounded-xl border-2 border-white shadow-sm object-cover" 
              src={role === AppRole.FARMER ? "https://picsum.photos/seed/farmer_ba/100/100" : "https://picsum.photos/seed/admin_avatar/100/100"} 
              alt="User" 
            />
            <div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-full border-2 border-white flex items-center justify-center">
               <CheckCircle className="size-2 text-white fill-current" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{role === AppRole.FARMER ? 'Bác Ba Nông Dân' : 'Admin Tổng'}</p>
            <p className="text-[8px] text-primary uppercase tracking-widest font-black">Trạng thái: Online</p>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-4 px-6 text-xs font-black text-red-500 bg-red-50 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 group shadow-sm shadow-red-100"
        >
          <LogOut className="size-4 transition-transform group-hover:-translate-x-1" /> 
          <span>ĐĂNG XUẤT HỆ THỐNG</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
