import { create } from 'zustand';

// Mock data for cars
const mockCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'Silver',
    licensePlate: 'ABC-123',
    vin: '12345678901234567',
    category: 'sedan',
    dailyRate: 45,
    status: 'available',
    mileage: 15000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
  },
  {
    id: 2,
    make: 'Honda',
    model: 'CR-V',
    year: 2023,
    color: 'Blue',
    licensePlate: 'XYZ-789',
    vin: '98765432109876543',
    category: 'suv',
    dailyRate: 55,
    status: 'rented',
    mileage: 8500,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400'
  },
  {
    id: 3,
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    color: 'White',
    licensePlate: 'TSL-456',
    vin: '56789012345678901',
    category: 'electric',
    dailyRate: 85,
    status: 'maintenance',
    mileage: 5200,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400'
  }
];

// Mock data for bookings
const mockBookings = [
  {
    id: 1,
    carId: 2,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1-555-0123',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    totalAmount: 275,
    status: 'active',
    createdAt: '2024-01-10T10:30:00Z'
  },
  {
    id: 2,
    carId: 1,
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+1-555-0456',
    startDate: '2024-01-22',
    endDate: '2024-01-25',
    totalAmount: 135,
    status: 'confirmed',
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: 3,
    carId: 3,
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    customerPhone: '+1-555-0789',
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    totalAmount: 340,
    status: 'completed',
    createdAt: '2024-01-05T09:15:00Z'
  }
];

// Mock data for users (customers)
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    joinDate: '2023-12-01',
    totalBookings: 3,
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1-555-0456',
    joinDate: '2023-11-15',
    totalBookings: 1,
    status: 'active'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1-555-0789',
    joinDate: '2023-10-20',
    totalBookings: 2,
    status: 'active'
  }
];

// Role-based access control system
const rolePermissions = {
  'super_admin': {
    label: 'Super Administrator',
    permissions: [
      'cars.view', 'cars.create', 'cars.edit', 'cars.delete', 'cars.bulk_update',
      'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.cancel', 'bookings.refund',
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.assign_roles',
      'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.schedule',
      'analytics.view_full', 'analytics.export',
      'settings.view', 'settings.edit', 'settings.system_config',
      'dashboard.full_access'
    ]
  },
  'manager': {
    label: 'Fleet Manager',
    permissions: [
      'cars.view', 'cars.create', 'cars.edit', 'cars.bulk_update',
      'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.cancel', 'bookings.refund',
      'users.view', 'users.create', 'users.edit',
      'employees.view', 'employees.create', 'employees.edit',
      'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.schedule',
      'analytics.view_full', 'analytics.export',
      'settings.view', 'settings.edit',
      'dashboard.full_access'
    ]
  },
  'fleet_coordinator': {
    label: 'Fleet Coordinator',
    permissions: [
      'cars.view', 'cars.create', 'cars.edit',
      'bookings.view', 'bookings.create', 'bookings.edit',
      'users.view',
      'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.schedule',
      'analytics.view_limited',
      'dashboard.limited_access'
    ]
  },
  'customer_service': {
    label: 'Customer Service Representative',
    permissions: [
      'cars.view',
      'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.cancel',
      'users.view', 'users.create', 'users.edit',
      'analytics.view_limited',
      'dashboard.limited_access'
    ]
  },
  'maintenance_staff': {
    label: 'Maintenance Staff',
    permissions: [
      'cars.view', 'cars.edit',
      'maintenance.view', 'maintenance.create', 'maintenance.edit', 'maintenance.schedule',
      'dashboard.maintenance_only'
    ]
  },
  'accountant': {
    label: 'Accountant',
    permissions: [
      'cars.view',
      'bookings.view',
      'users.view',
      'analytics.view_full', 'analytics.export',
      'dashboard.financial_only'
    ]
  }
};

