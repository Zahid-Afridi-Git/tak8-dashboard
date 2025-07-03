import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  BarChart3,
  Settings,
  X,
  Wrench,
  Shield,
  UserCog,
  LogOut,
  Globe,
  DollarSign,
  Truck
} from 'lucide-react';
import useStore from '../../store';
import { useAuth } from '../Auth/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useStore();
  const { user, hasPermission, logout } = useAuth();

  // Base navigation for all users
  const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: null }
  ];

  // Navigation items with permission requirements
  const conditionalNavigation = [
    { name: 'Fleet Management', href: '/fleet', icon: Truck, permission: 'cars.view' },
    { name: 'Bookings', href: '/bookings', icon: Calendar, permission: 'bookings.view' },
    { name: 'Revenue (AUD)', href: '/revenue', icon: DollarSign, permission: 'bookings.view' },
    { name: 'Users', href: '/users', icon: Users, permission: 'users.view' },
    { name: 'Website & Content', href: '/content', icon: Globe, permission: 'cars.view' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'analytics.view_full' },
  ];

  // Admin-only navigation
  const adminNavigation = [
    { name: 'Employees', href: '/employees', icon: UserCog, permission: 'employees.view' },
    { name: 'Admin Panel', href: '/admin', icon: Shield, permission: 'settings.system_config' },
    { name: 'Settings', href: '/settings', icon: Settings, permission: 'settings.view' },
  ];

  // Filter navigation based on permissions
  const navigation = [
    ...baseNavigation,
    ...conditionalNavigation.filter(item => !item.permission || hasPermission(item.permission)),
    ...adminNavigation.filter(item => !item.permission || hasPermission(item.permission))
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Car className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">CarRental</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-500 capitalize">
                      {user?.role?.replace('_', ' ') || 'No role'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 