import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Get params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderCode = urlParams.get('orderCode');
  const status = urlParams.get('status');
  const cancel = urlParams.get('cancel');

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

  const handleGoToMyOrders = () => {
    navigate('/my-orders');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 py-20">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-12 flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="size-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-700">
            <div className="size-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-gray-900 mb-3 font-display">
            Thanh toán thành công!
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
            Đơn hàng của bạn đã được thanh toán thành công qua PayOS.
            Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.
          </p>

          {/* Order Info */}
          {orderCode && (
            <div className="w-full p-6 bg-gray-50 rounded-3xl mb-8">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Mã đơn hàng
              </p>
              <p className="text-xl font-black text-primary">
                #{orderCode}
              </p>
            </div>
          )}

          {/* Countdown */}
          <div className="flex items-center gap-3 text-sm text-gray-500 font-bold mb-8">
            <Loader2 className="size-4 animate-spin" />
            <span>Tự động chuyển sau {countdown} giây...</span>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3">
            <button
              onClick={handleGoToMyOrders}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <Package className="size-5" />
              Xem đơn hàng của tôi
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

export default PaymentSuccess;
