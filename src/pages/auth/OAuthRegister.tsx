import React, { useState, useEffect } from 'react';
import { AppRole } from '../../types';
import { ArrowLeft, CheckCircle, Store, User, Truck, ShieldAlert } from 'lucide-react';
import { authService, otpService } from '../../services';
import OTPVerification from '../../components/auth/OTPVerification';

interface OAuthRegisterProps {
    onRegisterSuccess: (role: AppRole) => void;
    onGoToLogin: () => void;
}

const InputField = ({
    icon, type = 'text', placeholder, value, onChange, required = false, disabled = false, readOnly = false
}: {
    icon: string; type?: string; placeholder: string; value: string;
    onChange?: (v: string) => void; required?: boolean; disabled?: boolean; readOnly?: boolean;
}) => (
    <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-350 group-focus-within:text-primary transition-colors text-xl z-10 pointer-events-none select-none">
            {icon}
        </span>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange && onChange(e.target.value)}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-0 focus:border-primary transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300 text-[15px] ${readOnly ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
        />
    </div>
);

const OAuthRegister: React.FC<OAuthRegisterProps> = ({ onRegisterSuccess, onGoToLogin }) => {
    const [selectedRole, setSelectedRole] = useState<AppRole>(AppRole.BUYER);
    const [agreed, setAgreed] = useState(false);

    // Base fields pre-filled from Google
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [phone, setPhone] = useState('');

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [pendingRegistration, setPendingRegistration] = useState<any>(null);

    // Shop Owner specific fields
    const [shopName, setShopName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [achievementFile, setAchievementFile] = useState<File | null>(null);

    // Shipper specific fields
    const [city, setCity] = useState('');
    const [vehicleType, setVehicleType] = useState('motorbike');
    const [licensePlate, setLicensePlate] = useState('');
    const [driverLicense, setDriverLicense] = useState('');
    const [shipperBankName, setShipperBankName] = useState('');
    const [shipperBankAccount, setShipperBankAccount] = useState('');
    const [shipperBankAccountName, setShipperBankAccountName] = useState('');
    const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
    const [portraitFile, setPortraitFile] = useState<File | null>(null);

    // Extract query params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get('email');
        const urlName = params.get('name');
        const urlAvatar = params.get('avatar');
        const urlRole = params.get('role');

        if (urlEmail) setEmail(urlEmail);
        if (urlName) setFullName(urlName);
        if (urlAvatar) setAvatar(urlAvatar);

        if (urlRole) {
            const roleMap: Record<string, AppRole> = {
                'BUYER': AppRole.BUYER,
                'SHOP_OWNER': AppRole.FARMER,
                'SHIPPER': AppRole.SHIPPER
            };
            const parsedRole = roleMap[urlRole.toUpperCase()];
            if (parsedRole) setSelectedRole(parsedRole);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic Validation
        if (!fullName || !email || !phone) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc'); return;
        }
        if (!agreed) {
            setError('Vui lòng đồng ý với điều khoản dịch vụ'); return;
        }

        const roleMap: Record<AppRole, string> = {
            [AppRole.BUYER]: 'BUYER',
            [AppRole.FARMER]: 'SHOP_OWNER',
            [AppRole.SHIPPER]: 'SHIPPER',
            [AppRole.ADMIN]: 'ADMIN',
        };

        // Prepare Registration Data
        // Generate a random strong password for the user since they log in via Google
        const randomPassword = Math.random().toString(36).slice(-10) + "A1@";

        const registrationData: any = {
            email,
            password: randomPassword,
            fullName,
            phoneNumber: phone,
            roleName: roleMap[selectedRole],
            logoUrl: avatar // Pass google avatar URL by default if no file uploaded
        };

        // Role-specific validation and data formatting
        if (selectedRole === AppRole.FARMER) {
            if (!shopName || !address || !bankAccount) {
                setError('Vui lòng điền đầy đủ thông tin cửa hàng'); return;
            }
            registrationData.shopName = shopName;
            registrationData.address = address;
            registrationData.description = description;
            registrationData.bankAccount = bankAccount;
        } else if (selectedRole === AppRole.SHIPPER) {
            if (!licensePlate || !driverLicense || !address || !city || !shipperBankName || !shipperBankAccount || !shipperBankAccountName) {
                setError('Vui lòng điền đầy đủ thông tin giao hàng'); return;
            }
            if (!driverLicenseFile || !portraitFile) {
                setError('Vui lòng tải lên đầy đủ giấy tờ hợp lệ'); return;
            }

            const descriptionStr = `Loại xe: ${vehicleType === 'motorbike' ? 'Xe máy' : 'Ô tô'}. ` +
                `Thành phố: ${city}. ` +
                `Ngân hàng: ${shipperBankName} - ${shipperBankAccount} - ${shipperBankAccountName}`;

            registrationData.license = driverLicense;
            registrationData.vehicleNumber = licensePlate;
            registrationData.address = address;
            registrationData.description = descriptionStr;
        }

        setPendingRegistration({
            data: registrationData,
            logoFile: selectedRole === AppRole.FARMER ? logoFile : portraitFile, // Use portraitFile instead of logoFile for shipper API
            achievementFile: selectedRole === AppRole.FARMER ? achievementFile : driverLicenseFile // Use driverLicenseFile instead of achievementFile for shipper API
        });

        setIsLoading(true);
        try {
            await otpService.sendOtp(email);
            setShowOtpVerification(true);
        } catch (err: any) {
            setError(err?.data?.message || 'Không thể gửi mã xác nhận. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

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
                                // Auto-login after registration
                                try {
                                    const loginResponse = await authService.login({
                                        email: email,
                                        password: pendingRegistration.data.password
                                    });

                                    if (loginResponse.result?.token) {
                                        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
                                        setTimeout(() => {
                                            // Clear URL params
                                            window.history.replaceState({}, document.title, "/nong_san_xau_ma/");
                                            onRegisterSuccess(selectedRole);
                                        }, 1000);
                                    } else {
                                        // If login fails for some reason but registration succeeded
                                        onGoToLogin();
                                    }
                                } catch (loginErr) {
                                    console.error("Auto-login failed:", loginErr);
                                    onGoToLogin();
                                }
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

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background-light font-sans">
            {/* ── LEFT ── Brand image panel */}
            <div className="hidden lg:block lg:w-1/2 relative h-full shrink-0">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    alt="Nông sản tươi sạch"
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80"
                />
                <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onGoToLogin} className="group flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all shadow-lg">
                            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-xl">eco</span>
                        </div>
                        <span className="display-font text-xl font-bold text-white drop-shadow-md">Xấu Mã</span>
                    </div>
                    <div className="max-w-sm">
                        <h2 className="display-font text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                            Hoàn tất <br /> hồ sơ của bạn
                        </h2>
                        <p className="text-white/85 text-base font-medium drop-shadow-sm leading-relaxed">
                            Tài khoản Google của bạn đã được xác thực thành công. Vui lòng bổ sung một số thông tin để gia nhập cộng đồng Xấu Mã.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT ── Registration form */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto custom-scrollbar bg-background-light flex flex-col">
                <div className="w-full max-w-[500px] m-auto px-8 py-10 flex-shrink-0">

                    <div className="mb-8 flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                        <div className="relative">
                            <img src={avatar || `https://ui-avatars.com/api/?name=${fullName}&background=random`} className="size-14 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight">{fullName}</p>
                            <p className="text-sm font-medium text-gray-500">{email}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h1 className="display-font text-3xl font-extrabold text-primary tracking-tight">Chọn vai trò của bạn</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Xác định cách bạn sẽ tham gia vào nền tảng.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ── Role selector ── */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { role: AppRole.BUYER, icon: <User className="size-5 mb-1" />, label: 'Người mua' },
                                { role: AppRole.FARMER, icon: <Store className="size-5 mb-1" />, label: 'Nhà vườn' },
                                { role: AppRole.SHIPPER, icon: <Truck className="size-5 mb-1" />, label: 'Shipper' },
                            ].map(item => (
                                <button
                                    key={item.role}
                                    type="button"
                                    onClick={() => setSelectedRole(item.role)}
                                    className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${selectedRole === item.role
                                        ? 'border-primary bg-primary/10 text-primary shadow-sm scale-[1.02]'
                                        : 'border-cream bg-white text-slate-400 hover:border-primary/30'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-bold text-[13px] text-center leading-tight">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                                <ShieldAlert className="size-5 text-red-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3">
                                <CheckCircle className="size-5 text-green-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-green-700 font-medium leading-relaxed">{success}</p>
                            </div>
                        )}

                        {/* Default Info - All Roles */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Thông tin cá nhân</h3>
                            <div className="space-y-3">
                                <InputField icon="person" placeholder="Họ và tên" value={fullName} onChange={setFullName} required disabled={isLoading} />

                                <div className="grid grid-cols-2 gap-3">
                                    <InputField icon="mail" type="email" placeholder="Email" value={email} readOnly disabled={isLoading} />
                                    <InputField icon="call" placeholder="Số điện thoại *" value={phone} onChange={setPhone} required disabled={isLoading} />
                                </div>
                            </div>
                        </div>

                        {/* Farmer Specific Fields */}
                        {selectedRole === AppRole.FARMER && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mt-6">Thông tin Cửa hàng / Nông trại</h3>
                                <div className="space-y-3">
                                    <InputField icon="store" placeholder="Tên cửa hàng/nông trại *" value={shopName} onChange={setShopName} required disabled={isLoading} />
                                    <InputField icon="location_on" placeholder="Địa chỉ chi tiết *" value={address} onChange={setAddress} required disabled={isLoading} />
                                    <InputField icon="account_balance_wallet" placeholder="Số Tải khoản ngân hàng *" value={bankAccount} onChange={setBankAccount} required disabled={isLoading} />
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-4 text-slate-350 z-10">description</span>
                                        <textarea placeholder="Mô tả ngắn" value={description} onChange={e => setDescription(e.target.value)} disabled={isLoading} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-cream bg-white focus:ring-0 focus:border-primary transition-all outline-none font-semibold text-slate-700 resize-none h-24 text-[15px]" />
                                    </div>

                                    {/* File Uploads for Farmer */}
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <div>
                                            <input type="file" id="logoUpload" accept="image/*" onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 30 * 1024 * 1024) { setError('Ảnh Logo không được vượt quá 30MB'); e.target.value = ''; setLogoFile(null); return; }
                                                    setError(null); setLogoFile(file);
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
                                                    if (file.size > 30 * 1024 * 1024) { setError('File chứng chỉ không được vượt quá 30MB'); e.target.value = ''; setAchievementFile(null); return; }
                                                    setError(null); setAchievementFile(file);
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

                                </div>
                            </div>
                        )}

                        {/* Shipper Specific Fields */}
                        {selectedRole === AppRole.SHIPPER && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mt-6">Thông tin Giao hàng</h3>
                                <div className="space-y-3">
                                    <select value={city} onChange={(e) => setCity(e.target.value)} required disabled={isLoading} className="w-full px-4 py-3.5 bg-white border-2 border-cream rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-semibold text-slate-700 cursor-pointer">
                                        <option value="">Chọn Tỉnh/Thành phố *</option>
                                        <option value="hcm">TP. Hồ Chí Minh</option>
                                        <option value="hn">Hà Nội</option>
                                        <option value="dn">Đà Nẵng</option>
                                    </select>
                                    <InputField icon="home" placeholder="Địa chỉ thường trú *" value={address} onChange={setAddress} required disabled={isLoading} />

                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                        {[{ value: 'motorbike', label: 'Xe máy', icon: '🏍️' }, { value: 'car', label: 'Ô tô', icon: '🚗' }].map((type) => (
                                            <button key={type.value} onClick={() => setVehicleType(type.value)} type="button" disabled={isLoading} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${vehicleType === type.value ? 'border-primary bg-primary/10 shadow-sm text-primary' : 'border-cream bg-white text-slate-400 hover:border-primary/30'}`}>
                                                <span className="text-2xl">{type.icon}</span>
                                                <span className="text-sm font-bold">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <InputField icon="two_wheeler" placeholder="Biển số xe *" value={licensePlate} onChange={setLicensePlate} required disabled={isLoading} />
                                    <InputField icon="badge" placeholder="Số giấy phép lái xe (GPLX) *" value={driverLicense} onChange={setDriverLicense} required disabled={isLoading} />

                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <div>
                                            <input type="file" id="driverLicenseUpload" accept="image/*" onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) setDriverLicenseFile(e.target.files[0]);
                                            }} className="hidden" disabled={isLoading} />
                                            <label htmlFor="driverLicenseUpload" className={`block p-2 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-all h-full min-h-[72px] ${driverLicenseFile ? 'border-primary bg-primary/5' : 'border-cream hover:border-primary/50 hover:bg-slate-50'} ${isLoading ? 'opacity-50' : ''}`}>
                                                <span className={`material-symbols-outlined text-xl ${driverLicenseFile ? 'text-primary' : 'text-slate-400'}`}>{driverLicenseFile ? 'check_circle' : 'camera_alt'}</span>
                                                <span className="text-[11px] font-bold text-slate-500 text-center leading-tight">{driverLicenseFile ? 'Đã tải bằng lái' : 'Chụp Bằng lái xe'}</span>
                                            </label>
                                        </div>
                                        <div>
                                            <input type="file" id="portraitUpload" accept="image/*" onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) setPortraitFile(e.target.files[0]);
                                            }} className="hidden" disabled={isLoading} />
                                            <label htmlFor="portraitUpload" className={`block p-2 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-all h-full min-h-[72px] ${portraitFile ? 'border-primary bg-primary/5' : 'border-cream hover:border-primary/50 hover:bg-slate-50'} ${isLoading ? 'opacity-50' : ''}`}>
                                                <span className={`material-symbols-outlined text-xl ${portraitFile ? 'text-primary' : 'text-slate-400'}`}>{portraitFile ? 'check_circle' : 'face'}</span>
                                                <span className="text-[11px] font-bold text-slate-500 text-center leading-tight px-1">{portraitFile ? 'Đã tải chân dung' : 'Ảnh chân dung'}</span>
                                            </label>
                                        </div>
                                    </div>

                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 mt-6">Thông tin Thanh toán</h3>
                                    <select value={shipperBankName} onChange={(e) => setShipperBankName(e.target.value)} required disabled={isLoading} className="w-full px-4 py-3.5 bg-white border-2 border-cream rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-semibold text-slate-700 cursor-pointer">
                                        <option value="">Chọn ngân hàng *</option>
                                        <option value="vcb">Vietcombank</option>
                                        <option value="tcb">Techcombank</option>
                                        <option value="mb">MB Bank</option>
                                        <option value="acb">ACB</option>
                                        <option value="bidv">BIDV</option>
                                    </select>
                                    <InputField icon="credit_card" placeholder="Số tài khoản *" value={shipperBankAccount} onChange={setShipperBankAccount} required disabled={isLoading} />
                                    <InputField icon="person" placeholder="Tên chủ tài khoản *" value={shipperBankAccountName} onChange={setShipperBankAccountName} required disabled={isLoading} />
                                </div>
                            </div>
                        )}

                        {/* Terms and Submit */}
                        <div className="pt-4 space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 rounded border-cream text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="text-[14px] font-medium text-slate-600 leading-relaxed">
                                    Bằng việc đăng ký, tôi đồng ý với các <a href="#" className="text-primary font-bold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-primary font-bold hover:underline">Chính sách bảo mật</a> của nền tảng <b>Xấu Mã</b>.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading || !agreed}
                                className="w-full py-4.5 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-primary/20 text-base tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? 'ĐANG XỬ LÝ...' : 'HOÀN TẤT ĐĂNG KÝ'}
                            </button>
                        </div>

                        <div className="text-center w-full">
                            <button type="button" onClick={onGoToLogin} className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                                Sử dụng tài khoản khác
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default OAuthRegister;
