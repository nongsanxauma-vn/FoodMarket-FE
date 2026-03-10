
import { Route, Navigate, useNavigate } from 'react-router-dom';
import BuyerHome from '../pages/BuyerHome';
import ProductDetail from '../pages/Product/ProductDetail';
import News from '../pages/News/News';
import NewsDetail from '../pages/News/NewsDetail';
import PaymentSuccess from '../pages/auth/PaymentSuccess';
import PaymentCancel from '../pages/auth/PaymentCancel';
import { useAuth } from '../contexts/AuthContext';
import { AppRole } from '../types';

const PublicRoutes = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const renderRoot = () => {
        if (isAuthenticated && user) {
            if (user.role === AppRole.ADMIN) return <Navigate to="/admin" replace />;
            if (user.role === AppRole.FARMER) return <Navigate to="/farmer" replace />;
            if (user.role === AppRole.SHIPPER) return <Navigate to="/shipper" replace />;
        }
        return <BuyerHome onSelectProduct={(id) => navigate(`/product/${id}`)} />;
    };

    return (
        <>
            <Route path="/" element={renderRoot()} />
            <Route path="/product/:productId" element={<ProductDetail />} />
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
