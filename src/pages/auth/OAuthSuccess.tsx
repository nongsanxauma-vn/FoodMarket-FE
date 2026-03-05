
import React, { useEffect, useState } from 'react';
import { authService } from '../../services';
import { AppRole } from '../../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface OAuthSuccessProps {
    onLogin: (role: AppRole) => void;
}

const OAuthSuccess: React.FC<OAuthSuccessProps> = ({ onLogin }) => {
    const [status, setStatus] = useState<'LOADING' | 'ERROR'>('LOADING');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const handleAuth = async () => {
            try {
                // 1. Get token from URL
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');

                if (!token) {
                    throw new Error('Không tìm thấy mã xác thực (Token).');
                }

                // 2. Save token
                authService.setToken(token);

                // 3. Fetch user info
                const userInfo = await authService.getMyInfo();

                if (userInfo.result) {
                    // Map role from backend to frontend AppRole
                    const roleMap: Record<string, AppRole> = {
                        'BUYER': AppRole.BUYER,
                        'SHOP_OWNER': AppRole.FARMER,
                        'SHIPPER': AppRole.SHIPPER,
                        'ADMIN': AppRole.ADMIN,
                    };

                    const backendRole = userInfo.result.role?.name || 'BUYER';
                    const userRole = roleMap[backendRole] || AppRole.BUYER;

                    // Clear URL params and navigate
                    window.history.replaceState({}, document.title, "/nong_san_xau_ma/");

                    // 4. Trigger login callback
                    onLogin(userRole);
                } else {
                    throw new Error('Không thể tải thông tin người dùng.');
                }
            } catch (err: any) {
                console.error('OAuth handling error:', err);
                setStatus('ERROR');
                setErrorMsg(err.message || 'Đã có lỗi xảy ra trong quá trình đăng nhập bằng Google.');
            }
        };

        handleAuth();
    }, [onLogin]);

    if (status === 'ERROR') {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-red-50 max-w-md w-full text-center">
                    <div className="size-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="size-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Đăng nhập thất bại</h2>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                        {errorMsg}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                    >
                        QUAY LẠI TRANG CHỦ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center">
            <div className="text-center">
                <div className="relative inline-block mb-8">
                    <div className="size-24 border-8 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-8" alt="Google" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Đang xác thực...</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
