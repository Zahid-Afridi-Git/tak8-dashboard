import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Building,
  UserCheck
} from 'lucide-react';
import useStore from '../../store';
import { useAuth } from '../../components/Auth/AuthContext';
import ProtectedRoute, { PermissionWrapper, AccessDeniedMessage } from '../../components/Auth/ProtectedRoute';

const EmployeeManagement = () => {
  const { 
    employees = [], 
    fetchEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee,
    rolePermissions = {} 
  } = useStore();
  const { user, hasPermission } = useAuth();

  // Ensure we have safe defaults
  const safeEmployees = employees || [];
  const safeRolePermissions = rolePermissions || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'customer_service',
    department: 'Customer Support',
    phone: '',
    status: 'active'
  });

  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    setNewEmployee({
      name: '',
      email: '',
      role: 'customer_service',
      department: 'Customer Support',
      phone: '',
      status: 'active'
    });
    setFormErrors({});
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const departments = [
    'Customer Support',
    'Fleet Management', 
    'Maintenance',
    'Administration',
    'Finance',
    'Marketing'
  ];

  useEffect(() => {
    if (fetchEmployees) {
      fetchEmployees();
    }
  }, [fetchEmployees]);

  // Filter employees based on search and filters
  const filteredEmployees = safeEmployees.filter(employee => {
    if (!employee) return false;
    const matchesSearch = (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Statistics
  const stats = {
    total: safeEmployees.length,
    active: safeEmployees.filter(emp => emp && emp.status === 'active').length,
    pending: safeEmployees.filter(emp => emp && !emp.passwordChanged).length,
    inactive: safeEmployees.filter(emp => emp && emp.status === 'inactive').length
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newEmployee.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!newEmployee.email.trim()) {
      errors.email = 'Email is required';
    } else if (!newEmployee.email.endsWith('@tak8.com')) {
      errors.email = 'Email must be from tak8.com domain';
    }
    
    if (!newEmployee.role) {
      errors.role = 'Role is required';
    }
    
    if (!newEmployee.department) {
      errors.department = 'Department is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      return;
    }

    if (!createEmployee) {
      alert('Employee creation function not available');
      return;
    }

    setIsLoading(true);
    try {
      const employeeData = {
        ...newEmployee,
        id: Date.now(),
        passwordChanged: false,
        createdAt: new Date().toISOString(),
        createdBy: user?.email || 'system'
      };

      await createEmployee(employeeData);
      closeAddModal();
      
      // Simulate sending welcome email
      console.log(`Welcome email sent to ${employeeData.email}`);
      alert(`Employee created successfully! Welcome email sent to ${employeeData.email}`);
    } catch (error) {
      console.error('Error creating employee:', error);
      alert(`Error creating employee: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      await updateEmployee(selectedEmployee.id, selectedEmployee);
      setShowEditModal(false);
      setSelectedEmployee(null);
      alert('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee');
    }
    setIsLoading(false);
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (!hasPermission('employees.delete')) {
      alert('You do not have permission to delete employees');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      try {
        await deleteEmployee(employeeId);
        alert('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
      }
    }
  };

  const getRoleDisplay = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleColor = (role) => {
    const colors = {
      'super_admin': 'bg-red-100 text-red-800',
      'manager': 'bg-blue-100 text-blue-800',
      'fleet_coordinator': 'bg-green-100 text-green-800',
      'customer_service': 'bg-purple-100 text-purple-800',
      'maintenance_staff': 'bg-yellow-100 text-yellow-800',
      'accountant': 'bg-indigo-100 text-indigo-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (!hasPermission('employees.view')) {
    return (
      <AccessDeniedMessage 
        message="You need 'employees.view' permission to access Employee Management."
        icon={Users}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-gray-600">Manage employee accounts, roles, and permissions</p>
          <div className="flex items-center mt-2">
            <Building className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-gray-500">tak8.com domain employees</span>
          </div>
        </div>
        
        <PermissionWrapper permissions={['employees.create']}>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="btn-primary flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </PermissionWrapper>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gray-500 rounded-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.role)}`}>
                      {getRoleDisplay(employee.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {employee.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${employee.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {employee.status}
                      </span>
                      {!employee.passwordChanged && (
                        <AlertCircle className="h-4 w-4 text-yellow-500 ml-1" title="Password not changed" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <PermissionWrapper permissions={['employees.view']}>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </PermissionWrapper>
                      
                      <PermissionWrapper permissions={['employees.edit']}>
                        <button 
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEditModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </PermissionWrapper>
                      
                      <PermissionWrapper permissions={['employees.delete']}>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </PermissionWrapper>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeAddModal}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Employee</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email (tak8.com)</label>
                    <input
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@tak8.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500 ${
                        formErrors.role ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      {Object.keys(safeRolePermissions).map(role => (
                        <option key={role} value={role}>
                          {getRoleDisplay(role)}
                        </option>
                      ))}
                    </select>
                    {formErrors.role && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                    )}
                    {newEmployee.role && safeRolePermissions[newEmployee.role] && (
                      <p className="mt-1 text-xs text-gray-500">
                        {safeRolePermissions[newEmployee.role].label}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleAddEmployee}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Employee'}
                </button>
                <button
                  onClick={closeAddModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowEditModal(false)}></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Employee</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={selectedEmployee.name}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={selectedEmployee.email}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={selectedEmployee.role}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, role: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {Object.keys(safeRolePermissions).map(role => (
                        <option key={role} value={role}>
                          {getRoleDisplay(role)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={selectedEmployee.department}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, department: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedEmployee.status}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, status: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleEditEmployee}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Employee'}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with route protection
const ProtectedEmployeeManagement = () => (
  <ProtectedRoute permissions={['employees.view']}>
    <EmployeeManagement />
  </ProtectedRoute>
);

export default ProtectedEmployeeManagement; 