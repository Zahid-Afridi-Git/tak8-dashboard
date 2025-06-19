import React, { createContext, useContext } from 'react';
import useStore from '../../store';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const {
    currentUser,
    isAuthenticated,
    authLoading,
    authError,
    hasPermission,
    getUserRole,
    login,
    logout
  } = useStore();

  const value = {
    user: currentUser,
    isAuthenticated,
    loading: authLoading,
    error: authError,
    hasPermission,
    getUserRole,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 