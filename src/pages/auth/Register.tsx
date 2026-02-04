
import React, { useState } from 'react';
import { AppRole } from '../../types/index';
import { Leaf, User, Phone, Lock, ArrowRight, ShieldCheck, Chrome, Facebook, Info, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onRegister: (role: AppRole) => void;
  onGoToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onGoToLogin }) => {
  const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.FARMER);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f2f0] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1200px] bg-white rounded-[60px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white animate-in fade-in duration-700">
        
        {/* Left Side: Brand Identity (Consistent with Login) */}
        <div className="w-full md:w-5/12 bg-[#5c8d5e] p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <button onClick={onGoToLogin} className="flex items-center gap-2 text-white/70 hover:text-white mb-10 transition-colors font-black text-xs uppercase tracking-widest">
               <ArrowLeft className="size-4" /> Quay lại
            </button>
            <div className="size-16 bg-white rounded-[20px] flex items-center justify-center text-[#5c8d5e] mb-12 shadow-2xl">
              <Leaf className="size-10 fill-current" />
            </div>
            <h1 className="text-6xl font-black font-display leading-[0.9] mb-4 uppercase tracking-tighter">XẤU MÃ</h1>
            <h2 className="text-5xl font-black text-white/50 font-display leading-tight">Tử Tế Từ Tâm.</h2>
            <p className="mt-10 text-lg text-white/90 font-medium max-w-[280px] leading-relaxed">
              Gia nhập mạng lưới nông sản mộc mạc lớn nhất Việt Nam ngay hôm nay.
            </p>
          </div>
          
          <div className="relative z-10 mt-20 bg-white/10 backdrop-blur-md rounded-[32px] p-8 border border-white/20">
             <p className="text-sm italic font-medium leading-relaxed">
               "Mỗi tài khoản mới là một bước chân gần hơn tới mục tiêu giảm lãng phí thực phẩm và hỗ trợ bà con nông dân."
             </p>
          </div>

          <div className="absolute -bottom-20 -right-20 size-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-7/12 p-10 md:p-16 bg-white overflow-y-auto max-h-screen custom-scrollbar">
          <div className="max-w-[500px] mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">Đăng ký tài khoản</h2>
              <p className="text-gray-400 font-bold text-sm">Chỉ mất 30 giây để trở thành một phần của Xấu Mã.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Role Selection Toggle */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Tôi muốn đăng ký làm:</label>
                <div className="bg-gray-100 p-1.5 rounded-[24px] flex gap-1">
                  <button 
                    onClick={() => setSelectedRole(AppRole.BUYER)}
                    className={`flex-1 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${
                      selectedRole === AppRole.BUYER ? 'bg-white text-[#5c8d5e] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Người mua
                  </button>
                  <button 
                    onClick={() => setSelectedRole(AppRole.FARMER)}
                    className={`flex-1 py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${
                      selectedRole === AppRole.FARMER ? 'bg-white text-[#5c8d5e] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Người bán
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5c8d5e] transition-colors">
                     <User className="size-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Họ và tên của bạn" 
                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-[#5c8d5e]/10 focus:border-[#5c8d5e] outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5c8d5e] transition-colors">
                     <Phone className="size-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Số điện thoại" 
                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-[#5c8d5e]/10 focus:border-[#5c8d5e] outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5c8d5e] transition-colors">
                    <ShieldCheck className="size-5" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Xác nhận" 
                    className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-[#5c8d5e]/10 focus:border-[#5c8d5e] outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>

              {/* KYC Info Box - Farmer only */}
              {selectedRole === AppRole.FARMER && (
                <div className="p-5 bg-orange-50 rounded-[24px] border border-orange-100 flex gap-4 animate-in slide-in-from-top-4 duration-300">
                  <Info className="size-5 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-orange-800 font-bold leading-relaxed">
                    Bạn sẽ cần thực hiện <span className="underline">Xác thực KYC</span> ngay sau bước này để có thể đăng bán sản phẩm.
                  </p>
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group px-2">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 size-5 rounded-lg border-gray-300 text-[#5c8d5e] focus:ring-[#5c8d5e]" 
                />
                <span className="text-xs font-medium text-gray-500 leading-relaxed">
                  Tôi đồng ý với <a href="#" className="text-[#5c8d5e] font-black">Điều khoản dịch vụ</a> và <a href="#" className="text-[#5c8d5e] font-black">Chính sách bảo mật</a>.
                </span>
              </label>

              {/* Action Button */}
              <button 
                onClick={() => onRegister(selectedRole)}
                disabled={!agreed}
                className={`w-full py-5 rounded-[28px] font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl ${
                  agreed ? 'bg-[#5c8d5e] text-white shadow-[#5c8d5e]/20 hover:bg-[#4a724b]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                ĐĂNG KÝ NGAY <ArrowRight className="size-6" />
              </button>

              <div className="flex items-center gap-4 py-2">
                 <div className="h-px bg-gray-100 flex-1" />
                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hoặc đăng ký nhanh qua</span>
                 <div className="h-px bg-gray-100 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 border border-gray-100 rounded-[24px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-black text-[10px] text-gray-600 uppercase tracking-widest">
                  <Chrome className="size-4 text-red-500" /> Google
                </button>
                <button className="py-4 border border-gray-100 rounded-[24px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-black text-[10px] text-gray-600 uppercase tracking-widest">
                  <Facebook className="size-4 text-blue-600 fill-current" /> Facebook
                </button>
              </div>
            </form>

            <div className="mt-12 text-center pb-8">
              <p className="text-sm font-bold text-gray-400">
                Đã có tài khoản?{' '}
                <button onClick={onGoToLogin} className="text-[#5c8d5e] font-black hover:underline">Đăng nhập</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