// Mock employee data (internal staff)
const mockEmployees = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@tak8.com',
    role: 'super_admin',
    department: 'Administration',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    createdBy: null, // System created
    passwordChanged: true
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@tak8.com',
    role: 'manager',
    department: 'Operations',
    status: 'active',
    createdAt: '2023-03-15T09:00:00Z',
    lastLogin: '2024-01-14T15:45:00Z',
    createdBy: 1,
    passwordChanged: true
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@tak8.com',
    role: 'fleet_coordinator',
    department: 'Fleet Management',
    status: 'active',
    createdAt: '2023-06-20T11:30:00Z',
    lastLogin: '2024-01-14T08:20:00Z',
    createdBy: 1,
    passwordChanged: true
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@tak8.com',
    role: 'customer_service',
    department: 'Customer Support',
    status: 'active',
    createdAt: '2023-08-10T14:15:00Z',
    lastLogin: '2024-01-13T16:30:00Z',
    createdBy: 2,
    passwordChanged: false // Still using temp password
  },
  {
    id: 5,
    name: 'Tom Wilson',
    email: 'tom.wilson@tak8.com',
    role: 'maintenance_staff',
    department: 'Maintenance',
    status: 'active',
    createdAt: '2023-09-05T10:00:00Z',
    lastLogin: '2024-01-12T07:45:00Z',
    createdBy: 2,
    passwordChanged: true
  }
];

