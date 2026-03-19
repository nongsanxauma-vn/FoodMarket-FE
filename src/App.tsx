import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatBotProvider, ChatBot } from './components/ChatBot';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './components/layout/ScrollToTop';
import './App.css';

const ChatBotWrapper: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const getChatBotRole = (userRole?: string): 'BUYER' | 'SHOP_OWNER' | 'SHIPPER' => {
    switch (userRole) {
      case 'FARMER':
        return 'SHOP_OWNER';
      case 'SHIPPER':
        return 'SHIPPER';
      default:
        return 'BUYER';
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <ChatBotProvider
      userId={parseInt(user.id)}
      userRole={getChatBotRole(user.role)}
    >
      <ChatBot
        title="Trợ lý AI FoodMarket"
        className="z-50"
      />
    </ChatBotProvider>
  );
};

const App: React.FC = () => {
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