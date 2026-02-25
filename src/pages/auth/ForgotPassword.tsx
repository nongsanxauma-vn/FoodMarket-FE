import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { otpService, passwordService } from '../../services';
import OTPVerification from '../../components/auth/OTPVerification';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);

    try {
      await otpService.sendOtp(email);
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err?.data?.message || 'Không thể gửi OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      await passwordService.resetPassword(email, newPassword, confirmPassword);
      setStep('success');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Enter Email
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 font-bold text-sm"
          >
            <ArrowLeft className="size-4" />
            Quay lại đăng nhập
          </button>

          <div className="flex justify-center mb-6">
            <div className="size-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="size-8 text-blue-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Quên mật khẩu?</h2>
            <p className="text-gray-500 text-sm">
              Nhập email của bạn để nhận mã xác thực
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-600 font-semibold text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-semibold transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-4 bg-blue-500 text-white font-black text-sm rounded-2xl hover:bg-blue-600 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'ĐANG GỬI...' : 'GỬI MÃ XÁC THỰC'}
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Verify OTP
  if (step === 'otp') {
    return (
      <OTPVerification
        email={email}
        onVerified={() => setStep('password')}
        onBack={() => setStep('email')}
      />
    );
  }

  // Step 3: Enter New Password
  if (step === 'password') {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="size-16 bg-green-50 rounded-full flex items-center justify-center">
              <Lock className="size-8 text-green-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Đặt mật khẩu mới</h2>
            <p className="text-gray-500 text-sm">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-600 font-semibold text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="password"
                placeholder="Mật khẩu mới (min 8 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none text-sm font-semibold transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none text-sm font-semibold transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full py-4 bg-green-500 text-white font-black text-sm rounded-2xl hover:bg-green-600 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'ĐANG ĐẶT LẠI...' : 'ĐẶT LẠI MẬT KHẨU'}
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 4: Success
  return (
    <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="size-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="size-12 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">Thành công!</h2>
        <p className="text-gray-500 text-sm mb-8">
          Mật khẩu của bạn đã được đặt lại thành công.
        </p>

        <button
          onClick={onSuccess}
          className="w-full py-4 bg-[#5c8d5e] text-white font-black text-sm rounded-2xl hover:bg-[#4a724b] transition-all"
        >
          ĐĂNG NHẬP NGAY
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
