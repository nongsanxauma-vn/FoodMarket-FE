
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ShipperDashboard from '../pages/shipper/Dashboard';
import { AppRole, KYCStatus } from '../types';
import { authService } from '../services';

const ShipperRoutes = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    return (
        <Route path="/shipper" element={
            <ProtectedRoute allowedRoles={[AppRole.SHIPPER]} requiredStatus={KYCStatus.APPROVED}>
                <ShipperDashboard onLogout={handleLogout} />
            </ProtectedRoute>
        } />
    );
};


export default ShipperRoutes;
