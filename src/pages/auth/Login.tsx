import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRole, KYCStatus } from '../../types';
import { Facebook } from "lucide-react";
import { authService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onGoToRegister: () => void;
  onForgotPassword?: () => void;
}

const Login: React.FC<LoginProps> = ({ onGoToRegister, onForgotPassword }) => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.BUYER);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === AppRole.ADMIN) navigate('/admin');
      else if (user.role === AppRole.FARMER) navigate('/farmer');
      else if (user.role === AppRole.SHIPPER) navigate('/shipper');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = () => {
    // ...
    const backendOAuthUrl = `http://localhost:8080/api/v1/oauth2/authorization/google?role=${selectedRole === AppRole.FARMER ? 'SHOP_OWNER' : selectedRole}`;
    window.location.href = backendOAuthUrl;
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] w-full bg-background-light">
      {/* Left Side: Brand Image Panel - Static background */}
      <div className="hidden lg:block lg:w-1/2 relative h-full shrink-0">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <img
          alt="Nông sản tươi sạch trong hộp gỗ"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://moitruong.net.vn/rau-cu-ptag.html"
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
              Ngon lành, <br />
              <span className="text-secondary italic">tử tế</span> & <br />
              tiết kiệm.
            </h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-sm leading-relaxed">
              Đồng hành cùng nông dân Việt Nam giải cứu nông sản "kém sắc" nhưng vẹn nguyên dinh dưỡng.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-background-light h-full overflow-y-auto">
        <div className="w-full max-w-md flex flex-col justify-center">

          {/* Header - Compact */}
          <div className="mb-4 text-center lg:text-left shrink-0">
            <h1 className="display-font text-3xl font-extrabold text-primary mb-0.5 tracking-tight">Đăng nhập</h1>
            <p className="text-[#64748b] text-base font-medium leading-tight">Chào mừng bạn quay trở lại với cộng đồng Xấu Mã.</p>
          </div>

          <form className="space-y-4 shrink-0" onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setIsLoading(true);

            try {
              const response = await authService.login({ email, password });

              if (response.result?.authenticated) {
                const userInfo = await authService.getMyInfo();

                if (userInfo.result) {
                  const roleMap: Record<string, AppRole> = {
                    'BUYER': AppRole.BUYER,
                    'SHOP_OWNER': AppRole.FARMER,
                    'SHIPPER': AppRole.SHIPPER,
                    'ADMIN': AppRole.ADMIN,
                  };

                  const userRole = roleMap[userInfo.result.role?.name || 'BUYER'] || AppRole.BUYER;
                  login(userRole);

                  // Navigate based on role & status
                  if (userRole === AppRole.ADMIN) navigate('/admin');
                  else if (userRole === AppRole.FARMER) {
                    if (userInfo.result.status === 'PENDING') navigate('/kyc');
                    else navigate('/farmer');
                  }
                  else if (userRole === AppRole.SHIPPER) {
                    if (userInfo.result.status === 'PENDING') navigate('/kyc');
                    else navigate('/shipper');
                  }
                  else navigate('/');
                }
              }
            } catch (err: any) {
              console.error('Login failed:', err);
              setError(err?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
            } finally {
              setIsLoading(false);
            }
          }}>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò:</label>
              <div className="grid grid-cols-4 gap-2">
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
                    className={`h-10 rounded-xl border-2 flex items-center justify-center transition-all ${selectedRole === item.role
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-cream bg-white text-slate-300 hover:border-primary/30'
                      }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs text-red-600 font-semibold">{error}</p>
                </div>
              )}

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg z-10">person</span>
                <input
                  className="w-full pl-12 pr-5 py-3 rounded-xl border-2 border-cream bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg z-10">lock</span>
                <input
                  className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-cream bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                  placeholder="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input className="w-5 h-5 rounded border-cream text-primary focus:ring-primary/20 transition-all cursor-pointer" type="checkbox" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700">Ghi nhớ</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-bold text-primary hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              className="w-full py-3.5 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div className="relative my-4 text-center shrink-0">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream"></div>
            </div>
            <span className="relative px-4 bg-background-light text-slate-400 text-[9px] font-black italic uppercase tracking-widest">Hoặc</span>
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-cream rounded-2xl hover:bg-cream/20 transition-all font-bold text-slate-600 text-base shadow-sm disabled:opacity-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>

            <button type="button" className="flex items-center justify-center gap-2.5 px-4 py-3 bg-white border-2 border-cream rounded-2xl hover:bg-cream/20 transition-all font-bold text-slate-600 text-base shadow-sm">
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
        </div >
      </div >
    </div >
  );
};

export default Login;
