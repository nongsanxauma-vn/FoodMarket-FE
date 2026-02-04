
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  ShoppingCart, 
  ChevronRight, 
  Clock, 
  Store, 
  CheckCircle2, 
  Plus, 
  Minus,
  Quote,
  Camera,
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../constants/index';
// import { generateProduceStory } from '../../services/geminiService';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [story, setStory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false);
    setStory('Nông sản chất lượng từ vườn tới tay bạn.');
    // generateProduceStory(product.name).then(res => {
    //   setStory(res);
    //   setLoading(false);
    // });
  }, [productId, product.name]);

  return (
    <div className="flex-1 bg-white animate-in fade-in duration-500 pb-32">
      {/* Navigation Header */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-6 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <button onClick={onBack} className="hover:text-[#38543a] transition-colors flex items-center gap-1">
            <ArrowLeft className="size-3" /> QUAY LẠI
          </button>
          <ChevronRight className="size-3" />
          <span className="text-gray-900">{product.category}</span>
          <ChevronRight className="size-3" />
          <span className="text-primary">{product.name}</span>
        </nav>
        <div className="flex gap-4">
           <button className="size-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:bg-red-50">
              <Heart className="size-5" />
           </button>
           <button className="size-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:bg-green-50">
              <Share2 className="size-5" />
           </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Product Media */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative aspect-square rounded-[48px] overflow-hidden shadow-2xl border border-gray-50 group">
            <img 
              src={product.image} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt={product.name}
            />
            <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 text-white border border-white/10 shadow-lg">
               <Camera className="size-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Ảnh thật 100% từ vườn</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${i === 1 ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}>
                 <img src={`https://picsum.photos/seed/prod_${i}_${productId}/200/200`} className="w-full h-full object-cover" alt="thumbnail" />
               </div>
             ))}
          </div>
        </div>

        {/* Right: Product Core Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
           <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-display leading-tight uppercase tracking-tighter">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-1.5">
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-black text-gray-900">{product.rating}</span>
                    <span className="text-gray-400 text-xs font-bold ml-1 uppercase tracking-widest">• Đã bán {product.soldCount}</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                    <MapPin className="size-4 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Cách bạn {product.distance}</span>
                 </div>
              </div>
           </div>

           <div className="p-10 bg-[#f8faf8] rounded-[48px] border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex items-baseline gap-4 relative z-10">
                 <span className="text-5xl font-black text-[#38543a]">{product.price.toLocaleString('vi-VN')}đ</span>
                 {product.originalPrice && (
                    <>
                      <span className="text-xl font-bold text-gray-300 line-through">{(product.originalPrice).toLocaleString('vi-VN')}đ</span>
                      <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest animate-bounce">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}% GIÁ TRỊ
                      </span>
                    </>
                 )}
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest relative z-10">
                QUY CÁCH: <span className="text-gray-900">Mỗi {product.unit}</span> • Tình trạng: <span className="text-primary">Vừa hái sáng nay</span>
              </p>
              
              <div className="absolute -right-10 -bottom-10 size-40 bg-primary/5 rounded-full blur-3xl" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-[32px] flex items-center gap-4 group hover:bg-orange-50 transition-colors">
                 <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                    <AlertTriangle className="size-6" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">VẬN CHUYỂN</p>
                    <p className="text-xs font-black text-orange-900 mt-0.5">Dễ dập nát (Cần túi khí)</p>
                 </div>
              </div>
              <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[32px] flex items-center gap-4 group hover:bg-blue-50 transition-colors">
                 <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Clock className="size-6" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">BẢO QUẢN</p>
                    <p className="text-xs font-black text-blue-900 mt-0.5">Tươi trong {product.expiry}</p>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-white border border-gray-100 rounded-[40px] flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all shadow-sm">
              <div className="flex items-center gap-5">
                 <div className="size-16 rounded-[24px] overflow-hidden border-2 border-primary/10 shadow-md">
                    <img src="https://picsum.photos/seed/farmerba/100/100" className="w-full h-full object-cover" alt="farmer" />
                 </div>
                 <div>
                    <h4 className="font-black text-gray-900 text-xl uppercase tracking-tight">{product.farm}</h4>
                    <div className="flex items-center gap-4 mt-1.5">
                       <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase"><CheckCircle2 className="size-3" /> Đã xác thực KYC</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đánh giá: 4.9/5</span>
                    </div>
                 </div>
              </div>
              <button className="px-6 py-3 bg-gray-50 text-primary text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">Ghé thăm vườn</button>
           </div>
        </div>
      </div>

      {/* Produce Story Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-24">
         <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="md:w-3/5 space-y-10">
               <div>
                  <h2 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4">Giá Trị Thật</h2>
                  <h3 className="text-4xl font-black text-gray-900 font-display leading-tight">
                    Tại sao vẻ ngoài "Xấu Mã" <br/>lại là lựa chọn tử tế?
                  </h3>
               </div>
               
               <div className="relative">
                  <Quote className="absolute -top-10 -left-10 size-24 text-primary/5 -z-10" />
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                      <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse" />
                    </div>
                  ) : (
                    <p className="text-lg text-gray-600 font-medium leading-[2] italic border-l-4 border-primary/20 pl-8">
                      {story}
                    </p>
                  )}
               </div>

               <div className="flex items-center gap-6 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Canh tác bởi</span>
                    <span className="text-sm font-black text-gray-900 mt-1 uppercase italic">Bác Nông Dân Tử Tế</span>
                  </div>
                  <div className="h-10 w-px bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiêu chuẩn</span>
                    <span className="text-sm font-black text-[#38543a] mt-1 uppercase">VietGAP / Thuận Tự Nhiên</span>
                  </div>
               </div>
            </div>
            
            <div className="md:w-2/5 w-full">
               <div className="relative aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="farm view" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#38543a]/80 to-transparent flex items-end p-12">
                     <p className="text-white text-lg font-black leading-snug">
                       "Hơi héo một chút, hơi cong một tẹo, nhưng tâm huyết của nhà vườn vẫn luôn tròn trịa."
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[100] animate-in slide-in-from-bottom-full duration-700">
         <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 flex items-center justify-between gap-12">
            <div className="hidden md:flex items-center gap-4">
               <img src={product.image} className="size-16 rounded-2xl object-cover shadow-md" alt="mini" />
               <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Đơn vị: {product.unit}</p>
               </div>
            </div>
            
            <div className="flex items-center gap-8 flex-1 justify-end">
               <div className="flex items-center gap-4 bg-[#f3f4f3] p-1.5 rounded-2xl border border-gray-100">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Minus className="size-4" /></button>
                  <span className="text-lg font-black text-gray-900 w-10 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="size-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Plus className="size-4" /></button>
               </div>
               
               <div className="flex flex-col items-end">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tạm tính</p>
                  <p className="text-3xl font-black text-[#38543a]">{(product.price * quantity).toLocaleString('vi-VN')}đ</p>
               </div>

               <div className="flex gap-4">
                  <button className="hidden lg:flex px-8 py-4 bg-white border-2 border-[#38543a] text-[#38543a] font-black rounded-2xl uppercase tracking-widest items-center justify-center gap-3 hover:bg-[#38543a]/5 transition-all">
                     <ShoppingCart className="size-5" /> Thêm vào giỏ
                  </button>
                  <button className="px-10 py-4 bg-[#38543a] text-white font-black rounded-2xl uppercase tracking-widest shadow-2xl shadow-[#38543a]/20 hover:bg-[#2d432e] transition-all transform active:scale-95 flex items-center gap-3">
                     Mua ngay <ArrowRight className="size-5" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProductDetail;
