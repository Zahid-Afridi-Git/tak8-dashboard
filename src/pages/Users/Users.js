import React, { useEffect } from 'react';
import { Users as UsersIcon, Mail, Phone, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import useStore from '../../store';

const UserRow = ({ user, onView, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">ID: {user.id}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm text-gray-900">
        <Mail className="h-4 w-4 mr-2 text-gray-400" />
        {user.email}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center text-sm text-gray-900">
        <Phone className="h-4 w-4 mr-2 text-gray-400" />
        {user.phone}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {new Date(user.joinDate).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {user.totalBookings}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {user.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        onClick={() => onView(user)}
        className="text-primary-600 hover:text-primary-900 mr-3"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => onEdit(user)}
        className="text-blue-600 hover:text-blue-900 mr-3"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(user)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </td>
  </tr>
);

const Users = () => {
  const { users, usersLoading, fetchUsers } = useStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleView = (user) => {
    alert(`Viewing details for ${user.name}`);
  };

  const handleEdit = (user) => {
    alert(`Editing ${user.name}`);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      alert(`Deleting ${user.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="mt-2 text-gray-600">Manage customer accounts and information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, user) => sum + user.totalBookings, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">No users have registered yet.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placeholder Notice */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center">
          <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">Users Management</h3>
            <p className="text-blue-700">
              This is a placeholder for the users management section. In a full implementation, 
              you would be able to view detailed user profiles, manage permissions, and track user activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 