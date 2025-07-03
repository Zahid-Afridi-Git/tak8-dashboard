import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  Car,
  Route,
  Search,
  Filter,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Download,
  Calendar,
  Activity,
  Fuel,
  Gauge,
  Plus,
  X,
  Edit3,
  Trash2
} from 'lucide-react';
import { useFleetStore } from '../../store/fleetStore';

const VehicleTracker = ({ search, setSearch }) => {
  // Use the centralized fleet store
  const { 
    vehicles, 
    trackedVehicles, 
    addToTracking, 
    removeFromTracking, 
    updateTrackingId,
    getTrackedVehicles 
  } = useFleetStore();

  const [activeView, setActiveView] = useState('live'); // live, history, routes, management
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [trackingData, setTrackingData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddTrackingModal, setShowAddTrackingModal] = useState(false);
  const [selectedVehicleForTracking, setSelectedVehicleForTracking] = useState(null);
  const [customTrackingId, setCustomTrackingId] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    timeRange: '1h'
  });

  // Initialize tracking data with realistic GPS coordinates
  useEffect(() => {
    const initializeTrackingData = () => {
      console.log('🗺️ VehicleTracker: Initializing tracking data with', vehicles.length, 'vehicles');
      
      const trackingInfo = vehicles.map(vehicle => ({
        id: vehicle.id,
        licensePlate: vehicle.licensePlate,
        make: vehicle.make,
        model: vehicle.model,
        status: vehicle.status,
        location: vehicle.location,
        image: vehicle.image || '/img/cars/default.png',
        updatedAt: vehicle.updatedAt,
        currentPosition: {
          lat: -37.8136 + (Math.random() - 0.5) * 0.1, // Melbourne area coordinates
          lng: 144.9631 + (Math.random() - 0.5) * 0.1,
          accuracy: Math.floor(Math.random() * 20) + 5,
          speed: vehicle.status === 'rented' ? Math.floor(Math.random() * 60) + 20 : 0,
          heading: Math.floor(Math.random() * 360),
          altitude: Math.floor(Math.random() * 100) + 50
        },
        lastUpdate: new Date(),
        isOnline: Math.random() > 0.1, // 90% online rate
        batteryLevel: Math.floor(Math.random() * 100),
        fuelLevel: vehicle.fuelLevel || Math.floor(Math.random() * 100),
        mileage: vehicle.currentMileage || 0,
        engineStatus: vehicle.status === 'rented' ? 'running' : 'off',
        driver: vehicle.status === 'rented' ? {
          name: `Driver ${Math.floor(Math.random() * 100)}`,
          id: `DRV${Math.floor(Math.random() * 1000)}`,
          contactNumber: `+61 4${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`
        } : null,
        destination: vehicle.status === 'rented' ? {
          name: ['Airport', 'City Center', 'Shopping Mall', 'Hotel', 'Business District'][Math.floor(Math.random() * 5)],
          eta: new Date(Date.now() + Math.random() * 3600000) // Random ETA within 1 hour
        } : null,
        alerts: []
      }));

      // Add some alerts for demonstration
      trackingInfo.forEach(vehicle => {
        if (vehicle.fuelLevel < 20) {
          vehicle.alerts.push({
            type: 'fuel',
            message: 'Low fuel level',
            severity: 'warning',
            timestamp: new Date()
          });
        }
        if (vehicle.batteryLevel < 15) {
          vehicle.alerts.push({
            type: 'battery',
            message: 'Low battery level',
            severity: 'critical',
            timestamp: new Date()
          });
        }
        if (!vehicle.isOnline) {
          vehicle.alerts.push({
            type: 'connection',
            message: 'Vehicle offline',
            severity: 'warning',
            timestamp: new Date()
          });
        }
      });

      setTrackingData(trackingInfo);
    };

    initializeTrackingData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrackingData(prev => prev.map(vehicle => ({
        ...vehicle,
        currentPosition: {
          ...vehicle.currentPosition,
          lat: vehicle.currentPosition.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.currentPosition.lng + (Math.random() - 0.5) * 0.001,
          speed: vehicle.status === 'rented' ? Math.floor(Math.random() * 60) + 20 : 0,
          heading: (vehicle.currentPosition.heading + Math.random() * 20 - 10) % 360
        },
        lastUpdate: new Date(),
        batteryLevel: Math.max(0, vehicle.batteryLevel - Math.random() * 2),
        fuelLevel: Math.max(0, vehicle.fuelLevel - Math.random() * 1)
      })));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [vehicles]); // Re-initialize when vehicles change

  // Force refresh tracking data when vehicle images are updated
  useEffect(() => {
    if (vehicles) {
      console.log('🔄 VehicleTracker: Fleet data updated, refreshing tracking data');
      
      setTrackingData(prev => {
        return prev.map(trackingVehicle => {
          const updatedVehicle = vehicles.find(v => v.id === trackingVehicle.id);
          if (updatedVehicle) {
            return {
              ...trackingVehicle,
              image: updatedVehicle.image || '/img/cars/default.png',
              updatedAt: updatedVehicle.updatedAt,
              status: updatedVehicle.status,
              location: updatedVehicle.location,
              fuelLevel: updatedVehicle.fuelLevel || trackingVehicle.fuelLevel
            };
          }
          return trackingVehicle;
        });
      });
    }
  }, [vehicles?.map(v => v.image + v.updatedAt + v.status).join(',')]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTrackingData(prev => prev.map(vehicle => ({
      ...vehicle,
      lastUpdate: new Date(),
      isOnline: Math.random() > 0.05 // 95% online after refresh
    })));
    
    setRefreshing(false);
  };

  const handleAddToTracking = (vehicle) => {
    setSelectedVehicleForTracking(vehicle);
    setCustomTrackingId(`TRK-${Date.now()}-${vehicle.id}`);
    setShowAddTrackingModal(true);
  };

  const confirmAddToTracking = () => {
    if (selectedVehicleForTracking) {
      addToTracking(selectedVehicleForTracking.id, customTrackingId);
      setShowAddTrackingModal(false);
      setSelectedVehicleForTracking(null);
      setCustomTrackingId('');
    }
  };

  const handleRemoveFromTracking = (vehicleId) => {
    removeFromTracking(vehicleId);
  };

  const handleUpdateTrackingId = (vehicleId, newTrackingId) => {
    updateTrackingId(vehicleId, newTrackingId);
  };

  const getStatusColor = (status, isOnline) => {
    if (!isOnline) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status, isOnline) => {
    if (!isOnline) return AlertTriangle;
    
    switch (status) {
      case 'available': return CheckCircle;
      case 'rented': return Users;
      case 'maintenance': return Settings;
      default: return Car;
    }
  };

  const filteredVehicles = trackingData.filter(vehicle => {
    const matchesSearch = search === '' || 
      vehicle.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;
    const matchesLocation = filters.location === 'all' || vehicle.location.includes(filters.location);
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const trackedVehiclesData = getTrackedVehicles();
  const availableForTracking = vehicles.filter(vehicle => 
    !trackedVehiclesData.some(tracked => tracked.id === vehicle.id)
  );

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Tracking</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'live', label: 'Live Tracking', icon: Activity },
            { id: 'management', label: 'Tracking Management', icon: Settings },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'routes', label: 'Routes', icon: Route }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Tracking View */}
      {activeView === 'live' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out-of-service">Out of Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Locations</option>
                  <option value="Main Branch">Main Branch</option>
                  <option value="Airport Branch">Airport Branch</option>
                  <option value="Downtown Branch">Downtown Branch</option>
                  <option value="Service Center">Service Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ status: 'all', location: 'all', timeRange: '1h' })}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => {
              const StatusIcon = getStatusIcon(vehicle.status, vehicle.isOnline);
              const isTracked = trackedVehiclesData.some(tracked => tracked.id === vehicle.id);
              
              return (
                <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Vehicle Image */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/img/cars/default.png';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status, vehicle.isOnline)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {vehicle.status}
                      </span>
                    </div>
                    {isTracked && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Tracked
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.licensePlate}</p>
                    
                    {/* Location and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {vehicle.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Vehicle Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Fuel</div>
                        <div className="text-lg font-semibold text-gray-900">{vehicle.fuelLevel}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Speed</div>
                        <div className="text-lg font-semibold text-gray-900">{vehicle.currentPosition.speed} km/h</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                      >
                        <Eye className="h-4 w-4 mr-1 inline" />
                        Details
                      </button>
                      {!isTracked ? (
                        <button
                          onClick={() => handleAddToTracking(vehicle)}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRemoveFromTracking(vehicle.id)}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tracking Management View */}
      {activeView === 'management' && (
        <div className="space-y-6">
          {/* Add Vehicle to Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Vehicle to Tracking</h3>
            
            {/* Vehicle Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vehicle
              </label>
              <select
                onChange={(e) => {
                  const vehicle = availableForTracking.find(v => v.id === parseInt(e.target.value));
                  setSelectedVehicleForTracking(vehicle);
                  if (vehicle) {
                    setCustomTrackingId(`TRK-${Date.now()}-${vehicle.id}`);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a vehicle...</option>
                {availableForTracking.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Tracking ID */}
            {selectedVehicleForTracking && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking ID
                </label>
                <input
                  type="text"
                  value={customTrackingId}
                  onChange={(e) => setCustomTrackingId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Add Button */}
            {selectedVehicleForTracking && (
              <button
                onClick={confirmAddToTracking}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2 inline" />
                Add to Tracking
              </button>
            )}
          </div>

          {/* Currently Tracked Vehicles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Tracked Vehicles</h3>
            
            {trackedVehiclesData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No vehicles are currently being tracked.</p>
            ) : (
              <div className="space-y-4">
                {trackedVehiclesData.map((vehicle) => {
                  const trackingData = trackedVehicles.find(t => t.vehicleId === vehicle.id);
                  
                  return (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={vehicle.image || '/img/cars/default.png'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {vehicle.make} {vehicle.model}
                          </h4>
                          <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                          <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Tracking ID</div>
                          <div className="font-mono text-sm text-gray-900">
                            {trackingData?.trackingId || 'N/A'}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const newId = prompt('Enter new tracking ID:', trackingData?.trackingId || '');
                              if (newId) {
                                handleUpdateTrackingId(vehicle.id, newId);
                              }
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            <Edit3 className="h-3 w-3 mr-1 inline" />
                            Edit ID
                          </button>
                          <button
                            onClick={() => handleRemoveFromTracking(vehicle.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1 inline" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h3>
          <p className="text-gray-500 text-center py-8">Tracking history feature coming soon...</p>
        </div>
      )}

      {/* Routes View */}
      {activeView === 'routes' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Routes</h3>
          <p className="text-gray-500 text-center py-8">Route visualization feature coming soon...</p>
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVehicle.make} {selectedVehicle.model} Details
              </h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedVehicle.image}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Vehicle Information</h4>
                  <p className="text-sm text-gray-600">License: {selectedVehicle.licensePlate}</p>
                  <p className="text-sm text-gray-600">Status: {selectedVehicle.status}</p>
                  <p className="text-sm text-gray-600">Location: {selectedVehicle.location}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Current Position</h4>
                  <p className="text-sm text-gray-600">
                    Lat: {selectedVehicle.currentPosition.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lng: {selectedVehicle.currentPosition.lng.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Speed: {selectedVehicle.currentPosition.speed} km/h
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">System Status</h4>
                  <p className="text-sm text-gray-600">
                    Online: {selectedVehicle.isOnline ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Battery: {selectedVehicle.batteryLevel}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Fuel: {selectedVehicle.fuelLevel}%
                  </p>
                </div>
                
                {selectedVehicle.driver && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Driver Information</h4>
                    <p className="text-sm text-gray-600">Name: {selectedVehicle.driver.name}</p>
                    <p className="text-sm text-gray-600">ID: {selectedVehicle.driver.id}</p>
                    <p className="text-sm text-gray-600">Contact: {selectedVehicle.driver.contactNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Tracking Modal */}
      {showAddTrackingModal && selectedVehicleForTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add to Tracking</h3>
              <button
                onClick={() => setShowAddTrackingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Vehicle:</p>
                <p className="font-semibold text-gray-900">
                  {selectedVehicleForTracking.make} {selectedVehicleForTracking.model}
                </p>
                <p className="text-sm text-gray-600">{selectedVehicleForTracking.licensePlate}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking ID
                </label>
                <input
                  type="text"
                  value={customTrackingId}
                  onChange={(e) => setCustomTrackingId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddTrackingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddToTracking}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add to Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTracker;
