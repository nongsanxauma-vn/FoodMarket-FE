import React, { useEffect, useState } from 'react';
import { XCircle, Loader2, ShoppingCart, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Get params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderCode = urlParams.get('orderCode');
  const cancel = urlParams.get('cancel');
  const status = urlParams.get('status');

  useEffect(() => {
    // Countdown to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 py-20">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-12 flex flex-col items-center text-center">
          {/* Cancel Icon */}
          <div className="size-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-700">
            <div className="size-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="size-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-gray-900 mb-3 font-display">
            Thanh toán đã hủy
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
            Bạn đã hủy thanh toán qua PayOS. Đơn hàng của bạn vẫn còn trong giỏ hàng,
            bạn có thể thanh toán lại bất cứ lúc nào.
          </p>

          {/* Order Info */}
          {orderCode && (
            <div className="w-full p-6 bg-gray-50 rounded-3xl mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Mã đơn hàng
              </p>
              <p className="text-xl font-black text-gray-900">
                #{orderCode}
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="w-full p-4 bg-yellow-50 border border-yellow-100 rounded-2xl mb-8 flex items-start gap-3">
            <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 font-medium text-left">
              Đơn hàng chưa được thanh toán. Vui lòng hoàn tất thanh toán để shop có thể xử lý đơn hàng của bạn.
            </p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3 text-sm text-gray-500 font-bold mb-8">
            <Loader2 className="size-4 animate-spin" />
            <span>Tự động chuyển sau {countdown} giây...</span>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <button
              onClick={handleGoToCart}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <ShoppingCart className="size-5" />
              Quay lại giỏ hàng
            </button>

            <button
              onClick={handleGoHome}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              Tiếp tục mua sắm
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
