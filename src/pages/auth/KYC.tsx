
import React, { useState } from 'react';
import Stepper from '../../components/ui/Stepper';
import { Camera, ShieldCheck, Save, Send, ShieldAlert, FileText, Leaf, Hourglass, CheckCircle } from 'lucide-react';

interface KYCProps {
  onComplete: () => void;
  onBack: () => void;
  role: 'FARMER' | 'SHIPPER';
}

const KYC: React.FC<KYCProps> = ({ onComplete, onBack, role }) => {
  const [step, setStep] = useState(2); // Bắt đầu từ bước 2 theo yêu cầu thiết kế

  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-black text-gray-800 mb-2">Bước 2: Xác thực danh tính</h3>
        <p className="text-gray-500 text-sm font-medium">Vui lòng tải lên ảnh chụp bản gốc Căn cước công dân của bạn để hệ thống xác minh.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-700">CCCD mặt trước <span className="text-red-500">*</span></label>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group h-64">
            <div className="size-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Camera className="size-6 text-gray-400 group-hover:text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Tải lên CCCD mặt trước</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">Định dạng JPG, PNG, PDF. Tối đa 5MB.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-700">CCCD mặt sau <span className="text-red-500">*</span></label>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group h-64">
            <div className="size-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Camera className="size-6 text-gray-400 group-hover:text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Tải lên CCCD mặt sau</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">Yêu cầu ảnh rõ nét, đủ 4 góc, không bị lóa.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4 mb-10">
        <ShieldCheck className="size-6 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-1">CAM KẾT BẢO MẬT</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Mọi dữ liệu cá nhân của bạn được mã hóa và bảo mật theo tiêu chuẩn quốc gia về bảo vệ dữ liệu. Chúng tôi chỉ sử dụng thông tin này cho mục đích xác thực tư cách nông dân trên nền tảng XẤU MÃ và cam kết không chia sẻ cho bên thứ ba.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-gray-100">
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">
          <Save className="size-4" /> Lưu bản nháp
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-gray-800">Quay lại</button>
          <button onClick={() => setStep(3)} className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
            Gửi yêu cầu <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-gray-800 mb-2">Chứng Chỉ Canh Tác Nông Nghiệp</h3>
          <p className="text-gray-500 text-sm font-medium">Hoàn thành hồ sơ năng lực để nhận thêm ưu đãi hiển thị.</p>
        </div>
        <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">Bước 3: Hoàn tất</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
            <CheckCircle className="size-4 fill-primary text-white" />
            <span>Chứng chỉ & Giải thưởng (Không bắt buộc)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="size-12 bg-green-50 rounded-full flex items-center justify-center">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">VietGAP / GlobalGAP</p>
                <p className="text-[10px] text-gray-400 font-medium">Giúp sản phẩm được ưu tiên và tăng uy tín</p>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                 <Send className="size-3 -rotate-90" /> Tải lên tài liệu
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="size-12 bg-green-50 rounded-full flex items-center justify-center">
                <Leaf className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Chứng nhận Hữu cơ</p>
                <p className="text-[10px] text-gray-400 font-medium">Chứng nhận Organic từ các tổ chức uy tín</p>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                 <Send className="size-3 -rotate-90" /> Tải lên tài liệu
              </button>
            </div>
          </div>

          <div className="bg-info/5 border border-info/20 rounded-2xl p-4 flex items-start gap-3">
             <div className="size-6 bg-info text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">i</div>
             <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
               Bạn có thể bỏ qua bước này nếu chưa có các chứng chỉ trên. Tuy nhiên, việc bổ sung đầy đủ thông tin sẽ giúp gian hàng của bạn nhanh chóng được tin tưởng bởi người mua.
             </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center justify-center border border-gray-100">
           <div className="size-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6">
              <Hourglass className="size-8 text-gray-300 animate-pulse" />
           </div>
           <h4 className="text-lg font-black text-gray-800 mb-3">Trạng thái xác thực</h4>
           <p className="text-[11px] text-gray-400 font-medium mb-8 leading-relaxed px-4">
              Đội ngũ Xấu Mã sẽ xem xét hồ sơ của bạn trong vòng 24-48 giờ làm việc.
           </p>
           <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="w-2/3 h-full bg-primary" />
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giai đoạn 3 của 3</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <ShieldCheck className="size-4" />
          <span className="text-[10px] italic">Sau khi nhấn "Hoàn thành", hồ sơ của bạn sẽ chính thức được gửi đi để phê duyệt.</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setStep(2)} className="text-sm font-bold text-gray-400 hover:text-gray-800">Quay lại</button>
          <button onClick={onComplete} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
            Hoàn thành đăng ký
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      <div className="max-w-6xl mx-auto pt-12 px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
               <span>Đăng ký</span>
               <span className="text-gray-300">/</span>
               <span className="text-primary">Xác thực danh tính</span>
            </div>
            <h1 className="text-4xl font-black font-display text-gray-900 tracking-tight">Trang Xác Thực Nông Dân (KYC)</h1>
          </div>
          <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-gray-200">
             <span className="size-2 bg-gray-300 rounded-full"></span>
             ĐANG CHỜ PHÊ DUYỆT
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-10 border-b border-gray-50 bg-white">
            <Stepper currentStep={step} steps={['Thông tin cá nhân', 'Xác thực danh tính', 'Chứng chỉ']} />
          </div>
          <div className="p-12">
            {step === 2 ? renderStep2() : renderStep3()}
          </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-xs text-gray-400 font-medium">Gặp khó khăn trong quá trình xác thực? <a href="#" className="text-primary font-bold underline underline-offset-4">Trung tâm trợ giúp</a> hoặc <a href="#" className="text-primary font-bold underline underline-offset-4">Liên hệ hỗ trợ</a></p>
        </div>
      </div>
    </div>
  );
};

export default KYC;
