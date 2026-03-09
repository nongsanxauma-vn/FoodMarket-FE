
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { AppRole } from '../types';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the segment after /admin/
    const segments = location.pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    const currentPath = lastSegment === 'admin' ? 'admin-overview' : `admin-${lastSegment}`;

    const handleNavigate = (path: string) => {
        const route = path.replace('admin-', '');
        navigate(`/admin/${route}`);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar
                role={AppRole.ADMIN}
                user={user}
                currentPath={currentPath}
                onNavigate={handleNavigate}
                onLogout={logout}
            />
            <main className="flex-1 overflow-y-auto bg-background">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
