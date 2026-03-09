
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ShipperDashboard from '../pages/shipper/Dashboard';
import { AppRole, KYCStatus } from '../types';

const ShipperRoutes = () => {
    return (
        <Route path="/shipper" element={
            <ProtectedRoute allowedRoles={[AppRole.SHIPPER]} requiredStatus={KYCStatus.APPROVED}>
                <ShipperDashboard onLogout={() => { }} />
            </ProtectedRoute>
        } />
    );
};

export default ShipperRoutes;
