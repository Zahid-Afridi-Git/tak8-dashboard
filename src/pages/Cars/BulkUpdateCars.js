import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  Briefcase,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import useStore from '../../store';

const CarEditRow = ({ car, onUpdate, onRemove, defaultValues }) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    weeklyRate: car.weeklyRate || car.dailyRate * defaultValues.weeklyRateMultiplier,
    unlimitedKmRate: car.unlimitedKmRate || car.dailyRate * defaultValues.unlimitedKmRateMultiplier,
    seatingCapacity: car.seatingCapacity || defaultValues.seatingCapacity,
    baggageCapacity: car.baggageCapacity !== undefined ? car.baggageCapacity : defaultValues.baggageCapacity,
    kmLimit: car.kmLimit || defaultValues.kmLimit
  });

  const handleSave = () => {
    onUpdate(car.id, editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      weeklyRate: car.weeklyRate || car.dailyRate * defaultValues.weeklyRateMultiplier,
      unlimitedKmRate: car.unlimitedKmRate || car.dailyRate * defaultValues.unlimitedKmRateMultiplier,
      seatingCapacity: car.seatingCapacity || defaultValues.seatingCapacity,
      baggageCapacity: car.baggageCapacity !== undefined ? car.baggageCapacity : defaultValues.baggageCapacity,
      kmLimit: car.kmLimit || defaultValues.kmLimit
    });
    setEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  if (editing) {
    return (
      <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">
            {car.make} {car.model} ({car.licensePlate})
          </h3>
          <span className="text-sm text-gray-600">
            Daily Rate: ${car.dailyRate}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              7+ Days Rate ($)
            </label>
            <input
              type="number"
              value={editData.weeklyRate}
              onChange={(e) => handleChange('weeklyRate', e.target.value)}
              className="input-field text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Unlimited KM ($)
            </label>
            <input
              type="number"
              value={editData.unlimitedKmRate}
              onChange={(e) => handleChange('unlimitedKmRate', e.target.value)}
              className="input-field text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Seats
            </label>
            <input
              type="number"
              value={editData.seatingCapacity}
              onChange={(e) => handleChange('seatingCapacity', e.target.value)}
              className="input-field text-sm"
              min="1"
              max="12"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bags
            </label>
            <input
              type="number"
              value={editData.baggageCapacity}
              onChange={(e) => handleChange('baggageCapacity', e.target.value)}
              className="input-field text-sm"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Daily KM Limit
            </label>
            <input
              type="number"
              value={editData.kmLimit}
              onChange={(e) => handleChange('kmLimit', e.target.value)}
              className="input-field text-sm"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-1 inline" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-1 inline" />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">
          {car.make} {car.model} ({car.licensePlate})
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Daily Rate: ${car.dailyRate}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            title="Edit values"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(car.id)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Remove from update queue"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-orange-500 mr-1" />
          <span>7+ Days: ${editData.weeklyRate}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-red-500 mr-1" />
          <span>Unlimited: ${editData.unlimitedKmRate}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 text-blue-500 mr-1" />
          <span>{editData.seatingCapacity} Seats</span>
        </div>
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 text-purple-500 mr-1" />
          <span>{editData.baggageCapacity} Bags</span>
        </div>
      </div>
    </div>
  );
};

