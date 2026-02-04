
import React, { useState } from 'react';
import { Sparkles, Info, ArrowRight, Package, Box, Zap, Gift, Trash2, Sprout } from 'lucide-react';

const BlindBoxTool: React.FC = () => {
  const [price, setPrice] = useState(59000);
  const items = [
    { id: 1, name: 'Bắp cải', image: 'https://picsum.photos/seed/cabbage/100/100', surplus: '15kg' },
    { id: 2, name: 'Cà chua', image: 'https://picsum.photos/seed/tomato/100/100', surplus: '8kg' },
    { id: 3, name: 'Khoai tây', image: 'https://picsum.photos/seed/potato/100/100', surplus: '20kg' },
    { id: 4, name: 'Cà rốt', image: 'https://picsum.photos/seed/carrot/100/100', surplus: '5kg' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900">Blind Box Surplus Tool</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Giải cứu nông sản dư thừa bằng cách tạo các túi quà bí ẩn hấp dẫn.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2">
           <Zap className="size-4 fill-primary" />
           <span className="text-xs font-black uppercase tracking-widest">Tiết kiệm rác thải: 42kg tháng này</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Box className="size-5" />
              </div>
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Bước 1: Chọn nông sản dư thừa</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               {items.map((item) => (
                 <div key={item.id} className="flex flex-col gap-3 group cursor-pointer">
                    <div className="relative aspect-square rounded-[32px] overflow-hidden border-2 border-transparent group-hover:border-primary transition-all shadow-sm">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                       <div className="absolute top-3 right-3 bg-white/90 backdrop-blur size-6 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                          <input type="checkbox" className="size-3 accent-primary" />
                       </div>
                    </div>
                    <div className="text-center">
                       <p className="text-xs font-black text-gray-800 uppercase">{item.name}</p>
                       <p className="text-[10px] text-primary font-bold">Dư: {item.surplus}</p>
                    </div>
                 </div>
               ))}
               <button className="aspect-square rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300 hover:border-primary/20 hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-3xl">add_circle</span>
                  <span className="text-[10px] font-black uppercase">Thêm món</span>
               </button>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Sparkles className="size-5" />
              </div>
              <h4 className="font-black text-gray-800 uppercase tracking-tight">Bước 2: Thiết lập combo</h4>
            </div>

            <div className="space-y-12">
               <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mức giá túi mù (VND)</label>
                     <span className="text-3xl font-black text-primary">{price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <input 
                    type="range" 
                    min="29000" 
                    max="199000" 
                    step="1000"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-full appearance-none accent-primary cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                     <span>29.000đ</span>
                     <span>199.000đ</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Số lượng vật phẩm</label>
                     <select className="w-full p-4 bg-gray-50 border border-transparent rounded-[24px] text-sm font-black outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all appearance-none cursor-pointer">
                        <option>3 - 5 loại nông sản</option>
                        <option>5 - 8 loại nông sản</option>
                        <option>Gói tiết kiệm (10kg+)</option>
                     </select>
                  </div>
                  <div className="flex flex-col gap-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái công khai</label>
                     <div className="flex items-center gap-2 h-full px-4">
                        <div className="relative inline-block w-12 h-6 rounded-full bg-primary/20">
                           <div className="absolute left-1 top-1 size-4 bg-primary rounded-full transition-all translate-x-6" />
                        </div>
                        <span className="text-xs font-bold text-gray-600">Hiển thị ngay trên cửa hàng</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8">
              <div className="size-20 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto text-primary">
                 <Gift className="size-10" />
              </div>
              <div className="text-center">
                 <h4 className="text-xl font-black text-gray-900 mb-2">Xem trước túi mù</h4>
                 <p className="text-[11px] text-gray-400 font-medium">Khách hàng sẽ thấy túi này như một hộp quà bất ngờ.</p>
              </div>

              <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 flex flex-col gap-4">
                 <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Cửa hàng:</span>
                    <span className="text-gray-900">Nông Trại Xanh</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-black text-gray-900">
                    <span>Giá niêm yết:</span>
                    <span className="text-primary">{price.toLocaleString('vi-VN')}đ</span>
                 </div>
                 <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 italic">
                    <span>Gồm:</span>
                    <span>3-5 món ngẫu nhiên</span>
                 </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10 flex items-start gap-3">
                 <Info className="size-4 text-primary shrink-0 mt-1" />
                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                   Thuật toán sẽ tự động phân phối nông sản dựa trên số lượng tồn kho của bạn để đảm bảo không món nào bị hư hỏng.
                 </p>
              </div>

              <button className="w-full py-5 bg-primary text-white font-black rounded-[32px] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98]">
                 <Sparkles className="size-5" /> TẠO COMBO RANDOM
              </button>
           </div>

           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Túi đang chạy (2)</h5>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div className="flex items-center gap-3">
                       <Sprout className="size-5 text-primary" />
                       <div>
                          <p className="text-xs font-black text-gray-800 uppercase">Gói Đất Đỏ</p>
                          <p className="text-[10px] text-gray-400 font-bold">Giá: 59.000đ • Đã bán: 12</p>
                       </div>
                    </div>
                    <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 className="size-4" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default BlindBoxTool;
