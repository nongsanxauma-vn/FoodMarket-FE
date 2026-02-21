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
    <div className="h-screen bg-[#f8faf8] flex items-center justify-center p-0 md:p-4 lg:p-6 overflow-hidden font-sans">
      <div className="w-full max-w-[1100px] h-full md:h-[min(90vh,800px)] bg-white md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Brand Identity (Pinned) */}
        <div className="hidden md:flex w-5/12 bg-[#5c8d5e] p-10 lg:p-14 text-white flex-col justify-between relative">
          <div className="relative z-10">
            <button 
              onClick={onGoToLogin} 
              className="group flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Quay lại đăng nhập
            </button>
            <div className="size-14 bg-white rounded-2xl flex items-center justify-center text-[#5c8d5e] mb-8 shadow-xl">
              <Leaf className="size-8 fill-current" />
            </div>
            <h1 className="text-5xl font-black leading-none mb-2 tracking-tighter">XẤU MÃ</h1>
            <h2 className="text-4xl font-bold text-white/40 leading-none mb-6">Tử tế từ tâm.</h2>
            <p className="text-base text-white/80 font-medium max-w-[240px] leading-relaxed">
              Gia nhập mạng lưới nông sản mộc mạc lớn nhất Việt Nam.
            </p>
          </div>
          
          <div className="relative z-10 bg-black/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <p className="text-xs italic font-light leading-relaxed opacity-90">
              "Mỗi tài khoản mới là một bước chân gần hơn tới mục tiêu giảm lãng phí thực phẩm và hỗ trợ bà con."
            </p>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-3xl" />
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-7/12 h-full bg-white flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-[420px] mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">Tạo tài khoản</h2>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Bắt đầu hành trình của bạn</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Role Selection */}
                <div className="bg-gray-100 p-1 rounded-2xl flex gap-1">
                  {( [ [AppRole.BUYER, 'Người mua'], [AppRole.FARMER, 'Người bán'] ] as const).map(([role, label]) => (
                    <button 
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                        selectedRole === role ? 'bg-white text-[#5c8d5e] shadow-sm' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Input Fields - Optimized Height */}
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Họ và tên" 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#5c8d5e] focus:ring-4 focus:ring-[#5c8d5e]/5 outline-none text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Số điện thoại" 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#5c8d5e] focus:ring-4 focus:ring-[#5c8d5e]/5 outline-none text-sm font-semibold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Mật khẩu" 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#5c8d5e] outline-none text-sm font-semibold transition-all"
                      />
                    </div>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Xác nhận" 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#5c8d5e] outline-none text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* KYC Tooltip */}
                {selectedRole === AppRole.FARMER && (
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex gap-3 animate-in fade-in slide-in-from-top-2">
                    <Info className="size-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-orange-800 font-bold leading-snug">
                      Bạn cần thực hiện <span className="underline">xác thực KYC</span> để bắt đầu đăng bán sản phẩm.
                    </p>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer py-1">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-gray-300 text-[#5c8d5e] focus:ring-[#5c8d5e]" 
                  />
                  <span className="text-[11px] font-medium text-gray-500 leading-tight">
                    Tôi đồng ý với <a href="#" className="text-[#5c8d5e] font-bold">Điều khoản</a> và <a href="#" className="text-[#5c8d5e] font-bold">Bảo mật</a>.
                  </span>
                </label>

                <button 
                  onClick={() => onRegister(selectedRole)}
                  disabled={!agreed}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    agreed ? 'bg-[#5c8d5e] text-white shadow-lg shadow-[#5c8d5e]/20 hover:bg-[#4a724b]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  TẠO TÀI KHOẢN <ArrowRight className="size-4" />
                </button>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="h-px bg-gray-100 flex-1" />
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Hoặc</span>
                  <div className="h-px bg-gray-100 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="py-3 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-[10px] text-gray-600 uppercase tracking-wider">
                    <Chrome className="size-3 text-red-500" /> Google
                  </button>
                  <button type="button" className="py-3 border border-gray-100 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-[10px] text-gray-600 uppercase tracking-wider">
                    <Facebook className="size-3 text-blue-600 fill-current" /> Facebook
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs font-bold text-gray-400">
                  Đã có tài khoản?{' '}
                  <button onClick={onGoToLogin} className="text-[#5c8d5e] font-black hover:underline">Đăng nhập ngay</button>
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