import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard, ChevronRight, Lock, Loader2, ShieldCheck, Wallet, ChevronLeft, AlertCircle, Package, X } from 'lucide-react';
import { orderService, paymentService, authService, cartService, CartResponse } from '../../services';

interface CheckoutProps {
   onComplete: (orderId: number) => void;
   onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onComplete, onBack }) => {
   const [isProcessing, setIsProcessing] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState<'COD' | 'PAYOS' | 'WALLET'>('WALLET');
   const [cartData, setCartData] = useState<CartResponse | null>(null);
   const [recipientName, setRecipientName] = useState('');
   const [recipientPhone, setRecipientPhone] = useState('');
   const [recipientAddress, setRecipientAddress] = useState('');
   const [note, setNote] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   
   // PayOS QR Code state
   const [showQRCode, setShowQRCode] = useState(false);
   const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
   const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

   const SHIPPING_FEE = 15000;
   const shopsCount = cartData?.items?.length ? Math.ceil(cartData.items.length / 3) : 1;

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            setError(null);
            
            const [userRes, cartRes] = await Promise.all([
               authService.getMyInfo(),
               cartService.getCart()
            ]);

            if (userRes.result) {
               setRecipientName(userRes.result.fullName || '');
               setRecipientPhone(userRes.result.phoneNumber || '');
               setRecipientAddress(userRes.result.address || '');
            }

            if (cartRes.result) {
               setCartData(cartRes.result);
               if (!cartRes.result.items || cartRes.result.items.length === 0) {
                  setError('Giỏ hàng trống!');
               }
            } else {
               setError('Không thể tải giỏ hàng.');
            }
         } catch (error: any) {
            console.error('Failed to fetch checkout data', error);
            setError('Có lỗi xảy ra khi tải dữ liệu.');
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const validateForm = (): boolean => {
      if (!recipientName.trim()) {
         alert('Vui lòng nhập tên người nhận');
         return false;
      }
      if (!recipientPhone.trim()) {
         alert('Vui lòng nhập số điện thoại');
         return false;
      }
      if (!recipientAddress.trim()) {
         alert('Vui lòng nhập địa chỉ nhận hàng');
         return false;
      }
      return true;
   };

   const handleConfirmPayment = async () => {
      if (!validateForm()) return;
      
      if (!cartData || !cartData.items || cartData.items.length === 0) {
         alert('Giỏ hàng trống!');
         return;
      }

      try {
         setIsProcessing(true);
         setError(null);

         const orderData = {
            recipientName,
            recipientPhone,
            shippingAddress: recipientAddress,
            note,
            paymentMethod: paymentMethod,
            items: cartData.items.map(item => ({
               productId: item.productId,
               quantity: item.quantity
            }))
         };

         const orderRes = await orderService.createOrder(orderData);

         if (orderRes.result) {
            const orderId = orderRes.result.id;
            const amount = orderRes.result.totalAmount;

            if (paymentMethod === 'PAYOS') {
               const paymentRes = await paymentService.createPaymentPayOS({
                  orderId, amount, method: 'PAYOS', paymentGateway: 'PAYOS'
               });

               if (paymentRes.result) {
                  if (paymentRes.result.checkoutUrl) {
                     window.location.href = paymentRes.result.checkoutUrl;
                     return;
                  }
                  
                  if (paymentRes.result.qrCodeUrl) {
                     setQrCodeUrl(paymentRes.result.qrCodeUrl);
                     setCheckoutUrl(paymentRes.result.checkoutUrl || null);
                     setShowQRCode(true);
                     setIsProcessing(false);
                     return;
                  }
               }
            } else if (paymentMethod === 'WALLET') {
               await paymentService.createPayment({
                  orderId, amount, method: 'WALLET', paymentGateway: 'WALLET'
               });
            }

            onComplete(orderId);
         }

      } catch (error: any) {
         console.error('Checkout failed', error);
         setError(error?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      } finally {
         setIsProcessing(false);
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="size-12 animate-spin text-primary" />
               <p className="text-sm font-bold text-gray-600">Đang tải...</p>
            </div>
         </div>
      );
   }

   if (error && (!cartData || !cartData.items || cartData.items.length === 0)) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center p-4 py-20">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 max-w-md text-center">
               <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
               <h3 className="text-xl font-black text-gray-900 mb-2">Không thể thanh toán</h3>
               <p className="text-gray-600 font-medium mb-6">{error}</p>
               <button onClick={onBack} className="w-full py-3 bg-primary text-white font-black rounded-2xl">
                  Quay lại giỏ hàng
               </button>
            </div>
         </div>
      );
   }

   const totalAmount = (cartData?.totalAmount || 0) + (SHIPPING_FEE * shopsCount);

   return (
      <div className="min-h-screen bg-gray-50 pb-20">
         {/* Compact Header */}
         <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <button 
                     onClick={onBack} 
                     disabled={isProcessing}
                     className="size-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                     <ChevronLeft className="size-5" />
                  </button>
                  <div>
                     <h1 className="text-lg font-black text-gray-900 uppercase">Thanh Toán</h1>
                     <p className="text-[10px] text-gray-500 font-bold">Bước cuối cùng để hoàn tất đơn hàng</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-primary text-[10px] font-black rounded-full">
                  <ShieldCheck className="size-3" />
                  BẢO MẬT
               </div>
            </div>
         </div>

         <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left Column - Form */}
               <div className="lg:col-span-2 space-y-4">
                  {/* Delivery Info */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                     <div className="flex items-center gap-2 mb-4">
                        <MapPin className="size-5 text-primary" />
                        <h3 className="text-sm font-black text-gray-900 uppercase">Thông tin nhận hàng</h3>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                                 Tên người nhận *
                              </label>
                              <input
                                 type="text"
                                 value={recipientName}
                                 onChange={(e) => setRecipientName(e.target.value)}
                                 placeholder="Nhập tên"
                                 className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all"
                                 disabled={isProcessing}
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                                 Số điện thoại *
                              </label>
                              <input
                                 type="tel"
                                 value={recipientPhone}
                                 onChange={(e) => setRecipientPhone(e.target.value)}
                                 placeholder="Nhập SĐT"
                                 className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-primary focus:bg-white transition-all"
                                 disabled={isProcessing}
                              />
                           </div>
                        </div>
                        
                        <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                              Địa chỉ nhận hàng *
                           </label>
                           <textarea
                              value={recipientAddress}
                              onChange={(e) => setRecipientAddress(e.target.value)}
                              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all resize-none"
                              rows={2}
                              disabled={isProcessing}
                           />
                        </div>
                        
                        <div>
                           <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">
                              Ghi chú (tùy chọn)
                           </label>
                           <input
                              type="text"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              placeholder="Ví dụ: Giao giờ hành chính"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all"
                              disabled={isProcessing}
                           />
                        </div>
                     </div>
                  </div>

                  {/* Payment Method - Compact */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                     <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="size-5 text-primary" />
                        <h3 className="text-sm font-black text-gray-900 uppercase">Phương thức thanh toán</h3>
                     </div>
                     
                     <div className="space-y-2">
                        {/* Wallet */}
                        <div
                           onClick={() => !isProcessing && setPaymentMethod('WALLET')}
                           className={`p-4 border-2 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                              paymentMethod === 'WALLET' 
                                 ? 'border-primary bg-green-50' 
                                 : 'border-gray-200 hover:border-gray-300'
                           } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           <div className={`size-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === 'WALLET' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                           }`}>
                              <Wallet className="size-5" />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-2">
                                 <p className="text-sm font-black text-gray-900">Ví Sàn</p>
                                 <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded uppercase">Khuyên dùng</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-medium">Bảo vệ bởi Escrow</p>
                           </div>
                           {paymentMethod === 'WALLET' && (
                              <div className="size-5 bg-primary rounded-full flex items-center justify-center">
                                 <div className="size-2 bg-white rounded-full" />
                              </div>
                           )}
                        </div>

                        {/* PayOS */}
                        <div
                           onClick={() => !isProcessing && setPaymentMethod('PAYOS')}
                           className={`p-4 border-2 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                              paymentMethod === 'PAYOS' 
                                 ? 'border-blue-500 bg-blue-50' 
                                 : 'border-gray-200 hover:border-gray-300'
                           } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           <div className={`size-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === 'PAYOS' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                           }`}>
                              <CreditCard className="size-5" />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-black text-gray-900">PayOS (VietQR)</p>
                              <p className="text-[10px] text-gray-500 font-medium">Quét mã thanh toán</p>
                           </div>
                           {paymentMethod === 'PAYOS' && (
                              <div className="size-5 bg-blue-500 rounded-full flex items-center justify-center">
                                 <div className="size-2 bg-white rounded-full" />
                              </div>
                           )}
                        </div>

                        {/* COD */}
                        <div
                           onClick={() => !isProcessing && setPaymentMethod('COD')}
                           className={`p-4 border-2 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                              paymentMethod === 'COD' 
                                 ? 'border-orange-500 bg-orange-50' 
                                 : 'border-gray-200 hover:border-gray-300'
                           } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           <div className={`size-10 rounded-lg flex items-center justify-center ${
                              paymentMethod === 'COD' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                           }`}>
                              <Package className="size-5" />
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-black text-gray-900">COD</p>
                              <p className="text-[10px] text-gray-500 font-medium">Thanh toán khi nhận hàng</p>
                           </div>
                           {paymentMethod === 'COD' && (
                              <div className="size-5 bg-orange-500 rounded-full flex items-center justify-center">
                                 <div className="size-2 bg-white rounded-full" />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column - Summary */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                     <h3 className="text-sm font-black text-gray-900 uppercase mb-4">Xác nhận đơn hàng</h3>
                     
                     {/* Products */}
                     <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                        {cartData?.items?.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-start gap-2 text-xs">
                              <div className="flex-1 min-w-0">
                                 <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                                 <p className="text-gray-500 font-medium">SL: {item.quantity}</p>
                              </div>
                              <span className="font-black text-gray-900 whitespace-nowrap">
                                 {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                              </span>
                           </div>
                        ))}
                     </div>

                     {/* Pricing */}
                     <div className="space-y-2 py-4 border-t border-gray-100">
                        <div className="flex justify-between text-xs">
                           <span className="text-gray-600 font-medium">Tiền hàng ({cartData?.items?.length || 0})</span>
                           <span className="font-bold text-gray-900">{(cartData?.totalAmount || 0).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-xs">
                           <span className="text-gray-600 font-medium">Phí vận chuyển</span>
                           <span className="font-bold text-gray-900">{(SHIPPING_FEE * shopsCount).toLocaleString('vi-VN')}đ</span>
                        </div>
                     </div>

                     {/* Total */}
                     <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-xs font-bold text-gray-600 uppercase">Tổng cộng</span>
                           <span className="text-2xl font-black text-primary">{totalAmount.toLocaleString('vi-VN')}đ</span>
                        </div>

                        {error && (
                           <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                              <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-[10px] text-red-600 font-bold">{error}</p>
                           </div>
                        )}

                        <button
                           disabled={isProcessing}
                           onClick={handleConfirmPayment}
                           className="w-full py-3 bg-primary text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isProcessing ? (
                              <><Loader2 className="size-5 animate-spin" /> Đang xử lý...</>
                           ) : (
                              <><Lock className="size-5" /> Xác nhận thanh toán</>
                           )}
                        </button>

                        <p className="text-[9px] text-gray-400 text-center mt-3 font-medium">
                           Bằng cách thanh toán, bạn đồng ý với <span className="text-primary font-bold">Điều khoản</span> của chúng tôi
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* QR Code Modal */}
         {showQRCode && qrCodeUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-6 flex flex-col items-center text-center gap-4">
                     <div className="flex items-center justify-between w-full mb-2">
                        <h3 className="text-lg font-black text-gray-900">Quét mã thanh toán</h3>
                        <button
                           onClick={() => {
                              setShowQRCode(false);
                              setQrCodeUrl(null);
                              setCheckoutUrl(null);
                           }}
                           className="size-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200"
                        >
                           <X className="size-5" />
                        </button>
                     </div>

                     <p className="text-sm text-gray-500 font-medium">
                        Mở app ngân hàng và quét mã QR
                     </p>

                     <div className="w-full aspect-square bg-white border-2 border-gray-100 rounded-2xl p-3">
                        <img 
                           src={qrCodeUrl} 
                           alt="PayOS QR Code" 
                           className="w-full h-full object-contain"
                           onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/300x300?text=QR+Error';
                           }}
                        />
                     </div>

                     <div className="w-full space-y-2">
                        {checkoutUrl && (
                           <a
                              href={checkoutUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all"
                           >
                              <ChevronRight className="size-5" />
                              Mở trang PayOS
                           </a>
                        )}
                     </div>

                     <p className="text-[10px] text-gray-400 font-medium">
                        Đơn hàng sẽ được xử lý sau khi thanh toán thành công
                     </p>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Checkout;
