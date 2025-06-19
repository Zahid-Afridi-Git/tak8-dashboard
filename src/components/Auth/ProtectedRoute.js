import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { AlertTriangle, Lock } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  permissions = [], 
  requireAll = false,
  fallback = null 
}) => {
  const { isAuthenticated, hasPermission, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific permissions required, just check authentication
  if (permissions.length === 0) {
    return children;
  }

  // Check permissions
  const hasRequiredPermissions = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : permissions.some(permission => hasPermission(permission));

  if (!hasRequiredPermissions) {
    // Show custom fallback or default access denied
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              <strong>Your Role:</strong> {user?.role ? 
                user.role.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 'Unknown'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Contact your administrator to request access.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Component-level permission wrapper
export const PermissionWrapper = ({ 
  permissions = [], 
  requireAll = false,
  fallback = null,
  children 
}) => {
  const { hasPermission } = useAuth();

  const hasRequiredPermissions = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : permissions.some(permission => hasPermission(permission));

  if (!hasRequiredPermissions) {
    if (fallback) return fallback;
    return null; // Hide component if no permission
  }

  return children;
};

// Access denied message component
export const AccessDeniedMessage = ({ message, icon: Icon = AlertTriangle }) => (
  <div className="card p-8 text-center">
    <Icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
    <p className="text-gray-600">
      {message || "You don't have permission to perform this action."}
    </p>
  </div>
);

export default ProtectedRoute; 