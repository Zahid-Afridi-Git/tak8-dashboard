import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  UserCog,
  Settings,
  Car,
  Calendar,
  BarChart3,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Activity,
  Lock,
  Eye,
  Edit,
  Plus,
  TrendingUp,
  Building,
  Globe,
  Server
} from 'lucide-react';
import useStore from '../../store';
import { useAuth } from '../../components/Auth/AuthContext';
import ProtectedRoute, { PermissionWrapper, AccessDeniedMessage } from '../../components/Auth/ProtectedRoute';

const AdminPanel = () => {
  const { 
    employees, 
    cars, 
    bookings, 
    users, 
    analytics,
    fetchEmployees, 
    fetchCars, 
    fetchBookings, 
    fetchUsers 
  } = useStore();
  const { user, hasPermission } = useAuth();

  const [systemStats, setSystemStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingPasswords: 0,
    totalFleet: 0,
    totalBookings: 0,
    totalRevenue: 0,
    systemHealth: 'good'
  });

  useEffect(() => {
    // Fetch all data for admin overview
    fetchEmployees();
    fetchCars();
    fetchBookings();
    fetchUsers();
  }, [fetchEmployees, fetchCars, fetchBookings, fetchUsers]);

  useEffect(() => {
    // Calculate admin statistics
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const pendingPasswords = employees.filter(emp => !emp.passwordChanged).length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    setSystemStats({
      totalEmployees: employees.length,
      activeEmployees,
      pendingPasswords,
      totalFleet: cars.length,
      totalBookings: bookings.length,
      totalRevenue,
      systemHealth: 'good'
    });
  }, [employees, cars, bookings]);

  if (!hasPermission('settings.system_config')) {
    return (
      <AccessDeniedMessage 
        message="You need 'settings.system_config' permission to access the Admin Panel."
        icon={Shield}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administration Panel</h1>
        <p className="mt-2 text-gray-600">
          Central hub for system administration and employee management
        </p>
        <div className="flex items-center mt-2">
          <Building className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-sm text-gray-500">tak8 Car Rental Management System</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalEmployees}</p>
              <p className="text-xs text-green-600">
                {systemStats.activeEmployees} active
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Setup</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.pendingPasswords}</p>
              <p className="text-xs text-yellow-600">
                Password changes needed
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fleet Size</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalFleet}</p>
              <p className="text-xs text-green-600">
                Vehicles managed
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-500 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <p className="text-sm font-medium text-green-600">Online</p>
              </div>
              <p className="text-xs text-gray-500">
                All systems operational
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Employee Management */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Employee Management</h2>
            <UserCog className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Active Employees</span>
              <span className="text-sm font-medium text-gray-900">{systemStats.activeEmployees}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-700">Pending Password Changes</span>
              <span className="text-sm font-medium text-yellow-600">{systemStats.pendingPasswords}</span>
            </div>
            
            <div className="space-y-2">
              <Link 
                to="/employees" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Manage Employees</span>
                <Eye className="h-4 w-4 text-gray-400" />
              </Link>
              
              <PermissionWrapper permissions={['employees.create']}>
                <Link 
                  to="/employees"
                  className="w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Employee
                </Link>
              </PermissionWrapper>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">System Overview</h2>
            <Server className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Database</span>
              </div>
              <span className="text-xs text-green-600">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Authentication</span>
              </div>
              <span className="text-xs text-green-600">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-700">Email Service</span>
              </div>
              <span className="text-xs text-blue-600">Ready</span>
            </div>

            <Link 
              to="/settings" 
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">System Settings</span>
              <Settings className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <Activity className="h-5 w-5 text-purple-500" />
          </div>
          
          <div className="space-y-2">
            <PermissionWrapper permissions={['cars.create']}>
              <Link 
                to="/cars/new" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Add New Car</span>
                <Car className="h-4 w-4 text-gray-400" />
              </Link>
            </PermissionWrapper>
            
            <PermissionWrapper permissions={['analytics.view_full']}>
              <Link 
                to="/analytics" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">View Analytics</span>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </Link>
            </PermissionWrapper>
            
            <PermissionWrapper permissions={['bookings.view']}>
              <Link 
                to="/bookings" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Manage Bookings</span>
                <Calendar className="h-4 w-4 text-gray-400" />
              </Link>
            </PermissionWrapper>
            
            <PermissionWrapper permissions={['users.view']}>
              <Link 
                to="/users" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">Customer Users</span>
                <Users className="h-4 w-4 text-gray-400" />
              </Link>
            </PermissionWrapper>
          </div>
        </div>
      </div>

      {/* Recent Activity & Role Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Role & Permission Matrix */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Role & Permission Matrix</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Super Admin</span>
              </div>
              <span className="text-xs text-red-600">Full Access</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <UserCog className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Manager</span>
              </div>
              <span className="text-xs text-blue-600">Fleet + Staff</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Car className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Fleet Coordinator</span>
              </div>
              <span className="text-xs text-green-600">Cars + Maintenance</span>
            </div>
            
            <div className="text-xs text-gray-500 mt-3">
              Click on roles to manage permissions and view detailed access matrix.
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent System Activity</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New employee added: Emily Davis</p>
                <p className="text-xs text-gray-500">2 hours ago • Customer Support</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">5 new cars added to fleet</p>
                <p className="text-xs text-gray-500">1 day ago • Fleet Management</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Password reset requested</p>
                <p className="text-xs text-gray-500">2 days ago • Tom Wilson</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">System backup completed</p>
                <p className="text-xs text-gray-500">3 days ago • Automated</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All Activity →
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="card p-6 bg-red-50 border-red-200">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h2 className="text-lg font-medium text-red-900">Emergency Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-3 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors">
            <Lock className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-700">Lock All Accounts</span>
          </button>
          
          <button className="flex items-center justify-center p-3 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-colors">
            <Database className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-700">Force Backup</span>
          </button>
          
          <button className="flex items-center justify-center p-3 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors">
            <Activity className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">System Health Check</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrap with route protection
const ProtectedAdminPanel = () => (
  <ProtectedRoute permissions={['settings.system_config']}>
    <AdminPanel />
  </ProtectedRoute>
);

export default ProtectedAdminPanel; 