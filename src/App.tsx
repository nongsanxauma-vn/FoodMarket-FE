
import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home/Home';
import ProductDetail from './pages/Product/ProductDetail';
import Cart from './pages/auth/Cart';
import Checkout from './pages/auth/Checkout';
import Success from './pages/auth/Success';
import Tracking from './pages/auth/Tracking';
import News from './pages/News/News';
import FarmerDashboard from './pages/farmer/Dashboard';
import Products from './pages/farmer/Products';
import AddProduct from './pages/farmer/AddProduct';
import Wallet from './pages/farmer/Wallet';
import Orders from './pages/farmer/Orders';
import Profile from './pages/farmer/Profile';
import BlindBoxTool from './pages/farmer/BlindBoxTool';
import FarmerNotifications from './pages/farmer/Notifications';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import KYC from './pages/auth/KYC';
import ShipperDashboard from './pages/shipper/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import KYCApproval from './pages/admin/KYCApproval';
import ShopMonitoring from './pages/admin/ShopMonitoring';
import Disputes from './pages/admin/Disputes';
import ShipperManagement from './pages/admin/ShipperManagement';
import BadBuyers from './pages/admin/BadBuyers';
import AdminWallet from './pages/admin/AdminWallet';
import NotificationManagement from './pages/admin/NotificationManagement';
import NewsManagement from './pages/admin/NewsManagement';
import { AppRole, User, KYCStatus } from './types/index';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isKYCRequired, setIsKYCRequired] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | null>(null);
  const [role, setRole] = useState<AppRole>(AppRole.BUYER);
  const [farmerSubPage, setFarmerSubPage] = useState<string>('overview');
  const [adminSubPage, setAdminSubPage] = useState<string>('admin-overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);

  const currentUser: User | null = isAuthenticated ? {
    id: 'user-123',
    name: role === AppRole.SHIPPER ? 'Anh Hùng Shipper' : role === AppRole.FARMER ? 'Bác Ba Nông Dân' : role === AppRole.ADMIN ? 'Admin Tổng' : 'Người dùng Xấu Mã',
    email: 'user@xauma.vn',
    role: role,
    kycStatus: KYCStatus.APPROVED,
    avatar: role === AppRole.FARMER ? 'https://picsum.photos/seed/farmer_ba/100/100' : 'https://picsum.photos/seed/app_avatar/100/100'
  } : null;

  const handleLogin = (selectedRole: AppRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setAuthMode(null);
  };

  const handleRegister = (selectedRole: AppRole) => {
    setRole(selectedRole);
    if (selectedRole === AppRole.FARMER || selectedRole === AppRole.SHIPPER) {
      setIsKYCRequired(true);
      setAuthMode(null);
    } else {
      setIsAuthenticated(true);
      setAuthMode(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsKYCRequired(false);
    setAuthMode(null);
    setSelectedProductId(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
    setIsTrackingOpen(false);
    setIsNewsOpen(false);
    setRole(AppRole.BUYER);
  };

  const handleKYCComplete = () => {
    setIsKYCRequired(false);
    setIsAuthenticated(true);
    setFarmerSubPage('overview');
  };

  const handleOpenCart = () => {
    if (!isAuthenticated) {
      setAuthMode('LOGIN');
      return;
    }
    setIsCartOpen(true);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
    setIsTrackingOpen(false);
    setIsNewsOpen(false);
    setSelectedProductId(null);
  };

  const handleOpenNews = () => {
    setIsNewsOpen(true);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
    setIsTrackingOpen(false);
    setSelectedProductId(null);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const handleOpenTracking = () => {
    setIsSuccessOpen(false);
    setIsTrackingOpen(true);
  };

  const handleCloseBuyerSpecialPages = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
    setIsTrackingOpen(false);
    setIsNewsOpen(false);
    setSelectedProductId(null);
  };

  // Rendering logic for Auth Screens
  if (isKYCRequired && (role === AppRole.FARMER || role === AppRole.SHIPPER)) {
    return <KYC role={role as any} onComplete={handleKYCComplete} onBack={() => setIsKYCRequired(false)} />;
  }

  if (authMode === 'REGISTER') {
    return <Register onRegister={handleRegister} onGoToLogin={() => setAuthMode('LOGIN')} />;
  }

  if (authMode === 'LOGIN') {
    return <Login onLogin={handleLogin} onGoToRegister={() => setAuthMode('REGISTER')} />;
  }

  const renderFarmerContent = () => {
    switch (farmerSubPage) {
      case 'overview': return <FarmerDashboard onNavigate={setFarmerSubPage} />;
      case 'products': return <Products onNavigate={setFarmerSubPage} />;
      case 'add-product': return <AddProduct onBack={() => setFarmerSubPage('products')} />;
      case 'wallet': return <Wallet />;
      case 'orders': return <Orders />;
      case 'notifications': return <FarmerNotifications />;
      case 'profile': return <Profile />;
      case 'blind-box': return <BlindBoxTool />;
      default: return <FarmerDashboard onNavigate={setFarmerSubPage} />;
    }
  };

  const renderAdminContent = () => {
    switch (adminSubPage) {
      case 'admin-overview': return <AdminDashboard />;
      case 'admin-kyc': return <KYCApproval />;
      case 'admin-news': return <NewsManagement />;
      case 'admin-notifications': return <NotificationManagement />;
      case 'admin-stores': return <ShopMonitoring />;
      case 'admin-disputes': return <Disputes />;
      case 'admin-shippers': return <ShipperManagement />;
      case 'admin-bad-buyers': return <BadBuyers />;
      case 'admin-wallet': return <AdminWallet />;
      default: return <AdminDashboard />;
    }
  }

  const renderContent = () => {
    switch (role) {
      case AppRole.BUYER:
        return (
          <div className="flex flex-col min-h-screen">
            <Header 
              user={currentUser} 
              isAuthenticated={isAuthenticated}
              onRoleSwitch={setRole} 
              onOpenCart={handleOpenCart} 
              onLogout={handleLogout}
              onOpenNews={handleOpenNews} 
              onGoHome={handleCloseBuyerSpecialPages}
              onOpenLogin={() => setAuthMode('LOGIN')}
              onOpenRegister={() => setAuthMode('REGISTER')}
            />
            <div className="flex-1">
              {isTrackingOpen ? <Tracking onBack={handleCloseBuyerSpecialPages} /> :
               isSuccessOpen ? <Success onTrackOrder={handleOpenTracking} onGoHome={handleCloseBuyerSpecialPages} /> :
               isCheckoutOpen ? <Checkout onComplete={handlePaymentSuccess} onBack={handleOpenCart} /> :
               isCartOpen ? <Cart onProceedToCheckout={handleProceedToCheckout} onBackToShopping={handleCloseBuyerSpecialPages} /> :
               isNewsOpen ? <News /> :
               selectedProductId ? <ProductDetail productId={selectedProductId} onBack={() => setSelectedProductId(null)} /> :
               <Home onSelectProduct={(id) => {
                 setSelectedProductId(id);
               }} />}
            </div>
            <Footer />
          </div>
        );
      case AppRole.FARMER:
        return (
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar role={role} currentPath={farmerSubPage} onNavigate={setFarmerSubPage} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto bg-background">{renderFarmerContent()}</main>
          </div>
        );
      case AppRole.SHIPPER:
        return <ShipperDashboard onLogout={handleLogout} />;
      case AppRole.ADMIN:
        return (
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar role={role} currentPath={adminSubPage} onNavigate={setAdminSubPage} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto bg-background">{renderAdminContent()}</main>
          </div>
        );
      default:
        return <div className="p-20 text-center font-bold">Unauthorized Access</div>;
    }
  };

  return <div className="min-h-screen bg-background">{renderContent()}</div>;
};

export default App;
