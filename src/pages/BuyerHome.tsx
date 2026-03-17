import React, { useState, useEffect } from 'react';
import { productService, ProductResponse, mysteryBoxService, MysteryBox, comboService, BuildComboResponse, cartService } from '../services';
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
  Grape,
  Loader2,
  Package,
  ChefHat,
  Tag,
} from 'lucide-react';
// import { generateProduceStory } from '../services/geminiService';

interface BuyerHomeProps {
  onSelectProduct: (id: string) => void;
  isAuthenticated?: boolean;
  onOpenLogin?: () => void;
}

const BuyerHome: React.FC<BuyerHomeProps> = ({ onSelectProduct, isAuthenticated = false, onOpenLogin = () => {} }) => {
  const [featuredStory, setFeaturedStory] = useState<string>('Đang tải câu chuyện nông sản...');
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [combos, setCombos] = useState<BuildComboResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBoxes, setIsLoadingBoxes] = useState(false);
  const [isLoadingCombos, setIsLoadingCombos] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getAll();
        if (response.result) {
          setProducts(response.result.filter(p => p.status === 'AVAILABLE' || !p.status).filter(p => p.id && !isNaN(p.id)));
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBoxes = async () => {
      try {
        setIsLoadingBoxes(true);
        const response = await mysteryBoxService.getAll();
        if (response.result) {
          // isActive undefined means backend doesn't return the field yet — treat as active
          setMysteryBoxes(response.result.filter((b: MysteryBox) => b.isActive !== false && b.isActive !== 0));
        }
      } catch (err) {
        console.error('Failed to fetch boxes:', err);
      } finally {
        setIsLoadingBoxes(false);
      }
    };

    fetchProducts();
    fetchBoxes();

    const fetchCombos = async () => {
      try {
        setIsLoadingCombos(true);
        const response = await comboService.getAll();
        if (response.result) {
          setCombos(response.result);
        }
      } catch (err) {
        console.error('Failed to fetch combos:', err);
      } finally {
        setIsLoadingCombos(false);
      }
    };
    fetchCombos();
  }, []);

  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative h-[480px] w-full rounded-3xl overflow-hidden mb-12 group shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://picsum.photos/seed/farmhero/1200/600")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12">
          <div className="max-w-xl text-white">
            <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Từ Nông Trại Đến Bàn Ăn</span>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.1] font-display uppercase tracking-tight">Nông sản mộc mạc,<br /><span className="text-primary italic">Giá trị thật.</span></h1>
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
          {isLoadingBoxes ? (
            <div className="col-span-full py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải túi mù...</div>
          ) : mysteryBoxes.length > 0 ? (
            mysteryBoxes.slice(0, 3).map((box) => (
              <div
                key={box.id}
                onClick={() => onSelectProduct(`box-${box.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col group p-4 cursor-pointer"
              >
                {/* Image area — mirrors product card structure */}
                <div className="relative h-48 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 overflow-hidden">
                  {box.imageUrl ? (
                    <img src={box.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={box.boxType} />
                  ) : (
                    <>
                      <ShoppingCart className="size-20 text-green-200 group-hover:scale-110 transition-transform duration-500" />
                      <span className="absolute text-3xl font-black text-primary/40">?</span>
                    </>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Award className="size-3 text-green-600" />
                    <span className="text-[10px] font-bold uppercase">Cam kết sạch</span>
                  </div>
                  {/* Cart icon — same pattern as product cards */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectProduct(`box-${box.id}`); }}
                    className="absolute bottom-3 right-3 size-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                  >
                    <ShoppingCart className="size-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-lg text-gray-900 truncate pr-2 uppercase tracking-tight">{box.boxType}</h4>
                    <span className="text-primary font-black text-xl whitespace-nowrap">{box.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 min-h-[32px]">{box.description || 'Hộp quà nông sản bí ẩn từ farm'}</p>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                    <MapPin className="size-3" /> Nông trại đối tác
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectProduct(`box-${box.id}`); }}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black py-3 rounded-xl transition-all mt-2 active:scale-95"
                  >
                    CHỌN TÚI NÀY
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <Package className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Hiện chưa có túi mù nào khả dụng</p>
            </div>
          )}
        </div>
      </div>

      {/* Combo Section */}
      {(isLoadingCombos || combos.length > 0) && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase font-display">Combo nấu ăn</h2>
              <p className="text-primary font-bold flex items-center gap-2">
                <Tag className="size-4" /> Tiết kiệm hơn khi mua theo combo
              </p>
            </div>
          </div>

          {isLoadingCombos ? (
            <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải combo...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.slice(0, 6).map((combo) => {
                const totalOriginal = combo.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const savings = totalOriginal - combo.discountPrice;
                return (
                  <div key={combo.id} onClick={() => onSelectProduct(`combo-${combo.id}`)} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 flex items-center gap-3">
                      <div className="size-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <ChefHat className="size-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-black text-gray-900 text-sm truncate">{combo.comboName}</h4>
                          {combo.region && (
                            <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full bg-white/80 text-primary border border-primary/20">
                              {combo.region === 'MIEN_BAC' ? '🌿 Bắc' : combo.region === 'MIEN_TRUNG' ? '🌶 Trung' : '🥥 Nam'}
                            </span>
                          )}
                        </div>
                        {combo.description && (
                          <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">{combo.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-4 space-y-2">
                      {combo.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 font-medium truncate flex-1 pr-2">• {item.productName}</span>
                          <span className="text-gray-500 font-bold whitespace-nowrap">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-4 pt-2 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xl font-black text-primary">{combo.discountPrice.toLocaleString('vi-VN')}đ</span>
                          {savings > 0 && (
                            <p className="text-[10px] text-green-600 font-bold">
                              Tiết kiệm {savings.toLocaleString('vi-VN')}đ
                            </p>
                          )}
                        </div>
                        {savings > 0 && (
                          <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full">
                            -{Math.round((savings / totalOriginal) * 100)}%
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(`combo-${combo.id}`); }}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <ChefHat className="size-4" />
                        Chọn combo này
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Featured Products */}
      <div className="mb-20">
        <h2 className="text-3xl font-black mb-8 px-2 uppercase font-display text-gray-900">Dành cho bạn hôm nay</h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 text-primary animate-spin" />
            <p className="text-gray-400 font-bold">Đang tải sản phẩm tươi sạch...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-10 rounded-[32px] text-center border border-red-100">
            <p className="text-red-500 font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-primary font-black underline">Tải lại trang</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product.id.toString())}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col cursor-pointer group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.imageUrl || 'https://picsum.photos/seed/product/400/300'} alt={product.productName} />
                  <button className="absolute bottom-4 right-4 size-10 bg-primary text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <ShoppingCart className="size-5" />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-[10px] font-bold uppercase">Nông sản</span>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                      <MapPin className="size-3" /> {product.shopName || (product.shopId ? `Farm #${product.shopId}` : 'Vườn nhà')}
                    </div>
                  </div>
                  <h3 className="text-gray-900 font-extrabold text-lg line-clamp-1">{product.productName}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="size-4 fill-current" />
                    <span className="text-xs font-bold text-gray-900">4.9</span>
                    <span className="text-gray-400 text-[10px]">(100+)</span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-primary font-black text-2xl">{product.sellingPrice.toLocaleString('vi-VN')}đ</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Mỗi {product.unit}</span>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md">TƯƠI SẠCH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default BuyerHome;