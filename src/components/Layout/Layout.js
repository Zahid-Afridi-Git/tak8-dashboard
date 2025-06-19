import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../Auth/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Don't show layout for login page or if not authenticated
  const isLoginPage = location.pathname === '/login';
  
  if (isLoginPage || !isAuthenticated) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 