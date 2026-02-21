import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  Plus, 
  Minus,
  ArrowRight,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Award,
  Leaf
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../constants/index';
import ShopProducts from './ShopProducts';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, isAuthenticated = false, onOpenLogin = () => {} }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('mota');
  const [selectedColor, setSelectedColor] = useState('green');
  const [viewShopMode, setViewShopMode] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);

  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];

  // Scroll to top when component loads or product changes
  useEffect(() => {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
  }, [productId]);

  // Shop View
  if (viewShopMode && selectedFarm) {
    return <ShopProducts farmName={selectedFarm} onBack={() => {
      setViewShopMode(false);
      setSelectedFarm(null);
    }} />;
  }

  return (
    <div className="flex-1 bg-white pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-gray-100 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-primary" onClick={onBack}>Trang chủ</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="size-4 rotate-180" /></button>
           <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="size-4" /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Media với Thumbnails dọc */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all ${i === 1 ? 'border-orange-400' : 'border-gray-100'}`}>
                <img src={`https://picsum.photos/seed/${i}/200/200`} className="w-full h-full object-cover" alt="thumb" />
              </div>
            ))}
          </div>
          <div className="flex-1 relative aspect-square rounded-lg overflow-hidden border border-gray-100">
             <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
             <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Sale!</span>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm">
               <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`size-4 ${i < 4 ? 'fill-orange-400' : ''}`} />)}
               </div>
               <span className="text-gray-400">(2 đánh giá)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 line-through text-lg">545.000đ</span>
              <span className="text-3xl font-bold text-orange-600">449.000đ</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-4">
              {product.description || "Cam hữu cơ được canh tác theo tiêu chuẩn nghiêm ngặt, đảm bảo độ tươi ngon và an toàn tuyệt đối cho sức khỏe gia đình bạn."}
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-3 pt-4">
            <p className="text-sm font-bold uppercase text-gray-700">Màu sắc</p>
            <div className="flex gap-3 items-center">
               {['#8bc34a', '#ff9800', '#f44336', '#ffeb3b'].map(color => (
                 <button 
                  key={color}
                  className={`size-8 rounded-full border-4 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-110`}
                  style={{ backgroundColor: color }}
                 />
               ))}
               <span className="text-xs text-red-500 ml-2 cursor-pointer">Xóa</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center border border-gray-200 rounded-md">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-primary"><Minus className="size-4" /></button>
              <input type="text" value={quantity} readOnly className="w-12 text-center font-bold outline-none" />
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-primary"><Plus className="size-4" /></button>
            </div>
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenLogin();
                } else {
                  alert(`Thêm ${quantity} sản phẩm vào giỏ hàng`);
                }
              }}
              className="flex-1 bg-[#3d5a41] text-white py-4 px-8 rounded-md font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-3"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Farmer Information Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Farm Info */}
            <div className="flex items-start gap-4">
              <div className="size-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-gray-100">
                <img 
                  src={`https://picsum.photos/seed/${product.farm}/100/100`} 
                  alt={product.farm}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-black text-gray-900 text-base mb-1">{product.farm}</h4>
                    <p className="text-xs text-gray-500 mb-3">Online {Math.floor(Math.random() * 12) + 1} Phút Trước</p>
                  </div>
                  <Heart className="size-5 text-red-500 cursor-pointer" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-4 py-2 bg-red-50 text-red-500 font-bold text-xs rounded-lg border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2">
                    💬 Chat Ngay
                  </button>
                  <button onClick={() => {
                    setViewShopMode(true);
                    setSelectedFarm(product.farm);
                  }} className="px-4 py-2 bg-gray-50 text-gray-600 font-bold text-xs rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    Xem Shop
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Farm Stats */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Star className="size-6 fill-orange-400 text-orange-400" />
                  </div>
                  <p className="text-2xl font-black text-red-500 mb-1">{product.rating}</p>
                  <p className="text-xs text-gray-500 font-medium">Đánh Giá</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-red-500 mb-1">{product.soldCount}</p>
                  <p className="text-xs text-gray-500 font-medium">Sản Phẩm</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-red-500 mb-1">90%</p>
                  <p className="text-xs text-gray-500 font-medium">Tỉ Lệ Phản Hồi</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Thời Gian Phản Hồi</p>
                    <p className="text-sm font-bold text-gray-900">Trong vài giờ</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Người Theo Dõi</p>
                    <p className="text-sm font-bold text-gray-900">{Math.floor(Math.random() * 5000) + 1000}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Tham Gia Từ</p>
                    <p className="text-sm font-bold text-gray-900">6 năm trước</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 border-t border-gray-100">
        <div className="flex justify-center gap-12 -mt-px mb-10">
          {['mô tả', 'thông tin bổ sung', 'đánh giá (2)'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold uppercase tracking-widest border-t-2 transition-all ${activeTab === tab ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="max-w-4xl mx-auto text-gray-500 text-sm leading-relaxed text-center italic">
          <p className="mb-6">Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada at at nulla. Morbi elit ex, viverra vitae ante vel, blandit feugiat ligula.</p>
          <p>Morbi ut sapien vitae odio accumsan gravida. Morbi vitae erat auctor, eleifend nunc a, lobortis neque. Praesent aliquam dignissim viverra.</p>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 mt-32">
        <h2 className="text-2xl font-bold text-center text-gray-800 uppercase mb-12 tracking-widest">Gợi ý món ăn</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.slice(0, 4).map((p) => (
            <div key={p.id} className="group cursor-pointer">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
                <button className="absolute bottom-4 right-4 size-10 bg-[#3d5a41] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  <ShoppingCart className="size-4" />
                </button>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{p.name}</h4>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 line-through">250.000đ</span>
                <span className="text-orange-600 font-bold">{p.price.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default ProductDetail;