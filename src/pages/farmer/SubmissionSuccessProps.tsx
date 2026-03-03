
import React from 'react';
import { CheckCircle, ArrowRight, Home, LayoutDashboard, EyeOff } from 'lucide-react';

interface SubmissionSuccessProps {
  onReturn: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({ onReturn }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-12 text-center">
        <div className="relative mb-10 inline-block">
          <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary relative z-10 mx-auto">
            <CheckCircle className="size-12 animate-in zoom-in duration-500" />
          </div>
          <div className="absolute top-0 left-0 size-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Sản phẩm đã lên kệ!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Nông sản của bạn đã được đăng bán thành công. Khách hàng giờ đây đã có thể thấy và đặt mua sản phẩm từ farm của bạn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3 text-primary">
              <EyeOff className="size-5" />
              <span className="text-xs font-black uppercase tracking-widest">Hiển thị</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Sản phẩm sẽ xuất hiện ngay tại trang chủ và danh mục Nông sản sạch.</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3 text-accent">
              <LayoutDashboard className="size-5" />
              <span className="text-xs font-black uppercase tracking-widest">Quản lý</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Bạn có thể theo dõi tồn kho và chỉnh sửa thông tin tại mục Quản lý sản phẩm.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReturn}
            className="px-8 h-14 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            <Home className="size-5" />
            Quản lý sản phẩm
          </button>

        </div>

        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Mã giao dịch: #XMA-99281-SRS
        </p>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
