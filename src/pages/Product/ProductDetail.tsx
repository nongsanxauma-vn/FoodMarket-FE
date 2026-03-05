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
  Leaf,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { productService, ProductResponse, cartService } from '../../services';
import ShopProducts from './ShopProducts';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, isAuthenticated = false, onOpenLogin = () => { } }) => {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('mota');
  const [viewShopMode, setViewShopMode] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);

    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch detailed product
        const idNum = Number(productId);
        const res = await productService.getById(idNum);
        if (res.result) {
          setProduct(res.result);

          // Optionally fetch some other products to show as related
          // (Right now, we can just get all and filter, or just get all and slice)
          const allRes = await productService.getAll();
          if (allRes.result) {
            setRelatedProducts(allRes.result.filter(p => p.id !== idNum).slice(0, 4));
          }
        } else {
          setError('Không tìm thấy sản phẩm.');
        }
      } catch (err) {
        console.error('Failed to fetch product detail:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Shop View
  if (viewShopMode && selectedFarm) {
    return <ShopProducts farmName={selectedFarm} onBack={() => {
      setViewShopMode(false);
      setSelectedFarm(null);
    }} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4 w-full">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải sản phẩm chi tiết...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 w-full px-4">
        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex flex-col items-center gap-4 text-red-600 font-bold max-w-lg text-center">
          <AlertCircle className="size-10" />
          <p>{error || 'Sản phẩm không khả dụng'}</p>
          <button onClick={onBack} className="mt-4 px-6 py-2 bg-white text-red-600 rounded-xl shadow-sm hover:shadow-md transition-shadow">Quay lại trang chủ</button>
        </div>
      </div>
    );
  }

  // Define dynamic properties from backend response
  const farmName = product.shopName || (product.shopId ? `Nông trại #${product.shopId}` : (product.shopOwnerId ? `Shop ID: ${product.shopOwnerId}` : 'Nông trại đối tác'));
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="flex-1 bg-white pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between border-b border-gray-100 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-primary" onClick={onBack}>Trang chủ</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900 font-medium">{product.productName}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 animate-in fade-in duration-500">
        {/* Left: Media */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-20 hidden md:flex">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all ${i === 1 ? 'border-primary' : 'border-gray-100 hover:border-primary/50'}`}>
                <img src={product.imageUrl || `https://picsum.photos/seed/${product.id + i}/200/200`} className="w-full h-full object-cover" alt="thumb" />
              </div>
            ))}
          </div>
          <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <img src={product.imageUrl || 'https://picsum.photos/seed/product/400/400'} className="w-full h-full object-cover" alt={product.productName} />
            {isOutOfStock ? (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Hết hàng</span>
            ) : (
              <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Tươi mới</span>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục: Nông sản</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {product.id}</span>
            </div>
            <h1 className="text-3xl font-black font-display text-gray-800 mb-2 leading-tight">{product.productName}</h1>
            <div className="flex items-center gap-4 text-sm mt-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className={`size-4 ${i < 4 ? 'fill-yellow-400' : ''}`} />)}
              </div>
              <span className="text-gray-400 font-bold text-xs">(128 đánh giá)</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-3">
              <span className="text-primary font-black text-4xl">{(product.sellingPrice || 0).toLocaleString('vi-VN')}đ</span>
              <span className="text-gray-400 font-bold uppercase text-xs mt-2">/ {product.unit || 'KG'}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-6 whitespace-pre-wrap">
              {product.description || "Sản phẩm sạch được thu hoạch ngay tại vườn. Không sử dụng thuốc trừ sâu, phân bón hóa học. Đảm bảo an toàn tuyệt đối cho sức khỏe."}
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <p className="text-[10px] font-black uppercase text-gray-700 tracking-widest flex items-center justify-between">
              <span>Số lượng</span>
              <span className={`lowercase font-medium ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>{product.stockQuantity} {product.unit} có sẵn</span>
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden h-14">
              <button disabled={isOutOfStock} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"><Minus className="size-4" /></button>
              <input type="text" value={isOutOfStock ? 0 : quantity} readOnly className="w-12 text-center font-black bg-transparent outline-none text-gray-800" />
              <button disabled={isOutOfStock || quantity >= product.stockQuantity} onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"><Plus className="size-4" /></button>
            </div>
            <button
              disabled={isOutOfStock || isAdding}
              onClick={async () => {
                if (!isAuthenticated) {
                  onOpenLogin();
                } else {
                  try {
                    setIsAdding(true);
                    await cartService.addToCart({ productId: Number(productId), quantity });
                    window.dispatchEvent(new Event('cart-updated'));
                    alert(`Đã thêm ${quantity} ${product.unit} ${product.productName} vào giỏ hàng`);
                  } catch (e) {
                    console.error('Failed to add to cart', e);
                    alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
                  } finally {
                    setIsAdding(false);
                  }
                }
              }}
              className="flex-1 bg-primary text-white h-14 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none hover:-translate-y-1 transform disabled:transform-none"
            >
              {isAdding ? <Loader2 className="size-5 animate-spin" /> : <ShoppingCart className="size-5" />}
              {isAdding ? 'Đang thêm...' : (isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ')}
            </button>
          </div>
        </div>
      </div>

      {/* Farmer Information Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-[32px] border border-green-100 shadow-sm p-10 relative overflow-hidden">
          <Leaf className="absolute -bottom-10 -right-10 size-64 text-green-100 opacity-50 rotate-45 pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Left: Farm Info */}
            <div className="flex items-start gap-5">
              <div className="size-24 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0 border-4 border-white">
                <img
                  src={`https://picsum.photos/seed/shop${product.shopOwnerId}/100/100`}
                  alt={farmName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-black text-gray-900 text-lg mb-1">{farmName}</h4>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                      <Award className="size-3" /> Nông trại uy tín
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => {
                    setViewShopMode(true);
                    setSelectedFarm(farmName);
                  }} className="px-5 py-2.5 bg-white text-primary font-black text-[10px] uppercase tracking-widest rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
                    Xem Trang Trại
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Farm Stats */}
            <div className="lg:col-span-2 flex items-center">
              <div className="grid grid-cols-3 gap-8 w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-black text-primary mb-1">4.9</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Đánh Giá (1K+)</p>
                </div>
                <div className="text-center border-l border-r border-gray-100 px-4">
                  <p className="text-2xl font-black text-gray-900 mb-1">98%</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tỉ Lệ Phản Hồi</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900 mb-1">3 Năm</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tham Gia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 border-t border-gray-100 pt-16 mb-20">
        <div className="flex justify-center gap-12 -mt-px mb-12">
          {['Mô tả chi tiết', 'Chứng nhận', 'Đánh giá (128)'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="max-w-4xl mx-auto">
          {activeTab === 'Mô tả chi tiết' && (
            <div className="text-gray-600 text-sm leading-loose whitespace-pre-wrap bg-gray-50 p-8 rounded-[32px] border border-gray-100">
              {product.description || "Nông sản được thu hoạch tận vườn với quy trình gieo trồng nghiêm ngặt."}
            </div>
          )}
          {activeTab === 'Chứng nhận' && (
            <div className="flex justify-center gap-6">
              <div className="p-6 border border-gray-100 rounded-2xl flex flex-col items-center bg-green-50/30">
                <Award className="size-10 text-green-500 mb-4" />
                <span className="text-sm font-bold text-gray-800">VietGAP</span>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl flex flex-col items-center bg-blue-50/30">
                <Leaf className="size-10 text-blue-500 mb-4" />
                <span className="text-sm font-bold text-gray-800">100% Organic</span>
              </div>
            </div>
          )}
          {activeTab === 'Đánh giá (128)' && (
            <div className="text-center text-gray-500 text-sm py-10">
              Tính năng đánh giá đang được cập nhật.
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-32">
          <h2 className="text-2xl font-black font-display text-gray-900 uppercase mb-12 flex items-center gap-4">
            Gợi ý mua kèm <span className="h-px bg-gray-200 flex-1"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} onClick={() => window.location.href = `/product?id=${p.id}`} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                  <img src={p.imageUrl || 'https://picsum.photos/seed/product/400/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.productName} />
                  <button className="absolute bottom-4 right-4 size-10 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hover:scale-110 shadow-lg">
                    <Plus className="size-5" />
                  </button>
                </div>
                <h4 className="font-extrabold text-gray-900 text-sm mb-1 line-clamp-1">{p.productName}</h4>
                <div className="flex gap-2 text-sm mt-2 items-center">
                  <span className="text-primary font-black text-lg">{(p.sellingPrice || 0).toLocaleString('vi-VN')}đ</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">/{p.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;