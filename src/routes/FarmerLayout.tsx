
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { AppRole } from '../types';

const FarmerLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the segment after /farmer/
    const segments = location.pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    const currentPath = lastSegment === 'farmer' ? 'overview' : lastSegment;

    const handleNavigate = (path: string) => {
        // Chat có trang riêng ngoài farmer layout
        if (path === 'chat') {
            navigate('/chat');
            return;
        }
        navigate(`/farmer/${path}`);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar
                role={AppRole.FARMER}
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

export default FarmerLayout;
