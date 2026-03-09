
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppRole, KYCStatus } from '../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: AppRole[];
    requiredStatus?: KYCStatus;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, requiredStatus }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-500">Đang kiểm tra quyền truy cập...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // If user doesn't have required role, redirect to home
        return <Navigate to="/" replace />;
    }

    if (requiredStatus && user && user.kycStatus !== requiredStatus) {
        // If user doesn't have required status, redirect to KYC info page
        return <Navigate to="/kyc" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
