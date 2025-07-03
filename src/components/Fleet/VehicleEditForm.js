import React, { useState, useEffect } from 'react';
import { Car, Save, X, Upload, Settings, DollarSign, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { useFleetStore } from '../../store/fleetStore';

const VehicleEditForm = ({ vehicle, showNotification, onClose, onUpdate }) => {
  // Use the centralized fleet store
  const { updateVehicle, updateVehicleImage, updateVehicleGroupImages, getVehiclesByGroup } = useFleetStore();
  
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    licensePlate: vehicle?.licensePlate || '',
    vin: vehicle?.vin || '',
    category: vehicle?.category || 'sedan',
    fuelType: vehicle?.fuelType || 'gasoline',
    transmission: vehicle?.transmission || 'automatic',
    status: vehicle?.status || 'available',
    location: vehicle?.location || 'Main Branch',
    seatingCapacity: vehicle?.seatingCapacity || 5,
    baggageCapacity: vehicle?.baggageCapacity || 0,
    features: vehicle?.features || [],
    description: vehicle?.description || '',
    image: vehicle?.image || '',
    dailyRate: vehicle?.dailyRate || 0,
    weeklyRate: vehicle?.weeklyRate || 0,
    fuelLevel: vehicle?.fuelLevel || 100,
    currentMileage: vehicle?.currentMileage || 0,
    nextServiceMileage: vehicle?.nextServiceMileage || 0
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  const categories = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van', 'Luxury', 'Electric', 'Hybrid'];
  const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid', 'cng'];
  const transmissions = ['automatic', 'manual', 'cvt'];
  const statuses = ['available', 'rented', 'maintenance', 'out-of-service'];
  const locations = ['Main Branch', 'Airport Branch', 'Downtown Branch', 'Service Center'];
  const availableFeatures = [
    'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera',
    'Heated Seats', 'Sunroof', 'Leather Seats', 'Cruise Control',
    'Parking Sensors', 'Keyless Entry', 'USB Charging', 'WiFi Hotspot'
  ];

  // Update form data when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      console.log('🔄 EDIT FORM: Updating form data with vehicle:', vehicle);
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        color: vehicle.color || '',
        licensePlate: vehicle.licensePlate || '',
        vin: vehicle.vin || '',
        category: vehicle.category || 'sedan',
        fuelType: vehicle.fuelType || 'gasoline',
        transmission: vehicle.transmission || 'automatic',
        status: vehicle.status || 'available',
        location: vehicle.location || 'Main Branch',
        seatingCapacity: vehicle.seatingCapacity || 5,
        baggageCapacity: vehicle.baggageCapacity || 0,
        features: vehicle.features || [],
        description: vehicle.description || '',
        image: vehicle.image || '',
        dailyRate: vehicle.dailyRate || 0,
        weeklyRate: vehicle.weeklyRate || 0,
        fuelLevel: vehicle.fuelLevel || 100,
        currentMileage: vehicle.currentMileage || 0,
        nextServiceMileage: vehicle.nextServiceMileage || 0
      });
    }
  }, [vehicle]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'features') {
        setFormData(prev => ({
          ...prev,
          features: checked 
            ? [...prev.features, value]
            : prev.features.filter(f => f !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (imageData) => {
    console.log('🖼️ EDIT FORM: Image upload triggered:', imageData);
    
    if (imageData) {
      const imageUrl = imageData.url || imageData.preview;
      console.log('✅ EDIT FORM: New image URL:', imageUrl);
      
      setFormData(prev => {
        const newFormData = { ...prev, image: imageUrl };
        console.log('🆕 EDIT FORM: New form data:', newFormData);
        return newFormData;
      });
      
      // Check if this vehicle is part of a bulk group
      const sameGroupVehicles = getVehiclesByGroup(vehicle.make, vehicle.model);
      
      console.log(`🚛 Vehicle ${vehicle.id} is part of group ${vehicle.make}-${vehicle.model} with ${sameGroupVehicles.length} vehicles`);
      
      if (sameGroupVehicles.length > 1) {
        console.log('🔄 BULK UPDATE: Updating image for all vehicles in bulk group');
        // Use the store to update all vehicles with the same make and model
        updateVehicleGroupImages(vehicle.make, vehicle.model, imageData);
        showNotification('success', 'Bulk Image Updated', `Image updated for all ${sameGroupVehicles.length} vehicles in the ${vehicle.make} ${vehicle.model} fleet.`);
      } else {
        console.log('🔄 SINGLE UPDATE: Updating image for single vehicle');
        // Use the store to update single vehicle
        updateVehicleImage(vehicle.id, imageData);
        showNotification('success', 'Image Updated', 'Vehicle image has been updated successfully.');
      }
    } else {
      console.log('❌ EDIT FORM: Image data is null, removing image');
      setFormData(prev => ({ ...prev, image: '' }));
      
      // Update vehicle to remove image using the store
      updateVehicle(vehicle.id, { image: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
    
    // Validation rules
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    
    if (formData.dailyRate <= 0) newErrors.dailyRate = 'Daily rate must be greater than 0';
    if (formData.weeklyRate <= 0) newErrors.weeklyRate = 'Weekly rate must be greater than 0';
    
    if (formData.seatingCapacity < 1 || formData.seatingCapacity > 12) {
      newErrors.seatingCapacity = 'Seating capacity must be between 1 and 12';
    }
    
    if (formData.baggageCapacity < 0) {
      newErrors.baggageCapacity = 'Baggage capacity cannot be negative';
    }

    if (formData.currentMileage < 0) {
      newErrors.currentMileage = 'Mileage cannot be negative';
    }

    if (formData.fuelLevel < 0 || formData.fuelLevel > 100) {
      newErrors.fuelLevel = 'Fuel level must be between 0 and 100';
    }

    // Check for duplicate license plates (excluding current vehicle)
    const existingPlates = getVehiclesByGroup(vehicle.make, vehicle.model)
      .filter(v => v.id !== vehicle.id)
      .map(v => v.licensePlate);
    
    if (existingPlates.includes(formData.licensePlate)) {
      newErrors.licensePlate = 'License plate already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Validation Error', 'Please fix the errors and try again.');
      return;
    }

    try {
      // Use the store to update the vehicle
      updateVehicle(vehicle.id, formData);
      
      showNotification('success', 'Vehicle Updated', 'Vehicle information has been updated successfully.');
      
      if (onUpdate) {
        onUpdate({ ...vehicle, ...formData });
      }
      
      onClose();
      
    } catch (error) {
      console.error('Error updating vehicle:', error);
      showNotification('error', 'Error', 'Failed to update vehicle. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'rented': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'out-of-service': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Car },
    { id: 'specs', label: 'Specifications', icon: Settings },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'location', label: 'Location & Status', icon: MapPin },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench }
  ];

  if (!vehicle) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Vehicle Not Found</h3>
            <p className="mt-1 text-sm text-gray-500">The vehicle you're trying to edit could not be found.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900">
              Edit Vehicle: {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500">
              License Plate: {vehicle.licensePlate} | VIN: {vehicle.vin}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Vehicle Status Header */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-500">Current Status:</span>
              <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last Updated: {new Date(vehicle.updatedAt || vehicle.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {sections.map(section => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.make ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.model ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.year ? 'border-red-500' : ''}`}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                  {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate *</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.licensePlate ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.licensePlate && <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VIN *</label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.vin ? 'border-red-500' : ''}`}
                    maxLength="17"
                    required
                  />
                  {errors.vin && <p className="mt-1 text-sm text-red-600">{errors.vin}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Image</label>
                <ImageUpload
                  onImageSelect={handleImageUpload}
                  currentImage={formData.image}
                  label="Upload Vehicle Image"
                  showPreview={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Additional notes about the vehicle..."
                />
              </div>
            </div>
          )}

          {/* Specifications */}
          {activeSection === 'specs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>
                        {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {transmissions.map(trans => (
                      <option key={trans} value={trans}>
                        {trans.charAt(0).toUpperCase() + trans.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity *</label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.seatingCapacity ? 'border-red-500' : ''}`}
                    min="1"
                    max="12"
                    required
                  />
                  {errors.seatingCapacity && <p className="mt-1 text-sm text-red-600">{errors.seatingCapacity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Baggage Capacity</label>
                  <input
                    type="number"
                    name="baggageCapacity"
                    value={formData.baggageCapacity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.baggageCapacity ? 'border-red-500' : ''}`}
                    min="0"
                  />
                  {errors.baggageCapacity && <p className="mt-1 text-sm text-red-600">{errors.baggageCapacity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Mileage</label>
                  <input
                    type="number"
                    name="currentMileage"
                    value={formData.currentMileage}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.currentMileage ? 'border-red-500' : ''}`}
                    min="0"
                  />
                  {errors.currentMileage && <p className="mt-1 text-sm text-red-600">{errors.currentMileage}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Level (%)</label>
                  <input
                    type="number"
                    name="fuelLevel"
                    value={formData.fuelLevel}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.fuelLevel ? 'border-red-500' : ''}`}
                    min="0"
                    max="100"
                  />
                  {errors.fuelLevel && <p className="mt-1 text-sm text-red-600">{errors.fuelLevel}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="features"
                        value={feature}
                        checked={formData.features.includes(feature)}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {activeSection === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate *</label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={formData.dailyRate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.dailyRate ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                    required
                  />
                  {errors.dailyRate && <p className="mt-1 text-sm text-red-600">{errors.dailyRate}</p>}
                  <p className="text-xs text-gray-500 mt-1">Daily rental rate for this vehicle</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Rate *</label>
                  <input
                    type="number"
                    name="weeklyRate"
                    value={formData.weeklyRate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.weeklyRate ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                    required
                  />
                  {errors.weeklyRate && <p className="mt-1 text-sm text-red-600">{errors.weeklyRate}</p>}
                  <p className="text-xs text-gray-500 mt-1">Weekly rental rate for this vehicle</p>
                </div>
              </div>
            </div>
          )}

          {/* Location & Status */}
          {activeSection === 'location' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance */}
          {activeSection === 'maintenance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Date</label>
                  <input
                    type="date"
                    name="lastServiceDate"
                    value={formData.lastServiceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Service Date</label>
                  <input
                    type="date"
                    name="nextServiceDate"
                    value={formData.nextServiceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Service Mileage</label>
                  <input
                    type="number"
                    name="nextServiceMileage"
                    value={formData.nextServiceMileage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleEditForm;
