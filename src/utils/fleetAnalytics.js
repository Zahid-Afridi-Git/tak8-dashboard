// Fleet Analytics and Excel Export Utility
// This file provides comprehensive analytics and Excel export functionality for the Fleet Management system

export const generateFleetAnalytics = (fleetData, timeframe = 'monthly') => {
  const now = new Date();
  const vehicles = fleetData.vehicles || [];
  const maintenanceRecords = fleetData.maintenanceRecords || [];
  
  // Calculate date ranges
  const getDateRange = (period) => {
    const end = new Date(now);
    let start = new Date(now);
    
    switch(period) {
      case 'daily':
        start.setDate(start.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }
    
    return { start, end };
  };

  const { start, end } = getDateRange(timeframe);

  // Calculate comprehensive fleet statistics
  const fleetStats = {
    totalVehicles: vehicles.length,
    availableVehicles: vehicles.filter(v => v.status === 'available').length,
    rentedVehicles: vehicles.filter(v => v.status === 'rented').length,
    maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
    totalRevenue: vehicles.reduce((sum, v) => {
      if (v.status === 'rented' && v.currentRental) {
        return sum + (v.currentRental.totalAmount || 0);
      }
      return sum;
    }, 0),
    utilizationRate: vehicles.length > 0 ? 
      (vehicles.filter(v => v.status === 'rented').length / vehicles.length * 100).toFixed(1) : 0
  };

  // Calculate revenue by location
  const revenueByLocation = fleetData.locations?.map(location => {
    const locationVehicles = vehicles.filter(v => v.location === location.name);
    const locationRevenue = locationVehicles.reduce((sum, v) => {
      if (v.status === 'rented' && v.currentRental) {
        return sum + (v.currentRental.totalAmount || 0);
      }
      return sum;
    }, 0);
    
    return {
      location: location.name,
      address: location.address,
      totalVehicles: locationVehicles.length,
      availableVehicles: locationVehicles.filter(v => v.status === 'available').length,
      rentedVehicles: locationVehicles.filter(v => v.status === 'rented').length,
      maintenanceVehicles: locationVehicles.filter(v => v.status === 'maintenance').length,
      revenue: locationRevenue,
      utilizationRate: locationVehicles.length > 0 ? 
        (locationVehicles.filter(v => v.status === 'rented').length / locationVehicles.length * 100).toFixed(1) : 0
    };
  }) || [];

  // Calculate revenue by vehicle type/category
  const revenueByType = vehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.category]) {
      acc[vehicle.category] = {
        category: vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1),
        count: 0,
        available: 0,
        rented: 0,
        maintenance: 0,
        revenue: 0,
        averageDailyRate: 0,
        averageWeeklyRate: 0
      };
    }
    
    acc[vehicle.category].count++;
    acc[vehicle.category].averageDailyRate += vehicle.dailyRate || 0;
    acc[vehicle.category].averageWeeklyRate += vehicle.weeklyRate || 0;
    
    switch(vehicle.status) {
      case 'available':
        acc[vehicle.category].available++;
        break;
      case 'rented':
        acc[vehicle.category].rented++;
        if (vehicle.currentRental) {
          acc[vehicle.category].revenue += vehicle.currentRental.totalAmount || 0;
        }
        break;
      case 'maintenance':
        acc[vehicle.category].maintenance++;
        break;
    }
    
    return acc;
  }, {});

  // Calculate averages for vehicle types
  Object.values(revenueByType).forEach(type => {
    if (type.count > 0) {
      type.averageDailyRate = (type.averageDailyRate / type.count).toFixed(2);
      type.averageWeeklyRate = (type.averageWeeklyRate / type.count).toFixed(2);
      type.utilizationRate = ((type.rented / type.count) * 100).toFixed(1);
    }
  });

  // Maintenance statistics
  const maintenanceStats = {
    totalRecords: maintenanceRecords.length,
    completedMaintenance: maintenanceRecords.filter(m => m.status === 'completed').length,
    scheduledMaintenance: maintenanceRecords.filter(m => m.status === 'scheduled').length,
    inProgressMaintenance: maintenanceRecords.filter(m => m.status === 'in-progress').length,
    totalMaintenanceCost: maintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0),
    averageMaintenanceCost: maintenanceRecords.length > 0 ? 
      (maintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0) / maintenanceRecords.length).toFixed(2) : 0
  };

  // Detailed vehicle rental analysis
  const vehicleRentalAnalysis = vehicles.map(vehicle => {
    // Calculate estimated metrics (in real app, this would come from booking history)
    const isCurrentlyRented = vehicle.status === 'rented';
    const estimatedMonthlyRentals = isCurrentlyRented ? 
      Math.floor(Math.random() * 12) + 8 : Math.floor(Math.random() * 8) + 1;
    const utilization = isCurrentlyRented ? 
      Math.floor(Math.random() * 20) + 70 : Math.floor(Math.random() * 40) + 10;
    
    // Calculate service status
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    const daysUntilService = Math.ceil((nextServiceDate - now) / (1000 * 60 * 60 * 24));
    const serviceStatus = daysUntilService < 7 ? 'Due Soon' : 
                         daysUntilService < 30 ? 'Upcoming' : 'Good';
    
    // Calculate estimated revenue
    const avgRentalDuration = 3; // days
    const estimatedMonthlyRevenue = estimatedMonthlyRentals * vehicle.dailyRate * avgRentalDuration;
    
    return {
      vehicleId: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      location: vehicle.location,
      category: vehicle.category,
      status: vehicle.status,
      dailyRate: vehicle.dailyRate,
      weeklyRate: vehicle.weeklyRate,
      currentMileage: vehicle.currentMileage || 0,
      fuelLevel: vehicle.fuelLevel || 0,
      batteryLevel: vehicle.batteryLevel || 0,
      estimatedMonthlyRentals: estimatedMonthlyRentals,
      utilizationRate: `${utilization}%`,
      estimatedMonthlyRevenue: estimatedMonthlyRevenue.toFixed(2),
      lastServiceDate: vehicle.lastServiceDate,
      nextServiceDate: vehicle.nextServiceDate,
      serviceStatus: serviceStatus,
      daysUntilService: daysUntilService,
      insuranceExpiry: vehicle.insurance?.expiryDate,
      registrationExpiry: vehicle.registration?.expiryDate,
      currentRenterName: vehicle.currentRental?.customerName || 'N/A',
      currentRentalAmount: vehicle.currentRental?.totalAmount || 0
    };
  });

  // Calculate top performers
  const topPerformers = {
    mostRentedVehicle: vehicleRentalAnalysis.reduce((max, v) => 
      v.estimatedMonthlyRentals > max.estimatedMonthlyRentals ? v : max, 
      vehicleRentalAnalysis[0] || {}),
    mostProfitableVehicle: vehicleRentalAnalysis.reduce((max, v) => 
      parseFloat(v.estimatedMonthlyRevenue) > parseFloat(max.estimatedMonthlyRevenue) ? v : max, 
      vehicleRentalAnalysis[0] || {}),
    mostProfitableLocation: revenueByLocation.reduce((max, loc) => 
      loc.revenue > max.revenue ? loc : max, 
      revenueByLocation[0] || {}),
    mostProfitableCategory: Object.values(revenueByType).reduce((max, cat) => 
      cat.revenue > max.revenue ? cat : max, 
      Object.values(revenueByType)[0] || {})
  };

  // Financial summary
  const financialSummary = {
    totalRevenue: fleetStats.totalRevenue,
    estimatedMonthlyRevenue: vehicleRentalAnalysis.reduce((sum, v) => 
      sum + parseFloat(v.estimatedMonthlyRevenue), 0).toFixed(2),
    totalMaintenanceCost: maintenanceStats.totalMaintenanceCost,
    netProfit: (fleetStats.totalRevenue - maintenanceStats.totalMaintenanceCost).toFixed(2),
    profitMargin: fleetStats.totalRevenue > 0 ? 
      (((fleetStats.totalRevenue - maintenanceStats.totalMaintenanceCost) / fleetStats.totalRevenue) * 100).toFixed(1) : 0
  };

  return {
    reportGenerated: now.toISOString(),
    timeframe: timeframe,
    dateRange: {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0]
    },
    fleetOverview: fleetStats,
    locationAnalysis: revenueByLocation,
    vehicleTypeAnalysis: Object.values(revenueByType),
    maintenanceAnalysis: maintenanceStats,
    vehicleRentalAnalysis: vehicleRentalAnalysis,
    topPerformers: topPerformers,
    financialSummary: financialSummary
  };
};

