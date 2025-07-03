import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Enhanced fleet store with proper image handling and real-time updates
export const useFleetStore = create(
  persist(
    (set, get) => ({
      // State
      vehicles: [],
      maintenanceRecords: [],
      technicians: [],
      trackedVehicles: [], // Vehicles currently being tracked
      loading: false,
      error: null,
      lastUpdate: null,

      // Actions
      initializeFleet: (defaultData) => {
        set({ vehicles: defaultData.vehicles || [] });
      },

      // Vehicle CRUD operations
      addVehicle: (vehicle) => {
        set((state) => ({
          vehicles: [...state.vehicles, { ...vehicle, id: Date.now(), createdAt: new Date().toISOString() }],
          lastUpdate: new Date().toISOString()
        }));
      },

      addVehicles: (newVehicles) => {
        set((state) => ({
          vehicles: [...state.vehicles, ...newVehicles],
          lastUpdate: new Date().toISOString()
        }));
      },

      updateVehicle: (vehicleId, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === vehicleId
              ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
              : vehicle
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      updateVehiclesByGroup: (make, model, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.make === make && vehicle.model === model
              ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
              : vehicle
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      deleteVehicle: (vehicleId) => {
        set((state) => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== vehicleId),
          lastUpdate: new Date().toISOString()
        }));
      },

      // Image handling with persistence
      updateVehicleImage: (vehicleId, imageData) => {
        const imageUrl = imageData?.url || imageData?.preview || '';
        
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === vehicleId
              ? { ...vehicle, image: imageUrl, updatedAt: new Date().toISOString() }
              : vehicle
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      updateVehicleGroupImages: (make, model, imageData) => {
        const imageUrl = imageData?.url || imageData?.preview || '';
        
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.make === make && vehicle.model === model
              ? { ...vehicle, image: imageUrl, updatedAt: new Date().toISOString() }
              : vehicle
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      // Tracking management
      addToTracking: (vehicleId, trackingId = null) => {
        const state = get();
        const vehicle = state.vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) return;

        const trackingData = {
          vehicleId,
          trackingId: trackingId || `TRK-${Date.now()}-${vehicleId}`,
          addedAt: new Date().toISOString(),
          isActive: true
        };

        set((state) => ({
          trackedVehicles: [
            ...state.trackedVehicles.filter(t => t.vehicleId !== vehicleId),
            trackingData
          ],
          lastUpdate: new Date().toISOString()
        }));
      },

      removeFromTracking: (vehicleId) => {
        set((state) => ({
          trackedVehicles: state.trackedVehicles.filter(t => t.vehicleId !== vehicleId),
          lastUpdate: new Date().toISOString()
        }));
      },

      updateTrackingId: (vehicleId, newTrackingId) => {
        set((state) => ({
          trackedVehicles: state.trackedVehicles.map(tracking =>
            tracking.vehicleId === vehicleId
              ? { ...tracking, trackingId: newTrackingId, updatedAt: new Date().toISOString() }
              : tracking
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      // Status updates
      updateVehicleStatus: (vehicleId, newStatus) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === vehicleId
              ? { ...vehicle, status: newStatus, updatedAt: new Date().toISOString() }
              : vehicle
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      // Bulk operations
      bulkUpdateVehicles: (vehicleIds, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicleIds.includes(vehicle.id)
              ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
              : vehicle
          ),
          lastUpdate: new Date().toISOString()
        }));
      },

      // Getters
      getVehicleById: (vehicleId) => {
        const state = get();
        return state.vehicles.find(vehicle => vehicle.id === vehicleId);
      },

      getVehiclesByGroup: (make, model) => {
        const state = get();
        return state.vehicles.filter(vehicle => vehicle.make === make && vehicle.model === model);
      },

      getTrackedVehicles: () => {
        const state = get();
        return state.trackedVehicles.map(tracking => {
          const vehicle = state.vehicles.find(v => v.id === tracking.vehicleId);
          return vehicle ? { ...vehicle, trackingId: tracking.trackingId, trackingData: tracking } : null;
        }).filter(Boolean);
      },

      getVehiclesByStatus: (status) => {
        const state = get();
        return state.vehicles.filter(vehicle => vehicle.status === status);
      },

      // Search and filtering
      searchVehicles: (searchTerm) => {
        const state = get();
        const term = searchTerm.toLowerCase();
        return state.vehicles.filter(vehicle =>
          vehicle.make.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term) ||
          vehicle.licensePlate.toLowerCase().includes(term) ||
          vehicle.vin.toLowerCase().includes(term)
        );
      },

      // Statistics
      getFleetStats: () => {
        const state = get();
        const vehicles = state.vehicles;
        
        return {
          total: vehicles.length,
          available: vehicles.filter(v => v.status === 'available').length,
          rented: vehicles.filter(v => v.status === 'rented').length,
          maintenance: vehicles.filter(v => v.status === 'maintenance').length,
          outOfService: vehicles.filter(v => v.status === 'out-of-service').length,
          tracked: state.trackedVehicles.length,
          totalValue: vehicles.reduce((sum, v) => sum + (v.dailyRate * 365), 0)
        };
      },

      // Loading states
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Reset store
      resetStore: () => {
        set({
          vehicles: [],
          maintenanceRecords: [],
          technicians: [],
          trackedVehicles: [],
          loading: false,
          error: null,
          lastUpdate: null
        });
      }
    }),
    {
      name: 'tak8-fleet-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        vehicles: state.vehicles,
        maintenanceRecords: state.maintenanceRecords,
        technicians: state.technicians,
        trackedVehicles: state.trackedVehicles,
        lastUpdate: state.lastUpdate
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Fleet store rehydrated:', state?.vehicles?.length, 'vehicles');
      }
    }
  )
); 