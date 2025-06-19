import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cars API
export const carsAPI = {
  // Get all cars with optional filters
  getCars: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/cars?${params}`);
    return response.data;
  },

  // Get single car by ID
  getCar: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  // Create new car
  createCar: async (carData) => {
    const response = await api.post('/cars', carData);
    return response.data;
  },

  // Update car
  updateCar: async (id, carData) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },

  // Delete car
  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },

  // Update car status
  updateCarStatus: async (id, status) => {
    const response = await api.patch(`/cars/${id}/status`, { status });
    return response.data;
  },

  // Upload car image
  uploadCarImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/cars/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  // Get all bookings with optional filters
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/bookings?${params}`);
    return response.data;
  },

  // Get single booking by ID
  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Get booking analytics
  getBookingAnalytics: async (dateRange) => {
    const response = await api.get(`/bookings/analytics`, { params: dateRange });
    return response.data;
  },
};

// Maintenance API
export const maintenanceAPI = {
  // Get all maintenance records
  getMaintenanceRecords: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/maintenance?${params}`);
    return response.data;
  },

  // Get single maintenance record
  getMaintenanceRecord: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },

  // Create new maintenance record
  createMaintenanceRecord: async (maintenanceData) => {
    const response = await api.post('/maintenance', maintenanceData);
    return response.data;
  },

  // Update maintenance record
  updateMaintenanceRecord: async (id, maintenanceData) => {
    const response = await api.put(`/maintenance/${id}`, maintenanceData);
    return response.data;
  },

  // Delete maintenance record
  deleteMaintenanceRecord: async (id) => {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data;
  },

  // Update maintenance status
  updateMaintenanceStatus: async (id, status) => {
    const response = await api.patch(`/maintenance/${id}/status`, { status });
    return response.data;
  },

  // Get maintenance schedule for a car
  getCarMaintenanceSchedule: async (carId) => {
    const response = await api.get(`/maintenance/car/${carId}/schedule`);
    return response.data;
  },

  // Get overdue maintenance
  getOverdueMaintenance: async () => {
    const response = await api.get('/maintenance/overdue');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get user booking history
  getUserBookings: async (userId) => {
    const response = await api.get(`/users/${userId}/bookings`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard analytics
  getDashboardAnalytics: async (dateRange) => {
    const response = await api.get('/analytics/dashboard', { params: dateRange });
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (dateRange) => {
    const response = await api.get('/analytics/revenue', { params: dateRange });
    return response.data;
  },

  // Get fleet utilization
  getFleetUtilization: async (dateRange) => {
    const response = await api.get('/analytics/fleet-utilization', { params: dateRange });
    return response.data;
  },

  // Get popular cars
  getPopularCars: async (dateRange) => {
    const response = await api.get('/analytics/popular-cars', { params: dateRange });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (dateRange) => {
    const response = await api.get('/analytics/customers', { params: dateRange });
    return response.data;
  },
};

// Fleet Management API
export const fleetAPI = {
  // Get fleet overview
  getFleetOverview: async () => {
    const response = await api.get('/fleet/overview');
    return response.data;
  },

  // Get fleet statistics
  getFleetStats: async (dateRange) => {
    const response = await api.get('/fleet/stats', { params: dateRange });
    return response.data;
  },

  // Get fleet utilization report
  getUtilizationReport: async (dateRange) => {
    const response = await api.get('/fleet/utilization-report', { params: dateRange });
    return response.data;
  },

  // Get maintenance alerts
  getMaintenanceAlerts: async () => {
    const response = await api.get('/fleet/maintenance-alerts');
    return response.data;
  },

  // Get fleet performance metrics
  getPerformanceMetrics: async (dateRange) => {
    const response = await api.get('/fleet/performance', { params: dateRange });
    return response.data;
  },
};

// Export default api instance for custom requests
export default api; 