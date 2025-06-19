import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Car, Shield, Eye, EyeOff, Mail, Lock, AlertCircle, Building, Users } from 'lucide-react';
import { useAuth } from './AuthContext';
import useStore from '../../store';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const { employees } = useStore();
  const [formData, setFormData] = useState({
    email: '',
    password: 'demo123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email) => {
    setFormData({ ...formData, email });
  };

  // Group demo accounts by role for display
  const demoAccounts = employees.filter(emp => emp.status === 'active').reduce((acc, emp) => {
    if (!acc[emp.role]) acc[emp.role] = [];
    acc[emp.role].push(emp);
    return acc;
  }, {});

  const getRoleColor = (role) => {
    const colors = {
      'super_admin': 'bg-red-50 border-red-200 text-red-800',
      'manager': 'bg-blue-50 border-blue-200 text-blue-800',
      'fleet_coordinator': 'bg-green-50 border-green-200 text-green-800',
      'customer_service': 'bg-purple-50 border-purple-200 text-purple-800',
      'maintenance_staff': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'accountant': 'bg-indigo-50 border-indigo-200 text-indigo-800'
    };
    return colors[role] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getRoleDisplay = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center">
              <Car className="h-10 w-10 text-primary-600" />
              <h1 className="ml-3 text-3xl font-bold text-gray-900">tak8</h1>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access the car rental management system
            </p>
            <div className="flex items-center mt-2">
              <Building className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-gray-500">tak8.com employees only</span>
            </div>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="you@tak8.com"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Demo Accounts */}
      <div className="hidden lg:block relative w-0 flex-1 bg-white">
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Role-Based Access Control</h3>
              <p className="mt-2 text-gray-600">
                Select a demo account to experience different permission levels
              </p>
              <div className="flex items-center justify-center mt-3">
                <Users className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">{employees.length} employee accounts</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(demoAccounts).map(([role, accounts]) => (
                <div key={role} className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                    {getRoleDisplay(role)}
                  </h4>
                  {accounts.slice(0, 2).map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleDemoLogin(account.email)}
                      className={`w-full p-3 border rounded-lg text-left hover:shadow-md transition-all ${getRoleColor(role)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{account.name}</div>
                          <div className="text-xs opacity-75">{account.email}</div>
                          <div className="text-xs opacity-60 mt-1">{account.department}</div>
                        </div>
                        <div className="text-xs opacity-60">
                          Click to login
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Demo Information</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• All accounts use password: <code className="bg-gray-200 px-1 rounded">demo123</code></li>
                <li>• Different roles have different permissions</li>
                <li>• Admin panel access varies by role level</li>
                <li>• Employee management restricted to admins/managers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 