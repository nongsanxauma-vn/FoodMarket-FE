import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Grid, 
  List, 
  Filter,
  Star,
  ShoppingCart,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../constants/index';

interface ShopProductsProps {
  farmName: string;
  onBack: () => void;
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
}

const ShopProducts: React.FC<ShopProductsProps> = ({ farmName, onBack, isAuthenticated = false, onOpenLogin = () => {} }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');

  // Scroll to top when component loads or farmName changes
  useEffect(() => {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
  }, [farmName]);

  // Filter shop products
  const shopProducts = MOCK_PRODUCTS.filter(p => p.farm === farmName);
  let filteredShopProducts = selectedCategory 
    ? shopProducts.filter(p => p.category === selectedCategory)
    : shopProducts;

  // Sort
  if (sortBy === 'asc') {
    filteredShopProducts = [...filteredShopProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'desc') {
    filteredShopProducts = [...filteredShopProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'bestseller') {
    filteredShopProducts = [...filteredShopProducts].sort((a, b) => b.soldCount - a.soldCount);
  }

  const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));

  // Farm info (mock data based on shop products)
  const totalRating = shopProducts.reduce((sum, p) => sum + p.rating, 0) / shopProducts.length;
  const totalSold = shopProducts.reduce((sum, p) => sum + p.soldCount, 0);

  return (
    <div className="flex-1 bg-gray-50 pb-20">
      {/* Sticky Header - Compact */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </button>
          <h3 className="font-black text-gray-900 flex-1 text-center text-lg">{farmName}</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Grid view">
              <Grid className="size-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="List view">
              <List className="size-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Farm Details - Scrollable */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6 items-start">
            {/* Logo */}
            <div className="size-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-gray-100 shadow-md">
              <img 
                src={`https://picsum.photos/seed/${farmName}/100/100`} 
                alt={farmName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">{farmName}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                    <Clock className="size-3" />
                    Online Các ngày hôm nay
                  </p>
                </div>
                <Heart className="size-5 text-red-500 cursor-pointer hover:scale-110 transition-transform flex-shrink-0" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Star className="size-3.5 fill-orange-400 text-orange-400" />
                    <span className="text-lg font-black text-orange-600">{totalRating.toFixed(1)}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Đánh Giá</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-lg font-black text-blue-600 mb-0.5">{shopProducts.length}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Sản Phẩm</p>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-lg font-black text-green-600 mb-0.5">98%</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Phản Hồi</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <p className="text-lg font-black text-purple-600 mb-0.5">6 năm</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Tham Gia</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="px-5 py-2 bg-red-500 text-white font-bold text-xs rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                  <MessageCircle className="size-3.5" />
                  Chat Ngay
                </button>
                <button className="px-5 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Heart className="size-3.5" />
                  Theo Dõi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Sidebar - Filter */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="size-5 text-gray-600" />
              <h3 className="font-black text-gray-900">Bộ lọc</h3>
            </div>

            {/* Categories */}
            <div className="space-y-3 mb-8">
              <h4 className="font-black text-gray-800 text-sm mb-4">DANH MỤC</h4>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                  selectedCategory === null
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                Tất cả danh mục ({shopProducts.length})
              </button>
              {categories.map(cat => {
                const count = shopProducts.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Size Filter */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-black text-gray-900 mb-4 text-sm">KÍCH CỠ</h4>
              <div className="space-y-2">
                {['1KG', '5KG', '500G', '2KG', '10KG'].map(size => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
                    <span className="text-sm text-gray-600 font-medium flex-1">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Products Grid */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mb-8">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-600">
                  Hiển thị <span className="text-primary font-black">1-{filteredShopProducts.length}</span> của <span className="text-primary font-black">{shopProducts.length}</span> kết quả
                </p>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 cursor-pointer hover:border-gray-300 transition-colors"
              >
                <option value="default">THỨ TỰ MẶC ĐỊNH</option>
                <option value="asc">Giá: Thấp đến Cao</option>
                <option value="desc">Giá: Cao đến Thấp</option>
                <option value="bestseller">Bán chạy nhất</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredShopProducts.length > 0 ? (
                filteredShopProducts.map(p => (
                  <div key={p.id} className="group">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100 group-hover:border-primary/50 transition-all duration-300">
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {p.originalPrice && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full">
                          -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                      )}
                      <button 
                        onClick={() => {
                          if (!isAuthenticated) {
                            onOpenLogin();
                          } else {
                            alert(`Thêm sản phẩm "${p.name}" vào giỏ hàng`);
                          }
                        }}
                        className="absolute bottom-4 right-4 size-10 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:scale-110 active:scale-95"
                      >
                        <ShoppingCart className="size-5" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 min-h-10 group-hover:text-primary transition-colors">{p.name}</h4>
                    <p className="text-xs text-gray-400 font-medium mb-3">{p.unit}</p>

                    {/* Price */}
                    <div className="flex gap-2 items-center mb-3">
                      {p.originalPrice && (
                        <span className="text-gray-400 line-through text-xs font-medium">{p.originalPrice.toLocaleString()}đ</span>
                      )}
                      <span className="text-lg font-black text-primary">{p.price.toLocaleString()}đ</span>
                    </div>

                    {/* Rating & Sales */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="size-3.5 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">Đã bán {p.soldCount}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-400 font-medium">Không có sản phẩm nào</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {shopProducts.length > 9 && (
              <div className="flex justify-center items-center gap-2 pt-8 border-t border-gray-100">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">←</button>
                <button className="size-9 bg-primary text-white rounded-lg text-xs font-black hover:bg-primary-dark transition-colors">1</button>
                <button className="size-9 border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">2</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">→</button>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default ShopProducts;
