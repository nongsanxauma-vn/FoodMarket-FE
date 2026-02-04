
import React from 'react';
/* Fix: Import missing User and CheckCircle2 icons from lucide-react */
import { Camera, ShieldCheck, Mail, Phone, MapPin, Star, Award, Leaf, FileText, Plus, Save, ExternalLink, User, CheckCircle2 } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Hồ sơ cá nhân & Cửa hàng</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Quản lý thông tin nhà vườn và cấu hình vận hành cửa hàng.</p>
        </div>
        <button className="px-8 py-3 bg-primary text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
          <Save className="size-5" /> Lưu thay đổi
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="size-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-orange-100">
            <img src="https://picsum.photos/seed/farmer_avatar/200/200" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 size-10 bg-primary text-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center hover:scale-110 transition-transform">
            <Camera className="size-5" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-black text-gray-900">Nông Trại Xanh</h3>
            <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
              <ShieldCheck className="size-3" /> Đã xác thực KYC
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã định danh</span>
              <span className="text-sm font-bold text-gray-700 flex items-center gap-1"><User className="size-3" /> FARM-8829</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tham gia</span>
              <span className="text-sm font-bold text-gray-700">Tháng 05, 2023</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đánh giá</span>
              <span className="text-sm font-bold text-gray-700 flex items-center gap-1">4.9 <Star className="size-3 text-yellow-500 fill-yellow-500" /></span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">contact_page</span>
            </div>
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Thông tin liên hệ</h4>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên chủ vườn</label>
              <input type="text" defaultValue="Bác Ba Nông Dân" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <input type="text" defaultValue="0987 654 321" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" defaultValue="bacba.farm@email.com" className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ vườn</label>
              <div className="relative">
                 <input type="text" defaultValue="Ấp Phú Lộc, xã An Khánh, huyện Châu Thành, Đồng Tháp" className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
                 <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-primary" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic">* Định vị chính xác để hỗ trợ tính phí ship &lt;10km cho khách hàng.</p>
            </div>
          </div>
        </div>

        {/* Reputation & Certificates */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Award className="size-5" />
            </div>
            <h4 className="font-black text-gray-800 uppercase tracking-tight">Chứng chỉ & Uy tín</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-green-50/30 rounded-3xl border border-primary/5 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ĐIỂM TIN CẬY</p>
                <h3 className="text-4xl font-black text-primary my-1">980</h3>
                <span className="text-[10px] font-black text-primary uppercase">Cấp độ: Kim Cương</span>
             </div>
             <div className="p-6 bg-yellow-50/30 rounded-3xl border border-yellow-100/50 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ĐÁNH GIÁ TRUNG BÌNH</p>
                <h3 className="text-4xl font-black text-yellow-600 my-1">4.9/5</h3>
                <span className="text-[10px] font-black text-yellow-600 uppercase">2,450 lượt mua</span>
             </div>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Danh sách chứng chỉ</p>
            <div className="p-5 bg-gray-50/80 rounded-3xl border border-gray-100 flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase">Chứng chỉ VietGAP</p>
                    <p className="text-[10px] text-gray-400 font-bold">Hiệu lực: 12/2025</p>
                  </div>
               </div>
               <button className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase">
                 Xem ảnh gốc <ExternalLink className="size-3" />
               </button>
            </div>
            <div className="p-5 bg-gray-50/80 rounded-3xl border border-gray-100 flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Leaf className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase">Chứng nhận Organic (Hữu cơ)</p>
                    <p className="text-[10px] text-gray-400 font-bold">Hiệu lực: 06/2024</p>
                  </div>
               </div>
               <button className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase">
                 Xem ảnh gốc <ExternalLink className="size-3" />
               </button>
            </div>
            <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[28px] text-gray-400 flex items-center justify-center gap-2 hover:border-primary/40 hover:text-primary transition-all">
               <Plus className="size-4" /> <span className="text-xs font-black uppercase tracking-widest">Tải lên chứng chỉ mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">storefront</span>
          </div>
          <h4 className="font-black text-gray-800 uppercase tracking-tight">Cấu hình cửa hàng & Vận hành</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Giờ mở cửa</label>
             <div className="relative">
                <input type="text" defaultValue="06:00 AM" className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">schedule</span>
             </div>
          </div>
          <div className="flex flex-col gap-3">
             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Giờ đóng cửa</label>
             <div className="relative">
                <input type="text" defaultValue="06:00 PM" className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">schedule</span>
             </div>
          </div>
          <div className="flex flex-col gap-3">
             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả phương pháp canh tác</label>
             <textarea rows={3} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all resize-none" defaultValue="Nông trại áp dụng phương pháp canh tác hoàn toàn thuận tự nhiên, không sử dụng phân bón hóa học và thuốc trừ sâu tổng hợp." />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default Profile;