// Convert data to CSV format
export const convertToCSV = (data, title = '') => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvData = [
    title ? `${title}` : '',
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value !== null && value !== undefined ? value : '';
      }).join(',')
    )
  ];
  
  return csvData.join('\n');
};

// Main Excel export function
export const exportFleetAnalyticsToExcel = (fleetData, timeframe = 'monthly', showNotification) => {
  const analytics = generateFleetAnalytics(fleetData, timeframe);
  
  // Create comprehensive CSV content
  let csvContent = `FLEET MANAGEMENT ANALYTICS REPORT\n`;
  csvContent += `Report Type: ${timeframe.toUpperCase()} ANALYSIS\n`;
  csvContent += `Generated: ${new Date(analytics.reportGenerated).toLocaleString()}\n`;
  csvContent += `Period: ${analytics.dateRange.from} to ${analytics.dateRange.to}\n`;
  csvContent += `Total Vehicles: ${analytics.fleetOverview.totalVehicles}\n\n`;

  // Executive Summary
  csvContent += "=== EXECUTIVE SUMMARY ===\n";
  csvContent += "Metric,Value,Unit\n";
  csvContent += `Total Vehicles,${analytics.fleetOverview.totalVehicles},count\n`;
  csvContent += `Currently Available,${analytics.fleetOverview.availableVehicles},count\n`;
  csvContent += `Currently Rented,${analytics.fleetOverview.rentedVehicles},count\n`;
  csvContent += `In Maintenance,${analytics.fleetOverview.maintenanceVehicles},count\n`;
  csvContent += `Fleet Utilization Rate,${analytics.fleetOverview.utilizationRate},%\n`;
  csvContent += `Total Revenue,${analytics.fleetOverview.totalRevenue},USD\n`;
  csvContent += `Estimated Monthly Revenue,${analytics.financialSummary.estimatedMonthlyRevenue},USD\n`;
  csvContent += `Total Maintenance Cost,${analytics.financialSummary.totalMaintenanceCost},USD\n`;
  csvContent += `Net Profit,${analytics.financialSummary.netProfit},USD\n`;
  csvContent += `Profit Margin,${analytics.financialSummary.profitMargin},%\n\n`;

  // Location Performance
  csvContent += "=== LOCATION PERFORMANCE ===\n";
  csvContent += convertToCSV(analytics.locationAnalysis) + "\n\n";

  // Vehicle Type Analysis
  csvContent += "=== VEHICLE TYPE ANALYSIS ===\n";
  csvContent += convertToCSV(analytics.vehicleTypeAnalysis) + "\n\n";

  // Maintenance Overview
  csvContent += "=== MAINTENANCE OVERVIEW ===\n";
  csvContent += "Metric,Value,Unit\n";
  csvContent += `Total Maintenance Records,${analytics.maintenanceAnalysis.totalRecords},count\n`;
  csvContent += `Completed Maintenance,${analytics.maintenanceAnalysis.completedMaintenance},count\n`;
  csvContent += `Scheduled Maintenance,${analytics.maintenanceAnalysis.scheduledMaintenance},count\n`;
  csvContent += `In Progress Maintenance,${analytics.maintenanceAnalysis.inProgressMaintenance},count\n`;
  csvContent += `Total Maintenance Cost,${analytics.maintenanceAnalysis.totalMaintenanceCost},USD\n`;
  csvContent += `Average Maintenance Cost,${analytics.maintenanceAnalysis.averageMaintenanceCost},USD\n\n`;

  // Top Performers
  csvContent += "=== TOP PERFORMERS ===\n";
  csvContent += "Category,Vehicle,Value\n";
  csvContent += `Most Rented Vehicle,"${analytics.topPerformers.mostRentedVehicle.make} ${analytics.topPerformers.mostRentedVehicle.model} (${analytics.topPerformers.mostRentedVehicle.licensePlate})",${analytics.topPerformers.mostRentedVehicle.estimatedMonthlyRentals} rentals/month\n`;
  csvContent += `Most Profitable Vehicle,"${analytics.topPerformers.mostProfitableVehicle.make} ${analytics.topPerformers.mostProfitableVehicle.model} (${analytics.topPerformers.mostProfitableVehicle.licensePlate})",$${analytics.topPerformers.mostProfitableVehicle.estimatedMonthlyRevenue}/month\n`;
  csvContent += `Most Profitable Location,${analytics.topPerformers.mostProfitableLocation.location},$${analytics.topPerformers.mostProfitableLocation.revenue}\n`;
  csvContent += `Most Profitable Category,${analytics.topPerformers.mostProfitableCategory.category},$${analytics.topPerformers.mostProfitableCategory.revenue}\n\n`;

  // Detailed Vehicle Information
  csvContent += "=== DETAILED VEHICLE INFORMATION ===\n";
  csvContent += convertToCSV(analytics.vehicleRentalAnalysis) + "\n\n";

  // Financial Analysis
  csvContent += "=== FINANCIAL ANALYSIS ===\n";
  csvContent += "Metric,Value,Unit\n";
  csvContent += `Current Total Revenue,${analytics.financialSummary.totalRevenue},USD\n`;
  csvContent += `Estimated Monthly Revenue,${analytics.financialSummary.estimatedMonthlyRevenue},USD\n`;
  csvContent += `Total Maintenance Costs,${analytics.financialSummary.totalMaintenanceCost},USD\n`;
  csvContent += `Net Profit,${analytics.financialSummary.netProfit},USD\n`;
  csvContent += `Profit Margin,${analytics.financialSummary.profitMargin},%\n\n`;

  // Recommendations
  csvContent += "=== RECOMMENDATIONS ===\n";
  csvContent += "Area,Recommendation,Priority\n";
  
  // Generate dynamic recommendations based on data
  if (analytics.fleetOverview.utilizationRate < 60) {
    csvContent += `Utilization,"Fleet utilization is ${analytics.fleetOverview.utilizationRate}% - consider marketing campaigns or pricing adjustments",High\n`;
  }
  
  if (analytics.maintenanceAnalysis.inProgressMaintenance > analytics.fleetOverview.totalVehicles * 0.15) {
    csvContent += `Maintenance,"High percentage of vehicles in maintenance - review maintenance schedules and procedures",Medium\n`;
  }
  
  if (analytics.financialSummary.profitMargin < 20) {
    csvContent += `Profitability,"Profit margin is ${analytics.financialSummary.profitMargin}% - review pricing strategy and operational costs",High\n`;
  }

  csvContent += `Fleet Expansion,"Consider adding more ${analytics.topPerformers.mostProfitableCategory.category} vehicles to ${analytics.topPerformers.mostProfitableLocation.location}",Medium\n`;

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const fileName = `fleet-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (showNotification) {
    showNotification('success', 'Export Successful', 
      `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} fleet analytics report (${fileName}) has been downloaded successfully.`);
  }

  return analytics;
};

// Real-time fleet data updates
export const updateFleetDataRealTime = (prevData) => {
  const updatedVehicles = prevData.vehicles.map(vehicle => {
    let updates = {};
    
    // Simulate real-time updates based on vehicle status
    if (vehicle.status === 'rented') {
      // Fuel consumption for rented vehicles
      updates.fuelLevel = Math.max(0, vehicle.fuelLevel - (Math.random() * 2));
      
      // Mileage increase for rented vehicles
      updates.currentMileage = vehicle.currentMileage + Math.floor(Math.random() * 10);
    }
    
    // Battery level changes for electric vehicles
    if (vehicle.category === 'electric') {
      if (vehicle.status === 'rented') {
        updates.batteryLevel = Math.max(0, vehicle.batteryLevel - (Math.random() * 3));
      } else if (vehicle.status === 'available') {
        // Assume charging when available
        updates.batteryLevel = Math.min(100, vehicle.batteryLevel + (Math.random() * 2));
      }
    }

    return { ...vehicle, ...updates };
  });

  // Recalculate fleet statistics
  const totalVehicles = updatedVehicles.length;
  const availableVehicles = updatedVehicles.filter(v => v.status === 'available').length;
  const rentedVehicles = updatedVehicles.filter(v => v.status === 'rented').length;
  const maintenanceVehicles = updatedVehicles.filter(v => v.status === 'maintenance').length;
  const totalRevenue = updatedVehicles.reduce((sum, v) => {
    if (v.status === 'rented' && v.currentRental) {
      return sum + (v.currentRental.totalAmount || 0);
    }
    return sum;
  }, 0);

  return {
    ...prevData,
    vehicles: updatedVehicles,
    fleetStats: {
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      maintenanceVehicles,
      totalRevenue
    }
  };
};

// Export quick summary data
export const exportQuickSummary = (fleetData, showNotification) => {
  const analytics = generateFleetAnalytics(fleetData, 'weekly');
  
  const summaryData = {
    'Report Date': new Date().toLocaleDateString(),
    'Total Fleet Size': analytics.fleetOverview.totalVehicles,
    'Available Vehicles': analytics.fleetOverview.availableVehicles,
    'Rented Vehicles': analytics.fleetOverview.rentedVehicles,
    'Maintenance Vehicles': analytics.fleetOverview.maintenanceVehicles,
    'Fleet Utilization': `${analytics.fleetOverview.utilizationRate}%`,
    'Weekly Revenue': `$${analytics.fleetOverview.totalRevenue}`,
    'Top Location': analytics.topPerformers.mostProfitableLocation.location,
    'Top Vehicle Category': analytics.topPerformers.mostProfitableCategory.category,
    'Profit Margin': `${analytics.financialSummary.profitMargin}%`
  };

  const csvContent = Object.entries(summaryData)
    .map(([key, value]) => `${key},${value}`)
    .join('\n');

  const blob = new Blob([`Fleet Management Quick Summary\nGenerated: ${new Date().toLocaleString()}\n\n${csvContent}`], 
    { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `fleet-summary-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (showNotification) {
    showNotification('success', 'Quick Summary Exported', 'Fleet summary has been downloaded successfully.');
  }
}; 