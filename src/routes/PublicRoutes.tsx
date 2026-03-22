import { Route, Navigate, useNavigate } from 'react-router-dom';
import BuyerHome from '../pages/BuyerHome';
import SearchResults from '../pages/SearchResults';
import ProductDetail from '../pages/Product/ProductDetail';
import MysteryBoxDetail from '../pages/MysteryBox/MysteryBoxDetail';
import ComboDetail from '../pages/Combo/ComboDetail';
import AllCombos from '../pages/Combo/AllCombos';
import AllMysteryBoxes from '../pages/MysteryBox/AllMysteryBoxes';
import News from '../pages/News/News';
import NewsDetail from '../pages/News/NewsDetail';
import PaymentSuccess from '../pages/auth/PaymentSuccess';
import PaymentCancel from '../pages/auth/PaymentCancel';
import MealPlan from '../pages/auth/MealPlan';
import { useAuth } from '../contexts/AuthContext';
import { AppRole } from '../types';

const PublicRoutes = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSelectProduct = (id: string) => {
        if (id.startsWith('box-')) {
            navigate(`/mystery-box/${id.replace('box-', '')}`);
        } else if (id.startsWith('combo-')) {
            navigate(`/combo/${id.replace('combo-', '')}`);
        } else {
            navigate(`/product/${id}`);
        }
    };

    const renderRoot = () => {
        if (isAuthenticated && user) {
            if (user.role === AppRole.ADMIN) return <Navigate to="/admin" replace />;
            if (user.role === AppRole.FARMER) return <Navigate to="/farmer" replace />;
            if (user.role === AppRole.SHIPPER) return <Navigate to="/shipper" replace />;
        }
        return <BuyerHome onSelectProduct={handleSelectProduct} isAuthenticated={isAuthenticated} onOpenLogin={() => navigate('/login')} />;
    };

    return (
        <>
            <Route path="/" element={renderRoot()} />
            <Route path="/search" element={<SearchResults onSelectProduct={handleSelectProduct} />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/mystery-box/:boxId" element={<MysteryBoxDetail />} />
            <Route path="/combo/:comboId" element={<ComboDetail />} />
            <Route path="/combos" element={<AllCombos />} />
            <Route path="/mystery-boxes" element={<AllMysteryBoxes />} />
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