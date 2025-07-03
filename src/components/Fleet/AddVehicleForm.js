import React, { useState } from 'react';
import { Car, Save, Upload, Settings, DollarSign, Hash, X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { useFleetStore } from '../../store/fleetStore';

const AddVehicleForm = ({ showNotification, onSuccess }) => {
  // Use the centralized fleet store
  const { addVehicles, vehicles } = useFleetStore();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    category: 'Sedan',
    fuelType: 'gasoline',
    transmission: 'automatic',
    seatingCapacity: 5,
    baggageCapacity: 2,
    fleetQuantity: 1,
    status: 'available',
    location: 'Main Branch',
    features: [],
    description: '',
    image: '',
    dailyRate: 0,
    weeklyRate: 0,
    fuelLevel: 100
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van', 'Luxury', 'Electric', 'Hybrid'];
  const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid', 'cng'];
  const transmissions = ['automatic', 'manual', 'cvt'];
  const statuses = ['available', 'out-of-service'];
  const locations = ['Main Branch', 'Airport Branch', 'Downtown Branch', 'Service Center'];
  const availableFeatures = [
    'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera',
    'Heated Seats', 'Sunroof', 'Leather Seats', 'Cruise Control',
    'Parking Sensors', 'Keyless Entry', 'USB Charging', 'WiFi Hotspot'
  ];

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
    console.log('🖼️ ADD VEHICLE: Image upload triggered:', imageData);
    
    if (imageData) {
      const imageUrl = imageData.url || imageData.preview;
      console.log('✅ ADD VEHICLE: New image URL:', imageUrl);
      
      setFormData(prev => {
        const newFormData = { ...prev, image: imageUrl };
        console.log('🆕 ADD VEHICLE: New form data:', newFormData);
        return newFormData;
      });
      
      setImagePreview(imageData.preview);
      showNotification('success', 'Image Added', 'Vehicle image has been added successfully.');
    } else {
      console.log('❌ ADD VEHICLE: Image data is null, removing image');
      setFormData(prev => ({ ...prev, image: '' }));
      setImagePreview('');
    }
  };

  const generateLicensePlates = (basePlate, quantity) => {
    const plates = [];
    const parts = basePlate.split('-');
    
    if (parts.length !== 2) {
      for (let i = 0; i < quantity; i++) {
        plates.push(`${basePlate}-${String(i + 1).padStart(3, '0')}`);
      }
    } else {
      const prefix = parts[0];
      const baseNumber = parseInt(parts[1]);
      
      for (let i = 0; i < quantity; i++) {
        const newNumber = baseNumber + i;
        plates.push(`${prefix}-${String(newNumber).padStart(3, '0')}`);
      }
    }
    
    return plates;
  };

  const generateVINs = (baseVin, quantity) => {
    const vins = [];
    for (let i = 0; i < quantity; i++) {
      if (baseVin.length === 17) {
        const baseNumber = parseInt(baseVin.slice(-4)) || 0;
        const newNumber = String(baseNumber + i).padStart(4, '0');
        vins.push(baseVin.slice(0, -4) + newNumber);
      } else {
        vins.push(`${baseVin}${String(i + 1).padStart(3, '0')}`);
      }
    }
    return vins;
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
    
    if (formData.fleetQuantity < 1 || formData.fleetQuantity > 50) {
      newErrors.fleetQuantity = 'Fleet quantity must be between 1 and 50';
    }

    // Check for duplicate license plates
    const quantity = parseInt(formData.fleetQuantity);
    const licensePlates = generateLicensePlates(formData.licensePlate, quantity);
    const existingPlates = vehicles.map(v => v.licensePlate);
    const duplicatePlates = licensePlates.filter(plate => existingPlates.includes(plate));
    
    if (duplicatePlates.length > 0) {
      newErrors.licensePlate = `License plates already exist: ${duplicatePlates.join(', ')}`;
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
      const quantity = parseInt(formData.fleetQuantity);
      const licensePlates = generateLicensePlates(formData.licensePlate, quantity);
      const vins = generateVINs(formData.vin, quantity);

      const newVehicles = [];
      
      for (let i = 0; i < quantity; i++) {
        const vehicleData = {
          ...formData,
          id: Date.now() + i,
          licensePlate: licensePlates[i],
          vin: vins[i],
          fleetNumber: i + 1,
          trackingId: `TRK-${Date.now()}-${i + 1}`,
          currentMileage: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        delete vehicleData.fleetQuantity;
        newVehicles.push(vehicleData);
      }

      // Use the centralized store to add vehicles
      addVehicles(newVehicles);

      showNotification('success', 'Vehicles Added', 
        `Successfully added ${quantity} ${formData.make} ${formData.model} vehicle${quantity > 1 ? 's' : ''} to the fleet.`);
      
      // Reset form
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        licensePlate: '',
        vin: '',
        category: 'Sedan',
        fuelType: 'gasoline',
        transmission: 'automatic',
        seatingCapacity: 5,
        baggageCapacity: 2,
        fleetQuantity: 1,
        status: 'available',
        location: 'Main Branch',
        features: [],
        description: '',
        image: '',
        dailyRate: 0,
        weeklyRate: 0,
        fuelLevel: 100
      });
      setImagePreview('');
      setErrors({});
      
      onSuccess();
      
    } catch (error) {
      console.error('Error adding vehicles:', error);
      showNotification('error', 'Error', 'Failed to add vehicles. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Add New Vehicle(s) to Fleet</h3>
          <button
            onClick={onSuccess}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Fleet Quantity */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Hash className="h-6 w-6 text-blue-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Fleet Quantity</h4>
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Bulk Add Feature
              </span>
            </div>
            
            <div className="max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Vehicles to Add *
              </label>
              <input
                type="number"
                name="fleetQuantity"
                value={formData.fleetQuantity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.fleetQuantity ? 'border-red-500' : ''}`}
                min="1"
                max="50"
                placeholder="1"
                required
              />
              {errors.fleetQuantity && <p className="mt-1 text-sm text-red-600">{errors.fleetQuantity}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Add multiple vehicles of the same model. License plates and VINs will be automatically incremented.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Car className="h-6 w-6 text-indigo-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.make ? 'border-red-500' : ''}`}
                  placeholder="e.g., Toyota"
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
                  placeholder="e.g., Camry"
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
                  placeholder="e.g., White"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base License Plate *</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.licensePlate ? 'border-red-500' : ''}`}
                  placeholder="e.g., ABC-123"
                  required
                />
                {errors.licensePlate && <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>}
                {formData.fleetQuantity > 1 && formData.licensePlate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Will generate: {formData.licensePlate} to {generateLicensePlates(formData.licensePlate, formData.fleetQuantity).slice(-1)[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base VIN *</label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.vin ? 'border-red-500' : ''}`}
                  placeholder="17-character VIN"
                  maxLength="17"
                  required
                />
                {errors.vin && <p className="mt-1 text-sm text-red-600">{errors.vin}</p>}
                {formData.fleetQuantity > 1 && (
                  <p className="text-xs text-gray-500 mt-1">VINs will be auto-incremented</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-indigo-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Vehicle Specifications</h4>
            </div>
            
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  placeholder="Number of bags"
                />
                {errors.baggageCapacity && <p className="mt-1 text-sm text-red-600">{errors.baggageCapacity}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <DollarSign className="h-6 w-6 text-indigo-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Pricing</h4>
            </div>
            
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
                  placeholder="0.00"
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
                  placeholder="0.00"
                  required
                />
                {errors.weeklyRate && <p className="mt-1 text-sm text-red-600">{errors.weeklyRate}</p>}
                <p className="text-xs text-gray-500 mt-1">Weekly rental rate for this vehicle</p>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Upload className="h-6 w-6 text-indigo-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Vehicle Image</h4>
            </div>
            
            <ImageUpload
              onImageSelect={handleImageUpload}
              currentImage={imagePreview}
              label="Upload Vehicle Image"
              showPreview={true}
            />
            
            {formData.fleetQuantity > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                This image will be used for all {formData.fleetQuantity} vehicles.
              </p>
            )}
          </div>

          {/* Vehicle Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Features</h4>
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

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Additional notes about the vehicle..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onSuccess}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Add {formData.fleetQuantity > 1 ? `${formData.fleetQuantity} Vehicles` : 'Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm; 