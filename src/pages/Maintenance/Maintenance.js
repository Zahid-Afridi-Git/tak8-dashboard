import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Wrench,
  Car,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  MapPin,
  Phone,
  FileText,
  Filter
} from 'lucide-react';
import useStore from '../../store';

// Add Maintenance Modal Component
const AddMaintenanceModal = ({ isOpen, onClose, cars, onAdd }) => {
  const [formData, setFormData] = useState({
    carId: '',
    type: '',
    description: '',
    scheduledDate: '',
    priority: 'medium',
    estimatedCost: '',
    serviceProvider: '',
    serviceProviderPhone: '',
    serviceProviderAddress: '',
    notes: '',
    mileage: ''
  });

  const [errors, setErrors] = useState({});

  const maintenanceTypes = [
    'Oil Change',
    'Brake Inspection',
    'Tire Rotation',
    'Engine Diagnostic',
    'Battery Replacement',
    'Transmission Service',
    'Air Filter Replacement',
    'Coolant Flush',
    'Spark Plug Replacement',
    'Wheel Alignment',
    'AC Service',
    'General Inspection',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.carId) newErrors.carId = 'Please select a car';
    if (!formData.type.trim()) newErrors.type = 'Maintenance type is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.serviceProvider.trim()) newErrors.serviceProvider = 'Service provider is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const maintenanceData = {
      ...formData,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      estimatedCost: parseFloat(formData.estimatedCost) || 0,
      mileage: parseInt(formData.mileage) || 0
    };

    onAdd(maintenanceData);
    setFormData({
      carId: '',
      type: '',
      description: '',
      scheduledDate: '',
      priority: 'medium',
      estimatedCost: '',
      serviceProvider: '',
      serviceProviderPhone: '',
      serviceProviderAddress: '',
      notes: '',
      mileage: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Maintenance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Car Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Car *
            </label>
            <select
              name="carId"
              value={formData.carId}
              onChange={handleInputChange}
              className={`input-field ${errors.carId ? 'border-red-500' : ''}`}
            >
              <option value="">Choose a car...</option>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} ({car.licensePlate}) - {car.mileage?.toLocaleString()} miles
                </option>
              ))}
            </select>
            {errors.carId && <p className="mt-1 text-sm text-red-600">{errors.carId}</p>}
          </div>

          {/* Maintenance Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`input-field ${errors.type ? 'border-red-500' : ''}`}
            >
              <option value="">Select type...</option>
              {maintenanceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
              placeholder="Detailed description of maintenance work..."
            />
          </div>

          {/* Date and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className={`input-field ${errors.scheduledDate ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Cost and Mileage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Mileage
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                placeholder="Current vehicle mileage"
              />
            </div>
          </div>

          {/* Service Provider Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Service Provider</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Provider Name *
              </label>
              <input
                type="text"
                name="serviceProvider"
                value={formData.serviceProvider}
                onChange={handleInputChange}
                className={`input-field ${errors.serviceProvider ? 'border-red-500' : ''}`}
                placeholder="e.g., AutoCare Center"
              />
              {errors.serviceProvider && <p className="mt-1 text-sm text-red-600">{errors.serviceProvider}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="serviceProviderPhone"
                  value={formData.serviceProviderPhone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="serviceProviderAddress"
                  value={formData.serviceProviderAddress}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Service center address"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
              placeholder="Any additional notes or special instructions..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <Save className="h-5 w-5 mr-2" />
              Schedule Maintenance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Maintenance Card Component
const MaintenanceCard = ({ maintenance, car, onView, onEdit, onDelete, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'scheduled': return Calendar;
      case 'overdue': return AlertTriangle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(maintenance.status);
  const isOverdue = new Date(maintenance.scheduledDate) < new Date() && maintenance.status === 'scheduled';

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${maintenance.status === 'overdue' ? 'bg-red-100' : 'bg-primary-100'}`}>
              <Wrench className={`h-5 w-5 ${maintenance.status === 'overdue' ? 'text-red-600' : 'text-primary-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{maintenance.type}</h3>
              <p className="text-sm text-gray-600">
                {car ? `${car.make} ${car.model} (${car.licensePlate})` : 'Unknown Vehicle'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(isOverdue ? 'overdue' : maintenance.status)}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {isOverdue ? 'Overdue' : maintenance.status.charAt(0).toUpperCase() + maintenance.status.slice(1).replace('-', ' ')}
            </div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(maintenance.priority)}`}>
              {maintenance.priority.charAt(0).toUpperCase() + maintenance.priority.slice(1)} Priority
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Scheduled:</span>
            <span className={`ml-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              {new Date(maintenance.scheduledDate).toLocaleDateString()}
            </span>
          </div>
          
          {maintenance.completedDate && (
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span className="font-medium">Completed:</span>
              <span className="ml-1">{new Date(maintenance.completedDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">
              {maintenance.status === 'completed' ? 'Final Cost:' : 'Estimated Cost:'}
            </span>
            <span className="ml-1 font-semibold text-gray-900">
              ${(maintenance.finalCost || maintenance.estimatedCost || 0).toFixed(2)}
            </span>
          </div>
          
          {maintenance.mileage && (
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium">Mileage:</span>
              <span className="ml-1">{maintenance.mileage.toLocaleString()} miles</span>
            </div>
          )}

          {maintenance.serviceProvider && (
            <div className="flex items-center text-sm text-gray-600">
              <Wrench className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium">Service Provider:</span>
              <span className="ml-1">{maintenance.serviceProvider}</span>
            </div>
          )}
        </div>

        {maintenance.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {maintenance.description}
            </p>
          </div>
        )}

        {/* Status Update Dropdown */}
        {maintenance.status !== 'completed' && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Update Status
            </label>
            <select
              value={maintenance.status}
              onChange={(e) => onStatusUpdate(maintenance.id, e.target.value)}
              className="input-field text-sm"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(maintenance)}
            className="flex-1 btn-secondary text-sm py-2"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </button>
          <button
            onClick={() => onEdit(maintenance)}
            className="flex-1 btn-primary text-sm py-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(maintenance)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Maintenance = () => {
  const { cars, fetchCars } = useStore();
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Enhanced mock maintenance data
  useEffect(() => {
    const mockMaintenanceData = [
      {
        id: '1',
        carId: '1',
        type: 'Oil Change',
        description: 'Regular oil change and filter replacement with synthetic oil',
        scheduledDate: '2024-01-15',
        completedDate: '2024-01-15',
        status: 'completed',
        priority: 'medium',
        estimatedCost: 45.99,
        finalCost: 48.50,
        mileage: 25000,
        serviceProvider: 'Quick Lube Plus',
        serviceProviderPhone: '(555) 123-4567',
        serviceProviderAddress: '123 Main St, City, State',
        notes: 'Used synthetic oil as requested. Next service due at 30,000 miles.'
      },
      {
        id: '2',
        carId: '2',
        type: 'Brake Inspection',
        description: 'Annual brake system inspection and pad replacement if needed',
        scheduledDate: '2024-01-20',
        status: 'scheduled',
        priority: 'high',
        estimatedCost: 150.00,
        mileage: 45000,
        serviceProvider: 'AutoCare Center',
        serviceProviderPhone: '(555) 987-6543',
        serviceProviderAddress: '456 Auto Blvd, City, State',
        notes: 'Customer reported squeaking noise when braking.'
      },
      {
        id: '3',
        carId: '3',
        type: 'Tire Rotation',
        description: 'Rotate tires and check alignment, inspect for wear patterns',
        scheduledDate: '2024-01-10',
        status: 'scheduled',
        priority: 'medium',
        estimatedCost: 35.00,
        mileage: 30000,
        serviceProvider: 'Tire World',
        serviceProviderPhone: '(555) 456-7890',
        serviceProviderAddress: '789 Tire Ave, City, State'
      },
      {
        id: '4',
        carId: '1',
        type: 'Engine Diagnostic',
        description: 'Check engine light diagnostic and repair',
        scheduledDate: '2024-01-25',
        status: 'in-progress',
        priority: 'high',
        estimatedCost: 200.00,
        mileage: 25500,
        serviceProvider: 'Expert Auto Repair',
        serviceProviderPhone: '(555) 321-0987',
        serviceProviderAddress: '321 Repair Rd, City, State',
        notes: 'Engine light came on during routine inspection.'
      },
      {
        id: '5',
        carId: '4',
        type: 'Battery Replacement',
        description: 'Replace car battery - showing signs of weakness during cold weather',
        scheduledDate: '2024-02-01',
        status: 'scheduled',
        priority: 'medium',
        estimatedCost: 120.00,
        mileage: 15000,
        serviceProvider: 'Battery Plus',
        serviceProviderPhone: '(555) 654-3210',
        serviceProviderAddress: '654 Power St, City, State',
        notes: 'Battery is 4 years old and struggling in cold weather.'
      }
    ];
    
    setMaintenanceRecords(mockMaintenanceData);
    fetchCars();
  }, [fetchCars]);

  const filteredRecords = maintenanceRecords.filter(record => {
    const car = cars.find(c => c.id === record.carId);
    const matchesSearch = 
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car && `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || record.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || record.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleAddMaintenance = (maintenanceData) => {
    setMaintenanceRecords(prev => [maintenanceData, ...prev]);
  };

  const handleStatusUpdate = (maintenanceId, newStatus) => {
    setMaintenanceRecords(prev => prev.map(record => {
      if (record.id === maintenanceId) {
        const updatedRecord = { ...record, status: newStatus };
        if (newStatus === 'completed' && !record.completedDate) {
          updatedRecord.completedDate = new Date().toISOString().split('T')[0];
        }
        return updatedRecord;
      }
      return record;
    }));
  };

  const handleView = (maintenance) => {
    alert(`Viewing maintenance record: ${maintenance.type}\n\nDetails:\n- Car: ${cars.find(c => c.id === maintenance.carId)?.make} ${cars.find(c => c.id === maintenance.carId)?.model}\n- Service Provider: ${maintenance.serviceProvider}\n- Status: ${maintenance.status}\n- Cost: $${maintenance.finalCost || maintenance.estimatedCost}`);
  };

  const handleEdit = (maintenance) => {
    alert(`Edit functionality would open a modal similar to Add Maintenance with pre-filled data for: ${maintenance.type}`);
  };

  const handleDelete = (maintenance) => {
    if (window.confirm(`Are you sure you want to delete this maintenance record for ${maintenance.type}?`)) {
      setMaintenanceRecords(prev => prev.filter(m => m.id !== maintenance.id));
    }
  };

  const getMaintenanceStats = () => {
    const now = new Date();
    const overdueRecords = maintenanceRecords.filter(m => 
      new Date(m.scheduledDate) < now && m.status === 'scheduled'
    );
    
    return {
      total: maintenanceRecords.length,
      completed: maintenanceRecords.filter(m => m.status === 'completed').length,
      scheduled: maintenanceRecords.filter(m => m.status === 'scheduled').length,
      inProgress: maintenanceRecords.filter(m => m.status === 'in-progress').length,
      overdue: overdueRecords.length,
      totalCost: maintenanceRecords.reduce((sum, m) => sum + (m.finalCost || m.estimatedCost || 0), 0)
    };
  };

  const stats = getMaintenanceStats();
  const maintenanceTypes = [...new Set(maintenanceRecords.map(m => m.type))];
  const statuses = ['scheduled', 'in-progress', 'completed'];
  const priorities = ['low', 'medium', 'high'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="mt-2 text-gray-600">Track and manage vehicle maintenance schedules</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Maintenance
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-red-500 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search maintenance records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            {maintenanceTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Maintenance Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map(maintenance => {
          const car = cars.find(c => c.id === maintenance.carId);
          return (
            <MaintenanceCard
              key={maintenance.id}
              maintenance={maintenance}
              car={car}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by scheduling maintenance for your vehicles.'}
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && typeFilter === 'all' && (
            <div className="mt-6">
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Schedule Maintenance
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Maintenance Modal */}
      <AddMaintenanceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        cars={cars}
        onAdd={handleAddMaintenance}
      />
    </div>
  );
};

export default Maintenance; 