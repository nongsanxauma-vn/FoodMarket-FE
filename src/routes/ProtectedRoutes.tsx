
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Cart from '../pages/auth/Cart';
import Checkout from '../pages/auth/Checkout';
import Success from '../pages/auth/Success';
import Tracking from '../pages/auth/Tracking';
import MyOrders from '../pages/auth/MyOrders';
import Profile from '../pages/farmer/Profile';
import KYC from '../pages/auth/KYC';
import { AppRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoutes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Route path="/cart" element={
                <ProtectedRoute>
                    <Cart onProceedToCheckout={() => navigate('/checkout')} onBackToShopping={() => navigate('/')} />
                </ProtectedRoute>
            } />
            <Route path="/checkout" element={
                <ProtectedRoute>
                    <Checkout onComplete={(id) => navigate(`/success?orderId=${id}`)} onBack={() => navigate('/cart')} />
                </ProtectedRoute>
            } />
            <Route path="/success" element={
                <ProtectedRoute>
                    <Success onViewMyOrders={() => navigate('/my-orders')} onGoHome={() => navigate('/')} orderId={0} />
                </ProtectedRoute>
            } />
            <Route path="/tracking/:orderId" element={
                <ProtectedRoute>
                    <Tracking onBack={() => navigate(-1)} orderId={0} />
                </ProtectedRoute>
            } />
            <Route path="/my-orders" element={
                <ProtectedRoute>
                    <MyOrders onBack={() => navigate('/')} onViewTracking={(id) => navigate(`/tracking/${id}`)} />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            <Route path="/kyc" element={
                <ProtectedRoute allowedRoles={[AppRole.FARMER, AppRole.SHIPPER]}>
                    <KYC
                        onComplete={() => navigate('/')}
                        onBack={() => navigate('/')}
                        role={(user?.role === AppRole.SHIPPER ? 'SHIPPER' : 'FARMER')}
                        user={user}
                    />
                </ProtectedRoute>
            } />
        </>
    );
};

export default ProtectedRoutes;
