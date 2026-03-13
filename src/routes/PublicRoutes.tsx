import { Route, Navigate, useNavigate } from 'react-router-dom';
import BuyerHome from '../pages/BuyerHome';
import ProductDetail from '../pages/Product/ProductDetail';
import MysteryBoxDetail from '../pages/MysteryBox/MysteryBoxDetail';
import News from '../pages/News/News';
import NewsDetail from '../pages/News/NewsDetail';
import PaymentSuccess from '../pages/auth/PaymentSuccess';
import PaymentCancel from '../pages/auth/PaymentCancel';
import { useAuth } from '../contexts/AuthContext';
import { AppRole } from '../types';

const PublicRoutes = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSelectProduct = (id: string) => {
        if (id.startsWith('box-')) {
            // Túi mù: bỏ prefix "box-" rồi navigate đến trang detail riêng
            navigate(`/mystery-box/${id.replace('box-', '')}`);
        } else {
            // Sản phẩm thường
            navigate(`/product/${id}`);
        }
    };

    const renderRoot = () => {
        if (isAuthenticated && user) {
            if (user.role === AppRole.ADMIN) return <Navigate to="/admin" replace />;
            if (user.role === AppRole.FARMER) return <Navigate to="/farmer" replace />;
            if (user.role === AppRole.SHIPPER) return <Navigate to="/shipper" replace />;
        }
        return <BuyerHome onSelectProduct={handleSelectProduct} />;
    };

    return (
        <>
            <Route path="/" element={renderRoot()} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            {/* Route mới cho túi mù */}
            <Route path="/mystery-box/:boxId" element={<MysteryBoxDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />

            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/withdraw/success" element={<PaymentSuccess />} />
            <Route path="/withdraw/cancel" element={<PaymentCancel />} />
        </>
    );
};

export default PublicRoutes;