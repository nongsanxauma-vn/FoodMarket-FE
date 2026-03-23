import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, ChevronRight, Plus, Minus, Loader2,
  AlertCircle, ChefHat, Tag, MapPin, MessageSquare, Star,
} from 'lucide-react';
import { comboService, BuildComboResponse, cartService, reviewService, ReviewResponse } from '../../services';
import { globalShowAlert } from '../../contexts/PopupContext';
import { useAuth } from '../../contexts/AuthContext';
import ShopProducts from '../Product/ShopProducts';

const ComboDetail: React.FC = () => {
  const { comboId } = useParams<{ comboId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [combo, setCombo] = useState<BuildComboResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [viewShopMode, setViewShopMode] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await comboService.getById(Number(comboId));
        if (res.result) setCombo(res.result);
        else setError('Không tìm thấy combo.');
      } catch {
        setError('Không thể tải thông tin combo. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    if (comboId) fetch();
  }, [comboId]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!combo?.shopOwnerId) return;
      try {
        const res = await reviewService.getByShopId(combo.shopOwnerId);
        if (res.result) setReviews(res.result);
      } catch { /* ignore */ }
    };
    fetchReviews();
  }, [combo?.shopOwnerId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!combo) return;
    try {
      setIsAdding(true);
      await cartService.addToCart({ buildComboId: combo.id, quantity });
      window.dispatchEvent(new Event('cart-updated'));
      globalShowAlert(`Đã thêm combo "${combo.comboName}" vào giỏ hàng!`, 'Thành công', 'success');
    } catch {
      globalShowAlert('Không thể thêm vào giỏ hàng. Vui lòng thử lại.', 'Lỗi', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  if (viewShopMode && combo?.shopOwnerId) {
    return <ShopProducts shopId={combo.shopOwnerId} onBack={() => setViewShopMode(false)} isAuthenticated={isAuthenticated} onOpenLogin={() => navigate('/login')} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4 w-full">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải combo...</p>
      </div>
    );
  }

  if (error || !combo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 w-full px-4">
        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex flex-col items-center gap-4 text-red-600 font-bold max-w-lg text-center">
          <AlertCircle className="size-10" />
          <p>{error || 'Combo không khả dụng'}</p>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-white text-red-600 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const totalOriginal = combo.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = totalOriginal - combo.discountPrice;
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.ratingStar, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="flex-1 bg-white pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center border-b border-gray-100 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Trang chủ</span>
          <ChevronRight className="size-4" />
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Combo</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900 font-medium">{combo.comboName}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 animate-in fade-in duration-500">
        {/* Left: Visual */}
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
          {combo.imageUrl ? (
            <img src={combo.imageUrl} className="w-full h-full object-cover" alt={combo.comboName} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-green-300">
              <ChefHat className="size-32 text-primary/20" />
              <span className="text-6xl font-black text-primary/10">{combo.items.length} món</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <ChefHat className="size-4 text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">Combo nấu ăn</span>
          </div>
          {savings > 0 && (
            <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Tag className="size-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">
                Tiết kiệm {savings.toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục: Combo nấu ăn</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {combo.id}</span>
            </div>
            <h1 className="text-3xl font-black font-display text-gray-800 mb-2 leading-tight">{combo.comboName}</h1>
            {combo.region && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full mt-1 mb-1 border border-green-100">
                <MapPin className="size-3.5" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {combo.region === 'MIEN_BAC' ? '🌿 Ẩm thực Miền Bắc' : combo.region === 'MIEN_TRUNG' ? '🌶 Ẩm thực Miền Trung' : '🥥 Ẩm thực Miền Nam'}
                </span>
              </div>
            )}
            {savings > 0 && (
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mt-2">
                <Tag className="size-3.5" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  Tiết kiệm {Math.round((savings / totalOriginal) * 100)}% so với mua lẻ
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mt-2">
            <span className="text-primary font-black text-4xl">{combo.discountPrice.toLocaleString('vi-VN')}đ</span>
            {totalOriginal > combo.discountPrice && (
              <span className="text-gray-400 line-through text-lg font-bold mb-1">{totalOriginal.toLocaleString('vi-VN')}đ</span>
            )}
          </div>

          {/* Description */}
          {combo.description && (
            <p className="text-gray-500 text-sm leading-relaxed">{combo.description}</p>
          )}

          {/* Farm info */}
          <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
            <MapPin className="size-4" />
            <span>Nông trại đối tác #{combo.shopOwnerId}</span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-black uppercase text-gray-700 tracking-widest">Số lượng combo</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600">
                  <Minus className="size-4" />
                </button>
                <input type="text" value={quantity} readOnly className="w-12 text-center font-black bg-transparent outline-none text-gray-800" />
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600">
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                disabled={isAdding}
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white h-14 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:text-gray-500 hover:-translate-y-1 transform disabled:transform-none"
              >
                {isAdding ? <Loader2 className="size-5 animate-spin" /> : <ShoppingCart className="size-5" />}
                {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
              </button>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="mt-2 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-6">
            <h4 className="font-black text-gray-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <ChefHat className="size-4 text-primary" /> Combo gồm những gì?
            </h4>
            <div className="space-y-2 mb-4">
              {combo.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">• {item.productName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold">x{item.quantity}</span>
                    <span className="text-primary font-black">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-green-100 pt-3 flex justify-between items-center">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Tổng giá lẻ</span>
              <span className="font-black text-gray-700">{totalOriginal.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Info Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-[32px] border border-green-100 shadow-sm p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-5">
              <div className="size-24 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0 border-4 border-white">
                <img src={`https://picsum.photos/seed/shop${combo.shopOwnerId}/100/100`} alt="Shop" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-black text-gray-900 text-lg mb-1">Nông trại đối tác #{combo.shopOwnerId}</h4>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setViewShopMode(true)}
                    className="px-5 py-2.5 bg-white text-primary font-black text-[10px] uppercase tracking-widest rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Xem Cửa Hàng
                  </button>
                  <button
                    onClick={() => { 
                      if (!isAuthenticated) { navigate('/login'); return; } 
                      window.dispatchEvent(new CustomEvent('open-chat-with-user', {
                        detail: { userId: combo.shopOwnerId, userName: 'Chủ shop' }
                      }));
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest rounded-xl border border-blue-100 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                  >
                    <MessageSquare className="size-3.5" /> Chat Shop
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 flex items-center">
              <div className="grid grid-cols-3 gap-8 w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-center">
                  <p className="text-2xl font-black text-primary mb-1">{avgRating ?? '—'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Đánh Giá ({reviews.length})</p>
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

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-20">
          <h2 className="text-2xl font-black text-gray-900 uppercase mb-8 flex items-center gap-4">
            Đánh giá cửa hàng <span className="h-px bg-gray-200 flex-1"></span>
          </h2>
          <div className="space-y-6">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {review.fullName ? review.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{review.fullName || `Người dùng #${review.buyerId}`}</p>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`size-3 ${i < review.ratingStar ? 'fill-yellow-400' : ''}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                {review.replyFromShop && (
                  <div className="mt-4 bg-white p-5 rounded-2xl border border-primary/10 relative">
                    <div className="absolute -top-3 left-6 bg-primary text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Phản hồi từ Nhà vườn</div>
                    <p className="text-gray-600 text-sm italic">{review.replyFromShop}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboDetail;
