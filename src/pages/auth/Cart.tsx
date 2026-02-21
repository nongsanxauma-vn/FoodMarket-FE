
import React from 'react';
import { ShoppingCart, MapPin, Trash2, Plus, Minus, AlertTriangle, ArrowRight, Info } from 'lucide-react';

interface CartProps {
  onProceedToCheckout: () => void;
  onBackToShopping: () => void;
}

const Cart: React.FC<CartProps> = ({ onProceedToCheckout, onBackToShopping }) => {
  return (
    <div className="flex-1 bg-background animate-in fade-in duration-500 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-4xl font-black text-gray-900 font-display">Giỏ Hàng Của Bạn</h1>
          <p className="text-gray-400 font-bold">Bạn có 3 sản phẩm từ 2 nhà vườn khác nhau</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* List Items */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Farm Group 1 */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Vườn Chú Tư</h3>
                  <span className="px-3 py-1 bg-green-50 text-primary text-[10px] font-black rounded-full uppercase">Cách bạn 1.2 km</span>
                </div>
                <button className="size-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <img src="https://picsum.photos/seed/lettuce/120/120" className="size-24 rounded-[32px] object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase mb-1">Rau ăn lá</p>
                        <h4 className="text-lg font-black text-gray-900">Cải Bẹ Xanh Đà Lạt</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">25.000đ</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mỗi 1kg</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button className="size-8 flex items-center justify-center text-gray-400 hover:text-primary"><Minus className="size-3" /></button>
                        <span className="text-sm font-black text-gray-900 w-4 text-center">2</span>
                        <button className="size-8 flex items-center justify-center text-gray-400 hover:text-primary"><Plus className="size-3" /></button>
                      </div>
                      <span className="text-xl font-black text-gray-900">50.000đ</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50/50 rounded-2xl border border-primary/10 flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary text-sm fill-1">check_circle</span>
                   <p className="text-[10px] text-gray-500 font-bold italic">Vị trí nằm trong vùng bảo quản tốt nhất (dưới 10km).</p>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                  <img src="https://picsum.photos/seed/tomato/120/120" className="size-24 rounded-[32px] object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase mb-1">Rau ăn quả</p>
                        <h4 className="text-lg font-black text-gray-900">Cà Chua Bi Cherry</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">45.000đ</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mỗi 500g</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button className="size-8 flex items-center justify-center text-gray-400 hover:text-primary"><Minus className="size-3" /></button>
                        <span className="text-sm font-black text-gray-900 w-4 text-center">1</span>
                        <button className="size-8 flex items-center justify-center text-gray-400 hover:text-primary"><Plus className="size-3" /></button>
                      </div>
                      <span className="text-xl font-black text-gray-900">45.000đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Group 2 - Warning State */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden opacity-90">
              <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400">local_shipping</span>
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Nông Trại Xanh</h3>
                  <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-full uppercase">Cách bạn 14.5 km</span>
                </div>
                <button className="size-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6 grayscale">
                  <img src="https://picsum.photos/seed/spinach/120/120" className="size-24 rounded-[32px] object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Rau ăn lá</p>
                        <h4 className="text-lg font-black text-gray-400">Rau Muống Sông</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-400">18.000đ</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mỗi 1kg</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button className="size-8 flex items-center justify-center text-gray-400"><Minus className="size-3" /></button>
                        <span className="text-sm font-black text-gray-400 w-4 text-center">1</span>
                        <button className="size-8 flex items-center justify-center text-gray-400"><Plus className="size-3" /></button>
                      </div>
                      <span className="text-xl font-black text-gray-400">18.000đ</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 flex items-start gap-4">
                   <AlertTriangle className="size-6 text-red-500 shrink-0 mt-0.5" />
                   <div>
                      <h4 className="text-sm font-black text-red-500 uppercase tracking-tight mb-1">Không thể giao do vượt quá khoảng cách bảo quản</h4>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Rau ăn lá cần được giao trong bán kính 10km để đảm bảo độ tươi ngon. Vui lòng chọn vườn khác gần hơn.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8 sticky top-32">
              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tóm tắt đơn hàng</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Tạm tính (3 sản phẩm)</span>
                  <span className="text-gray-900 font-black">113.000đ</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Số nhà vườn tham gia</span>
                  <span className="text-gray-900 font-black">02</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Phí vận chuyển dự kiến</span>
                  <span className="text-gray-900 font-black">15.000đ</span>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng cộng</p>
                   <h3 className="text-3xl font-black text-primary">128.000đ</h3>
                   <p className="text-[9px] text-gray-400 font-bold italic mt-1">(Đã bao gồm VAT)</p>
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
               <div className="size-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <Info className="size-4" />
               </div>
               <div>
                  <h5 className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">Chính sách giao hàng</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Đơn hàng từ nhiều nhà vườn có thể được giao vào các khung giờ khác nhau để đảm bảo độ tươi.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
