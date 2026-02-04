
import React, { useState } from 'react';
import { AppRole } from '../../types';
import { Leaf, Mail, Lock, ArrowRight, User, Truck, Sprout, ShieldAlert, Chrome, Facebook } from 'lucide-react';

interface LoginProps {
  onLogin: (role: AppRole) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.BUYER);

  return (
    <div className="min-h-screen bg-[#f0f2f0] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1100px] bg-white rounded-[60px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Left Side: Brand Panel (Exactly like your image) */}
        <div className="w-full md:w-5/12 bg-[#5c8d5e] p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo Icon */}
            <div className="size-16 bg-white rounded-[20px] flex items-center justify-center text-[#5c8d5e] mb-12 shadow-2xl shadow-black/10">
              <Leaf className="size-10 fill-current" />
            </div>
            
            {/* Brand Titles */}
            <h1 className="text-6xl font-black font-display leading-[0.9] mb-4 uppercase tracking-tighter">
              XẤU MÃ
            </h1>
            <h2 className="text-5xl font-black text-white/50 font-display leading-tight">
              Tử Tế Từ Tâm.
            </h2>

            {/* Subtext */}
            <p className="mt-10 text-lg text-white/90 font-medium max-w-[280px] leading-relaxed">
              Kết nối trực tiếp nông dân và người tiêu dùng, chung tay giảm lãng phí thực phẩm Việt.
            </p>
          </div>
          
          {/* Quote Box at Bottom (Exactly like your image) */}
          <div className="relative z-10 mt-20 bg-white/10 backdrop-blur-md rounded-[32px] p-8 border border-white/20">
             <p className="text-sm italic font-medium leading-relaxed">
               "Chúng tôi tin rằng mỗi củ khoai, mỗi bó rau dù vẻ ngoài thế nào đều chứa đựng công sức và giá trị dinh dưỡng vẹn nguyên."
             </p>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -bottom-20 -right-20 size-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 size-80 bg-black/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-10 md:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-[420px] mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">Đăng nhập</h2>
              <p className="text-gray-400 font-bold text-sm">Chào mừng bạn quay trở lại với cộng đồng Xấu Mã.</p>
            </div>

            <div className="space-y-8">
               {/* Role Selector */}
               <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Bạn đăng nhập với tư cách:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { role: AppRole.BUYER, label: 'Người mua', icon: User },
                      { role: AppRole.FARMER, label: 'Nông dân', icon: Sprout },
                      { role: AppRole.SHIPPER, label: 'Shipper', icon: Truck },
                      { role: AppRole.ADMIN, label: 'Admin', icon: ShieldAlert },
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => setSelectedRole(item.role)}
                        className={`py-4 px-3 rounded-[24px] border-2 flex items-center gap-3 transition-all ${
                          selectedRole === item.role 
                            ? 'border-[#5c8d5e] bg-[#5c8d5e]/5 text-[#5c8d5e] shadow-sm' 
                            : 'border-gray-50 text-gray-400 hover:bg-gray-50 hover:border-gray-100'
                        }`}
                      >
                        <item.icon className="size-5 shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                      </button>
                    ))}
                  </div>
               </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5c8d5e] transition-colors">
                    <Mail className="size-5" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email hoặc số điện thoại" 
                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-[#5c8d5e]/10 focus:border-[#5c8d5e] outline-none text-sm font-bold transition-all"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5c8d5e] transition-colors">
                    <Lock className="size-5" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-[#5c8d5e]/10 focus:border-[#5c8d5e] outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="size-4 rounded-md border-gray-300 text-[#5c8d5e] focus:ring-[#5c8d5e]" />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Ghi nhớ</span>
                </label>
                <a href="#" className="text-xs font-bold text-[#5c8d5e] hover:underline">Quên mật khẩu?</a>
              </div>

              {/* Login Button */}
              <button 
                onClick={() => onLogin(selectedRole)}
                className="w-full py-5 bg-[#5c8d5e] text-white rounded-[28px] font-black text-lg shadow-xl shadow-[#5c8d5e]/20 hover:bg-[#4a724b] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
              >
                ĐĂNG NHẬP <ArrowRight className="size-6" />
              </button>

              {/* Social Login */}
              <div className="flex items-center gap-4 py-2">
                 <div className="h-px bg-gray-100 flex-1" />
                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hoặc đăng nhập với</span>
                 <div className="h-px bg-gray-100 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-[24px] hover:bg-gray-50 transition-all text-xs font-black text-gray-600">
                    <Chrome className="size-4 text-red-500" /> GOOGLE
                 </button>
                 <button className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-[24px] hover:bg-gray-50 transition-all text-xs font-black text-gray-600">
                    <Facebook className="size-4 text-blue-600 fill-current" /> FACEBOOK
                 </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm font-bold text-gray-400">
                Bạn là người mới?{' '}
                <button onClick={onGoToRegister} className="text-[#5c8d5e] hover:underline font-black">Tạo tài khoản ngay</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
