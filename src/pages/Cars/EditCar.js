import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  AlertTriangle
} from 'lucide-react';
import useStore from '../../store';

const EditCar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cars, updateCar, carsLoading } = useStore();
  
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
    weeklyRate: 0,
    unlimitedKmRate: 0,
    seatingCapacity: 5,
    baggageCapacity: 2,
    kmLimit: 150,
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
  const [loading, setLoading] = useState(true);
  const [carNotFound, setCarNotFound] = useState(false);

  const categories = [
    'sedan', 'suv', 'hatchback', 'coupe', 'convertible', 
    'truck', 'van', 'luxury', 'electric', 'hybrid'
  ];

  const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid', 'cng'];
  const transmissions = ['automatic', 'manual', 'cvt'];
  const statuses = ['available', 'rented', 'maintenance', 'unavailable'];

  const availableFeatures = [
    'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera',
    'Heated Seats', 'Sunroof', 'Leather Seats', 'Cruise Control',
    'Parking Sensors', 'Keyless Entry', 'USB Charging', 'WiFi Hotspot'
  ];

  // Load car data on component mount
  useEffect(() => {
    const car = cars.find(c => c.id === id);
    if (car) {
      // Set default values for new fields if they don't exist
      setFormData({
        ...car,
        weeklyRate: car.weeklyRate || car.dailyRate * 6, // Default to 6x daily rate
        unlimitedKmRate: car.unlimitedKmRate || car.dailyRate * 8, // Default to 8x daily rate
        seatingCapacity: car.seatingCapacity || 5,
        baggageCapacity: car.baggageCapacity || 2,
        kmLimit: car.kmLimit || 150,
        insurance: car.insurance || {
          provider: '',
          policyNumber: '',
          expiryDate: ''
        },
        maintenance: car.maintenance || {
          lastService: '',
          nextService: '',
          serviceInterval: 5000
        }
      });
      setImagePreview(car.image || '');
      setLoading(false);
    } else {
      setCarNotFound(true);
      setLoading(false);
    }
  }, [id, cars]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updateCar(id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      navigate('/cars');
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to update car. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (carNotFound) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Car not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The car you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/cars')}
            className="btn-primary"
          >
            Back to Cars
          </button>
        </div>
      </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Car</h1>
            <p className="mt-2 text-gray-600">Update vehicle information and pricing</p>
          </div>
        </div>
      </div>

      {/* Migration Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              New Pricing Features Available
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>We've added new pricing options and capacity information. Default values have been set based on your existing daily rate:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>7+ Days Rate: ${formData.weeklyRate} (6x daily rate)</li>
                <li>Unlimited KM Rate: ${formData.unlimitedKmRate} (8x daily rate)</li>
                <li>Seating Capacity: {formData.seatingCapacity} seats</li>
                <li>Baggage Capacity: {formData.baggageCapacity} bags</li>
              </ul>
              <p className="mt-2">Please review and adjust these values as needed.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
                License Plate *
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VIN *
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
              <div className="flex">
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
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    weeklyRate: prev.dailyRate * 6
                  }))}
                  className="ml-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                  title="Set to 6x daily rate"
                >
                  6x
                </button>
              </div>
              {errors.weeklyRate && <p className="mt-1 text-sm text-red-600">{errors.weeklyRate}</p>}
              <p className="text-xs text-gray-500 mt-1">7+ Days Rate</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unlimited KM Rate ($) *
              </label>
              <div className="flex">
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
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    unlimitedKmRate: prev.dailyRate * 8
                  }))}
                  className="ml-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                  title="Set to 8x daily rate"
                >
                  8x
                </button>
              </div>
              {errors.unlimitedKmRate && <p className="mt-1 text-sm text-red-600">{errors.unlimitedKmRate}</p>}
              <p className="text-xs text-gray-500 mt-1">Unlimited KM</p>
            </div>
          </div>

          {/* Quick Pricing Actions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Pricing Updates</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  weeklyRate: prev.dailyRate * 6,
                  unlimitedKmRate: prev.dailyRate * 8
                }))}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
              >
                Auto-calculate all rates
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  dailyRate: prev.dailyRate * 1.1,
                  weeklyRate: prev.weeklyRate * 1.1,
                  unlimitedKmRate: prev.unlimitedKmRate * 1.1
                }))}
                className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded"
              >
                +10% all rates
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  dailyRate: prev.dailyRate * 0.9,
                  weeklyRate: prev.weeklyRate * 0.9,
                  unlimitedKmRate: prev.unlimitedKmRate * 0.9
                }))}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded"
              >
                -10% all rates
              </button>
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
                Upload New Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
              />
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
            Update Car
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCar; 