const useStore = create((set, get) => ({
  // Cars state
  cars: mockCars,
  carsLoading: false,
  carsError: null,

  // Bookings state
  bookings: mockBookings,
  bookingsLoading: false,
  bookingsError: null,

  // Users state (customers)
  users: mockUsers,
  usersLoading: false,
  usersError: null,

  // Authentication state
  currentUser: mockEmployees[0], // Default to admin for demo
  isAuthenticated: true,
  authLoading: false,
  authError: null,

  // Employee management state
  employees: mockEmployees,
  employeesLoading: false,
  employeesError: null,
  
  // Role permissions
  rolePermissions,

  // Analytics state
  analytics: {
    totalRevenue: 12450,
    totalBookings: 45,
    totalCars: 12,
    totalUsers: 28,
    monthlyRevenue: [
      { month: 'Jan', revenue: 2400 },
      { month: 'Feb', revenue: 1398 },
      { month: 'Mar', revenue: 9800 },
      { month: 'Apr', revenue: 3908 },
      { month: 'May', revenue: 4800 },
      { month: 'Jun', revenue: 3800 }
    ],
    popularCars: [
      { name: 'Toyota Camry', bookings: 12 },
      { name: 'Honda CR-V', bookings: 8 },
      { name: 'Tesla Model 3', bookings: 6 }
    ]
  },

  // UI state
  sidebarOpen: true,
  currentPage: 'dashboard',

  // Permission checker
  hasPermission: (permission) => {
    const user = get().currentUser;
    if (!user || !user.role) return false;
    
    const userRole = rolePermissions[user.role];
    return userRole ? userRole.permissions.includes(permission) : false;
  },

  // Get user role info
  getUserRole: () => {
    const user = get().currentUser;
    if (!user || !user.role) return null;
    return rolePermissions[user.role];
  },

  // Authentication actions
  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const employee = mockEmployees.find(emp => emp.email === email);
      if (employee && employee.status === 'active') {
        set({ 
          currentUser: employee,
          isAuthenticated: true,
          authLoading: false
        });
        return { success: true };
      } else {
        set({ authError: 'Invalid credentials or inactive account', authLoading: false });
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      set({ authError: error.message, authLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      authError: null
    });
  },

  // Employee management actions
  fetchEmployees: async () => {
    set({ employeesLoading: true, employeesError: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ employees: mockEmployees, employeesLoading: false });
    } catch (error) {
      set({ employeesError: error.message, employeesLoading: false });
    }
  },

  createEmployee: async (employeeData) => {
    const currentUser = get().currentUser;
    if (!get().hasPermission('employees.create')) {
      throw new Error('Insufficient permissions to create employees');
    }

    set({ employeesLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEmployee = {
        ...employeeData,
        id: Date.now(),
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        passwordChanged: false,
        lastLogin: null
      };

      set(state => ({
        employees: [...state.employees, newEmployee],
        employeesLoading: false
      }));

      // In real app, send welcome email here
      console.log(`Welcome email sent to ${newEmployee.email}`);
      
      return { success: true, employee: newEmployee };
    } catch (error) {
      set({ employeesError: error.message, employeesLoading: false });
      throw error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    if (!get().hasPermission('employees.edit')) {
      throw new Error('Insufficient permissions to edit employees');
    }

    set({ employeesLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        employees: state.employees.map(emp => 
          emp.id === id ? { ...emp, ...employeeData } : emp
        ),
        employeesLoading: false
      }));
    } catch (error) {
      set({ employeesError: error.message, employeesLoading: false });
    }
  },

  deleteEmployee: async (id) => {
    if (!get().hasPermission('employees.delete')) {
      throw new Error('Insufficient permissions to delete employees');
    }

    set({ employeesLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        employees: state.employees.map(emp => 
          emp.id === id ? { ...emp, status: 'inactive' } : emp
        ),
        employeesLoading: false
      }));
    } catch (error) {
      set({ employeesError: error.message, employeesLoading: false });
    }
  },

  // Cars actions (with permission checks)
  fetchCars: async () => {
    if (!get().hasPermission('cars.view')) {
      set({ carsError: 'Insufficient permissions to view cars' });
      return;
    }

    set({ carsLoading: true, carsError: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ cars: mockCars, carsLoading: false });
    } catch (error) {
      set({ carsError: error.message, carsLoading: false });
    }
  },

  addCar: async (carData) => {
    if (!get().hasPermission('cars.create')) {
      throw new Error('Insufficient permissions to create cars');
    }

    set({ carsLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCar = {
        ...carData,
        id: Date.now(),
        status: 'available'
      };
      set(state => ({
        cars: [...state.cars, newCar],
        carsLoading: false
      }));
    } catch (error) {
      set({ carsError: error.message, carsLoading: false });
    }
  },

  updateCar: async (id, carData) => {
    if (!get().hasPermission('cars.edit')) {
      throw new Error('Insufficient permissions to edit cars');
    }

    set({ carsLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        cars: state.cars.map(car => 
          car.id === id ? { ...car, ...carData } : car
        ),
        carsLoading: false
      }));
    } catch (error) {
      set({ carsError: error.message, carsLoading: false });
    }
  },

  deleteCar: async (id) => {
    if (!get().hasPermission('cars.delete')) {
      throw new Error('Insufficient permissions to delete cars');
    }

    set({ carsLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        cars: state.cars.filter(car => car.id !== id),
        carsLoading: false
      }));
    } catch (error) {
      set({ carsError: error.message, carsLoading: false });
    }
  },

  // Bookings actions (with permission checks)
  fetchBookings: async () => {
    if (!get().hasPermission('bookings.view')) {
      set({ bookingsError: 'Insufficient permissions to view bookings' });
      return;
    }

    set({ bookingsLoading: true, bookingsError: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ bookings: mockBookings, bookingsLoading: false });
    } catch (error) {
      set({ bookingsError: error.message, bookingsLoading: false });
    }
  },

  updateBookingStatus: async (id, status) => {
    if (!get().hasPermission('bookings.edit')) {
      throw new Error('Insufficient permissions to edit bookings');
    }

    set({ bookingsLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === id ? { ...booking, status } : booking
        ),
        bookingsLoading: false
      }));
    } catch (error) {
      set({ bookingsError: error.message, bookingsLoading: false });
    }
  },

  // Users actions (with permission checks)
  fetchUsers: async () => {
    if (!get().hasPermission('users.view')) {
      set({ usersError: 'Insufficient permissions to view users' });
      return;
    }

    set({ usersLoading: true, usersError: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ users: mockUsers, usersLoading: false });
    } catch (error) {
      set({ usersError: error.message, usersLoading: false });
    }
  },

  // UI actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentPage: (page) => set({ currentPage: page }),

  // Get available roles for current user to assign
  getAssignableRoles: () => {
    const currentUser = get().currentUser;
    if (!currentUser) return [];

    // Super admin can assign any role
    if (currentUser.role === 'super_admin') {
      return Object.keys(rolePermissions);
    }
    
    // Manager can assign roles below their level
    if (currentUser.role === 'manager') {
      return ['fleet_coordinator', 'customer_service', 'maintenance_staff', 'accountant'];
    }

    // Others cannot assign roles
    return [];
  }
}));

export default useStore; 