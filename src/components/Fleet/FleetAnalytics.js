import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Car, 
  Calendar,
  Users,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Fuel,
  Activity
} from 'lucide-react';

const FleetAnalytics = ({ fleetData }) => {
  // Calculate detailed analytics
  const analytics = useMemo(() => {
    const vehicles = fleetData?.vehicles || [];
    const maintenanceRecords = fleetData?.maintenanceRecords || [];
    
    // Revenue Analytics
    const totalRevenue = vehicles.reduce((sum, v) => {
      if (v.status === 'rented') return sum + (v.dailyRate || 0);
      return sum;
    }, 0);
    
    // Performance Metrics
    const totalVehicles = vehicles.length;
    const utilizationRate = totalVehicles > 0 ? 
      Math.round((vehicles.filter(v => v.status === 'rented').length / totalVehicles) * 100) : 0;
    
    // Efficiency Metrics
    const avgDailyRate = vehicles.length > 0 ? 
      Math.round(vehicles.reduce((sum, v) => sum + (v.dailyRate || 0), 0) / vehicles.length) : 0;
    
    // Maintenance Analytics
    const maintenanceCost = maintenanceRecords.reduce((sum, record) => 
      sum + (record.estimatedCost || 0), 0);
    
    const avgMaintenanceCost = maintenanceRecords.length > 0 ? 
      Math.round(maintenanceCost / maintenanceRecords.length) : 0;
    
    // Category Performance
    const categoryPerformance = vehicles.reduce((acc, vehicle) => {
      const category = vehicle.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = { total: 0, rented: 0, revenue: 0 };
      }
      acc[category].total++;
      if (vehicle.status === 'rented') {
        acc[category].rented++;
        acc[category].revenue += vehicle.dailyRate || 0;
      }
      return acc;
    }, {});
    
    // Location Performance
    const locationPerformance = vehicles.reduce((acc, vehicle) => {
      const location = vehicle.location || 'Unknown';
      if (!acc[location]) {
        acc[location] = { total: 0, rented: 0, available: 0, maintenance: 0 };
      }
      acc[location].total++;
      if (vehicle.status === 'rented') acc[location].rented++;
      if (vehicle.status === 'available') acc[location].available++;
      if (vehicle.status === 'maintenance') acc[location].maintenance++;
      return acc;
    }, {});
    
    // Fleet Age Analysis
    const currentYear = new Date().getFullYear();
    const ageGroups = vehicles.reduce((acc, vehicle) => {
      const age = currentYear - (vehicle.year || currentYear);
      const ageGroup = age <= 2 ? 'New (0-2 years)' : 
                     age <= 5 ? 'Modern (3-5 years)' : 
                     age <= 10 ? 'Mature (6-10 years)' : 
                     'Aging (10+ years)';
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});
    
    // Fuel Efficiency Analysis
    const fuelAnalysis = vehicles.reduce((acc, vehicle) => {
      const level = vehicle.fuelLevel || 0;
      if (level >= 80) acc.high++;
      else if (level >= 50) acc.medium++;
      else acc.low++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    return {
      totalRevenue,
      utilizationRate,
      avgDailyRate,
      maintenanceCost,
      avgMaintenanceCost,
      categoryPerformance,
      locationPerformance,
      ageGroups,
      fuelAnalysis,
      totalVehicles
    };
  }, [fleetData]);

  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Helper function to format currency
  const formatCurrency = (num) => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1) + 'K';
    }
    return '$' + num.toLocaleString();
  };

  const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{value}</p>
          {change && (
            <div className="flex items-center mt-1">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs lg:text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 lg:p-3 rounded-full ${color} flex-shrink-0 ml-2`}>
          <Icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const BarChart = ({ data, title, valueKey, labelKey, color = 'bg-blue-500' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {Object.entries(data || {}).map(([key, value]) => {
          const maxValue = Math.max(...Object.values(data || {}).map(v => 
            typeof v === 'object' ? (v[valueKey] || 0) : (v || 0)
          ));
          const currentValue = typeof value === 'object' ? (value[valueKey] || 0) : (value || 0);
          const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-sm lg:text-base">
                  {typeof currentValue === 'number' ? 
                    (valueKey === 'revenue' ? formatCurrency(currentValue) : formatNumber(currentValue)) : 
                    currentValue
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="bg-green-500"
        />
        <MetricCard
          title="Fleet Utilization"
          value={`${analytics.utilizationRate}%`}
          change={analytics.utilizationRate > 70 ? "+5.2%" : "-2.1%"}
          trend={analytics.utilizationRate > 70 ? "up" : "down"}
          icon={Target}
          color="bg-blue-500"
        />
        <MetricCard
          title="Avg Daily Rate"
          value={formatCurrency(analytics.avgDailyRate)}
          change="+8.3%"
          trend="up"
          icon={BarChart3}
          color="bg-purple-500"
        />
        <MetricCard
          title="Maintenance Cost"
          value={formatCurrency(analytics.maintenanceCost)}
          change="-3.7%"
          trend="down"
          icon={AlertCircle}
          color="bg-yellow-500"
        />
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={analytics.categoryPerformance}
          title="Revenue by Category"
          valueKey="revenue"
          color="bg-green-500"
        />
        <BarChart
          data={analytics.locationPerformance}
          title="Vehicles by Location"
          valueKey="total"
          color="bg-blue-500"
        />
      </div>

      {/* Fleet Composition Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={analytics.ageGroups}
          title="Fleet Age Distribution"
          color="bg-purple-500"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fuel Level Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Fuel className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">High (80%+)</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{analytics.fuelAnalysis.high}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <Fuel className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-yellow-800 font-medium">Medium (50-79%)</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{analytics.fuelAnalysis.medium}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Fuel className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800 font-medium">Low (Below 50%)</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{analytics.fuelAnalysis.low}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Location Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Vehicles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rented
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(analytics.locationPerformance).map(([location, data]) => {
                const utilizationRate = data.total > 0 ? Math.round((data.rented / data.total) * 100) : 0;
                return (
                  <tr key={location}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.rented}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.available}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        utilizationRate > 80 ? 'bg-green-100 text-green-800' :
                        utilizationRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {utilizationRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Strong Performance</p>
                <p className="text-sm text-gray-600">
                  {analytics.utilizationRate > 70 ? 
                    'Fleet utilization is excellent at ' + analytics.utilizationRate + '%' :
                    'Consider promotional pricing to increase utilization'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Revenue Growth</p>
                <p className="text-sm text-gray-600">
                  Daily revenue trending upward with strong demand
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Maintenance Alert</p>
                <p className="text-sm text-gray-600">
                  {analytics.fuelAnalysis.low > 0 ? 
                    analytics.fuelAnalysis.low + ' vehicles need refueling' :
                    'Fleet fuel levels are optimal'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Optimization</p>
                <p className="text-sm text-gray-600">
                  Consider redistributing vehicles for better location balance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetAnalytics;
