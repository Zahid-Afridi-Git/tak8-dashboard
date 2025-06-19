import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Car,
  Fuel,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import useStore from '../../store';

const CarCard = ({ car, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'rented': return Clock;
      case 'maintenance': return Settings;
      case 'unavailable': return AlertTriangle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(car.status);

  return (
    <div className="card overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {car.make} {car.model}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {car.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Car className="h-4 w-4 mr-2" />
            {car.year} • {car.color} • {car.licensePlate}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Fuel className="h-4 w-4 mr-2" />
            {car.fuelType} • {car.transmission} • {car.mileage.toLocaleString()} miles
          </div>
          <div className="text-lg font-bold text-primary-600">
            ${car.dailyRate}/day
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onView(car)}
            className="flex-1 btn-secondary text-sm py-2"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </button>
          <button
            onClick={() => onEdit(car)}
            className="flex-1 btn-primary text-sm py-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(car)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Cars = () => {
  const navigate = useNavigate();
  const { cars, carsLoading, fetchCars, deleteCar } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Check if any cars need updates for the new fields
  const getCarsNeedingUpdate = () => {
    return cars.filter(car => 
      !car.weeklyRate || 
      !car.unlimitedKmRate || 
      !car.seatingCapacity || 
      car.baggageCapacity === undefined ||
      !car.kmLimit
    );
  };

  const carsNeedingUpdate = getCarsNeedingUpdate();

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || car.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (car) => {
    if (window.confirm(`Are you sure you want to delete ${car.make} ${car.model}?`)) {
      await deleteCar(car.id);
    }
  };

  const handleView = (car) => {
    // In a real app, this would navigate to a detailed view
    alert(`Viewing details for ${car.make} ${car.model}`);
  };

  const handleEdit = (car) => {
    navigate(`/cars/edit/${car.id}`);
  };

  const categories = [...new Set(cars.map(car => car.category))];
  const statuses = ['available', 'rented', 'maintenance', 'unavailable'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cars Management</h1>
          <p className="mt-2 text-gray-600">Manage your vehicle fleet</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {carsNeedingUpdate.length > 0 && (
            <Link to="/cars/bulk-update" className="btn-secondary">
              <RefreshCw className="h-5 w-5 mr-2" />
              Bulk Update ({carsNeedingUpdate.length})
            </Link>
          )}
          <Link to="/cars/new" className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </Link>
        </div>
      </div>

      {/* Migration Notice */}
      {carsNeedingUpdate.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                New Features Available
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  {carsNeedingUpdate.length} cars need updating with new pricing options and capacity information. 
                  <Link to="/cars/bulk-update" className="font-medium underline ml-1">
                    Click here to update them automatically.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cars..."
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
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {cars.filter(car => car.status === 'available').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rented</p>
              <p className="text-2xl font-bold text-gray-900">
                {cars.filter(car => car.status === 'rented').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">
                {cars.filter(car => car.status === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {carsLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {filteredCars.length === 0 && !carsLoading && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding a new car to your fleet.'}
          </p>
          {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
            <div className="mt-6">
              <Link to="/cars/new" className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Add New Car
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cars; 