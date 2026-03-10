
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import FarmerLayout from './FarmerLayout';
import ProtectedRoute from './ProtectedRoute';
import FarmerDashboard from '../pages/farmer/Dashboard';
import Products from '../pages/farmer/Products';
import AddProduct from '../pages/farmer/AddProduct';
import ComboBuilder from '../pages/farmer/ComboBuilder';
import Wallet from '../pages/farmer/Wallet';
import Orders from '../pages/farmer/Orders';
import OrderPreparation from '../pages/farmer/OrderPreparation';
import Profile from '../pages/farmer/Profile';
import BlindBoxTool from '../pages/farmer/BlindBoxTool';
import FarmerNotifications from '../pages/farmer/Notifications';
import Reviews from '../pages/farmer/Reviews';
import { AppRole, KYCStatus } from '../types';

const FarmerRoutes = () => {
    const navigate = useNavigate();

    return (
        <Route path="/farmer" element={
            <ProtectedRoute allowedRoles={[AppRole.FARMER]} requiredStatus={KYCStatus.APPROVED}>
                <FarmerLayout />
            </ProtectedRoute>
        }>
            <Route index element={<FarmerDashboard onNavigate={(path) => navigate(`/farmer/${path}`)} />} />
            <Route path="overview" element={<FarmerDashboard onNavigate={(path) => navigate(`/farmer/${path}`)} />} />
            <Route path="products" element={<Products onNavigate={(path) => navigate(`/farmer/${path}`)} />} />
            <Route path="add-product" element={<AddProduct onBack={() => navigate('/farmer/products')} />} />
            <Route path="combo-builder" element={<ComboBuilder onBack={() => navigate('/farmer/products')} />} />
            <Route path="combo-builder/:comboId" element={<ComboBuilder onBack={() => navigate('/farmer/products')} />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="orders" element={<Orders onPrepareOrder={(id) => navigate(`/farmer/order-prep/${id}`)} />} />
            <Route path="order-prep/:orderId" element={<OrderPreparation orderId="" onBack={() => navigate('/farmer/orders')} onComplete={() => navigate('/farmer/orders')} />} />
            <Route path="notifications" element={<FarmerNotifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="blind-box" element={<BlindBoxTool />} />
            <Route path="reviews" element={<Reviews />} />
        </Route>
    );
};

export default FarmerRoutes;
