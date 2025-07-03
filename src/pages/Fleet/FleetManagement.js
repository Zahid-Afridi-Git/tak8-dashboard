import React, { useState, useEffect } from 'react';
import {
  Car,
  Wrench,
  CheckCircle,
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  BarChart3,
  TrendingUp,
  FileText,
  XCircle,
  AlertCircle,
  Users,
  Edit
} from 'lucide-react';

// Import components
import AddVehicleForm from '../../components/Fleet/AddVehicleForm';
import MaintenanceManager from '../../components/Fleet/MaintenanceManager';
import VehicleEditForm from '../../components/Fleet/VehicleEditForm';
import FleetAnalytics from '../../components/Fleet/FleetAnalytics';
import FleetOverview from '../../components/Fleet/FleetOverview';
import DocumentExport from '../../components/Fleet/DocumentExport';
import VehicleTracker from '../../components/Fleet/VehicleTracker';
import VehicleCard from '../../components/Fleet/VehicleCard';
import { useFleetStore } from '../../store/fleetStore';

const FleetManagement = () => {
  // Use the centralized fleet store
  const { 
    vehicles: storeVehicles, 
    initializeFleet, 
    addVehicle, 
    updateVehicle: updateStoreVehicle,
    deleteVehicle: deleteStoreVehicle,
    updateVehicleGroupImages: updateStoreGroupImages
  } = useFleetStore();

  const [activeTab, setActiveTab] = useState('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedBulkVehicle, setSelectedBulkVehicle] = useState(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showVehicleEditModal, setShowVehicleEditModal] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState(null);
  const [showIndividualDeleteModal, setShowIndividualDeleteModal] = useState(false);
  const [selectedVehicleForDelete, setSelectedVehicleForDelete] = useState(null);
  const [trackingSearch, setTrackingSearch] = useState('');
  const [prefilledMaintenanceData, setPrefilledMaintenanceData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState(null);
  const [maintenanceNotifications, setMaintenanceNotifications] = useState([]);

  // Force refresh of vehicle groups when fleet data changes
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    console.log('🔄 FORCE REFRESH: UI refreshed with key', refreshKey + 1);
  };

  // Enhanced notification system with better validation messages
  const showEnhancedNotification = (type, title, message, duration = 5000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
    
    // Log detailed notification for debugging
    console.log(`📢 ${type.toUpperCase()}: ${title} - ${message}`);
  };

  // Navigate to maintenance with pre-filled vehicle data
  const handleNavigateToMaintenance = (vehicle) => {
    console.log('🔧 Navigating to maintenance with vehicle data:', vehicle);
    
    // Prepare pre-filled maintenance data
    const maintenanceData = {
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
      type: 'General Inspection', // Default maintenance type
      description: `Scheduled maintenance for ${vehicle.make} ${vehicle.model}`,
      scheduledDate: new Date().toISOString().split('T')[0], // Today's date
      priority: 'medium',
      status: 'scheduled',
      estimatedCost: 0,
      assignedTechnician: '',
      notes: `Current mileage: ${vehicle.currentMileage?.toLocaleString() || 'Unknown'} miles\nFuel level: ${vehicle.fuelLevel || 'Unknown'}%\nLocation: ${vehicle.location || 'Unknown'}`
    };
    
    setPrefilledMaintenanceData(maintenanceData);
    setActiveTab('maintenance');
    
    showEnhancedNotification(
      'info', 
      'Maintenance Form Ready', 
      `Pre-filled maintenance form for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}). Please review and complete the details.`,
      7000
    );
  };

  // Enhanced bulk image updates with proper persistence
  const handleBulkImageUpdate = async (make, model, imageUrl, file = null) => {
    console.log(`🖼️ Starting bulk image update for ${make} ${model} vehicles`, {
      imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : 'null',
      fileProvided: !!file,
      isDataURL: imageUrl && imageUrl.startsWith('data:'),
      isBlobURL: imageUrl && imageUrl.startsWith('blob:')
    });
    
    try {
      const updateTimestamp = new Date().toISOString();
      
      // Count affected vehicles from current fleet data
      const affectedVehicles = fleetData.vehicles.filter(v => v.make === make && v.model === model);
      console.log(`🎯 Found ${affectedVehicles.length} vehicles to update in fleet data`);

      if (affectedVehicles.length === 0) {
        console.log('⚠️ No vehicles found to update');
        return false;
      }
      
      // Update all vehicles with the same make and model
      setFleetData(prev => {
        const updatedVehicles = prev.vehicles.map(vehicle => {
          if (vehicle.make === make && vehicle.model === model) {
            console.log(`📝 Updating vehicle ${vehicle.licensePlate} image from ${vehicle.image || 'none'} to ${imageUrl || 'none'}`);
            return {
              ...vehicle,
              image: imageUrl || '/img/cars/default.svg',
              updatedAt: updateTimestamp
            };
          }
          return vehicle;
        });
        
        const newFleetData = {
          ...prev,
          vehicles: updatedVehicles
        };
        
        console.log('✅ Fleet data updated with new images');
        
        // Log the updated vehicles for debugging
        const updatedAffected = newFleetData.vehicles.filter(v => v.make === make && v.model === model);
        console.log('🔍 Updated vehicles images:', updatedAffected.map(v => ({
          plate: v.licensePlate,
          image: v.image ? (v.image.startsWith('data:') ? `data:${v.image.substring(5, 50)}...` : v.image) : 'none'
        })));
        
        return newFleetData;
      });

      // Also update the store for tracking tab
      updateStoreGroupImages(make, model, { url: imageUrl, preview: imageUrl });

      // Multiple refreshes to ensure UI updates properly
      setTimeout(() => {
        forceRefresh();
        console.log('🔄 First UI refresh after bulk image update');
      }, 50);
      
      setTimeout(() => {
        forceRefresh();
        console.log('🔄 Second UI refresh after bulk image update');
      }, 200);
      
      // Determine image type for notification
      let imageType = 'removed';
      if (imageUrl) {
        if (imageUrl.startsWith('data:')) {
          imageType = 'persistent data URL (will survive page refresh)';
        } else if (imageUrl.startsWith('blob:')) {
          imageType = 'temporary blob URL (will be lost on refresh)';
        } else if (imageUrl.startsWith('/img/')) {
          imageType = 'static file path';
        } else {
          imageType = 'external URL';
        }
      }
      
      showEnhancedNotification(
        'success',
        'Fleet Images Updated Successfully',
        `✅ Updated ${affectedVehicles.length} ${make} ${model} vehicle${affectedVehicles.length > 1 ? 's' : ''} with ${imageType}. Changes will persist after page refresh and are visible in all tabs including tracking.`,
        8000
      );

      console.log(`✅ Bulk image update completed successfully for ${affectedVehicles.length} vehicles`);
      
      return true; // Indicate success
      
    } catch (error) {
      console.error('❌ Failed to update bulk images:', error);
      showEnhancedNotification(
        'error',
        'Image Update Failed',
        'Failed to update vehicle images. This might be due to storage limitations or invalid image data. Please try again with a smaller image.',
        5000
      );
      return false;
    }
  };

  // Initialize fleet data
  const getDefaultFleetData = () => {
    const now = new Date().toISOString();
    return {
      vehicles: [
        {
          id: 1,
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          licensePlate: 'ABC-123',
          vin: '1HGBH41JXMN109186',
          status: 'available',
          category: 'Sedan',
          location: 'Main Branch',
          dailyRate: 65,
          weeklyRate: 390,
          fuelLevel: 85,
          currentMileage: 15000,
          lastServiceDate: '2024-01-15',
          nextServiceDate: '2024-04-15',
          nextServiceMileage: 20000,
          image: '/img/cars/toyota_camry.png',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 2,
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          licensePlate: 'ABC-124',
          vin: '1HGBH41JXMN109187',
          status: 'rented',
          category: 'Sedan',
          location: 'Main Branch',
          dailyRate: 65,
          weeklyRate: 390,
          fuelLevel: 60,
          currentMileage: 16000,
          lastServiceDate: '2024-01-10',
          nextServiceDate: '2024-04-10',
          nextServiceMileage: 21000,
          image: '/img/cars/toyota_camry.png',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 3,
          make: 'Honda',
          model: 'Civic',
          year: 2023,
          licensePlate: 'DEF-456',
          vin: '2HGFC2F59JH542891',
          status: 'available',
          category: 'Compact',
          location: 'Airport Branch',
          dailyRate: 55,
          weeklyRate: 330,
          fuelLevel: 90,
          currentMileage: 12000,
          lastServiceDate: '2024-02-01',
          nextServiceDate: '2024-05-01',
          nextServiceMileage: 17000,
          image: '/img/cars/toyota_corrolla.png',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 4,
          make: 'Mazda',
          model: 'CX-8',
          year: 2023,
          licensePlate: 'GHI-789',
          vin: 'JM3KFBCM5K0123456',
          status: 'maintenance',
          category: 'SUV',
          location: 'Service Center',
          dailyRate: 75,
          weeklyRate: 450,
          fuelLevel: 40,
          currentMileage: 18000,
          lastServiceDate: '2024-02-28',
          nextServiceDate: '2024-03-15',
          nextServiceMileage: 23000,
          image: '/img/cars/mazda_cx8.png',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 5,
          make: 'Suzuki',
          model: 'Swift',
          year: 2023,
          licensePlate: 'JKL-012',
          vin: 'JS2RE5A85K0000123',
          status: 'available',
          category: 'Compact',
          location: 'Downtown Branch',
          dailyRate: 50,
          weeklyRate: 300,
          fuelLevel: 95,
          currentMileage: 8000,
          lastServiceDate: '2024-02-15',
          nextServiceDate: '2024-05-15',
          nextServiceMileage: 13000,
          image: '/img/cars/suzuki_swift.png',
          createdAt: now,
          updatedAt: now
        },
        {
          id: 6,
          make: 'KIA',
          model: 'Carnival',
          year: 2023,
          licensePlate: 'MNO-345',
          vin: 'KNAFA8A36K5000123',
          status: 'rented',
          category: 'Van',
          location: 'Airport Branch',
          dailyRate: 85,
          weeklyRate: 510,
          fuelLevel: 70,
          currentMileage: 22000,
          lastServiceDate: '2024-01-20',
          nextServiceDate: '2024-04-20',
          nextServiceMileage: 27000,
          image: '/img/cars/KIA Carnival.png',
          createdAt: now,
          updatedAt: now
        }
      ],
      maintenanceRecords: [
        {
          id: 1,
          vehicleId: 4,
          type: 'Oil Change',
          date: '2024-03-15',
          status: 'scheduled',
          description: 'Regular oil change and filter replacement',
          assignedTechnician: 'John Smith',
          estimatedCost: 80,
          priority: 'medium',
          createdAt: now
        },
        {
          id: 2,
          vehicleId: 1,
          type: 'Brake Inspection',
          date: '2024-04-15',
          status: 'scheduled',
          description: 'Routine brake system inspection',
          assignedTechnician: 'Sarah Wilson',
          estimatedCost: 150,
          priority: 'high',
          createdAt: now
        }
      ],
      technicians: [
        { id: 1, name: 'John Smith', specialization: 'General Maintenance', status: 'available' },
        { id: 2, name: 'Sarah Wilson', specialization: 'Engine Specialist', status: 'available' },
        { id: 3, name: 'Mike Johnson', specialization: 'Electrical Systems', status: 'available' }
      ]
    };
  };

  const [fleetData, setFleetData] = useState(() => {
    const savedData = localStorage.getItem('tak8-fleet-data');
    console.log('🔄 FleetManagement: Loading data from localStorage');
    return savedData ? JSON.parse(savedData) : getDefaultFleetData();
  });

  // Initialize fleet store with local data ONLY on component mount
  useEffect(() => {
    console.log('🔄 FleetManagement: Initializing fleet store with', fleetData.vehicles.length, 'vehicles');
    initializeFleet(fleetData);
  }, [initializeFleet]); // Only depends on initializeFleet, not fleetData

  // Sync local fleet data with store when store vehicles change (for updates from other components)
  useEffect(() => {
    if (storeVehicles.length > 0) {
      // Only sync if we have actual changes from the store (not from local updates)
      const localVehicleIds = new Set(fleetData.vehicles.map(v => v.id));
      const storeVehicleIds = new Set(storeVehicles.map(v => v.id));
      
      // Check if there are different vehicles (added/removed) or if lengths differ
      const hasStructuralChanges = 
        storeVehicles.length !== fleetData.vehicles.length ||
        !storeVehicles.every(sv => localVehicleIds.has(sv.id)) ||
        !fleetData.vehicles.every(lv => storeVehicleIds.has(lv.id));
      
      if (hasStructuralChanges) {
        console.log('🔄 FleetManagement: Detected store structural changes, syncing local data');
        setFleetData(prev => ({
          ...prev,
          vehicles: storeVehicles
        }));
      }
    }
  }, [storeVehicles]); // Only depend on storeVehicles, not fleetData

  // Enhanced localStorage save with proper image handling
  useEffect(() => {
    console.log('💾 FleetManagement: Saving data to localStorage', {
      vehicleCount: fleetData.vehicles.length,
      timestamp: new Date().toISOString()
    });
    
    // Clean up only blob URLs (data URLs are persistent and should be kept)
    const cleanedFleetData = {
      ...fleetData,
      vehicles: fleetData.vehicles.map(vehicle => {
        let cleanedImage = vehicle.image;
        
        // Only remove blob URLs, keep data URLs (they persist across sessions)
        if (vehicle.image && vehicle.image.startsWith('blob:')) {
          console.log(`🗑️ Removing blob URL for vehicle ${vehicle.licensePlate}: ${vehicle.image.substring(0, 50)}...`);
          cleanedImage = '';
        } else if (vehicle.image && vehicle.image.startsWith('data:')) {
          console.log(`✅ Keeping data URL for vehicle ${vehicle.licensePlate}: ${vehicle.image.substring(0, 50)}...`);
          cleanedImage = vehicle.image; // Keep data URLs
        }
        
        return {
          ...vehicle,
          image: cleanedImage
        };
      })
    };
    
    try {
      localStorage.setItem('tak8-fleet-data', JSON.stringify(cleanedFleetData));
      console.log('✅ FleetManagement: Data saved successfully with', 
        cleanedFleetData.vehicles.filter(v => v.image && v.image.startsWith('data:')).length, 
        'persistent data URL images'
      );
    } catch (error) {
      console.error('❌ FleetManagement: Failed to save data:', error);
      // If saving fails due to quota, try to save without images
      if (error.name === 'QuotaExceededError') {
        console.log('⚠️ Storage quota exceeded, saving without images');
        const dataWithoutImages = {
          ...cleanedFleetData,
          vehicles: cleanedFleetData.vehicles.map(v => ({ ...v, image: '' }))
        };
        try {
          localStorage.setItem('tak8-fleet-data', JSON.stringify(dataWithoutImages));
          console.log('✅ Data saved without images due to storage constraints');
        } catch (fallbackError) {
          console.error('❌ Failed to save even without images:', fallbackError);
        }
      }
    }
  }, [fleetData]);

  // Check for maintenance notifications
  useEffect(() => {
    const checkMaintenanceNotifications = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const upcomingMaintenance = [];
      
      fleetData.vehicles.forEach(vehicle => {
        if (vehicle.nextServiceDate) {
          const serviceDate = new Date(vehicle.nextServiceDate);
          const timeDiff = serviceDate.getTime() - today.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          if (daysDiff === 1) {
            upcomingMaintenance.push({
              id: `maintenance-${vehicle.id}`,
              type: 'maintenance-tomorrow',
              vehicle: vehicle,
              message: `Scheduled maintenance for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}) is due tomorrow`,
              priority: 'high'
            });
          } else if (daysDiff <= 0) {
            upcomingMaintenance.push({
              id: `maintenance-${vehicle.id}`,
              type: 'maintenance-overdue',
              vehicle: vehicle,
              message: `Maintenance for ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}) is overdue by ${Math.abs(daysDiff)} days`,
              priority: 'critical'
            });
          }
        }
      });
      
      setMaintenanceNotifications(upcomingMaintenance);
    };
    
    checkMaintenanceNotifications();
    const interval = setInterval(checkMaintenanceNotifications, 3600000);
    return () => clearInterval(interval);
  }, [fleetData]);

  // Group vehicles by make-model
  const getVehicleGroups = () => {
    const groups = {};
    fleetData.vehicles.forEach(vehicle => {
      const key = `${vehicle.make}-${vehicle.model}`;
      if (!groups[key]) {
        groups[key] = {
          make: vehicle.make,
          model: vehicle.model,
          vehicles: [],
          totalCount: 0,
          availableCount: 0,
          rentedCount: 0,
          maintenanceCount: 0,
          image: '', // We'll set this below
        };
      }
      groups[key].vehicles.push(vehicle);
      groups[key].totalCount++;
      // Count status
      switch (vehicle.status) {
        case 'available': groups[key].availableCount++; break;
        case 'rented': groups[key].rentedCount++; break;
        case 'maintenance': groups[key].maintenanceCount++; break;
        default: break;
      }
    });
    // After grouping, set the group image to the most recently updated valid image
    Object.values(groups).forEach(group => {
      const validImages = group.vehicles
        .filter(v => v.image && v.image !== '/img/cars/default.svg' && v.image.trim() !== '')
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      group.image = validImages.length > 0 ? validImages[0].image : '/img/cars/default.svg';
      
      // Debug logging for image assignment
      console.log(`🖼️ Group ${group.make} ${group.model} image assignment:`, {
        totalVehicles: group.vehicles.length,
        validImages: validImages.length,
        assignedImage: group.image.startsWith('data:') ? `data:${group.image.substring(5, 50)}...` : group.image,
        vehicleImages: group.vehicles.map(v => ({ 
          id: v.id, 
          plate: v.licensePlate, 
          image: v.image ? (v.image.startsWith('data:') ? `data:${v.image.substring(5, 50)}...` : v.image) : 'none' 
        }))
      });
    });
    return Object.values(groups);
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': 
        return 'bg-green-100 text-green-800';
      case 'rented': 
        return 'bg-blue-100 text-blue-800';
      case 'maintenance': 
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-service': 
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': 
        return CheckCircle;
      case 'rented': 
        return Users;
      case 'maintenance': 
        return Wrench;
      case 'out-of-service': 
        return XCircle;
      default: 
        return AlertCircle;
    }
  };

  const showNotification = (type, title, message, duration = 5000) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotification(null), duration);
  };

  const handleBulkDelete = (group) => {
    console.log('🗑️ Bulk delete requested for group:', group);
    setSelectedBulkVehicle(group);
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = () => {
    if (selectedBulkVehicle) {
      const vehicleIds = selectedBulkVehicle.vehicles.map(v => v.id);
      const vehicleCount = selectedBulkVehicle.totalCount;
      const fleetName = `${selectedBulkVehicle.make} ${selectedBulkVehicle.model}`;
      
      setFleetData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(v => !vehicleIds.includes(v.id))
      }));

      // Also delete from store for tracking tab
      vehicleIds.forEach(vehicleId => {
        deleteStoreVehicle(vehicleId);
      });
      
      // Force refresh to update the UI
      setTimeout(() => {
        forceRefresh();
      }, 100);
      
      showEnhancedNotification(
        'success', 
        'Fleet Deleted Successfully', 
        `${vehicleCount} ${fleetName} vehicle${vehicleCount > 1 ? 's have' : ' has'} been permanently removed from the fleet. This action affects all related maintenance records and analytics.`,
        8000
      );
    }
    
    setShowBulkDeleteModal(false);
    setSelectedBulkVehicle(null);
  };

  // Individual vehicle delete functions
  const handleIndividualDelete = (vehicle) => {
    console.log('🗑️ Individual delete requested for vehicle:', vehicle);
    setSelectedVehicleForDelete(vehicle);
    setShowIndividualDeleteModal(true);
  };

  const confirmIndividualDelete = () => {
    if (selectedVehicleForDelete) {
      const vehicle = selectedVehicleForDelete;
      
      // Remove from fleet data
      setFleetData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(v => v.id !== vehicle.id)
      }));

      // Also delete from store for tracking tab
      deleteStoreVehicle(vehicle.id);
      
      // Force refresh to update the UI
      setTimeout(() => {
        forceRefresh();
      }, 100);
      
      showEnhancedNotification(
        'success', 
        'Vehicle Deleted Successfully', 
        `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}) has been permanently removed from the fleet. This action affects all related maintenance records and analytics.`,
        6000
      );
    }
    
    setShowIndividualDeleteModal(false);
    setSelectedVehicleForDelete(null);
  };

  const exportFleetData = () => {
    const data = JSON.stringify(fleetData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fleet-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'Export Complete', 'Fleet data has been exported successfully.');
  };

  // Handle vehicle click for editing
  const handleVehicleClick = (vehicle) => {
    setSelectedVehicleForEdit(vehicle);
    setShowVehicleEditModal(true);
  };

  // Close vehicle edit modal
  const closeVehicleEditModal = () => {
    setSelectedVehicleForEdit(null);
    setShowVehicleEditModal(false);
  };

  // Enhanced vehicle update with robust data persistence
  const handleVehicleUpdate = (updatedVehicle) => {
    console.log('🔄 handleVehicleUpdate: Starting vehicle update process', {
      vehicleId: updatedVehicle.id,
      licensePlate: updatedVehicle.licensePlate,
      changes: updatedVehicle
    });

    const originalVehicle = fleetData.vehicles.find(v => v.id === updatedVehicle.id);
    if (!originalVehicle) {
      console.error('❌ Original vehicle not found for update');
      showEnhancedNotification('error', 'Update Failed', 'Vehicle not found in database.');
      return;
    }

    const hasImageChanged = originalVehicle?.image !== updatedVehicle.image;
    const hasDataChanged = JSON.stringify(originalVehicle) !== JSON.stringify(updatedVehicle);
    
    console.log('📊 Update analysis:', { hasImageChanged, hasDataChanged });

    // Update fleet data with enhanced validation
    setFleetData(prev => {
      const newFleetData = {
        ...prev,
        vehicles: prev.vehicles.map(vehicle => 
          vehicle.id === updatedVehicle.id ? {
            ...updatedVehicle,
            image: updatedVehicle.image || vehicle.image || '/img/cars/default.svg',
            updatedAt: new Date().toISOString(),
            // Ensure all required fields are present
            id: vehicle.id, // Preserve original ID
            createdAt: vehicle.createdAt || new Date().toISOString()
          } : vehicle
        )
      };
      
      console.log('✅ Fleet data updated successfully');
      return newFleetData;
    });

    // Also update the store for tracking tab
    updateStoreVehicle(updatedVehicle.id, updatedVehicle);

    // Single UI refresh after a short delay to ensure state updates are complete
    setTimeout(() => {
      forceRefresh();
      console.log('🔄 UI refresh after vehicle update');
    }, 100);
    
    // Enhanced success notification
    const changesSummary = [];
    if (hasDataChanged) changesSummary.push('vehicle data');
    if (hasImageChanged) changesSummary.push('vehicle image');
    
    showEnhancedNotification(
      'success', 
      'Vehicle Updated Successfully', 
      `${updatedVehicle.make} ${updatedVehicle.model} (${updatedVehicle.licensePlate}) has been updated. Changed: ${changesSummary.join(' and ')}. Changes are now visible across all fleet views and will persist after page refresh.`,
      8000
    );
    
    console.log('✅ Vehicle update process completed successfully');
    
    setShowVehicleEditModal(false);
    setSelectedVehicleForEdit(null);
  };

  // Handle rental status updates with improved feedback
  const handleRentalStatusUpdate = async (vehicleId, newStatus) => {
    console.log(`🚗 Updating rental status for vehicle ${vehicleId} to ${newStatus}`);
    
    return new Promise((resolve) => {
      setFleetData(prev => {
        const vehicle = prev.vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
          console.error(`❌ Vehicle ${vehicleId} not found`);
          showEnhancedNotification('error', 'Update Failed', `Vehicle not found in fleet database.`);
          resolve();
          return prev;
        }

        const updatedVehicles = prev.vehicles.map(v => {
          if (v.id === vehicleId) {
            const updates = {
              ...v,
              status: newStatus,
              updatedAt: new Date().toISOString()
            };
            
            // Handle rental start/end dates
            if (newStatus === 'rented' && v.status !== 'rented') {
              updates.rentalStartDate = new Date().toISOString();
              console.log(`📅 Setting rental start date for vehicle ${vehicleId}`);
            } else if (newStatus !== 'rented' && v.status === 'rented') {
              // Add to rental history when returning
              const rentalDuration = v.rentalStartDate 
                ? Math.floor((new Date() - new Date(v.rentalStartDate)) / (1000 * 60 * 60 * 24))
                : 0;
              
              updates.rentalHistory = [
                ...(v.rentalHistory || []),
                {
                  startDate: v.rentalStartDate,
                  endDate: new Date().toISOString(),
                  duration: rentalDuration
                }
              ];
              updates.rentalStartDate = null;
              console.log(`📝 Added rental history entry for vehicle ${vehicleId}, duration: ${rentalDuration} days`);
            }
            
            console.log(`✅ Vehicle ${vehicleId} status updated:`, updates);
            return updates;
          }
          return v;
        });
        
        const newFleetData = {
          ...prev,
          vehicles: updatedVehicles
        };
        
        // Also update the store for tracking tab
        const updatedVehicle = updatedVehicles.find(v => v.id === vehicleId);
        if (updatedVehicle) {
          updateStoreVehicle(vehicleId, updatedVehicle);
        }
        
        // Force UI refresh after a short delay
        setTimeout(() => {
          forceRefresh();
          resolve();
        }, 100);
        
        // Enhanced status update notifications
        const vehicleName = `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
        switch (newStatus) {
          case 'rented':
            showEnhancedNotification(
              'success', 
              'Vehicle Rented Successfully', 
              `${vehicleName} is now generating revenue! Remember to update fuel and mileage when returned.`
            );
            break;
          case 'available':
            showEnhancedNotification(
              'success', 
              'Vehicle Returned', 
              `${vehicleName} is now available for rent. Consider scheduling maintenance if needed.`
            );
            break;
          case 'maintenance':
            showEnhancedNotification(
              'success', 
              'Maintenance Scheduled', 
              `${vehicleName} has been moved to maintenance status. Track progress in the Maintenance tab.`
            );
            break;
          default:
            showEnhancedNotification(
              'success', 
              'Status Updated', 
              `${vehicleName} status updated to ${newStatus}.`
            );
        }
        
        return newFleetData;
      });
    });
  };

  const tabs = [
    { id: 'overview', label: 'Fleet Overview', icon: BarChart3 },
    { id: 'vehicles', label: 'Vehicle Management', icon: Car },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'analytics', label: 'Fleet Analytics', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'tracking', label: 'Vehicle Tracking', icon: MapPin }
  ];

  const vehicleGroups = getVehicleGroups();

  // Filter vehicles based on search and status
  const filteredGroups = vehicleGroups.filter(group => {
    const matchesSearch = searchTerm === '' || 
      group.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      group.vehicles.some(vehicle => vehicle.status === filterStatus);
    
    return matchesSearch && matchesStatus;
  });

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
                <div>
              <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your entire vehicle fleet efficiently
                  </p>
                </div>
            <div className="flex space-x-3">
              <button
                onClick={exportFleetData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setActiveTab('add-vehicle')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </button>
              </div>
                  </div>
                </div>
            </div>

      {/* Maintenance Notifications */}
      {maintenanceNotifications.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Maintenance Notifications ({maintenanceNotifications.length})
                </h3>
                <div className="mt-2">
                  {maintenanceNotifications.slice(0, 5).map((notification, index) => (
                    <p key={index} className="text-sm text-yellow-700">
                      • {notification.message}
                    </p>
                  ))}
                  {maintenanceNotifications.length > 5 && (
                    <p className="text-sm text-yellow-700 font-medium">
                      ... and {maintenanceNotifications.length - 5} more
                    </p>
                    )}
                  </div>
                </div>
                  </div>
                  </div>
                </div>
              )}
              
      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
              </div>
            </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fleet Overview Tab */}
        {activeTab === 'overview' && (
          <FleetOverview 
            fleetData={fleetData}
          />
        )}

        {/* Vehicle Management Tab */}
        {activeTab === 'vehicles' && (
      <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
                <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
        </div>

            {/* Vehicle Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group, index) => {
                const key = `${group.make}-${group.model}`;
          return (
                  <VehicleCard
                    key={`${key}-${refreshKey}`}
                    group={group}
                    refreshKey={refreshKey}
                    onViewDetails={(group) => {
                      setSelectedBulkVehicle(group);
                      setShowVehicleDetails(true);
                    }}
                    onEditVehicle={(vehicle) => handleVehicleClick(vehicle)}
                    onDeleteGroup={(group) => handleBulkDelete(group)}
                    onRentalStatusUpdate={handleRentalStatusUpdate}
                    onNavigateToMaintenance={handleNavigateToMaintenance}
                    onBulkImageUpdate={handleBulkImageUpdate}
                    onClick={(group) => {
                      // Handle card click to show details
                      setSelectedBulkVehicle(group);
                      setShowVehicleDetails(true);
                    }}
                  />
                );
              })}
                </div>

            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
                  </div>
                )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <MaintenanceManager 
            fleetData={fleetData}
            setFleetData={setFleetData}
            showNotification={showEnhancedNotification}
            prefilledData={prefilledMaintenanceData}
            onPrefilledDataUsed={() => setPrefilledMaintenanceData(null)}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <FleetAnalytics 
            fleetData={fleetData}
            setFleetData={setFleetData}
          />
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <DocumentExport 
            fleetData={fleetData}
            showNotification={showNotification}
          />
        )}

        {/* Vehicle Tracking Tab */}
        {activeTab === 'tracking' && (
          <VehicleTracker 
            search={trackingSearch}
            setSearch={setTrackingSearch}
            fleetData={fleetData}
          />
        )}

        {/* Add Vehicle Tab */}
        {activeTab === 'add-vehicle' && (
          <AddVehicleForm 
            fleetData={fleetData}
            setFleetData={setFleetData}
            showNotification={showNotification}
            onSuccess={() => setActiveTab('vehicles')}
          />
        )}
        </div>

      {/* Vehicle Details Modal */}
      {showVehicleDetails && selectedBulkVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedBulkVehicle.make} {selectedBulkVehicle.model} Fleet Details
              </h3>
                    <button 
                onClick={() => setShowVehicleDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
                    </button>
                  </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {selectedBulkVehicle.vehicles.map((vehicle) => {
                const StatusIcon = getStatusIcon(vehicle.status);
    return (
                  <div 
                    key={vehicle.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
              <div>
                        <h4 className="font-medium text-gray-900">{vehicle.licensePlate}</h4>
                        <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
              </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                {vehicle.status}
              </span>
            </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Location: {vehicle.location}</p>
                      <p>Mileage: {vehicle.currentMileage?.toLocaleString()} miles</p>
                      <p>Fuel: {vehicle.fuelLevel}%</p>
                      <p>Daily Rate: ${vehicle.dailyRate}</p>
              </div>
                    <div className="mt-3 space-y-2">
                      {/* Primary Actions Row */}
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={() => handleVehicleClick(vehicle)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-indigo-300 text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIndividualDelete(vehicle);
                          }}
                          className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                      
                      {/* Status Actions Row */}
                      <div className="flex justify-between gap-2">
                        {vehicle.status !== 'rented' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRentalStatusUpdate(vehicle.id, 'rented');
                            }}
                            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            Rent
                          </button>
                        )}
                        {vehicle.status === 'rented' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRentalStatusUpdate(vehicle.id, 'available');
                            }}
                            className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Return
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToMaintenance(vehicle);
                            setShowVehicleDetails(false);
                          }}
                          className="flex-1 inline-flex items-center justify-center px-3 py-1.5 border border-yellow-300 text-xs font-medium rounded text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                        >
                          <Wrench className="w-3 h-3 mr-1" />
                          Maintenance
                        </button>
                      </div>
      </div>
    </div>
            );
          })}
      </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && selectedBulkVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Delete Fleet
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete all {selectedBulkVehicle.totalCount} {selectedBulkVehicle.make} {selectedBulkVehicle.model} vehicles? 
                  This action cannot be undone.
                  </p>
                </div>
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Fleet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Vehicle Delete Confirmation Modal */}
      {showIndividualDeleteModal && selectedVehicleForDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Delete Vehicle
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the vehicle <strong>{selectedVehicleForDelete.make} {selectedVehicleForDelete.model}</strong> with license plate <strong>{selectedVehicleForDelete.licensePlate}</strong>? 
                  This action cannot be undone.
                  </p>
                </div>
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => setShowIndividualDeleteModal(false)}
                  className="px-4 py-2 bg-white text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmIndividualDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-md p-4 ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex">
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' :
                  notification.type === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {notification.title}
                </h3>
                <div className={`mt-2 text-sm ${
                  notification.type === 'success' ? 'text-green-700' :
                  notification.type === 'error' ? 'text-red-700' :
                  'text-blue-700'
                }`}>
                  <p>{notification.message}</p>
              </div>
            </div>
                    </div>
          </div>
        </div>
      )}

      {/* Vehicle Edit Modal */}
      {showVehicleEditModal && selectedVehicleForEdit && (
        <VehicleEditForm
          vehicle={selectedVehicleForEdit}
          fleetData={fleetData}
          setFleetData={setFleetData}
          showNotification={showEnhancedNotification}
          onClose={closeVehicleEditModal}
          onUpdate={handleVehicleUpdate}
        />
      )}
    </div>
  );
};

export default FleetManagement; 