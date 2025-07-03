import React, { useState, useRef } from 'react';
import {
  Wrench,
  CheckCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  Users,
  AlertCircle,
  XCircle,
  Upload
} from 'lucide-react';

const VehicleCard = ({ 
  group, 
  refreshKey,
  onViewDetails, 
  onEditVehicle, 
  onDeleteGroup, 
  onRentalStatusUpdate,
  onNavigateToMaintenance,
  onBulkImageUpdate,
  onClick 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef(null);

  // Helper functions for fleet status display

  // Calculate fleet status
  const getFleetStatus = () => {
    if (group.availableCount === group.totalCount) return 'All Available';
    if (group.rentedCount === group.totalCount) return 'All Rented';
    if (group.maintenanceCount === group.totalCount) return 'All Maintenance';
    return 'Mixed Status';
  };

  const getFleetStatusColor = () => {
    if (group.availableCount === group.totalCount) return 'text-green-600';
    if (group.rentedCount === group.totalCount) return 'text-blue-600';
    if (group.maintenanceCount === group.totalCount) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // Handle image upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limit: 300KB
      const MAX_SIZE = 300 * 1024;
      const MAX_WIDTH = 800;
      if (file.size > MAX_SIZE) {
        // Compress using canvas
        const img = new window.Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const scale = Math.min(1, MAX_WIDTH / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          // Try to compress to JPEG, fallback to PNG
          let dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          if (dataUrl.length > MAX_SIZE * 1.33) {
            dataUrl = canvas.toDataURL('image/png');
          }
          if (dataUrl.length > MAX_SIZE * 1.33) {
            alert('Image is too large even after compression. Please choose a smaller image.');
            setShowImageUpload(false);
            return;
          }
          onBulkImageUpdate(group.make, group.model, dataUrl, file);
          setShowImageUpload(false);
          URL.revokeObjectURL(url);
        };
        img.onerror = () => {
          alert('Failed to load image.');
          setShowImageUpload(false);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          onBulkImageUpdate(group.make, group.model, reader.result, file);
          setShowImageUpload(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    onBulkImageUpdate(group.make, group.model, '/img/cars/default.png');
    setShowImageUpload(false);
  };

  // Get sample vehicle for additional data
  const sampleVehicle = group.vehicles[0] || {};

  return (
    <div 
      key={`${group.make}-${group.model}-${refreshKey}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-indigo-300 cursor-pointer group"
      onClick={() => onClick(group)}
    >
      {/* Vehicle Image */}
      <div className="relative">
        <img
          src={group.image || '/img/cars/default.svg'}
          alt={`${group.make} ${group.model}`}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.target.src = '/img/cars/default.svg';
          }}
        />
        
        {/* Fleet Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white shadow-sm">
            <span className={`w-2 h-2 rounded-full mr-1.5 ${
              group.availableCount === group.totalCount ? 'bg-green-500' :
              group.rentedCount === group.totalCount ? 'bg-blue-500' :
              group.maintenanceCount === group.totalCount ? 'bg-yellow-500' :
              'bg-gray-500'
            }`}></span>
            {group.totalCount} Unit{group.totalCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-1.5 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(group);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImageUpload(!showImageUpload);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Update Image
                  </button>

                  {group.vehicles.some(v => v.status === 'available') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToMaintenance(sampleVehicle);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Schedule Maintenance
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGroup(group);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Fleet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload Overlay */}
        {showImageUpload && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 m-4 space-y-3">
              <h4 className="font-medium text-gray-900">Update Fleet Image</h4>
              <div className="space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageUpload();
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Image
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Use Default Image
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowImageUpload(false);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Information */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {group.make} {group.model}
            </h3>
            <p className="text-sm text-gray-600">
              {sampleVehicle.year} • {sampleVehicle.category?.charAt(0).toUpperCase() + sampleVehicle.category?.slice(1)}
            </p>
          </div>
          <span className={`text-sm font-medium ${getFleetStatusColor()}`}>
            {getFleetStatus()}
          </span>
        </div>

        {/* Status Counts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center py-2 bg-green-50 rounded">
            <div className="text-lg font-semibold text-green-600">{group.availableCount}</div>
            <div className="text-xs text-green-600">Available</div>
          </div>
          <div className="text-center py-2 bg-blue-50 rounded">
            <div className="text-lg font-semibold text-blue-600">{group.rentedCount}</div>
            <div className="text-xs text-blue-600">Rented</div>
          </div>
          <div className="text-center py-2 bg-yellow-50 rounded">
            <div className="text-lg font-semibold text-yellow-600">{group.maintenanceCount}</div>
            <div className="text-xs text-yellow-600">Maintenance</div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Daily Rate:</span>
            <span className="font-medium">${sampleVehicle.dailyRate || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Seating:</span>
            <span className="font-medium">{sampleVehicle.seatingCapacity || 'N/A'} passengers</span>
          </div>
          <div className="flex justify-between">
            <span>Fuel Type:</span>
            <span className="font-medium capitalize">{sampleVehicle.fuelType || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Transmission:</span>
            <span className="font-medium capitalize">{sampleVehicle.transmission || 'N/A'}</span>
          </div>
        </div>

        {/* Features */}
        {sampleVehicle.features && sampleVehicle.features.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {sampleVehicle.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {feature}
                </span>
              ))}
              {sampleVehicle.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{sampleVehicle.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* Primary Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(group);
              }}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            
            {group.vehicles.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditVehicle(group.vehicles[0]);
                }}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex gap-2">
            {/* Rent button - show only if there are available vehicles */}
            {group.availableCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const availableVehicle = group.vehicles.find(v => v.status === 'available');
                  if (availableVehicle) {
                    onRentalStatusUpdate(availableVehicle.id, 'rented');
                  }
                }}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Users className="w-4 h-4 mr-1" />
                Rent ({group.availableCount})
              </button>
            )}

            {/* Return button - show only if there are rented vehicles */}
            {group.rentedCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rentedVehicle = group.vehicles.find(v => v.status === 'rented');
                  if (rentedVehicle) {
                    onRentalStatusUpdate(rentedVehicle.id, 'available');
                  }
                }}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Return ({group.rentedCount})
              </button>
            )}

            {/* Maintenance button - always show if there are vehicles */}
            {group.vehicles.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToMaintenance(sampleVehicle);
                }}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Wrench className="w-4 h-4 mr-1" />
                Maintenance
              </button>
            )}
          </div>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-indigo-50 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 rounded-lg pointer-events-none"></div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default VehicleCard;
