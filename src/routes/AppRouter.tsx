
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import AuthRoutes from './AuthRoutes';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoutes from './AdminRoutes';
import FarmerRoutes from './FarmerRoutes';
import ShipperRoutes from './ShipperRoutes';
import ChatPage from '../pages/chat/ChatPage';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* MainLayout (Header + Footer) cho mọi trang buyer + auth */}
            <Route element={<MainLayout />}>
                {AuthRoutes()}
                {PublicRoutes()}
                {ProtectedRoutes()}
            </Route>

            {/* Chat page - fullscreen, không có header/footer */}
            <Route path="/chat" element={<ChatPage />} />

            {/* Admin, Farmer, Shipper Routes (layout riêng) */}
            {AdminRoutes()}
            {FarmerRoutes()}
            {ShipperRoutes()}

            {/* Fallback 404 */}
            <Route path="*" element={<div className="p-20 text-center font-bold">404 - Trang không tìm thấy</div>} />
        </Routes>
    );
};

export default AppRouter;
