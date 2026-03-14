
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './components/layout/ScrollToTop';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/nong_san_xau_ma/">
      <ScrollToTop />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;