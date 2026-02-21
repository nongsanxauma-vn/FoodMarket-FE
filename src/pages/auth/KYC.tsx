import React, { useState } from 'react';
import Stepper from '../../components/ui/Stepper';
import { ShieldCheck, Send, FileText, Leaf, Hourglass, CheckCircle, ArrowLeft, Home } from 'lucide-react';

interface KYCProps {
  onComplete: () => void;
  onBack: () => void;
  role: 'FARMER' | 'SHIPPER';
}

const KYC: React.FC<KYCProps> = ({ onComplete, onBack, role }) => {
  const [step, setStep] = useState(2);
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã gửi đơn

  const handleSubmit = () => {
    // Ở đây bạn sẽ gọi API để gửi dữ liệu lên server
    setIsSubmitted(true);
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
            <p className="text-sm font-bold text-gray-800">Xác thực chứng chỉ</p>
            <p className="text-[11px] text-gray-400">Đang kiểm tra</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={() => window.location.href = '/'} // Hoặc điều hướng về trang chủ
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          <Home className="size-4" /> Về trang chủ
        </button>
        <button 
          onClick={onComplete}
          className="text-sm font-bold text-gray-400 hover:text-primary transition-colors"
        >
          Xem lại hồ sơ đã gửi
        </button>
      </div>
    </div>
  );

  const renderCertificatesStep = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Chứng Chỉ Canh Tác Nông Nghiệp</h3>
          <p className="text-gray-500 text-sm font-medium">Bổ sung hồ sơ năng lực để Admin dễ dàng phê duyệt tài khoản.</p>
        </div>
        <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">Bước 2: Hoàn tất</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-colors group">
              <div className="size-12 bg-green-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="size-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-gray-800">VietGAP / GlobalGAP</p>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                 <Send className="size-3 -rotate-90" /> Tải lên
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-colors group">
              <div className="size-12 bg-green-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="size-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-gray-800">Chứng nhận Hữu cơ</p>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                 <Send className="size-3 -rotate-90" /> Tải lên
              </button>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
             <div className="size-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">i</div>
             <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
               Hồ sơ có chứng chỉ nông nghiệp sẽ được ưu tiên duyệt sớm và có nhãn "Người bán uy tín" sau khi hoạt động.
             </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100">
           <div className="size-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="size-7 text-primary" />
           </div>
           <h4 className="text-sm font-black text-gray-800 mb-2">Cam kết bảo mật</h4>
           <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              Thông tin của bạn chỉ dùng cho mục đích xác thực nội bộ.
           </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-gray-100">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-800">
          <ArrowLeft className="size-4" /> Quay lại
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-primary text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2"
        >
          Hoàn thành & Gửi duyệt <Send className="size-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      <div className="max-w-6xl mx-auto pt-12 px-4">
        {/* Header - Ẩn khi đã gửi đơn */}
        {!isSubmitted && (
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  <span>Đăng ký</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-primary">Xác thực hồ sơ</span>
              </div>
              <h1 className="text-4xl font-black font-display text-gray-900 tracking-tight">Xác Thực Nông Dân</h1>
            </div>
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-gray-200">
               <span className="size-2 bg-gray-300 rounded-full"></span>
               GIAI ĐOẠN CUỐI
            </div>
          </div>
        )}

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Chỉ hiển thị Stepper khi chưa gửi đơn */}
          {!isSubmitted && (
            <div className="px-10 border-b border-gray-50 bg-white">
              <Stepper 
                currentStep={step} 
                steps={['Thông tin cá nhân', 'Chứng chỉ & Năng lực']} 
              />
            </div>
          )}
          
          <div className="p-12">
            {isSubmitted ? renderPendingStatus() : renderCertificatesStep()}
          </div>
        </div>

        {!isSubmitted && (
          <div className="mt-12 text-center">
              <p className="text-xs text-gray-400 font-medium">Bạn cần hỗ trợ? <a href="#" className="text-primary font-bold underline underline-offset-4">Liên hệ hỗ trợ 24/7</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC;