
import React from 'react';
import { Leaf, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#75AF68] text-white py-16 px-4 md:px-40 mt-12">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white rounded-full flex items-center justify-center text-[#1a4d2e]">
              <Leaf className="size-6 fill-current" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">XẤU MÃ</h2>
          </div>
          <p className="text-sm text-green-100 leading-relaxed opacity-80 font-display">
            Nền tảng thương mại điện tử nông sản kết nối trực tiếp nông dân và người tiêu dùng Việt. Cam kết Tươi - Sạch - Minh bạch mỗi ngày.
          </p>
          <div className="flex gap-4">
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Facebook className="size-5" />
            </button>
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Instagram className="size-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-black text-lg uppercase tracking-wider">Dịch vụ</h5>
          <ul className="flex flex-col gap-3 text-sm text-green-100 opacity-80">
            <li><a className="hover:text-white transition-colors" href="#">Giao hàng 2h</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Gói mù nông sản</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Bảo hiểm Escrow</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-black text-lg uppercase tracking-wider">Hỗ trợ</h5>
          <ul className="flex flex-col gap-3 text-sm text-green-100 opacity-80">
            <li><a className="hover:text-white transition-colors" href="#">Trung tâm trợ giúp</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Chính sách đổi trả</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Liên hệ vận chuyển</a></li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h5 className="font-black text-lg uppercase tracking-wider">Liên hệ</h5>
          <div className="flex flex-col gap-3 text-sm text-green-100 opacity-80">
            <span className="flex items-center gap-2"><Phone className="size-4" /> 1900 1234</span>
            <span className="flex items-center gap-2"><Mail className="size-4" /> hotro@xauma.vn</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-100/60 font-medium">
        <p>© 2024 XẤU MÃ. Bản quyền thuộc về Team Green. Proudly Made in Vietnam.</p>
        <div className="flex gap-8">
          <a className="hover:text-white" href="#">Điều khoản sử dụng</a>
          <a className="hover:text-white" href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
