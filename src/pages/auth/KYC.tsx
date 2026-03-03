import React, { useState } from 'react';
import { ShieldCheck, Hourglass, CheckCircle, ArrowLeft, Home, Store, Mail, Phone, MapPin, CreditCard, FileText, User } from 'lucide-react';

interface KYCProps {
  onComplete: () => void;
  onBack: () => void;
  role: 'FARMER' | 'SHIPPER';
}

const KYC: React.FC<KYCProps> = ({ onComplete, onBack, role }) => {
  const [isSubmitted, setIsSubmitted] = useState(role === 'FARMER');
  const [isReviewing, setIsReviewing] = useState(false);

  // Mock data — trong thực tế sẽ lấy từ API hoặc truyền qua props
  const submittedData = {
    fullName: 'Người dùng',
    email: 'user@email.com',
    phone: '0385xxxxxx',
    shopName: 'Cửa hàng của tôi',
    address: 'Địa chỉ đã đăng ký',
    bankAccount: '********',
    hasLogo: true,
    hasAchievement: true,
  };

  // Giao diện hiển thị khi đang chờ Admin duyệt
  const renderPendingStatus = () => (
    <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center text-center py-10">
      <div className="size-24 bg-orange-50 rounded-full flex items-center justify-center mb-8 relative">
        <Hourglass className="size-12 text-orange-500 animate-spin-slow" />
        <div className="absolute -top-1 -right-1 size-6 bg-orange-500 border-4 border-white rounded-full"></div>
      </div>

      <h3 className="text-2xl font-black text-gray-800 mb-4">Hồ sơ đang được chờ duyệt!</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
        Cảm ơn bạn đã hoàn thành hồ sơ năng lực. Đội ngũ quản trị viên của <span className="font-bold text-primary">Xấu Mã</span> sẽ xem xét và phê duyệt tài khoản của bạn trong vòng <span className="text-gray-800 font-bold">24h - 48h</span> làm việc.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start gap-4 text-left">
          <CheckCircle className="size-5 text-green-500 shrink-0 mt-1" />
          <div>
            <p className="text-sm font-bold text-gray-800">Thông tin cá nhân</p>
            <p className="text-[11px] text-gray-400">Đã tiếp nhận</p>
          </div>
        </div>
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start gap-4 text-left">
          <Hourglass className="size-5 text-orange-500 shrink-0 mt-1" />
          <div>
            <p className="text-sm font-bold text-gray-800">Xác thực cửa hàng</p>
            <p className="text-[11px] text-gray-400">Đang kiểm tra</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          <Home className="size-4" /> Về trang chủ
        </button>
        <button
          onClick={() => setIsReviewing(true)}
          className="text-sm font-bold text-gray-400 hover:text-primary transition-colors"
        >
          Xem lại hồ sơ đã gửi
        </button>
      </div>
    </div>
  );

  // Giao diện xem lại hồ sơ đã gửi (read-only)
  const renderReviewProfile = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Hồ Sơ Đã Gửi</h3>
          <p className="text-gray-500 text-sm font-medium">Thông tin bạn đã đăng ký, đang chờ Admin xem xét.</p>
        </div>
        <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1">
          <Hourglass className="size-3" /> Đang chờ duyệt
        </span>
      </div>

      {/* Thông tin cá nhân */}
      <div className="space-y-3 mb-6">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
          <User className="size-3.5" /> Thông tin cá nhân
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoRow icon={<User className="size-4" />} label="Họ và tên" value={submittedData.fullName} />
          <InfoRow icon={<Mail className="size-4" />} label="Email" value={submittedData.email} />
          <InfoRow icon={<Phone className="size-4" />} label="Số điện thoại" value={submittedData.phone} />
          <InfoRow icon={<CreditCard className="size-4" />} label="Tài khoản NH" value={submittedData.bankAccount} />
        </div>
      </div>

      {/* Thông tin cửa hàng */}
      {role === 'FARMER' && (
        <div className="space-y-3 mb-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <Store className="size-3.5" /> Thông tin cửa hàng
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow icon={<Store className="size-4" />} label="Tên cửa hàng" value={submittedData.shopName} />
            <InfoRow icon={<MapPin className="size-4" />} label="Địa chỉ" value={submittedData.address} />
          </div>
        </div>
      )}

      {/* Tài liệu đính kèm */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
          <FileText className="size-3.5" /> Tài liệu đính kèm
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${submittedData.hasLogo ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <CheckCircle className={`size-5 shrink-0 ${submittedData.hasLogo ? 'text-green-500' : 'text-gray-300'}`} />
            <div>
              <p className="text-sm font-bold text-gray-800">Ảnh Logo</p>
              <p className="text-[11px] text-gray-400">{submittedData.hasLogo ? 'Đã tải lên' : 'Chưa tải lên'}</p>
            </div>
          </div>
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${submittedData.hasAchievement ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <CheckCircle className={`size-5 shrink-0 ${submittedData.hasAchievement ? 'text-green-500' : 'text-gray-300'}`} />
            <div>
              <p className="text-sm font-bold text-gray-800">Chứng chỉ</p>
              <p className="text-[11px] text-gray-400">{submittedData.hasAchievement ? 'Đã tải lên' : 'Chưa tải lên'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cam kết bảo mật */}
      <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3 border border-gray-100 mb-8">
        <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích xác thực nội bộ bởi đội ngũ Xấu Mã.
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <button
          onClick={() => setIsReviewing(false)}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="size-4" /> Quay lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      <div className="max-w-3xl mx-auto pt-12 px-4">
        {isReviewing && (
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                <span>Đăng ký</span>
                <span className="text-gray-300">/</span>
                <span className="text-primary">Xem lại hồ sơ</span>
              </div>
              <h1 className="text-4xl font-black font-display text-gray-900 tracking-tight">Hồ sơ của bạn</h1>
            </div>
            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-orange-200">
              <Hourglass className="size-3" />
              CHỜ DUYỆT
            </div>
          </div>
        )}

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 md:p-12">
            {isReviewing ? renderReviewProfile() : renderPendingStatus()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị một hàng thông tin read-only
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-gray-50 rounded-2xl px-4 py-3.5 border border-gray-100 flex items-center gap-3">
    <div className="text-gray-400 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default KYC;