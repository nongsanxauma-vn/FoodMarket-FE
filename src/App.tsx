
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatBotProvider, ChatBot } from './components/ChatBot';
import { initializeTheme } from './components/ChatBot/utils/themeUtils';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './components/layout/ScrollToTop';
import './App.css';

// Helper component to access auth context for ChatBot
const ChatBotWrapper: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Map AppRole to ChatBot role format
  const getChatBotRole = (userRole?: string): 'BUYER' | 'SHOP_OWNER' | 'SHIPPER' => {
    switch (userRole) {
      case 'FARMER':
        return 'SHOP_OWNER';
      case 'SHIPPER':
        return 'SHIPPER';
      case 'BUYER':
      case 'ADMIN':
      default:
        return 'BUYER';
    }
  };

  if (!isAuthenticated || !user) {
    return null; // Don't show ChatBot for unauthenticated users
  }

  return (
    <ChatBotProvider 
      userId={parseInt(user.id)} 
      userRole={getChatBotRole(user.role)}
    >
      <ChatBot 
        title="FoodMarket AI Assistant"
        className="z-50"
      />
    </ChatBotProvider>
  );
};

const App: React.FC = () => {
  // Initialize theme system on app start
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <BrowserRouter basename="/">
      <ScrollToTop />
      <AuthProvider>
        <AppRouter />
        <ChatBotWrapper />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;