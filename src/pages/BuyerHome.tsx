
import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants.tsx';
import { 
  Star, 
  MapPin, 
  ShoppingCart, 
  ArrowRight, 
  Zap, 
  Award, 
  Leaf, 
  Utensils, 
  Apple, 
  LayoutGrid, 
  Grape 
} from 'lucide-react';
// import { generateProduceStory } from '../services/geminiService';

interface BuyerHomeProps {
  onSelectProduct: (id: string) => void;
}

const BuyerHome: React.FC<BuyerHomeProps> = ({ onSelectProduct }) => {
  const [featuredStory, setFeaturedStory] = useState<string>('Đang tải câu chuyện nông sản...');

  const categories = [
    { name: 'Rau ăn lá', icon: Leaf },
    { name: 'Rau gia vị', icon: Utensils },
    { name: 'Rau ăn quả', icon: Apple },
    { name: 'Củ & hạt', icon: LayoutGrid },
    { name: 'Trái cây', icon: Grape },
  ];

  useEffect(() => {
    // generateProduceStory('Cà chua bi hữu cơ').then(setFeaturedStory);
    setFeaturedStory('Nông sản từ vườn đến bàn ăn, giữ trọn hương vị tự nhiên và tâm huyết của người nông dân.');
  }, []);

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative h-[480px] w-full rounded-3xl overflow-hidden mb-12 group shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://picsum.photos/seed/farmhero/1200/600")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12">
          <div className="max-w-xl text-white">
            <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Từ Nông Trại Đến Bàn Ăn</span>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.1] font-display uppercase tracking-tight">Nông sản mộc mạc,<br/><span className="text-primary italic">Giá trị thật.</span></h1>
            <p className="text-lg text-gray-200 mb-8 max-w-md leading-relaxed">
              {featuredStory}
            </p>
            <div className="flex gap-4">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1">Mua sắm ngay</button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all">Tìm hiểu thêm</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="size-16 bg-green-50/50 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <cat.icon className="size-7" />
            </div>
            <span className="text-sm font-black text-gray-800 font-display">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Blind Box Banner */}
      <div id="goi-mu" className="mb-16 scroll-mt-32">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase font-display">Túi mù hôm nay</h2>
            <p className="text-primary font-bold flex items-center gap-2">
              <Zap className="size-4 fill-current" /> Tiết kiệm 50% so với mua lẻ
            </p>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 hover:underline group">
            Xem tất cả <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Gói Mù Đất Đỏ', price: '50.000đ', items: '1 Củ + 2 Rau + 1 Bí mật', farm: 'Vườn Chú Tư' },
            { name: 'Gói Mù Giải Nhiệt', price: '50.000đ', items: '2 Củ + 1 Quả + 1 Bí mật', farm: 'Vườn Cô Bảy' },
            { name: 'Gói Mù Bữa Cơm', price: '50.000đ', items: '3 Rau + Gia vị + 1 Bí mật', farm: 'Nông Trại Xanh' },
          ].map((box, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col group p-4">
              <div className="h-48 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 relative">
                 <ShoppingCart className="size-20 text-green-200 group-hover:scale-110 transition-transform duration-500" />
                 <span className="absolute text-3xl font-black text-primary/40">?</span>
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Award className="size-3 text-green-600" />
                    <span className="text-[10px] font-bold">CAM KẾT TƯƠI</span>
                 </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-lg text-gray-900">{box.name}</h4>
                  <span className="text-primary font-black text-xl">{box.price}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">{box.items}</p>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                  <MapPin className="size-3" /> {box.farm}
                </div>
                <button className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3 rounded-xl transition-all mt-2">
                  CHỌN TÚI NÀY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-20">
        <h2 className="text-3xl font-black mb-8 px-2 uppercase font-display text-gray-900">Dành cho bạn hôm nay</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              onClick={() => onSelectProduct(product.id)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col cursor-pointer group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.image} alt={product.name} />
                <button className="absolute bottom-4 right-4 size-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <ShoppingCart className="size-5" />
                </button>
                {product.originalPrice && (
                   <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm">Giảm 15%</span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-primary text-[10px] font-bold uppercase">{product.category}</span>
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                    <MapPin className="size-3" /> {product.distance}
                  </div>
                </div>
                <h3 className="text-gray-900 font-extrabold text-lg line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="size-4 fill-current" />
                  <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                  <span className="text-gray-400 text-[10px]">({product.soldCount})</span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-primary font-black text-2xl">{product.price.toLocaleString('vi-VN')}đ</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Mỗi {product.unit}</span>
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md">TƯƠI SẠCH</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BuyerHome;
