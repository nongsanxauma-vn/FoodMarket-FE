import React, { useState } from 'react';
import { AppRole } from '../../types/index';
import { Leaf, User, Phone, Lock, ArrowRight, ShieldCheck, Chrome, Facebook, Info, ArrowLeft, Bike } from 'lucide-react';
import { authService } from '../../services';
import OTPVerification from '../../components/auth/OTPVerification';

interface RegisterProps {
  onRegister: (role: AppRole) => void;
  onGoToLogin: () => void;
  onGoToShipperRegister?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onGoToLogin, onGoToShipperRegister }) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.FARMER);
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<any>(null);

  // Nếu đang ở bước OTP verification
  if (showOtpVerification) {
    return (
      <OTPVerification
        email={email}
        onVerified={async () => {
          // Sau khi verify OTP thành công, thực hiện đăng ký
          if (pendingRegistration) {
            setIsLoading(true);
            try {
              const response = await authService.register(pendingRegistration);
              
              if (response.result) {
                setSuccess('Đăng ký thành công! Đang chuyển hướng...');
                setTimeout(() => {
                  onRegister(selectedRole);
                }, 1500);
              }
            } catch (err: any) {
              console.error('Register failed:', err);
              setError(err?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
              setShowOtpVerification(false);
            } finally {
              setIsLoading(false);
            }
          }
        }}
        onBack={() => {
          setShowOtpVerification(false);
          setPendingRegistration(null);
        }}
      />
    );
  }

  return (
    <div className="h-screen bg-[#f8faf8] flex items-center justify-center p-4 overflow-hidden font-sans">
      <div className="w-full max-w-[1000px] h-[min(95vh,750px)] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex border border-gray-100">
        
        {/* Left Side: Brand Identity */}
        <div className="hidden md:flex w-[380px] bg-[#5c8d5e] p-10 text-white flex-col justify-between relative shrink-0">
          <div className="relative z-10">
            <button 
              onClick={onGoToLogin} 
              className="group flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Quay lại
            </button>
            <div className="size-12 bg-white rounded-xl flex items-center justify-center text-[#5c8d5e] mb-6 shadow-xl">
              <Leaf className="size-7 fill-current" />
            </div>
            <h1 className="text-4xl font-black leading-none mb-2 tracking-tight">XẤU MÃ</h1>
            <h2 className="text-3xl font-bold text-white/40 leading-none mb-4">Tử tế từ tâm.</h2>
            <p className="text-sm text-white/80 font-medium max-w-[240px] leading-relaxed">
              Gia nhập mạng lưới nông sản mộc mạc lớn nhất Việt Nam.
            </p>
          </div>
          
          {/* Shipper CTA */}
          {onGoToShipperRegister && (
            <button
              onClick={onGoToShipperRegister}
              className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all group text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Bike className="size-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-white">Đăng ký Shipper</span>
              </div>
              <p className="text-xs text-white/70 font-medium">Thu nhập 8-12tr/tháng</p>
            </button>
          )}

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-3xl" />
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-[440px] mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">Tạo tài khoản</h2>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Bắt đầu hành trình của bạn</p>
              </div>

              <form className="space-y-3.5" onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSuccess(null);
                
                // Validation
                if (!fullName || !email || !phone || !password || !confirmPassword) {
                  setError('Vui lòng điền đầy đủ thông tin');
                  return;
                }
                
                if (password !== confirmPassword) {
                  setError('Mật khẩu xác nhận không khớp');
                  return;
                }
                
                if (password.length < 8) {
                  setError('Mật khẩu phải có ít nhất 8 ký tự');
                  return;
                }
                
                if (!agreed) {
                  setError('Vui lòng đồng ý với điều khoản và chính sách');
                  return;
                }
                
                // Chuẩn bị dữ liệu đăng ký
                const roleMap: Record<AppRole, 'BUYER' | 'SHOP_OWNER' | 'SHIPPER' | 'ADMIN'> = {
                  [AppRole.BUYER]: 'BUYER',
                  [AppRole.FARMER]: 'SHOP_OWNER',
                  [AppRole.SHIPPER]: 'SHIPPER',
                  [AppRole.ADMIN]: 'ADMIN',
                };
                
                const registrationData = {
                  email,
                  password,
                  fullName,
                  phoneNumber: phone,
                  roleName: roleMap[selectedRole],
                };
                
                // Lưu dữ liệu và chuyển sang bước OTP
                setPendingRegistration(registrationData);
                setShowOtpVerification(true);
              }}>
                {/* Role Selection */}
                <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
                  {( [ [AppRole.BUYER, 'Người mua'], [AppRole.FARMER, 'Người bán'] ] as const).map(([role, label]) => (
                    <button 
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                        selectedRole === role ? 'bg-white text-[#5c8d5e] shadow-sm' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-xs text-red-600 font-semibold">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs text-green-600 font-semibold">{success}</p>
                  </div>
                )}

                {/* Input Fields - Compact Layout */}
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Họ và tên" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#5c8d5e] focus:ring-2 focus:ring-[#5c8d5e]/10 outline-none text-sm font-semibold transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#5c8d5e] focus:ring-2 focus:ring-[#5c8d5e]/10 outline-none text-sm font-semibold transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Số điện thoại" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#5c8d5e] focus:ring-2 focus:ring-[#5c8d5e]/10 outline-none text-sm font-semibold transition-all"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Mật khẩu" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#5c8d5e] outline-none text-sm font-semibold transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Xác nhận" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#5c8d5e] outline-none text-sm font-semibold transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* KYC Notice - Only for Farmer */}
                {selectedRole === AppRole.FARMER && (
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex gap-2.5">
                    <Info className="size-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-800 font-semibold leading-snug">
                      Cần xác thực KYC để bắt đầu bán hàng
                    </p>
                  </div>
                )}

                {/* Terms Agreement */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-gray-300 text-[#5c8d5e] focus:ring-[#5c8d5e]" 
                  />
                  <span className="text-xs font-medium text-gray-500 leading-tight">
                    Tôi đồng ý với <a href="#" className="text-[#5c8d5e] font-bold">Điều khoản</a> và <a href="#" className="text-[#5c8d5e] font-bold">Bảo mật</a>
                  </span>
                </label>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={!agreed || isLoading}
                  className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    agreed && !isLoading ? 'bg-[#5c8d5e] text-white shadow-lg shadow-[#5c8d5e]/20 hover:bg-[#4a724b]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'ĐANG TẠO...' : 'TẠO TÀI KHOẢN'} <ArrowRight className="size-4" />
                </button>

                {/* Social Login */}
                <div className="relative flex items-center gap-4 py-1">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Hoặc</span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-xs text-gray-600">
                    <Chrome className="size-3.5 text-red-500" /> Google
                  </button>
                  <button type="button" className="py-2.5 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-xs text-gray-600">
                    <Facebook className="size-3.5 text-blue-600 fill-current" /> Facebook
                  </button>
                </div>
              </form>

              {/* Footer Links */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-xs font-bold text-gray-400">
                  Đã có tài khoản?{' '}
                  <button onClick={onGoToLogin} className="text-[#5c8d5e] font-black hover:underline">Đăng nhập</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;