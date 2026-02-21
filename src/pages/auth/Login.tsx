
import React, { useState } from 'react';
import { AppRole } from '../../types';
import { Facebook } from "lucide-react";

interface LoginProps {
  onLogin: (role: AppRole) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToRegister }) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.BUYER);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-light">
      {/* Left Side: Brand Image Panel - Static background */}
      <div className="hidden lg:block lg:w-1/2 relative h-full shrink-0">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <img 
          alt="Nông sản tươi sạch trong hộp gỗ" 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAw_xXxVDDIwzdg7n_0cCpoahHsxdorA_yeN2hG9i7SiheR_1AB2x3P0ItoJzgOrqPBsP-Std_CyB2X-6LJXRVUTh98oI3GSmmrCGPL1B1N0CnJEnDgMo4t9t-RPv7zIu9SfLOCwvs1jn7Ou2ADuIjsQ4s3G0L5rbQxCX1JG9rnxMBh0mcPDpiUJuK-i--i8PHCjyX6Zje9FnOyhRZSP2zCVs4TLiu_nFT8sYdux441OYF8SOlGU1HxNAFJgIoI2SbjnHNathWZnIl" 
        />
        <div className="absolute inset-0 z-20 p-12 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-xl">
              <span className="material-symbols-outlined text-white text-xl font-bold">eco</span>
            </div>
            <span className="display-font text-2xl font-bold text-white tracking-tight drop-shadow-md">Xấu Mã</span>
          </div>
          <div className="max-w-md">
            <h2 className="display-font text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              Ngon lành, <br/>
              <span className="text-secondary italic">tử tế</span> & <br/>
              tiết kiệm.
            </h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-sm leading-relaxed">
              Đồng hành cùng nông dân Việt Nam giải cứu nông sản "kém sắc" nhưng vẹn nguyên dinh dưỡng.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-background-light h-full overflow-hidden">
        <div className="w-full max-w-md flex flex-col justify-center">
          
          {/* Header - Compact */}
          <div className="mb-6 text-center lg:text-left shrink-0">
            <h1 className="display-font text-4xl font-extrabold text-primary mb-1 tracking-tight">Đăng nhập</h1>
            <p className="text-[#64748b] text-lg font-medium leading-tight">Chào mừng bạn quay trở lại với cộng đồng Xấu Mã.</p>
          </div>

          <form className="space-y-4 shrink-0" onSubmit={(e) => { e.preventDefault(); onLogin(selectedRole); }}>
            
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò:</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { role: AppRole.BUYER, icon: 'person' },
                  { role: AppRole.SHIPPER, icon: 'agriculture' },
                  { role: AppRole.FARMER, icon: 'local_shipping' },
                  { role: AppRole.ADMIN, icon: 'shield' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    title={item.role}
                    onClick={() => setSelectedRole(item.role)}
                    className={`h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      selectedRole === item.role 
                        ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                        : 'border-cream bg-white text-slate-300 hover:border-primary/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl z-10">person</span>
                <input 
                  className="w-full pl-14 pr-5 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 text-base" 
                  placeholder="Email hoặc số điện thoại" 
                  type="text" 
                />
              </div>

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl z-10">lock</span>
                <input 
                  className="w-full pl-14 pr-12 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 text-base" 
                  placeholder="Mật khẩu" 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input className="w-5 h-5 rounded border-cream text-primary focus:ring-primary/20 transition-all cursor-pointer" type="checkbox" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700">Ghi nhớ</span>
              </label>
              <button type="button" className="text-sm font-bold text-primary hover:underline">Quên mật khẩu?</button>
            </div>

            <button 
              className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 text-lg" 
              type="submit"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <div className="relative my-6 text-center shrink-0">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream"></div>
            </div>
            <span className="relative px-4 bg-background-light text-slate-400 text-[10px] font-black italic uppercase tracking-widest">Hoặc đăng nhập với</span>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0">
           <button className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-cream rounded-2xl hover:bg-cream/20 transition-all font-bold text-slate-600 text-base shadow-sm">
             <img
                   src="https://www.svgrepo.com/show/475656/google-color.svg"
                   className="w-5 h-5"
              />
              Google
            </button>

            <button className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-cream rounded-2xl hover:bg-cream/20 transition-all font-bold text-slate-600 text-base shadow-sm">
              Facebook
            </button>
          </div>

          <div className="mt-6 text-center shrink-0">
            <p className="text-base font-bold text-slate-500">
              Chưa có tài khoản?{' '}
              <button 
                onClick={onGoToRegister}
                className="text-primary font-black hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
