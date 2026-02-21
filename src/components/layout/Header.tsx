
import React, { useState } from 'react';
import { AppRole, User } from '../../types/index';
import { Search, ShoppingCart, Bell, Menu, Leaf, User as UserIcon, LogOut, Phone } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  isAuthenticated: boolean;
  onRoleSwitch: (role: AppRole) => void;
  onOpenCart?: () => void;
  onLogout: () => void;
  onOpenNews?: () => void;
  onGoHome: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  isAuthenticated, 
  onRoleSwitch, 
  onOpenCart, 
  onLogout, 
  onOpenNews, 
  onGoHome,
  onOpenLogin,
  onOpenRegister
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Chỉ hiển thị Header này cho người mua (BUYER) hoặc Khách chưa login
  if (user && user.role !== AppRole.BUYER) {
    return null;
  }

  return (
    <header className="sticky top-0 z-[60] flex flex-col w-full bg-white shadow-sm font-sans">
      {/* Top Bar - Dark Green Section */}
      <div className="bg-[#5DBE61] text-white px-4 md:px-10 lg:px-40 py-4">
        <div className="flex items-center justify-between max-w-[1280px] mx-auto gap-10">
          {/* Logo Area */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={onGoHome}>
            <div className="size-10 bg-white rounded-full flex items-center justify-center text-[#38543a]">
              <Leaf className="size-6 fill-current" />
            </div>
            <h2 className="text-white text-3xl font-black leading-tight tracking-tighter uppercase font-display italic">XẤU MÃ</h2>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-[700px] relative">
            <div className="relative flex items-center bg-white rounded-full h-11 px-5 overflow-hidden shadow-inner">
              <Search className="size-4 text-gray-400 mr-3" />
              <input 
                className="w-full border-none focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400 font-medium" 
                placeholder="Tìm kiếm nông sản, nhà vườn..." 
                type="text"
              />
            </div>
          </div>

          {/* Icons / Auth Area */}
          <div className="flex items-center gap-6 relative">
            {isAuthenticated ? (
              <>
                <button className="relative text-white hover:opacity-80 transition-opacity">
                  <Bell className="size-6" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#E66666] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#38543a]">2</span>
                </button>

                <button onClick={onOpenCart} className="relative text-white hover:opacity-80 transition-opacity">
                  <ShoppingCart className="size-6" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#FAD973] text-[#38543a] text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#38543a]">3</span>
                </button>
                
                <div className="relative">
                  <div 
                    className="size-10 rounded-full border-2 border-white/20 cursor-pointer hover:border-white transition-all overflow-hidden bg-gray-200"
                    style={{ backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    {!user?.avatar && <UserIcon className="size-5 m-auto mt-2 text-gray-500" />}
                  </div>

                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 py-3 animate-in fade-in zoom-in-95 duration-200 text-gray-800 overflow-hidden ring-1 ring-black/5">
                      <div className="px-5 py-3 border-b border-gray-50 mb-1">
                         <p className="text-sm font-black truncate">{user?.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{user?.role}</p>
                      </div>
                      <button onClick={() => { setShowProfileMenu(false); onRoleSwitch(AppRole.FARMER); }} className="w-full px-5 py-3 text-left text-xs font-bold hover:bg-gray-50 flex items-center gap-3 transition-colors">
                        <UserIcon className="size-4 text-gray-400" /> Chuyển sang Nông dân
                      </button>
                      <button onClick={() => { setShowProfileMenu(false); onRoleSwitch(AppRole.SHIPPER); }} className="w-full px-5 py-3 text-left text-xs font-bold hover:bg-gray-50 flex items-center gap-3 transition-colors">
                        <span className="material-symbols-outlined text-lg text-gray-400">local_shipping</span> Chuyển sang Shipper
                      </button>
                      <div className="h-px bg-gray-50 mx-3 my-1" />
                      <button onClick={onLogout} className="w-full px-5 py-3 text-left text-xs font-black text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                        <LogOut className="size-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onOpenLogin}
                  className="px-6 py-2.5 text-sm font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={onOpenRegister}
                  className="px-6 py-2.5 bg-[#FAD973] text-[#38543a] rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 transition-all"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sub Header - Navigation */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-10 lg:px-40 h-14 flex items-center">
        <div className="flex items-center justify-between w-full max-w-[1280px] mx-auto">
          <button className="flex items-center gap-3 text-gray-800 hover:text-primary transition-colors group">
            <Menu className="size-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-tight">DANH MỤC SẢN PHẨM</span>
          </button>

          <div className="flex items-center gap-12">
            <nav className="flex items-center gap-10">
              <a href="#goi-mu" className="text-gray-600 text-xs font-bold hover:text-primary transition-all uppercase tracking-tight">GÓI MÙ</a>
              <button 
                onClick={onGoHome} 
                className="text-gray-900 text-xs font-black border-b-2 border-[#29a33d] pb-1 uppercase tracking-tight text-nowrap"
              >
                TRANG CHỦ
              </button>
              <a href="#" className="text-gray-600 text-xs font-bold hover:text-primary transition-all uppercase tracking-tight">KHUYẾN MÃI</a>
              <button 
                onClick={onOpenNews} 
                className="text-gray-600 text-xs font-bold hover:text-primary transition-all uppercase tracking-tight"
              >
                TIN TỨC
              </button>
            </nav>
            
            <div className="h-6 w-px bg-gray-100 mx-2" />
            
            <div className="flex items-center gap-2.5 text-gray-800">
               <Phone className="size-4 fill-current" />
               <span className="text-xs font-black uppercase tracking-tight">HOTLINE: 1900 1234</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
