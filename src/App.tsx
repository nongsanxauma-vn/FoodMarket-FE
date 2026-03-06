
import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import BuyerHome from './pages/BuyerHome';
import ProductDetail from './pages/Product/ProductDetail';
import Cart from './pages/auth/Cart';
import Checkout from './pages/auth/Checkout';
import Success from './pages/auth/Success';
import Tracking from './pages/auth/Tracking';
import MyOrders from './pages/auth/MyOrders';
import PaymentSuccess from './pages/auth/PaymentSuccess';
import PaymentCancel from './pages/auth/PaymentCancel';
import News from './pages/News/News';
import NewsDetail from './pages/News/NewsDetail';
import FarmerDashboard from './pages/farmer/Dashboard';
import Products from './pages/farmer/Products';
import AddProduct from './pages/farmer/AddProduct';
import ComboBuilder from './pages/farmer/ComboBuilder';
import Wallet from './pages/farmer/Wallet';
import Orders from './pages/farmer/Orders';
import OrderPreparation from './pages/farmer/OrderPreparation';
import Profile from './pages/farmer/Profile';
import BlindBoxTool from './pages/farmer/BlindBoxTool';
import FarmerNotifications from './pages/farmer/Notifications';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ShipperRegister from './pages/auth/ShipperRegister';
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
import OAuthSuccess from './pages/auth/OAuthSuccess';
import OAuthRegister from './pages/auth/OAuthRegister';
import { authService } from './services';
// import ProductApproval from './pages/admin/ProductApproval';
import { AppRole, User, KYCStatus } from './types/index';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isKYCRequired, setIsKYCRequired] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'SHIPPER_REGISTER' | null>(null);
  const [role, setRole] = useState<AppRole>(AppRole.BUYER);
  const [farmerSubPage, setFarmerSubPage] = useState<string>('overview');
  const [adminSubPage, setAdminSubPage] = useState<string>('admin-overview');
  const [selectedOrderIdForPrep, setSelectedOrderIdForPrep] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'home' | 'blindbox' | 'news'>('home');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);


  // Fetch user info when authenticated
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const response = await authService.getMyInfo();
          if (response.result) {
            const userData = response.result;
            const backendRole = userData.role.name;
            const accountRole = backendRole === 'SHOP_OWNER' ? AppRole.FARMER :
              (backendRole === 'SHIPPER' ? AppRole.SHIPPER :
                (backendRole === 'ADMIN' ? AppRole.ADMIN : AppRole.BUYER));

            const mappedUser: User = {
              id: userData.id.toString(),
              name: userData.fullName,
              email: userData.email,
              role: accountRole, // Use the actual role from backend
              kycStatus: userData.status === 'PENDING' ? KYCStatus.PENDING : (userData.status === 'ACTIVE' ? KYCStatus.APPROVED : KYCStatus.REJECTED),
              avatar: userData.logoUrl || userData.profileImageUrl || (role === AppRole.FARMER ? 'https://picsum.photos/seed/farmer_ba/100/100' : 'https://picsum.photos/seed/app_avatar/100/100'),
              phone: userData.phoneNumber,
              address: userData.address,
              shopName: userData.shopName,
              bankAccount: userData.bankAccount,
              description: userData.description,
              achievement: userData.achievement
            };
            setCurrentUser(mappedUser);
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          if (authService.getToken()) {
            // Token might be expired
            handleLogout();
          }
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  // Prevent body scroll when modal is open (but NOT for full page views like ProductDetail or News)
  useEffect(() => {
    const isModalOpen = isCartOpen || isCheckoutOpen || isSuccessOpen || isTrackingOpen || isMyOrdersOpen;
    if (isModalOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isCheckoutOpen, isSuccessOpen, isTrackingOpen, isMyOrdersOpen, isProfileOpen]);

  // Reset order prep when navigating away from Orders
  useEffect(() => {
    if (farmerSubPage !== 'orders') {
      setSelectedOrderIdForPrep(null);
    }
  }, [farmerSubPage]);



  // Scroll to top when page changes
  useEffect(() => {
    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
  }, [farmerSubPage, adminSubPage]);

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
    authService.logout();
    setIsAuthenticated(false);
    setIsKYCRequired(false);
    setAuthMode(null);
    setSelectedProductId(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
    setIsTrackingOpen(false);
    setIsNewsOpen(false);
    setIsProfileOpen(false);
    setRole(AppRole.BUYER);
  };

  const handleKYCComplete = () => {
    setIsKYCRequired(false);
    setIsAuthenticated(true);
    // Refresh user info after KYC
    authService.getMyInfo().then(res => {
      if (res.result) {
        const userData = res.result;
        setCurrentUser(prev => prev ? { ...prev, kycStatus: KYCStatus.APPROVED } : null);
      }
    });
    setFarmerSubPage('overview');
    setIsProfileOpen(false);
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
    setActiveTab('news');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (orderId: number) => {
    setIsCheckoutOpen(false);
    setCurrentOrderId(orderId);
    setIsSuccessOpen(true);
  };

  const handleOpenMyOrders = () => {
    setIsSuccessOpen(false);
    setIsMyOrdersOpen(true);
  };

  const handleOpenTracking = (orderId: number) => {
    setIsMyOrdersOpen(false);
    setCurrentOrderId(orderId);
    setIsTrackingOpen(true);
  };
  const handleCloseBuyerSpecialPages = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
    setIsTrackingOpen(false);
    setIsMyOrdersOpen(false);
    setIsNewsOpen(false);
    setIsProfileOpen(false);
    setSelectedProductId(null);
    setSelectedNewsId(null);
    setActiveTab('home');
  };

  // 1. Handle OAuth Success path detection
  if (window.location.pathname.endsWith('/oauth-success')) {
    return <OAuthSuccess onLogin={handleLogin} />;
  }

  // 2. Handle OAuth Registration route
  if (window.location.pathname.endsWith('/oauth-register')) {
    return <OAuthRegister
      onRegisterSuccess={handleRegister}
      onGoToLogin={() => {
        window.history.replaceState({}, document.title, "/nong_san_xau_ma/");
        setAuthMode('LOGIN');
      }}
    />;
  }

  // 3. Handle Payment Success callback from PayOS
  if (window.location.pathname.includes('/payment/success') || window.location.pathname.includes('/withdraw/success')) {
    return <PaymentSuccess />;
  }

  // 4. Handle Payment Cancel callback from PayOS
  if (window.location.pathname.includes('/payment/cancel') || window.location.pathname.includes('/withdraw/cancel')) {
    return <PaymentCancel />;
  }

  // Show loading while fetching user info if authenticated
  if (isAuthenticated && !currentUser) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-500">Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  // Rendering logic for Auth Screens
  // Force KYC for Farmers and Shippers if status is PENDING or it's a first-time registration
  const shouldShowKYC = (isAuthenticated && currentUser?.kycStatus === KYCStatus.PENDING) ||
    (isKYCRequired && (role === AppRole.FARMER || role === AppRole.SHIPPER));

  if (shouldShowKYC && (role === AppRole.FARMER || role === AppRole.SHIPPER)) {
    return (
      <KYC
        role={role as any}
        user={currentUser}
        onComplete={handleKYCComplete}
        onBack={handleLogout}
      />
    );
  }

  if (authMode === 'SHIPPER_REGISTER') {
    return <ShipperRegister
      onComplete={() => {
        setAuthMode('LOGIN');
      }}
      onBack={() => setAuthMode('REGISTER')}
    />;
  }

  if (authMode === 'REGISTER') {
    return <Register
      onRegister={handleRegister}
      onGoToLogin={() => setAuthMode('LOGIN')}
      onGoToShipperRegister={() => setAuthMode('SHIPPER_REGISTER')}
    />;
  }

  if (authMode === 'LOGIN') {
    return <Login onLogin={handleLogin} onGoToRegister={() => setAuthMode('REGISTER')} />;
  }

  const renderFarmerContent = () => {
    // Show order preparation if selected
    if (selectedOrderIdForPrep) {
      return <OrderPreparation
        orderId={selectedOrderIdForPrep}
        onBack={() => setSelectedOrderIdForPrep(null)}
        onComplete={() => setSelectedOrderIdForPrep(null)}
      />;
    }

    switch (farmerSubPage) {
      case 'overview': return <FarmerDashboard onNavigate={setFarmerSubPage} />;
      case 'products': return <Products onNavigate={setFarmerSubPage} />;
      case 'add-product': return <AddProduct onBack={() => setFarmerSubPage('products')} />;
      case 'combo-builder': return <ComboBuilder onBack={() => setFarmerSubPage('overview')} />;
      case 'wallet': return <Wallet />;
      case 'orders': return <Orders onPrepareOrder={setSelectedOrderIdForPrep} />;
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
      // case 'admin-products': return <ProductApproval />;
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
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenMyOrders={handleOpenMyOrders}
              activeTab={activeTab}
            />
            <div className="flex-1">
              {isTrackingOpen ? <Tracking onBack={handleCloseBuyerSpecialPages} orderId={currentOrderId} /> :
                isMyOrdersOpen ? <MyOrders onBack={handleCloseBuyerSpecialPages} onViewTracking={handleOpenTracking} /> :
                  isSuccessOpen ? <Success onViewMyOrders={handleOpenMyOrders} onGoHome={handleCloseBuyerSpecialPages} orderId={currentOrderId} /> :
                    isCheckoutOpen ? <Checkout onComplete={handlePaymentSuccess} onBack={handleOpenCart} /> :
                      isCartOpen ? <Cart onProceedToCheckout={handleProceedToCheckout} onBackToShopping={handleCloseBuyerSpecialPages} /> :
                        isNewsOpen ? <News /> :
                          selectedProductId ? <ProductDetail
                            productId={selectedProductId}
                            onBack={() => setSelectedProductId(null)}
                            isAuthenticated={isAuthenticated}
                            onOpenLogin={() => setAuthMode('LOGIN')}
                          /> :
                            isProfileOpen ? <Profile /> :
                              <BuyerHome onSelectProduct={(id) => {
                                setSelectedProductId(id);
                              }} />}
            </div>
            <Footer />
          </div>
        );
      case AppRole.FARMER:
        return (
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar role={role} user={currentUser} currentPath={farmerSubPage} onNavigate={setFarmerSubPage} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto bg-background">{renderFarmerContent()}</main>
          </div>
        );
      case AppRole.SHIPPER:
        return <ShipperDashboard onLogout={handleLogout} />;
      case AppRole.ADMIN:
        return (
          <div className="flex h-screen w-full overflow-hidden">
            <Sidebar role={role} user={currentUser} currentPath={adminSubPage} onNavigate={setAdminSubPage} onLogout={handleLogout} />
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
