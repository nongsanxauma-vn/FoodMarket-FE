
import React from 'react';
import { Phone, Mail, Facebook, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#5DBE61] text-white py-16 px-4 md:px-40 mt-12">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1: Logo & Brand Info */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="size-14 rounded-full" />
            <div>
              <h2 className="text-xl font-black tracking-tight">Nông Sản</h2>
              <p className="text-sm font-bold">Xấu Mã</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="w-11 h-11 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center" title="Facebook">
              <Facebook className="size-5" />
            </button>
            <button className="w-11 h-11 rounded-full hover:opacity-75 transition-opacity flex items-center justify-center" title="TikTok">
              <img src="/tiktoklogo.png" alt="TikTok" className="size-12" />
            </button>
            <button className="w-11 h-11 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center font-black text-sm" title="Zalo">
              Z
            </button>
          </div>
          <div className="flex flex-col gap-2 text-sm text-green-50">
            <span className="flex items-center gap-2 font-medium"><Phone className="size-4" /> 0913 135 603</span>
            <span className="flex items-center gap-2"><Mail className="size-4" /> hotro@nongsanxauma.vn</span>
            <span className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" /><span className="text-xs">Số 1 Lưu Hữu Phước, Đông Hoà, Dĩ An, Thành phố Hồ Chí Minh</span></span>
          </div>
        </div>

        {/* Column 2: About */}
        <div className="flex flex-col gap-6">
          <h5 className="font-black text-white uppercase tracking-wider text-sm">Về Nông Sản Xấu Mã</h5>
          <ul className="flex flex-col gap-3 text-sm text-green-50">
            <li><a className="hover:text-white transition-colors font-medium" href="#">Về Thương Hiệu</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Sứ mệnh</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Hành trình bền vững</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Hệ thống quản trị</a></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="flex flex-col gap-6">
          <h5 className="font-black text-white uppercase tracking-wider text-sm">Mua hàng & Dịch vụ</h5>
          <ul className="flex flex-col gap-3 text-sm text-green-50">
            <li><a className="hover:text-white transition-colors font-medium" href="#">Chính sách giao hàng</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Gói mù nông sản</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Dành cho doanh nghiệp (B2B)</a></li>
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="flex flex-col gap-6">
          <h5 className="font-black text-white uppercase tracking-wider text-sm">Hỗ trợ khách hàng</h5>
          <ul className="flex flex-col gap-3 text-sm text-green-50">
            <li><a className="hover:text-white transition-colors font-medium" href="#">Trung tâm trợ giúp (FAQs)</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Chính sách đổi trả</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Kiểm tra đơn hàng</a></li>
            <li><a className="hover:text-white transition-colors font-medium" href="#">Liên hệ văn chuyển</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-100 font-medium">
        <p>Copyright © 2026 by Nông Sản Xâu Mã. All rights reserved</p>
        <div className="flex gap-4">
          <a className="hover:text-white underline" href="#">Điều khoản sử dụng</a>
          <span>|</span>
          <a className="hover:text-white underline" href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
