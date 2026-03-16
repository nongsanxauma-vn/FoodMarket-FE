import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminMessages from '../pages/admin/Messages';
import KYCApproval from '../pages/admin/KYCApproval';
import NewsManagement from '../pages/admin/NewsManagement';
import NotificationManagement from '../pages/admin/NotificationManagement';
import ShopMonitoring from '../pages/admin/ShopMonitoring';
import Disputes from '../pages/admin/Disputes';
import ShipperManagement from '../pages/admin/ShipperManagement';
import BadBuyers from '../pages/admin/BadBuyers';
import AdminWallet from '../pages/admin/AdminWallet';
import { AppRole } from '../types';

const AdminRoutes = () => {
    return (
        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={[AppRole.ADMIN]}>
                <AdminLayout />
            </ProtectedRoute>
        }>
            <Route index element={<AdminDashboard />} />
            <Route path="overview" element={<AdminDashboard />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="kyc" element={<KYCApproval />} />
            <Route path="news" element={<NewsManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="stores" element={<ShopMonitoring />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="shippers" element={<ShipperManagement />} />
            <Route path="bad-buyers" element={<BadBuyers />} />
            <Route path="wallet" element={<AdminWallet />} />
        </Route>
    );
};

export default AdminRoutes;
