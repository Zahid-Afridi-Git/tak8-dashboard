import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Calendar, User, DollarSign, AlertTriangle, Clock, CheckCircle, X, Search, Car, AlertCircleIcon } from 'lucide-react';

const MaintenanceManager = ({ fleetData, setFleetData, showNotification, prefilledData, onPrefilledDataUsed }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    description: '',
    scheduledDate: '',
    assignedTechnician: '',
    estimatedCost: 0,
    priority: 'medium',
    status: 'scheduled'
  });
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrefilledForm, setIsPrefilledForm] = useState(false);

  // Handle pre-filled data from vehicle card navigation
  useEffect(() => {
    if (prefilledData) {
      console.log('🔧 MaintenanceManager: Pre-filled data received:', prefilledData);
      
      setFormData({
        vehicleId: prefilledData.vehicleId?.toString() || '',
        type: prefilledData.type || 'General Inspection',
        description: prefilledData.description || '',
        scheduledDate: prefilledData.scheduledDate || '',
        assignedTechnician: prefilledData.assignedTechnician || '',
        estimatedCost: prefilledData.estimatedCost || 0,
        priority: prefilledData.priority || 'medium',
        status: prefilledData.status || 'scheduled'
      });
      
      setIsPrefilledForm(true);
      setShowAddForm(true);
      setErrors({});
      
      // Mark pre-filled data as used
      if (onPrefilledDataUsed) {
        onPrefilledDataUsed();
      }
      
      showNotification(
        'info',
        'Form Pre-filled',
        `Maintenance form has been pre-filled for ${prefilledData.vehicleName || 'selected vehicle'}. Please review and complete the details.`,
        6000
      );
    }
  }, [prefilledData, onPrefilledDataUsed, showNotification]);

  const maintenanceTypes = [
    'Oil Change', 'Brake Inspection', 'Tire Rotation', 'Engine Service',
    'Transmission Service', 'Air Conditioning', 'Battery Check', 'Coolant Service',
    'Spark Plug Replacement', 'Belt Replacement', 'General Inspection', 'Emergency Repair'
  ];

  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];

  const getMaintenanceIcon = (type) => {
    const iconMap = {
      'Oil Change': { icon: '🛢️', color: 'bg-blue-500' },
      'Brake Inspection': { icon: '🛡️', color: 'bg-red-500' },
      'Tire Rotation': { icon: '🛞', color: 'bg-gray-500' },
      'Engine Service': { icon: '⚙️', color: 'bg-green-500' },
      'Transmission Service': { icon: '🔧', color: 'bg-purple-500' },
      'Air Conditioning': { icon: '❄️', color: 'bg-blue-400' },
      'Battery Check': { icon: '🔋', color: 'bg-yellow-500' },
      'Coolant Service': { icon: '💧', color: 'bg-cyan-500' },
      'Spark Plug Replacement': { icon: '⚡', color: 'bg-yellow-600' },
      'Belt Replacement': { icon: '🔗', color: 'bg-gray-600' },
      'General Inspection': { icon: '🔍', color: 'bg-indigo-500' },
      'Emergency Repair': { icon: '🚨', color: 'bg-red-600' }
    };
    return iconMap[type] || { icon: '🔧', color: 'bg-gray-500' };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
      if (daysDiff < 0) {
        return `${Math.abs(daysDiff)} days overdue`;
      } else if (daysDiff <= 7) {
        return `${daysDiff} days`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleId) newErrors.vehicleId = 'Please select a vehicle';
    if (!formData.type.trim()) newErrors.type = 'Maintenance type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.assignedTechnician.trim()) newErrors.assignedTechnician = 'Technician assignment is required';
    if (formData.estimatedCost < 0) newErrors.estimatedCost = 'Cost cannot be negative';
    
    const scheduledDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduledDate < today) {
      newErrors.scheduledDate = 'Scheduled date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorCount = Object.keys(errors).length;
      showNotification(
        'error', 
        'Validation Failed', 
        `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} in the form. Check required fields and ensure all information is complete.`,
        8000
      );
      return;
    }

    const newRecord = {
      id: Date.now(),
      ...formData,
      vehicleId: parseInt(formData.vehicleId),
      estimatedCost: parseFloat(formData.estimatedCost),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFleetData(prev => ({
      ...prev,
      maintenanceRecords: [...(prev.maintenanceRecords || []), newRecord]
    }));

    const vehicle = fleetData.vehicles.find(v => v.id === parseInt(formData.vehicleId));
    const wasPrefilledForm = isPrefilledForm;
    
    showNotification(
      'success', 
      'Maintenance Scheduled Successfully', 
      `${formData.type} scheduled for ${vehicle?.make} ${vehicle?.model} (${vehicle?.licensePlate || 'Unknown'}) on ${new Date(formData.scheduledDate).toLocaleDateString()}. ${wasPrefilledForm ? 'Pre-filled form completed successfully!' : 'You can track progress in the maintenance dashboard.'}`,
      8000
    );

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      type: '',
      description: '',
      scheduledDate: '',
      assignedTechnician: '',
      estimatedCost: 0,
      priority: 'medium',
      status: 'scheduled'
    });
    setErrors({});
    setShowAddForm(false);
    setIsPrefilledForm(false);
  };

  const updateMaintenanceStatus = (recordId, newStatus) => {
    const record = (fleetData.maintenanceRecords || []).find(r => r.id === recordId);
    const vehicle = fleetData.vehicles.find(v => v.id === record?.vehicleId);
    
    setFleetData(prev => ({
      ...prev,
      maintenanceRecords: (prev.maintenanceRecords || []).map(record => 
        record.id === recordId 
          ? { ...record, status: newStatus, updatedAt: new Date().toISOString() }
          : record
      )
    }));

    const statusMessages = {
      'scheduled': 'Maintenance has been scheduled and is awaiting execution.',
      'in-progress': 'Maintenance work is now in progress. Monitor completion status.',
      'completed': 'Maintenance has been completed successfully! Vehicle may be ready for service.',
      'cancelled': 'Maintenance has been cancelled. Consider rescheduling if still needed.'
    };

    showNotification(
      'success', 
      'Status Updated Successfully', 
      `${record?.type || 'Maintenance'} for ${vehicle?.make} ${vehicle?.model} (${vehicle?.licensePlate || 'Unknown'}) updated to "${newStatus}". ${statusMessages[newStatus] || ''}`,
      6000
    );
  };

  const deleteMaintenanceRecord = (recordId) => {
    const record = (fleetData.maintenanceRecords || []).find(r => r.id === recordId);
    const vehicle = fleetData.vehicles.find(v => v.id === record?.vehicleId);
    
    if (!window.confirm(`Are you sure you want to delete this maintenance record for ${vehicle?.make} ${vehicle?.model} (${vehicle?.licensePlate})? This action cannot be undone.`)) {
      return;
    }
    
    setFleetData(prev => ({
      ...prev,
      maintenanceRecords: (prev.maintenanceRecords || []).filter(r => r.id !== recordId)
    }));

    showNotification(
      'success', 
      'Maintenance Record Deleted', 
      `${record?.type || 'Maintenance'} record for ${vehicle?.make} ${vehicle?.model} (${vehicle?.licensePlate || 'Unknown'}) has been permanently removed from the system.`,
      5000
    );
  };

  const availableVehicles = fleetData.vehicles.filter(v => v.status !== 'rented');
  const maintenanceRecords = fleetData.maintenanceRecords || [];
  
  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesFilter = filter === 'all' || record.status === filter;
    const vehicle = fleetData.vehicles.find(v => v.id === record.vehicleId);
    const vehicleString = vehicle ? `${vehicle.make} ${vehicle.model} ${vehicle.licensePlate}` : '';
    const matchesSearch = searchTerm === '' || 
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assignedTechnician.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const maintenanceStats = {
    total: maintenanceRecords.length,
    scheduled: maintenanceRecords.filter(r => r.status === 'scheduled').length,
    inProgress: maintenanceRecords.filter(r => r.status === 'in-progress').length,
    completed: maintenanceRecords.filter(r => r.status === 'completed').length,
    totalCost: maintenanceRecords
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.estimatedCost || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Maintenance Management</h3>
          <p className="text-gray-600">Schedule and track vehicle maintenance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Wrench className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{maintenanceStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{maintenanceStats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{maintenanceStats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{maintenanceStats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${maintenanceStats.totalCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search maintenance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            {['all', 'scheduled', 'in-progress', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Records */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecords.map(record => {
              const vehicle = fleetData.vehicles.find(v => v.id === record.vehicleId);
              const maintenanceInfo = getMaintenanceIcon(record.type);
              const isOverdue = new Date(record.scheduledDate) < new Date() && record.status === 'scheduled';
              
              return (
                <div key={record.id} className={`bg-white rounded-xl shadow-sm border-l-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${getPriorityColor(record.priority)} ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${maintenanceInfo.color} text-white text-xl shadow-md`}>
                          {maintenanceInfo.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-semibold text-gray-900">{record.type}</h4>
                            {isOverdue && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 flex items-center mt-1">
                            <Car className="w-4 h-4 mr-1" />
                            {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Unknown Vehicle'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(record.status)}`}>
                          {record.status.replace('-', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${record.priority === 'critical' ? 'border-red-200 bg-red-50 text-red-800' : 
                          record.priority === 'high' ? 'border-orange-200 bg-orange-50 text-orange-800' :
                          record.priority === 'medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-800' :
                          'border-green-200 bg-green-50 text-green-800'}`}>
                          {record.priority} priority
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-xs font-medium text-gray-500">Scheduled</span>
                          <p className="text-sm font-medium text-gray-900">{formatDate(record.scheduledDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-xs font-medium text-gray-500">Technician</span>
                          <p className="text-sm font-medium text-gray-900">{record.assignedTechnician}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-xs font-medium text-gray-500">Cost</span>
                          <p className="text-sm font-medium text-gray-900">${record.estimatedCost}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-xs font-medium text-gray-500">Type</span>
                          <p className="text-sm font-medium text-gray-900 capitalize">{record.type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex space-x-2">
                        {record.status !== 'completed' && record.status !== 'cancelled' && (
                          <select
                            value={record.status}
                            onChange={(e) => updateMaintenanceStatus(record.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            {statuses.map(status => (
                              <option key={status} value={status}>{status.replace('-', ' ')}</option>
                            ))}
                          </select>
                        )}
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                          View Details
                        </button>
                      </div>
                      <button
                        onClick={() => deleteMaintenanceRecord(record.id)}
                        className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance records</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' && searchTerm === '' ? 'No maintenance records found.' : 'No records match your current filters.'}
            </p>
          </div>
        )}
      </div>

      {/* Schedule Maintenance Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">Schedule Maintenance</h3>
                {isPrefilledForm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <AlertCircleIcon className="w-4 h-4 mr-1" />
                    Pre-filled from Vehicle
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setIsPrefilledForm(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {isPrefilledForm && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Form Pre-filled from Vehicle Card</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      This form has been automatically filled with vehicle information. Please review all fields and complete any missing details before scheduling.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle *
                  </label>
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.vehicleId ? 'border-red-500' : ''}`}
                    required
                  >
                    <option value="">Choose a vehicle...</option>
                    {availableVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} ({vehicle.licensePlate}) - {vehicle.currentMileage?.toLocaleString()} miles
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.type ? 'border-red-500' : ''}`}
                    required
                  >
                    <option value="">Select type...</option>
                    {maintenanceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.scheduledDate ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Technician *
                  </label>
                  <input
                    type="text"
                    name="assignedTechnician"
                    value={formData.assignedTechnician}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.assignedTechnician ? 'border-red-500' : ''}`}
                    placeholder="Technician name"
                    required
                  />
                  {errors.assignedTechnician && <p className="mt-1 text-sm text-red-600">{errors.assignedTechnician}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost
                  </label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.estimatedCost ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  {errors.estimatedCost && <p className="mt-1 text-sm text-red-600">{errors.estimatedCost}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the maintenance work to be performed..."
                  required
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManager;
