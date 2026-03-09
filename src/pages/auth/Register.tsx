import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRole } from '../../types/index';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { authService, otpService } from '../../services';
import OTPVerification from '../../components/auth/OTPVerification';

interface RegisterProps {
  onGoToLogin: () => void;
  onGoToShipperRegister?: () => void;
}

// Reusable compact input component
const InputField = ({
  icon, type = 'text', placeholder, value, onChange, required = false, disabled = false,
}: {
  icon: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean; disabled?: boolean;
}) => (
  <div className="relative group">
    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-350 group-focus-within:text-primary transition-colors text-xl z-10 pointer-events-none select-none">
      {icon}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-0 focus:border-primary transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300 text-[15px]"
    />
  </div>
);

const Register: React.FC<RegisterProps> = ({ onGoToLogin, onGoToShipperRegister }) => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === AppRole.ADMIN) navigate('/admin');
      else if (user.role === AppRole.FARMER) navigate('/farmer');
      else if (user.role === AppRole.SHIPPER) navigate('/shipper');
      else navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

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
  const [farmerStep, setFarmerStep] = useState<1 | 2>(1);

  // Shop Owner specific fields
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [achievementFile, setAchievementFile] = useState<File | null>(null);

  if (showOtpVerification) {
    return (
      <OTPVerification
        email={email}
        onVerified={async () => {
          if (pendingRegistration) {
            setIsLoading(true);
            try {
              const response = await authService.register(
                pendingRegistration.data,
                pendingRegistration.logoFile,
                pendingRegistration.achievementFile
              );
              if (response.result) {
                setSuccess('Đăng ký thành công! Đang chuyển hướng...');
                setTimeout(() => {
                  login(selectedRole);
                  if (selectedRole === AppRole.FARMER) navigate('/kyc');
                  else navigate('/');
                }, 1500);
              }
            } catch (err: any) {
              setError(err?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
              setShowOtpVerification(false);
            } finally {
              setIsLoading(false);
            }
          }
        }}
        onBack={() => { setShowOtpVerification(false); setPendingRegistration(null); }}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Common validations for Step 1
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin'); return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp'); return;
    }
    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự'); return;
    }

    if (selectedRole === AppRole.FARMER) {
      if (farmerStep === 1) {
        setFarmerStep(2);
        return; // Advance to step 2 instead of submitting
      } else {
        // Validation for step 2
        if (!shopName || !address || !bankAccount) {
          setError('Vui lòng điền đầy đủ trường bắt buộc của cửa hàng'); return;
        }
        if (!agreed) {
          setError('Vui lòng đồng ý với điều khoản'); return;
        }
      }
    } else {
      // Buyer validation
      if (!agreed) {
        setError('Vui lòng đồng ý với điều khoản'); return;
      }
    }

    const roleMap: Record<AppRole, string> = {
      [AppRole.BUYER]: 'BUYER',
      [AppRole.FARMER]: 'SHOP_OWNER',
      [AppRole.SHIPPER]: 'SHIPPER',
      [AppRole.ADMIN]: 'ADMIN',
    };

    const registrationData: any = {
      email, password, fullName, phoneNumber: phone, roleName: roleMap[selectedRole],
    };
    if (selectedRole === AppRole.FARMER) {
      registrationData.shopName = shopName;
      registrationData.address = address;
      registrationData.description = description;
      registrationData.bankAccount = bankAccount;
    }

    setPendingRegistration({
      data: registrationData,
      logoFile,
      achievementFile
    });

    setIsLoading(true);
    try {
      await otpService.sendOtp(email);
      setShowOtpVerification(true);
    } catch (err: any) {
      setError(err?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFarmer = selectedRole === AppRole.FARMER;

  return (
    <div className="flex min-h-screen w-full bg-background-light font-sans">

      {/* ── LEFT ── Brand image panel */}
      <div className="hidden lg:block lg:w-1/2 relative h-full shrink-0">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          alt="Nông sản tươi sạch"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAw_xXxVDDIwzdg7n_0cCpoahHsxdorA_yeN2hG9i7SiheR_1AB2x3P0ItoJzgOrqPBsP-Std_CyB2X-6LJXRVUTh98oI3GSmmrCGPL1B1N0CnJEnDgMo4t9t-RPv7zIu9SfLOCwvs1jn7Ou2ADuIjsQ4s3G0L5rbQxCX1JG9rnxMBh0mcPDpiUJuK-i--i8PHCjyX6Zje9FnOyhRZSP2zCVs4TLiu_nFT8sYdux441OYF8SOlGU1HxNAFJgIoI2SbjnHNathWZnIl"
        />
        <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between">
          {/* Top bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="group flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all shadow-lg"
              title="Quay lại"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-xl">eco</span>
            </div>
            <span className="display-font text-xl font-bold text-white drop-shadow-md">Xấu Mã</span>
          </div>
          {/* Bottom tagline */}
          <div className="max-w-sm">
            <h2 className="display-font text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              Ngon lành, <br />
              <span className="text-secondary italic">tử tế</span> & <br />
              tiết kiệm.
            </h2>
            <p className="text-white/85 text-base font-medium drop-shadow-sm leading-relaxed">
              Đồng hành cùng nông dân Việt Nam giải cứu nông sản &ldquo;kém sắc&rdquo; nhưng vẹn nguyên dinh dưỡng.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT ── Registration form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto custom-scrollbar bg-background-light flex flex-col">
        <div className="w-full max-w-[460px] m-auto px-8 py-10 flex-shrink-0">

          {/* Header */}
          <div className="mb-6">
            <h1 className="display-font text-5xl font-extrabold text-primary tracking-tight">Đăng ký</h1>
            <p className="text-slate-500 text-base font-medium mt-1">Bắt đầu hành trình của bạn trên Xấu Mã.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Role selector ── */}
            <div className="grid grid-cols-2 gap-3 relative z-10 transition-transform duration-500" style={{ transform: isFarmer && farmerStep === 2 ? 'translateY(-20px) opacity(0)' : 'none', opacity: isFarmer && farmerStep === 2 ? 0 : 1, pointerEvents: isFarmer && farmerStep === 2 ? 'none' : 'auto', height: isFarmer && farmerStep === 2 ? 0 : 'auto', marginBottom: isFarmer && farmerStep === 2 ? 0 : '1rem' }}>
              {[
                { role: AppRole.BUYER, icon: 'person', label: 'Người mua' },
                { role: AppRole.FARMER, icon: 'storefront', label: 'Người bán' },
              ].map(item => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => { setSelectedRole(item.role); setFarmerStep(1); }}
                  className={`h-13 py-3 rounded-2xl border-2 flex items-center justify-center gap-2.5 transition-all font-bold text-base ${selectedRole === item.role
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-cream bg-white text-slate-400 hover:border-primary/30'
                    }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* ── Error / Success ── */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                <p className="text-xs text-red-600 font-semibold break-words whitespace-pre-wrap">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                <p className="text-xs text-green-600 font-semibold break-words whitespace-pre-wrap">{success}</p>
              </div>
            )}

            {/* MULTI-STEP SLIDER WRAPPER */}
            <div className="overflow-hidden relative w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out items-start"
                style={{
                  width: isFarmer ? '200%' : '100%',
                  transform: isFarmer && farmerStep === 2 ? 'translateX(-50%)' : 'translateX(0%)'
                }}
              >

                {/* ── PART 1: Basic Info ── */}
                <div className="w-full shrink-0 px-1" style={{ width: isFarmer ? '50%' : '100%' }}>
                  <div className="space-y-3">
                    <InputField icon="badge" placeholder="Họ và tên" value={fullName} onChange={setFullName} required disabled={isLoading} />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField icon="mail" type="email" placeholder="Email" value={email} onChange={setEmail} required disabled={isLoading} />
                      <InputField icon="call" placeholder="Số điện thoại" value={phone} onChange={setPhone} required disabled={isLoading} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField icon="lock" type="password" placeholder="Mật khẩu" value={password} onChange={setPassword} required disabled={isLoading} />
                      <InputField icon="verified_user" type="password" placeholder="Xác nhận MK" value={confirmPassword} onChange={setConfirmPassword} required disabled={isLoading} />
                    </div>
                  </div>

                  {/* ── Social login (Buyer only) ── */}
                  {!isFarmer && onGoToShipperRegister && (
                    <div className="space-y-2.5 mt-5">
                      <div className="relative flex items-center gap-3">
                        <div className="h-px bg-cream flex-1" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoặc đăng ký với</span>
                        <div className="h-px bg-cream flex-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-cream rounded-xl hover:bg-cream/30 transition-all font-bold text-slate-600 text-sm">
                          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" /> Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-cream rounded-xl hover:bg-cream/30 transition-all font-bold text-slate-600 text-sm">
                          Facebook
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Buttons Step 1 ── */}
                  <div className="space-y-3 pt-5 w-full">
                    {!isFarmer && (
                      <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-5 h-5 rounded border-cream text-primary focus:ring-primary/20 cursor-pointer" />
                        <span className="text-[15px] font-bold text-slate-500">Tôi đồng ý với <a href="#" className="text-primary hover:underline">Điều khoản</a> &amp; <a href="#" className="text-primary hover:underline">Bảo mật</a></span>
                      </label>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || (!isFarmer && !agreed)}
                      className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 text-base tracking-wide flex items-center justify-center gap-2"
                    >
                      {isFarmer ? (
                        <>THÔNG TIN CỬA HÀNG <span className="material-symbols-outlined text-[22px]">arrow_forward</span></>
                      ) : isLoading ? 'ĐANG TẠO...' : 'TẠO TÀI KHOẢN'}
                    </button>

                    {/* ── Shipper CTA Banner ── */}
                    {onGoToShipperRegister && (
                      <button
                        type="button"
                        onClick={onGoToShipperRegister}
                        className="mt-2 w-full group flex items-center gap-4 rounded-2xl border-2 border-cream bg-white px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all hover:scale-[1.005] active:scale-[0.99] shadow-sm text-left"
                      >
                        {/* Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-xl">two_wheeler</span>
                        </div>
                        {/* Text */}
                        <div className="flex-1">
                          <p className="text-sm font-extrabold text-slate-700 leading-tight">Trở thành Shipper của Xấu Mã</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">Thu nhập 8 – 15 triệu/tháng · Chủ động giờ làm</p>
                        </div>
                        {/* Arrow */}
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary text-xl group-hover:translate-x-1 transition-all shrink-0">arrow_forward</span>
                      </button>
                    )}

                    {/* Footer link in Step 1 */}
                    <p className="mt-4 text-center text-[15px] font-bold text-slate-500">
                      Đã có tài khoản?{' '}
                      <button type="button" onClick={onGoToLogin} className="text-primary font-black hover:underline">
                        Đăng nhập
                      </button>
                    </p>
                  </div>
                </div>

                {/* ── PART 2: Shop Info (FARMER only) ── */}
                {isFarmer && (
                  <div className="w-1/2 shrink-0 px-1 opacity-100 transition-opacity">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">storefront</span>
                          Thông tin cửa hàng
                        </p>
                        <button type="button" onClick={() => setFarmerStep(1)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">edit</span> Sửa hồ sơ
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <InputField icon="storefront" placeholder="Tên nông trại / cửa hàng *" value={shopName} onChange={setShopName} required={isFarmer && farmerStep === 2} disabled={isLoading} />
                        <InputField icon="account_balance_wallet" placeholder="Số tài khoản NH *" value={bankAccount} onChange={setBankAccount} required={isFarmer && farmerStep === 2} disabled={isLoading} />
                      </div>

                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-350 group-focus-within:text-primary transition-colors text-xl z-10 pointer-events-none">location_on</span>
                        <input type="text" placeholder="Địa chỉ chi tiết (điểm lấy hàng) *" value={address} onChange={e => setAddress(e.target.value)} required={isFarmer && farmerStep === 2} disabled={isLoading} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-0 focus:border-primary transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300 text-[15px]" />
                      </div>

                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-350 group-focus-within:text-primary transition-colors text-xl z-10 pointer-events-none">description</span>
                        <input type="text" placeholder="Mô tả ngắn về nông trại (không bắt buộc)" value={description} onChange={e => setDescription(e.target.value)} disabled={isLoading} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-0 focus:border-primary transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300 text-[15px]" />
                      </div>

                      {/* File Uploads */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input type="file" id="logoUpload" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 30 * 1024 * 1024) {
                                setError('Ảnh Logo không được vượt quá 30MB');
                                e.target.value = '';
                                setLogoFile(null);
                                return;
                              }
                              setError(null); // Clear previous errors if the file is valid
                              setLogoFile(file);
                            }
                          }} className="hidden" disabled={isLoading} />
                          <label htmlFor="logoUpload" className={`block p-2 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-all h-full min-h-[72px] ${logoFile ? 'border-primary bg-primary/5' : 'border-cream hover:border-primary/50 hover:bg-slate-50'} ${isLoading ? 'opacity-50' : ''}`}>
                            <span className={`material-symbols-outlined text-xl ${logoFile ? 'text-primary' : 'text-slate-400'}`}>{logoFile ? 'check_circle' : 'add_photo_alternate'}</span>
                            <span className="text-[11px] font-bold text-slate-500 text-center leading-tight">{logoFile ? 'Đã tải ảnh Logo' : 'Ảnh đại diện (Tùy chọn)'}</span>
                          </label>
                        </div>
                        <div>
                          <input type="file" id="achievementUpload" accept="image/*, application/pdf" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 30 * 1024 * 1024) {
                                setError('File chứng chỉ không được vượt quá 30MB');
                                e.target.value = '';
                                setAchievementFile(null);
                                return;
                              }
                              setError(null); // Clear previous errors if the file is valid
                              setAchievementFile(file);
                            }
                          }} className="hidden" disabled={isLoading} />
                          <label htmlFor="achievementUpload" className={`block p-2 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-all h-full min-h-[72px] ${achievementFile ? 'border-primary bg-primary/5' : 'border-cream hover:border-primary/50 hover:bg-slate-50'} ${isLoading ? 'opacity-50' : ''}`}>
                            <span className={`material-symbols-outlined text-xl ${achievementFile ? 'text-primary' : 'text-slate-400'}`}>{achievementFile ? 'check_circle' : 'workspace_premium'}</span>
                            <span className="text-[11px] font-bold text-slate-500 text-center leading-tight px-1">{achievementFile ? 'Đã tải chứng chỉ' : 'Chứng chỉ VietGAP / Hữu cơ'}</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-orange-50 border-2 border-orange-100 rounded-2xl">
                        <span className="material-symbols-outlined text-orange-500 text-xl shrink-0">info</span>
                        <p className="text-sm text-orange-800 font-bold">Hồ sơ có chứng chỉ sẽ được duyệt nhanh hơn</p>
                      </div>

                      {/* ── Buttons Step 2 ── */}
                      <div className="space-y-3 pt-3 flex flex-col">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-5 h-5 rounded border-cream text-primary focus:ring-primary/20 cursor-pointer" />
                          <span className="text-[15px] font-bold text-slate-500">Tôi đồng ý với <a href="#" className="text-primary hover:underline">Điều khoản</a> &amp; <a href="#" className="text-primary hover:underline">Bảo mật</a></span>
                        </label>
                        <div className="flex gap-3 w-full">
                          <button type="button" onClick={() => setFarmerStep(1)} className="px-5 py-4 bg-white border-2 border-cream text-slate-500 font-extrabold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                          </button>
                          <button type="submit" disabled={!agreed || isLoading} className="flex-1 py-4 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 text-base tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'ĐANG TẠO...' : <>TẠO TÀI KHOẢN <span className="material-symbols-outlined text-[22px]">check_circle</span></>}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;