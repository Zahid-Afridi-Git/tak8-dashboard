import React, { useMemo } from 'react';
import { 
  Car, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MapPin, 
  Wrench, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Calendar,
  Fuel,
  Activity
} from 'lucide-react';

const FleetOverview = ({ fleetData }) => {
  // Calculate comprehensive fleet statistics
  const stats = useMemo(() => {
    const vehicles = fleetData?.vehicles || [];
    
    // Basic counts
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'available').length;
    const rentedVehiclesList = vehicles.filter(v => v.status === 'rented');
    const rentedVehicles = rentedVehiclesList.length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
    const outOfServiceVehicles = vehicles.filter(v => v.status === 'out-of-service').length;
    
    // Revenue calculations
    const dailyRevenue = rentedVehiclesList.reduce((sum, v) => sum + (v.dailyRate || 0), 0);
    const monthlyRevenue = dailyRevenue * 30;
    const yearlyRevenue = dailyRevenue * 365;
    
    // Utilization rate
    const utilizationRate = totalVehicles > 0 ? Math.round((rentedVehicles / totalVehicles) * 100) : 0;
    
    // Category breakdown
    const categoryBreakdown = vehicles.reduce((acc, vehicle) => {
      const category = vehicle.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    // Location breakdown
    const locationBreakdown = vehicles.reduce((acc, vehicle) => {
      const location = vehicle.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    
    // Maintenance due soon (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const maintenanceDueSoon = vehicles.filter(vehicle => {
      if (!vehicle.nextServiceDate) return false;
      const serviceDate = new Date(vehicle.nextServiceDate);
      return serviceDate >= today && serviceDate <= nextWeek;
    }).length;
    
    // Average fleet age
    const currentYear = new Date().getFullYear();
    const averageAge = vehicles.length > 0 
      ? Math.round(vehicles.reduce((sum, v) => sum + (currentYear - (v.year || currentYear)), 0) / vehicles.length)
      : 0;
    
    // Average mileage
    const averageMileage = vehicles.length > 0
      ? Math.round(vehicles.reduce((sum, v) => sum + (v.currentMileage || 0), 0) / vehicles.length)
      : 0;
    
    // Average fuel level
    const averageFuel = vehicles.length > 0
      ? Math.round(vehicles.reduce((sum, v) => sum + (v.fuelLevel || 0), 0) / vehicles.length)
      : 0;

    return {
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      maintenanceVehicles,
      outOfServiceVehicles,
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      utilizationRate,
      categoryBreakdown,
      locationBreakdown,
      maintenanceDueSoon,
      averageAge,
      averageMileage,
      averageFuel
    };
  }, [fleetData]);

  const StatCard = ({ title, value, icon: Icon, color, change, subtext }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color = 'bg-blue-500' }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={Car}
          color="bg-blue-500"
          change={8}
          subtext="Active fleet size"
        />
        <StatCard
          title="Daily Revenue"
          value={`$${stats.dailyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          change={12}
          subtext="From rented vehicles"
        />
        <StatCard
          title="Utilization Rate"
          value={`${stats.utilizationRate}%`}
          icon={TrendingUp}
          color="bg-purple-500"
          change={stats.utilizationRate > 70 ? 5 : -3}
          subtext={`${stats.rentedVehicles} vehicles rented`}
        />
        <StatCard
          title="Maintenance Due"
          value={stats.maintenanceDueSoon}
          icon={AlertTriangle}
          color="bg-yellow-500"
          subtext="Next 7 days"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Available"
          value={stats.availableVehicles}
          icon={CheckCircle}
          color="bg-green-500"
          subtext="Ready for rental"
        />
        <StatCard
          title="In Maintenance"
          value={stats.maintenanceVehicles}
          icon={Wrench}
          color="bg-yellow-500"
          subtext="Being serviced"
        />
        <StatCard
          title="Out of Service"
          value={stats.outOfServiceVehicles}
          icon={XCircle}
          color="bg-red-500"
          subtext="Temporarily unavailable"
        />
      </div>

      {/* Fleet Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Status</h3>
          <div className="space-y-4">
            <ProgressBar 
              label="Available Vehicles" 
              value={stats.availableVehicles} 
              total={stats.totalVehicles}
              color="bg-green-500"
            />
            <ProgressBar 
              label="Rented Vehicles" 
              value={stats.rentedVehicles} 
              total={stats.totalVehicles}
              color="bg-blue-500"
            />
            <ProgressBar 
              label="In Maintenance" 
              value={stats.maintenanceVehicles} 
              total={stats.totalVehicles}
              color="bg-yellow-500"
            />
            <ProgressBar 
              label="Out of Service" 
              value={stats.outOfServiceVehicles} 
              total={stats.totalVehicles}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Revenue Projections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Projections</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Daily</span>
              <span className="font-semibold text-green-600">${stats.dailyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Monthly</span>
              <span className="font-semibold text-green-600">${stats.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Yearly</span>
              <span className="font-semibold text-green-600">${stats.yearlyRevenue.toLocaleString()}</span>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Utilization at {stats.utilizationRate}% - 
                {stats.utilizationRate > 80 ? ' Excellent performance!' : 
                 stats.utilizationRate > 60 ? ' Good performance.' : ' Room for improvement.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category & Location Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vehicle Categories</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / stats.totalVehicles) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Location Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.locationBreakdown).map(([location, count]) => (
              <div key={location} className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {location}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / stats.totalVehicles) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet Health Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Health Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageAge}</p>
            <p className="text-sm text-gray-600">Average Age (years)</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageMileage.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Average Mileage</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
              <Fuel className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageFuel}%</p>
            <p className="text-sm text-gray-600">Average Fuel Level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;
