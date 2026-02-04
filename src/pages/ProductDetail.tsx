
import React, { useState } from 'react';
/* Fix: Import missing AlertTriangle icon from lucide-react */
import { 
  Star, 
  MapPin, 
  ShoppingCart, 
  ChevronRight, 
  Info, 
  Clock, 
  Store, 
  MessageSquare, 
  CheckCircle2, 
  Plus, 
  Minus,
  Quote,
  ChefHat,
  Camera,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex-1 bg-white animate-in fade-in duration-500 pb-32">
      {/* Breadcrumbs */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-6">
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <button onClick={onBack} className="hover:text-primary">Trang chủ</button>
          <ChevronRight className="size-3" />
          <span className="hover:text-primary cursor-pointer">Rau ăn quả</span>
          <ChevronRight className="size-3" />
          <span className="text-gray-900">Cà chua Bi</span>
        </nav>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Images */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-lg border border-gray-100 group">
            <img src="https://picsum.photos/seed/tomato_detail/800/800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white border border-white/10">
               <Camera className="size-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Ảnh thật từ vườn</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             <div className="aspect-square rounded-2xl border-2 border-primary overflow-hidden p-1">
                <div className="w-full h-full rounded-xl bg-green-50 flex items-center justify-center text-primary font-black text-xl">1</div>
             </div>
             <img src="https://picsum.photos/seed/t2/200/200" className="aspect-square rounded-2xl object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all" />
             <img src="https://picsum.photos/seed/t3/200/200" className="aspect-square rounded-2xl object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all" />
             <div className="aspect-square rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-xs cursor-pointer hover:bg-gray-100 transition-colors">
                +3 ảnh
             </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
           <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black text-gray-900 font-display">Cà chua Bi vườn hữu cơ</h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-1.5">
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-black text-gray-900">4.9</span>
                    <span className="text-gray-400 text-xs font-bold ml-1">• Đã bán 1.2k</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                    <MapPin className="size-4 text-primary" /> Cách bạn 3.5 km
                 </div>
              </div>
           </div>

           <div className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 flex flex-col gap-6">
              <div className="flex items-baseline gap-4">
                 <span className="text-4xl font-black text-primary">38.250đ</span>
                 <span className="text-lg font-bold text-gray-300 line-through">45.000đ</span>
                 <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest ml-2">ƯU ĐÃI 15%</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá niêm yết theo đơn vị: <span className="text-gray-900">1kg</span></p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-center gap-4">
                 <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                    <AlertTriangle className="size-5" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">RỦI RO VẬN CHUYỂN</p>
                    <p className="text-xs font-black text-orange-900 mt-0.5">Trung bình</p>
                 </div>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4">
                 <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                    <Clock className="size-5" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">HẠN SỬ DỤNG</p>
                    <p className="text-xs font-black text-blue-900 mt-0.5">Tươi nhất trong 3-5 ngày</p>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                 <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Store className="size-7" />
                 </div>
                 <div>
                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">Vườn Rau Chú Bảy – Đà Lạt</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lạc Dương, Lâm Đồng</p>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-[10px] font-black text-primary uppercase">98% Phản hồi</span>
                       <span className="text-[10px] font-bold text-gray-300">Gia nhập 2 năm</span>
                    </div>
                 </div>
              </div>
              <button className="px-6 py-3 border border-primary/20 text-primary text-xs font-black rounded-xl hover:bg-primary hover:text-white transition-all">Xem shop</button>
           </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-20">
         <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 uppercase font-display">Câu chuyện nông sản</h2>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8 text-gray-600 font-medium leading-[1.8]">
               <p>Những quả cà chua bi này có thể có lớp vỏ hơi nhám, hoặc hình dáng không tròn trịa hoàn hảo như trong siêu thị. Tại <span className="text-primary font-black">XẤU MÃ</span>, chúng tôi gọi đây là "vẻ đẹp mộc mạc".</p>
               <p>Được canh tác theo hướng hữu cơ tại vùng đất đỏ Lạc Dương, chú Bảy cam kết không sử dụng thuốc tăng trưởng hay chất bảo quản. Do thời tiết sương muối nhẹ, vỏ quả có thể xuất hiện các vết rám, nhưng chính điều đó lại giúp quả tích tụ lượng đường tự nhiên cao hơn, thịt quả chắc và mọng nước hơn hẳn loại hàng "đẹp mã".</p>
               
               <div className="p-10 bg-green-50/50 rounded-[40px] border-l-8 border-primary relative overflow-hidden">
                  <Quote className="absolute -top-4 -right-4 size-32 text-primary opacity-5" />
                  <p className="text-xl font-bold text-gray-800 italic relative z-10">
                    "Tôi muốn khách hàng ăn quả cà chua đúng vị của đất mẹ, chứ không phải ăn cái vẻ bề ngoài bóng bẩy." - <span className="text-primary not-italic font-black">Chú Bảy (Chủ vườn)</span>
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Combo Recommendations */}
      <div className="bg-gray-50/30 py-24 border-y border-gray-100">
         <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase font-display">Gợi ý Combo món ăn ngon</h2>
                  <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">Mua trọn bộ nguyên liệu để nhận giá ưu đãi và nấu ngay món ngon</p>
               </div>
               <button className="text-primary font-black flex items-center gap-2 hover:underline group text-sm uppercase tracking-widest">
                  Xem tất cả công thức <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { name: 'Combo Salad Sức Khỏe', tag: 'BÁN CHẠY', price: '125.000đ', oldPrice: '145đ', items: ['Cà chua bi hữu cơ (500g)', 'Xà lách thủy canh (300g)', 'Ức gà phi lê (250g)', 'Sốt dầu giấm chuẩn vị'], image: 'https://picsum.photos/seed/salad_combo/600/600' },
                 { name: 'Combo Mì Ý Sốt Cà', tag: 'DỄ LÀM NHẤT', price: '158.000đ', oldPrice: '180đ', items: ['Cà chua bi (1kg)', 'Mì Spaghetti Barilla (500g)', 'Thịt bò băm (200g)', 'Lá Basil tươi & Gia vị Ý'], image: 'https://picsum.photos/seed/pasta_combo/600/600' },
               ].map((combo, i) => (
                 <div key={i} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex h-[320px] group hover:shadow-xl transition-all">
                    <div className="w-2/5 relative">
                       <img src={combo.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 bg-[#38703d] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{combo.tag}</div>
                    </div>
                    <div className="w-3/5 p-8 flex flex-col justify-between">
                       <div>
                          <h4 className="text-xl font-black text-gray-900 mb-4">{combo.name}</h4>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">NGUYÊN LIỆU CHÍNH:</p>
                          <ul className="space-y-2">
                             {combo.items.map((item, idx) => (
                               <li key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                  <CheckCircle2 className="size-3.5 text-primary" /> {item}
                               </li>
                             ))}
                          </ul>
                       </div>
                       <div className="flex items-center justify-between mt-6 border-t border-gray-50 pt-6">
                          <div>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">GIÁ TRỌN BỘ</p>
                             <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-primary">{combo.price}</span>
                                <span className="text-xs text-gray-300 line-through font-bold">{combo.oldPrice}</span>
                             </div>
                          </div>
                          <button className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                             <ShoppingCart className="size-5" />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Reviews */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-24">
         <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-black text-gray-900 uppercase font-display">Đánh giá thực tế (48)</h2>
            <button className="text-sm font-black text-primary uppercase tracking-widest hover:underline">Xem tất cả</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { user: 'Hương Giang', date: '2 ngày trước', rating: 5, comment: 'Dù mã ngoài hơi xấu xí tí nhưng cà chua cực kỳ ngọt và thơm. Shop gói hàng rất kỹ, không bị dập nát quả nào. Sẽ ủng hộ vườn chú Bảy dài dài!', images: ['https://picsum.photos/seed/r1/200/200', 'https://picsum.photos/seed/r2/200/200'] },
              { user: 'Minh Quân', date: '1 tuần trước', rating: 5, comment: 'Vị cà chua đậm đà, dùng làm salad hay ăn sống đều ngon. Giá quá tốt cho chất lượng hữu cơ. Mong shop duy trì mô hình kết nối nhà vườn này.', images: ['https://picsum.photos/seed/r3/200/200'] },
            ].map((rev, i) => (
              <div key={i} className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="size-12 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden">
                          <img src={`https://picsum.photos/seed/u${i}/80/80`} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900">{rev.user}</p>
                          <div className="flex gap-0.5 mt-1">
                             {[...Array(5)].map((_, idx) => <Star key={idx} className="size-3 text-yellow-400 fill-current" />)}
                          </div>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{rev.date}</span>
                 </div>
                 <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                 <div className="flex gap-3">
                    {rev.images.map((img, idx) => (
                       <img key={idx} src={img} className="size-20 rounded-2xl object-cover shadow-sm grayscale hover:grayscale-0 cursor-pointer transition-all" />
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-6 shadow-2xl z-[100] animate-in slide-in-from-bottom-full duration-700">
         <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 flex items-center justify-between gap-8">
            <div className="flex items-center gap-12">
               <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Minus className="size-4" /></button>
                  <span className="text-lg font-black text-gray-900 w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Plus className="size-4" /></button>
               </div>
               <div className="flex flex-col">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">TẠM TÍNH</p>
                  <p className="text-2xl font-black text-gray-900">{(38250 * quantity).toLocaleString('vi-VN')}đ</p>
               </div>
            </div>
            <div className="flex gap-4 flex-1 max-w-md">
               <button className="flex-1 py-4 px-8 border-2 border-primary text-primary font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/5 transition-all">
                  <ShoppingCart className="size-5" /> Thêm vào giỏ
               </button>
               <button className="flex-1 py-4 px-8 bg-primary text-white font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
                  Mua ngay
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProductDetail;
