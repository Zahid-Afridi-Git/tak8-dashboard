import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import { useAuth } from './components/Auth/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Bookings from './pages/Bookings/Bookings';
import Users from './pages/Users/Users';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import EmployeeManagement from './pages/Employees/EmployeeManagement';
import AdminPanel from './pages/Admin/AdminPanel';
import LoginPage from './components/Auth/LoginPage';
import ContentManagement from './pages/Content/ContentManagement';
import FleetManagement from './pages/Fleet/FleetManagement';
import RevenueManagement from './pages/Revenue/RevenueManagement';
import './App.css';

// Component to handle authentication routing
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        } />
        <Route path="/bookings" element={
          isAuthenticated ? <Bookings /> : <Navigate to="/login" replace />
        } />
        <Route path="/users" element={
          isAuthenticated ? <Users /> : <Navigate to="/login" replace />
        } />
        <Route path="/analytics" element={
          isAuthenticated ? <Analytics /> : <Navigate to="/login" replace />
        } />
        <Route path="/settings" element={
          isAuthenticated ? <Settings /> : <Navigate to="/login" replace />
        } />
        <Route path="/employees" element={
          isAuthenticated ? <EmployeeManagement /> : <Navigate to="/login" replace />
        } />
        <Route path="/admin" element={
          isAuthenticated ? <AdminPanel /> : <Navigate to="/login" replace />
        } />
        <Route path="/content" element={
          isAuthenticated ? <ContentManagement /> : <Navigate to="/login" replace />
        } />
        <Route path="/fleet" element={
          isAuthenticated ? <FleetManagement /> : <Navigate to="/login" replace />
        } />
        <Route path="/revenue" element={
          isAuthenticated ? <RevenueManagement /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
