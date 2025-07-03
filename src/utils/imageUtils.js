// Image utility functions for persistent storage
export const convertFileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      console.log('✅ File converted to data URL successfully');
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      console.error('❌ Failed to convert file to data URL');
      reject(new Error('Failed to convert file to data URL'));
    };
    
    // Convert to data URL (base64)
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB.');
  }
  
  return true;
};

export const compressImageIfNeeded = (dataURL, maxSize = 1024 * 1024) => {
  return new Promise((resolve) => {
    // If data URL is already small enough, return as is
    if (dataURL.length < maxSize) {
      resolve(dataURL);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (maintain aspect ratio)
      let { width, height } = img;
      const maxDimension = 800;
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels
      let quality = 0.8;
      let compressedDataURL = canvas.toDataURL('image/jpeg', quality);
      
      while (compressedDataURL.length > maxSize && quality > 0.1) {
        quality -= 0.1;
        compressedDataURL = canvas.toDataURL('image/jpeg', quality);
      }
      
      console.log(`🖼️ Image compressed: ${dataURL.length} -> ${compressedDataURL.length} bytes (quality: ${quality.toFixed(1)})`);
      resolve(compressedDataURL);
    };
    
    img.onerror = () => {
      console.warn('⚠️ Failed to compress image, using original');
      resolve(dataURL);
    };
    
    img.src = dataURL;
  });
}; 