const BulkUpdateCars = () => {
  const navigate = useNavigate();
  const { cars, updateCar } = useStore();
  const [updating, setUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [removedCarIds, setRemovedCarIds] = useState(new Set());
  const [individualUpdates, setIndividualUpdates] = useState({});

  const [defaultValues, setDefaultValues] = useState({
    weeklyRateMultiplier: 6,
    unlimitedKmRateMultiplier: 8,
    seatingCapacity: 5,
    baggageCapacity: 2,
    kmLimit: 150
  });

  const getCarsNeedingUpdate = () => {
    return cars.filter(car => 
      !removedCarIds.has(car.id) && (
        !car.weeklyRate || 
        !car.unlimitedKmRate || 
        !car.seatingCapacity || 
        car.baggageCapacity === undefined ||
        !car.kmLimit
      )
    );
  };

  const carsNeedingUpdate = getCarsNeedingUpdate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDefaultValues(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleIndividualUpdate = (carId, updateData) => {
    setIndividualUpdates(prev => ({
      ...prev,
      [carId]: updateData
    }));
  };

  const handleRemoveFromQueue = (carId) => {
    setRemovedCarIds(prev => new Set([...prev, carId]));
  };

  const handleBulkUpdate = async () => {
    setUpdating(true);
    setErrors([]);
    setUpdateProgress(0);
    
    const carsToUpdate = getCarsNeedingUpdate();
    const total = carsToUpdate.length;
    let updated = 0;
    const updateErrors = [];

    for (const car of carsToUpdate) {
      try {
        const individualUpdate = individualUpdates[car.id];
        const updatedCarData = {
          ...car,
          weeklyRate: individualUpdate?.weeklyRate || car.weeklyRate || car.dailyRate * defaultValues.weeklyRateMultiplier,
          unlimitedKmRate: individualUpdate?.unlimitedKmRate || car.unlimitedKmRate || car.dailyRate * defaultValues.unlimitedKmRateMultiplier,
          seatingCapacity: individualUpdate?.seatingCapacity || car.seatingCapacity || defaultValues.seatingCapacity,
          baggageCapacity: individualUpdate?.baggageCapacity !== undefined ? individualUpdate.baggageCapacity : (car.baggageCapacity !== undefined ? car.baggageCapacity : defaultValues.baggageCapacity),
          kmLimit: individualUpdate?.kmLimit || car.kmLimit || defaultValues.kmLimit,
          insurance: car.insurance || {
            provider: '',
            policyNumber: '',
            expiryDate: ''
          },
          maintenance: car.maintenance || {
            lastService: '',
            nextService: '',
            serviceInterval: 5000
          },
          features: car.features || [],
          description: car.description || '',
          updatedAt: new Date().toISOString()
        };

        await updateCar(car.id, updatedCarData);
        updated++;
        setUpdateProgress(Math.round((updated / total) * 100));
        
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        updateErrors.push({
          car: `${car.make} ${car.model} (${car.licensePlate})`,
          error: error.message
        });
      }
    }

    setErrors(updateErrors);
    setCompleted(true);
    setUpdating(false);
  };

  if (completed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/cars')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Update Complete</h1>
            <p className="mt-2 text-gray-600">Cars have been updated with new pricing and capacity information</p>
          </div>
        </div>

        <div className="card p-6 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Successful!</h2>
          <p className="text-gray-600 mb-6">
            {carsNeedingUpdate.length} cars have been updated with the new pricing and capacity fields.
          </p>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Some cars could not be updated:
              </h3>
              <ul className="text-left text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>
                    <strong>{error.car}</strong>: {error.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/cars')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Update Cars</h1>
          <p className="mt-2 text-gray-600">Update existing cars with new pricing and capacity information</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              Cars Requiring Updates ({carsNeedingUpdate.length})
            </h3>
            <p className="mt-2 text-blue-700">
              Found <strong>{carsNeedingUpdate.length}</strong> cars that need updating with new pricing and capacity fields. 
              You can edit individual values or use default multipliers for bulk updates.
            </p>
          </div>
        </div>
      </div>

      {carsNeedingUpdate.length === 0 ? (
        <div className="card p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">All Cars Up to Date!</h2>
          <p className="text-gray-600 mb-6">
            All remaining cars already have the new pricing and capacity information.
          </p>
          <button
            onClick={() => navigate('/cars')}
            className="btn-primary"
          >
            Back to Cars
          </button>
        </div>
      ) : (
        <>
          {/* Default Values Configuration */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Default Values Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Rate Multiplier
                </label>
                <input
                  type="number"
                  name="weeklyRateMultiplier"
                  value={defaultValues.weeklyRateMultiplier}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">7+ Days Rate = Daily Rate × This</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unlimited KM Multiplier
                </label>
                <input
                  type="number"
                  name="unlimitedKmRateMultiplier"
                  value={defaultValues.unlimitedKmRateMultiplier}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Unlimited KM = Daily Rate × This</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Seating Capacity
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={defaultValues.seatingCapacity}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  max="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Baggage Capacity
                </label>
                <input
                  type="number"
                  name="baggageCapacity"
                  value={defaultValues.baggageCapacity}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Daily KM Limit
                </label>
                <input
                  type="number"
                  name="kmLimit"
                  value={defaultValues.kmLimit}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Cars List with Individual Editing */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Cars to Update</h2>
              <p className="text-sm text-gray-600">
                Click <Edit className="h-4 w-4 inline" /> to edit individual values or <Trash2 className="h-4 w-4 inline" /> to remove from queue
              </p>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {carsNeedingUpdate.map(car => (
                <CarEditRow
                  key={car.id}
                  car={car}
                  defaultValues={defaultValues}
                  onUpdate={handleIndividualUpdate}
                  onRemove={handleRemoveFromQueue}
                />
              ))}
            </div>
          </div>

          {/* Update Progress */}
          {updating && (
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Updating Cars...</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${updateProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{updateProgress}% complete</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/cars')}
              className="btn-secondary"
              disabled={updating}
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpdate}
              disabled={updating || carsNeedingUpdate.length === 0}
              className="btn-primary"
            >
              {updating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Update {carsNeedingUpdate.length} Cars
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkUpdateCars; 