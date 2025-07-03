import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

const ImageUpload = ({ 
  onImageSelect, 
  currentImage = null, 
  acceptedTypes = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = "Upload Image",
  showPreview = true 
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    setError('');
    setUploading(true);

    // Create persistent data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result; // This is a data URL that will persist
      setPreview(dataUrl);
      setUploading(false);
      
      console.log('📸 ImageUpload: Created persistent data URL', {
        fileName: file.name,
        size: file.size,
        dataUrlLength: dataUrl.length
      });
      
      // Call the callback with the persistent data URL
      if (onImageSelect) {
        onImageSelect({
          file: file,
          preview: dataUrl,
          url: dataUrl, // Use data URL as the actual URL for persistence
          name: file.name,
          size: file.size,
          isPersistent: true
        });
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const input = fileInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        handleFileSelect({ target: { files: [file] } });
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearImage = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            {showPreview && (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Image selected</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Image Library Button */}
      <div className="flex space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary text-sm"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Choose from Computer
        </button>
        <button
          onClick={() => {
            // This would open a media library modal in production
            alert('Media Library feature coming soon!\nFor now, use "Choose from Computer" to upload images.');
          }}
          className="btn-outline text-sm"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Media Library
        </button>
      </div>
    </div>
  );
};

export default ImageUpload; 