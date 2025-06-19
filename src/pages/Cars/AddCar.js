import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Car,
  Calendar,
  DollarSign,
  Settings,
  FileText,
  Save,
  X,
  Hash,
  AlertTriangle,
  Lock
} from 'lucide-react';
import useStore from '../../store';
import { useAuth } from '../../components/Auth/AuthContext';
import ProtectedRoute, { PermissionWrapper, AccessDeniedMessage } from '../../components/Auth/ProtectedRoute';

const AddCar = () => {
  const navigate = useNavigate();
  const { addCar, carsLoading } = useStore();
  const { hasPermission, user } = useAuth();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    category: 'sedan',
    fuelType: 'gasoline',
    transmission: 'automatic',
    mileage: 0,
    dailyRate: 0,
    weeklyRate: 0, // 7+ Days Rate
    unlimitedKmRate: 0, // Unlimited KM Rate
    seatingCapacity: 5,
    baggageCapacity: 2,
    kmLimit: 150, // Daily KM limit
    fleetQuantity: 1, // Number of cars to add
    status: 'available',
    features: [],
    description: '',
    image: '',
    insurance: {
      provider: '',
      policyNumber: '',
      expiryDate: ''
    },
    maintenance: {
      lastService: '',
      nextService: '',
      serviceInterval: 5000
    }
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const categories = [
    'sedan', 'suv', 'hatchback', 'coupe', 'convertible', 
    'truck', 'van', 'luxury', 'electric', 'hybrid'
  ];

  const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid', 'cng'];
  const transmissions = ['automatic', 'manual', 'cvt'];
  const statuses = ['available', 'maintenance', 'unavailable'];

  const availableFeatures = [
    'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera',
    'Heated Seats', 'Sunroof', 'Leather Seats', 'Cruise Control',
    'Parking Sensors', 'Keyless Entry', 'USB Charging', 'WiFi Hotspot'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateLicensePlates = (basePlate, quantity) => {
    const plates = [];
    const parts = basePlate.split('-');
    
    if (parts.length === 2) {
      const [letters, numbers] = parts;
      for (let i = 0; i < quantity; i++) {
        const newNumber = (parseInt(numbers) + i).toString().padStart(numbers.length, '0');
        plates.push(`${letters}-${newNumber}`);
      }
    } else {
      // Fallback for different license plate formats
      for (let i = 0; i < quantity; i++) {
        plates.push(`${basePlate}-${(i + 1).toString().padStart(2, '0')}`);
      }
    }
    
    return plates;
  };

  const generateVINs = (baseVin, quantity) => {
    const vins = [];
    for (let i = 0; i < quantity; i++) {
      // Simple VIN generation for demo - in real app this would be proper VIN generation
      const lastDigits = (parseInt(baseVin.slice(-3)) + i).toString().padStart(3, '0');
      vins.push(baseVin.slice(0, -3) + lastDigits);
    }
    return vins;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (formData.dailyRate <= 0) newErrors.dailyRate = 'Daily rate must be greater than 0';
    if (formData.weeklyRate <= 0) newErrors.weeklyRate = '7+ Days rate must be greater than 0';
    if (formData.unlimitedKmRate <= 0) newErrors.unlimitedKmRate = 'Unlimited KM rate must be greater than 0';
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    if (formData.seatingCapacity < 1) newErrors.seatingCapacity = 'Seating capacity must be at least 1';
    if (formData.baggageCapacity < 0) newErrors.baggageCapacity = 'Baggage capacity cannot be negative';
    if (formData.fleetQuantity < 1 || formData.fleetQuantity > 50) {
      newErrors.fleetQuantity = 'Fleet quantity must be between 1 and 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check permission before proceeding
    if (!hasPermission('cars.create')) {
      alert('You do not have permission to add cars. Contact your administrator.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    try {
      const quantity = parseInt(formData.fleetQuantity);
      const licensePlates = generateLicensePlates(formData.licensePlate, quantity);
      const vins = generateVINs(formData.vin, quantity);

      // Add multiple cars
      for (let i = 0; i < quantity; i++) {
        const carData = {
          ...formData,
          id: `${Date.now()}-${i}`, // Unique ID for each car
          licensePlate: licensePlates[i],
          vin: vins[i],
          fleetNumber: i + 1, // Car number in fleet
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: user?.id || 'unknown' // Track who created the car
        };
        
        // Remove fleetQuantity from individual car data
        delete carData.fleetQuantity;
        
        await addCar(carData);
        
        // Small delay between adding cars
        if (quantity > 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      navigate('/cars');
    } catch (error) {
      console.error('Error adding car(s):', error);
      
      // Show user-friendly error message based on error type
      if (error.message.includes('Insufficient permissions')) {
        alert('Access denied: You do not have permission to add cars.');
      } else {
        alert('Failed to add car(s). Please try again.');
      }
    }
  };

  // Check if user has permission to create cars
  if (!hasPermission('cars.create')) {
    return (
      <AccessDeniedMessage 
        message="You need 'cars.create' permission to add new vehicles to the fleet."
        icon={Lock}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/cars')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
            <p className="mt-2 text-gray-600">Add a new vehicle to your fleet</p>
            {/* Role indicator */}
            <div className="flex items-center mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user?.role?.replace('_', ' ').toUpperCase() || 'UNKNOWN ROLE'}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                Logged in as: {user?.name || 'Unknown User'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Permission indicator */}
        <div className="text-right">
          <div className="flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Add Car Permission: Granted
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Created cars will be tracked under your account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Fleet Quantity */}
        <PermissionWrapper permissions={['cars.bulk_update', 'cars.create']}>
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <Hash className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Fleet Quantity</h2>
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Bulk Add Feature
              </span>
            </div>
          
          <div className="max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Cars to Add *
            </label>
            <input
              type="number"
              name="fleetQuantity"
              value={formData.fleetQuantity}
              onChange={handleInputChange}
              className={`input-field ${errors.fleetQuantity ? 'border-red-500' : ''}`}
              min="1"
              max="50"
              placeholder="1"
            />
            {errors.fleetQuantity && <p className="mt-1 text-sm text-red-600">{errors.fleetQuantity}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Add multiple cars of the same model. License plates and VINs will be automatically incremented.
            </p>
            
            {formData.fleetQuantity > 1 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Preview:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• {formData.fleetQuantity} × {formData.make} {formData.model || 'Model'}</li>
                  <li>• License Plates: {formData.licensePlate} to {generateLicensePlates(formData.licensePlate || 'ABC-123', formData.fleetQuantity).slice(-1)[0]}</li>
                  <li>• VINs: {formData.vin || '12345678901234567'} to {generateVINs(formData.vin || '12345678901234567', formData.fleetQuantity).slice(-1)[0]}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        </PermissionWrapper>

        {/* Basic Information */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Car className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className={`input-field ${errors.make ? 'border-red-500' : ''}`}
                placeholder="e.g., Toyota"
              />
              {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className={`input-field ${errors.model ? 'border-red-500' : ''}`}
                placeholder="e.g., Camry"
              />
              {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`input-field ${errors.year ? 'border-red-500' : ''}`}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., White"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base License Plate *
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                className={`input-field ${errors.licensePlate ? 'border-red-500' : ''}`}
                placeholder="e.g., ABC-123"
              />
              {errors.licensePlate && <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>}
              {formData.fleetQuantity > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  Will generate: {formData.licensePlate || 'ABC-123'} to {generateLicensePlates(formData.licensePlate || 'ABC-123', formData.fleetQuantity).slice(-1)[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base VIN *
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                className={`input-field ${errors.vin ? 'border-red-500' : ''}`}
                placeholder="17-character VIN"
                maxLength="17"
              />
              {errors.vin && <p className="mt-1 text-sm text-red-600">{errors.vin}</p>}
              {formData.fleetQuantity > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  VINs will be auto-incremented
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Specifications */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Specifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="input-field"
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>
                    {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="input-field"
              >
                {transmissions.map(trans => (
                  <option key={trans} value={trans}>
                    {trans.charAt(0).toUpperCase() + trans.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                className={`input-field ${errors.mileage ? 'border-red-500' : ''}`}
                min="0"
                placeholder="Current mileage"
              />
              {errors.mileage && <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seating Capacity *
              </label>
              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleInputChange}
                className={`input-field ${errors.seatingCapacity ? 'border-red-500' : ''}`}
                min="1"
                max="12"
                placeholder="Number of seats"
              />
              {errors.seatingCapacity && <p className="mt-1 text-sm text-red-600">{errors.seatingCapacity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Baggage Capacity *
              </label>
              <input
                type="number"
                name="baggageCapacity"
                value={formData.baggageCapacity}
                onChange={handleInputChange}
                className={`input-field ${errors.baggageCapacity ? 'border-red-500' : ''}`}
                min="0"
                max="10"
                placeholder="Number of bags"
              />
              {errors.baggageCapacity && <p className="mt-1 text-sm text-red-600">{errors.baggageCapacity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily KM Limit
              </label>
              <input
                type="number"
                name="kmLimit"
                value={formData.kmLimit}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                placeholder="KM per day"
              />
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <DollarSign className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Pricing Information</h2>
            <PermissionWrapper 
              permissions={['cars.create', 'cars.edit']} 
              fallback={
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Read/Write Access
                </span>
              }
            >
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Full Pricing Control
              </span>
            </PermissionWrapper>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rate ($) *
              </label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleInputChange}
                className={`input-field ${errors.dailyRate ? 'border-red-500' : ''}`}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.dailyRate && <p className="mt-1 text-sm text-red-600">{errors.dailyRate}</p>}
              <p className="text-xs text-gray-500 mt-1">{formData.kmLimit}KM / Day</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7+ Days Rate ($) *
              </label>
              <input
                type="number"
                name="weeklyRate"
                value={formData.weeklyRate}
                onChange={handleInputChange}
                className={`input-field ${errors.weeklyRate ? 'border-red-500' : ''}`}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.weeklyRate && <p className="mt-1 text-sm text-red-600">{errors.weeklyRate}</p>}
              <p className="text-xs text-gray-500 mt-1">7+ Days Rate</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unlimited KM Rate ($) *
              </label>
              <input
                type="number"
                name="unlimitedKmRate"
                value={formData.unlimitedKmRate}
                onChange={handleInputChange}
                className={`input-field ${errors.unlimitedKmRate ? 'border-red-500' : ''}`}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {errors.unlimitedKmRate && <p className="mt-1 text-sm text-red-600">{errors.unlimitedKmRate}</p>}
              <p className="text-xs text-gray-500 mt-1">Unlimited KM</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableFeatures.map(feature => (
              <label key={feature} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Insurance & Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insurance */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Insurance Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  name="insurance.provider"
                  value={formData.insurance.provider}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., State Farm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Number
                </label>
                <input
                  type="text"
                  name="insurance.policyNumber"
                  value={formData.insurance.policyNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Policy number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="insurance.expiryDate"
                  value={formData.insurance.expiryDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Maintenance Schedule</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Service Date
                </label>
                <input
                  type="date"
                  name="maintenance.lastService"
                  value={formData.maintenance.lastService}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Service Date
                </label>
                <input
                  type="date"
                  name="maintenance.nextService"
                  value={formData.maintenance.nextService}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interval (miles)
                </label>
                <input
                  type="number"
                  name="maintenance.serviceInterval"
                  value={formData.maintenance.serviceInterval}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1000"
                  step="1000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <Upload className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Car Image</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
              />
              {formData.fleetQuantity > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  This image will be used for all {formData.fleetQuantity} cars.
                </p>
              )}
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Car preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="input-field"
            placeholder="Additional notes about the vehicle..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/cars')}
            className="btn-secondary"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={carsLoading}
            className="btn-primary"
          >
            {carsLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Add {formData.fleetQuantity > 1 ? `${formData.fleetQuantity} Cars` : 'Car'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Wrap with route-level protection
const ProtectedAddCar = () => (
  <ProtectedRoute permissions={['cars.create']}>
    <AddCar />
  </ProtectedRoute>
);

export default ProtectedAddCar; 