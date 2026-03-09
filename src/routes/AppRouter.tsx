
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import AuthRoutes from './AuthRoutes';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AdminRoutes from './AdminRoutes';
import FarmerRoutes from './FarmerRoutes';
import ShipperRoutes from './ShipperRoutes';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* MainLayout (Header + Footer) cho mọi trang buyer + auth để không mất header/footer */}
            <Route element={<MainLayout />}>
                {AuthRoutes()}
                {PublicRoutes()}
                {ProtectedRoutes()}
            </Route>

            {/* Admin, Farmer, Shipper Routes (layout riêng, không dùng MainLayout) */}
            {AdminRoutes()}
            {FarmerRoutes()}
            {ShipperRoutes()}

            {/* Fallback 404 */}
            <Route path="*" element={<div className="p-20 text-center font-bold">404 - Trang không tìm thấy</div>} />
        </Routes>
    );
};

export default AppRouter;
