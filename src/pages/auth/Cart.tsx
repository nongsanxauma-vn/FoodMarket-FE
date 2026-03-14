import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Info, ArrowRight, ArrowLeft, Loader2, Package, Gift } from 'lucide-react';
import { cartService, CartResponse, CartItemResponse } from '../../services/cart.service';

interface CartProps {
  onProceedToCheckout: () => void;
  onBackToShopping: () => void;
}

type GroupedCart = Record<string, CartItemResponse[]>;

interface CartState {
  cart: CartResponse | null;
  groupedItems: GroupedCart;
}

const Cart: React.FC<CartProps> = ({ onProceedToCheckout, onBackToShopping }) => {
  const [cartState, setCartState] = useState<CartState>({ cart: null, groupedItems: {} });
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null); // "p-{productId}" hoặc "b-{mysteryBoxId}"

  const fetchCart = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const resp = await cartService.getCart();
      const cartData = resp.result;
      if (!cartData) {
        setCartState({ cart: null, groupedItems: {} });
        return;
      }

      // Group theo shopName — backend đã enrich sẵn shopName trong CartItemResponse
      const grouped = cartData.items.reduce((acc: GroupedCart, item) => {
        const key = item.shopName || 'Nông Trại Khác';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      setCartState({ cart: cartData, groupedItems: grouped });
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    const handleCartUpdate = () => fetchCart(true);
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  // Lấy unique key cho mỗi item để track loading state
  const itemKey = (item: CartItemResponse) =>
    item.itemType === 'MYSTERY_BOX' ? `b-${item.mysteryBoxId}` : `p-${item.productId}`;

  const handleUpdateQuantity = async (item: CartItemResponse, change: number) => {
    const newQty = item.quantity + change;
    if (newQty < 1) return;
    const key = itemKey(item);
    setUpdatingKey(key);
    try {
      if (item.itemType === 'MYSTERY_BOX' && item.mysteryBoxId) {
        await cartService.updateMysteryBoxQuantity(item.mysteryBoxId, newQty);
      } else if (item.productId) {
        await cartService.updateQuantity(item.productId, newQty);
      }
      await fetchCart(true);
    } catch (error) {
      console.error('Update quantity failed', error);
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleRemoveItem = async (item: CartItemResponse) => {
    const key = itemKey(item);
    setUpdatingKey(key);
    try {
      if (item.itemType === 'MYSTERY_BOX' && item.mysteryBoxId) {
        await cartService.removeMysteryBox(item.mysteryBoxId);
      } else if (item.productId) {
        await cartService.removeItem(item.productId);
      }
      await fetchCart(true);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Remove item failed', error);
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) return;
    setLoading(true);
    try {
      await cartService.clearCart();
      await fetchCart();
    } catch (error) {
      console.error('Clear cart failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cartState.cart) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="size-8 animate-spin" />
          <p className="font-bold">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  const { cart, groupedItems } = cartState;
  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const shopsCount = Object.keys(groupedItems).length;

  return (
    <div className="bg-background pb-20 animate-in fade-in duration-500">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">

        <button
          onClick={onBackToShopping}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span className="font-bold text-sm">Quay lại mua sắm</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-gray-900 font-display">Giỏ Hàng Của Bạn</h1>
            {totalItems > 0 ? (
              <p className="text-gray-400 font-bold">
                Bạn có {totalItems} sản phẩm từ {shopsCount} nhà vườn khác nhau
              </p>
            ) : (
              <p className="text-gray-400 font-bold">Giỏ hàng của bạn đang trống</p>
            )}
          </div>
          {totalItems > 0 && (
            <button onClick={handleClearCart} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-2">
              <Trash2 className="size-4" /> Xóa tất cả
            </button>
          )}
        </div>

        {totalItems === 0 ? (
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-16 text-center flex flex-col items-center justify-center">
            <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <ShoppingCart className="size-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Chưa có sản phẩm nào!</h3>
            <p className="text-gray-500 mb-8 max-w-sm">Hãy khám phá thêm các loại nông sản tươi ngon đang chờ bạn mang về nhé.</p>
            <button onClick={onBackToShopping} className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95">
              Khám phá Nông sản ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col gap-8">
              {Object.entries(groupedItems).map(([shopName, items]) => (
                <div key={shopName} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{shopName}</h3>
                  </div>
                  <div className="p-8 space-y-8">
                    {items.map((item, idx) => {
                      const key = itemKey(item);
                      const isUpdating = updatingKey === key;
                      const isMysteryBox = item.itemType === 'MYSTERY_BOX';

                      return (
                        <div key={key} className={`flex items-center gap-6 ${idx > 0 ? 'pt-6 border-t border-gray-50' : ''}`}>
                          {/* Image / Mystery placeholder */}
                          <div className="size-24 rounded-[32px] overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                className="w-full h-full object-cover"
                                alt={item.productName}
                              />
                            ) : isMysteryBox ? (
                              <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                                <Package className="size-10 text-green-300" />
                              </div>
                            ) : (
                              <img
                                src={`https://picsum.photos/seed/${item.productId}/120/120`}
                                className="w-full h-full object-cover"
                                alt={item.productName}
                              />
                            )}
                            {/* Badge túi mù */}
                            {isMysteryBox && (
                              <div className="absolute -top-1 -right-1 size-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                <Gift className="size-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                {/* Label loại item */}
                                <p className="text-[10px] font-black text-primary uppercase mb-1">
                                  {isMysteryBox ? '🎁 Túi mù nông sản' : 'Nông sản'}
                                </p>
                                <h4 className="text-lg font-black text-gray-900">{item.productName}</h4>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-gray-900">
                                  {(item.price || 0).toLocaleString('vi-VN')}đ
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                  {isMysteryBox ? 'Mỗi túi' : 'Mỗi đơn vị'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                <button
                                  disabled={isUpdating || item.quantity <= 1}
                                  onClick={() => handleUpdateQuantity(item, -1)}
                                  className="size-8 flex items-center justify-center text-gray-400 hover:text-primary disabled:opacity-50"
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="text-sm font-black text-gray-900 w-4 text-center">
                                  {isUpdating
                                    ? <Loader2 className="size-3 animate-spin mx-auto text-primary" />
                                    : item.quantity}
                                </span>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateQuantity(item, 1)}
                                  className="size-8 flex items-center justify-center text-gray-400 hover:text-primary disabled:opacity-50"
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xl font-black text-gray-900">
                                  {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
                                </span>
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleRemoveItem(item)}
                                  className="size-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8">
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tóm tắt đơn hàng</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span className="text-gray-900 font-black">{(cart?.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Số nhà vườn tham gia</span>
                    <span className="text-gray-900 font-black">{shopsCount < 10 ? `0${shopsCount}` : shopsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                    <span>Phí vận chuyển dự kiến</span>
                    <span className="text-gray-900 font-black">{(15000 * shopsCount).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng cộng</p>
                    <h3 className="text-3xl font-black text-primary">
                      {((cart?.totalAmount || 0) + (15000 * shopsCount)).toLocaleString('vi-VN')}đ
                    </h3>
                    <p className="text-[9px] text-gray-400 font-bold italic mt-1">(Đã bao gồm phí vận chuyển ước tính)</p>
                  </div>
                </div>
                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98]"
                >
                  Tiến hành đặt hàng <ArrowRight className="size-5" />
                </button>
                <button onClick={onBackToShopping} className="text-sm font-black text-primary hover:underline mx-auto uppercase tracking-widest">
                  Tiếp tục mua sắm
                </button>
              </div>

              <div className="p-8 bg-green-50/50 rounded-[32px] border border-primary/5 flex items-start gap-4">
                <div className="size-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Info className="size-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">Chính sách giao hàng</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Đơn hàng từ nhiều nhà vườn có thể được giao vào các khung giờ khác nhau để đảm bảo độ tươi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;