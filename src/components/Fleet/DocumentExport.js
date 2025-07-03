import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Printer, 
  Mail, 
  Calendar,
  BarChart3,
  DollarSign,
  Wrench,
  Users,
  Car,
  MapPin,
  CheckCircle,
  Package,
  Clock,
  Filter
} from 'lucide-react';

const DocumentExport = ({ fleetData, showNotification }) => {
  const [selectedReportType, setSelectedReportType] = useState('fleet-summary');
  const [selectedBulkReports, setSelectedBulkReports] = useState([]);
  const [bulkDownloadMode, setBulkDownloadMode] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '1900-01-01',
    endDate: new Date().toISOString().split('T')[0]
  });
  const [timeFilter, setTimeFilter] = useState('all');

  const reportTypes = [
    { id: 'fleet-summary', name: 'Fleet Summary Report', icon: Car, description: 'Complete overview of fleet status and metrics' },
    { id: 'revenue-report', name: 'Revenue Report', icon: DollarSign, description: 'Financial performance and revenue analytics' },
    { id: 'maintenance-report', name: 'Maintenance Report', icon: Wrench, description: 'Maintenance schedules and service history' },
    { id: 'utilization-report', name: 'Utilization Report', icon: BarChart3, description: 'Vehicle usage and efficiency metrics' },
    { id: 'location-report', name: 'Location Report', icon: MapPin, description: 'Fleet distribution by location' },
    { id: 'customer-report', name: 'Customer Report', icon: Users, description: 'Customer bookings and preferences' }
  ];

  const timeFilterOptions = [
    { value: 'all', label: 'All Time (Current Data)' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    const now = new Date();
    
    if (value === 'all') {
      // Set to include all data from the beginning of time to now
      setDateRange({
        startDate: '1900-01-01',
        endDate: now.toISOString().split('T')[0]
      });
    } else if (value !== 'custom') {
      let startDate;
      switch (value) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      setDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      });
    }
  };

  const handleBulkReportSelection = (reportId) => {
    setSelectedBulkReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  const selectAllReports = () => {
    if (selectedBulkReports.length === reportTypes.length) {
      setSelectedBulkReports([]);
    } else {
      setSelectedBulkReports(reportTypes.map(report => report.id));
    }
  };

  const filterDataByDateRange = (data, startDate, endDate) => {
    // If "All Time" is selected or start date is very old, return all data
    if (timeFilter === 'all' || startDate === '1900-01-01') {
      return {
        ...data,
        vehicles: data.vehicles || [],
        maintenanceRecords: data.maintenanceRecords || []
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end day
    
    return {
      ...data,
      vehicles: data.vehicles?.filter(vehicle => {
        // If vehicle doesn't have creation date, include it (current vehicles)
        if (!vehicle.createdAt && !vehicle.updatedAt) {
          return true;
        }
        const vehicleDate = new Date(vehicle.createdAt || vehicle.updatedAt || new Date());
        return vehicleDate >= start && vehicleDate <= end;
      }) || [],
      maintenanceRecords: data.maintenanceRecords?.filter(record => {
        // If record doesn't have date, include it for current data
        if (!record.date && !record.createdAt) {
          return true;
        }
        const recordDate = new Date(record.date || record.createdAt || new Date());
        return recordDate >= start && recordDate <= end;
      }) || []
    };
  };

  const generateCombinedReport = (reportIds, format) => {
    const filteredData = filterDataByDateRange(fleetData, dateRange.startDate, dateRange.endDate);
    const vehicles = filteredData?.vehicles || [];
    const maintenanceRecords = filteredData?.maintenanceRecords || [];
    
    const combinedReport = {
      title: 'Combined Fleet Report',
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      },
      generatedAt: new Date().toISOString(),
      reports: {}
    };

    reportIds.forEach(reportId => {
      switch (reportId) {
        case 'fleet-summary':
          combinedReport.reports.fleetSummary = {
            title: 'Fleet Summary Report',
            totalVehicles: vehicles.length,
            availableVehicles: vehicles.filter(v => v.status === 'available').length,
            rentedVehicles: vehicles.filter(v => v.status === 'rented').length,
            maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
            outOfServiceVehicles: vehicles.filter(v => v.status === 'out-of-service').length,
            categories: vehicles.reduce((acc, v) => {
              acc[v.category] = (acc[v.category] || 0) + 1;
              return acc;
            }, {}),
            locations: vehicles.reduce((acc, v) => {
              acc[v.location] = (acc[v.location] || 0) + 1;
              return acc;
            }, {}),
            utilizationRate: vehicles.length > 0 ? 
              Math.round((vehicles.filter(v => v.status === 'rented').length / vehicles.length) * 100) : 0
          };
          break;
        
        case 'revenue-report':
          const totalRevenue = vehicles.reduce((sum, v) => sum + (v.status === 'rented' ? v.dailyRate : 0), 0);
          combinedReport.reports.revenueReport = {
            title: 'Revenue Report',
            totalRevenue,
            potentialRevenue: vehicles.reduce((sum, v) => sum + v.dailyRate, 0),
            avgDailyRate: vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.dailyRate, 0) / vehicles.length) : 0,
            highestEarner: vehicles.reduce((max, v) => v.dailyRate > (max?.dailyRate || 0) ? v : max, null),
            revenueByCategory: vehicles.reduce((acc, v) => {
              const revenue = v.status === 'rented' ? v.dailyRate : 0;
              acc[v.category] = (acc[v.category] || 0) + revenue;
              return acc;
            }, {}),
            revenueByLocation: vehicles.reduce((acc, v) => {
              const revenue = v.status === 'rented' ? v.dailyRate : 0;
              acc[v.location] = (acc[v.location] || 0) + revenue;
              return acc;
            }, {})
          };
          break;
        
        case 'maintenance-report':
          combinedReport.reports.maintenanceReport = {
            title: 'Maintenance Report',
            totalMaintenanceItems: maintenanceRecords.length,
            upcomingMaintenance: maintenanceRecords.filter(r => r.status === 'scheduled').length,
            completedMaintenance: maintenanceRecords.filter(r => r.status === 'completed').length,
            inProgressMaintenance: maintenanceRecords.filter(r => r.status === 'in-progress').length,
            maintenanceByType: maintenanceRecords.reduce((acc, r) => {
              acc[r.type] = (acc[r.type] || 0) + 1;
              return acc;
            }, {}),
            estimatedCosts: maintenanceRecords.reduce((sum, r) => sum + (r.estimatedCost || 0), 0),
            actualCosts: maintenanceRecords.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0),
            averageCostPerMaintenance: maintenanceRecords.length > 0 ? 
              Math.round(maintenanceRecords.reduce((sum, r) => sum + (r.estimatedCost || 0), 0) / maintenanceRecords.length) : 0
          };
          break;
        
        case 'utilization-report':
          combinedReport.reports.utilizationReport = {
            title: 'Utilization Report',
            overallUtilization: vehicles.length > 0 ? 
              Math.round((vehicles.filter(v => v.status === 'rented').length / vehicles.length) * 100) : 0,
            utilizationByCategory: vehicles.reduce((acc, v) => {
              if (!acc[v.category]) {
                acc[v.category] = { total: 0, rented: 0, utilization: 0 };
              }
              acc[v.category].total++;
              if (v.status === 'rented') acc[v.category].rented++;
              acc[v.category].utilization = Math.round((acc[v.category].rented / acc[v.category].total) * 100);
              return acc;
            }, {}),
            utilizationByLocation: vehicles.reduce((acc, v) => {
              if (!acc[v.location]) {
                acc[v.location] = { total: 0, rented: 0, utilization: 0 };
              }
              acc[v.location].total++;
              if (v.status === 'rented') acc[v.location].rented++;
              acc[v.location].utilization = Math.round((acc[v.location].rented / acc[v.location].total) * 100);
              return acc;
            }, {})
          };
          break;
        
        case 'location-report':
          combinedReport.reports.locationReport = {
            title: 'Location Report',
            locationBreakdown: vehicles.reduce((acc, v) => {
              if (!acc[v.location]) {
                acc[v.location] = { total: 0, available: 0, rented: 0, maintenance: 0, outOfService: 0 };
              }
              acc[v.location].total++;
              acc[v.location][v.status === 'out-of-service' ? 'outOfService' : v.status]++;
              return acc;
            }, {}),
            mostProfitableLocation: Object.entries(vehicles.reduce((acc, v) => {
              const revenue = v.status === 'rented' ? v.dailyRate : 0;
              acc[v.location] = (acc[v.location] || 0) + revenue;
              return acc;
            }, {})).reduce((max, [location, revenue]) => 
              revenue > (max[1] || 0) ? [location, revenue] : max, ['', 0])[0]
          };
          break;
        
        case 'customer-report':
          // This would contain customer data in a real implementation
          combinedReport.reports.customerReport = {
            title: 'Customer Report',
            note: 'Customer data would be integrated from booking system',
            rentedVehicles: vehicles.filter(v => v.status === 'rented').map(v => ({
              licensePlate: v.licensePlate,
              make: v.make,
              model: v.model,
              dailyRate: v.dailyRate,
              rentalStartDate: v.rentalStartDate || 'Current rental',
              location: v.location
            }))
          };
          break;
      }
    });

    return combinedReport;
  };

  const downloadCombinedReport = async (format) => {
    if (selectedBulkReports.length === 0) {
      showNotification('error', 'No Reports Selected', 'Please select at least one report type for bulk download.');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const combinedData = generateCombinedReport(selectedBulkReports, format);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `fleet-combined-report-${timestamp}`;

      if (format === 'json') {
        downloadJSON(combinedData, `${filename}.json`);
      } else if (format === 'csv') {
        downloadCombinedCSV(combinedData, `${filename}.csv`);
      } else if (format === 'zip') {
        // For ZIP, we'll create separate files but package them together
        // In a real implementation, you'd use JSZip
        showNotification('info', 'ZIP Download', 'ZIP format will be available in the next update. Using JSON format instead.');
        downloadJSON(combinedData, `${filename}.json`);
      }

      showNotification('success', 'Download Complete', 
        `Combined report with ${selectedBulkReports.length} report types downloaded successfully.`);
      
    } catch (error) {
      showNotification('error', 'Download Failed', 'Failed to generate combined report. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const downloadCombinedCSV = (data, filename) => {
    let csvContent = 'Fleet Combined Report\n';
    csvContent += `Generated: ${data.generatedAt}\n`;
    csvContent += `Date Range: ${data.dateRange.startDate} to ${data.dateRange.endDate}\n\n`;

    Object.entries(data.reports).forEach(([reportKey, reportData]) => {
      csvContent += `${reportData.title}\n`;
      csvContent += '='.repeat(reportData.title.length) + '\n';
      
      // Convert report data to CSV format
      if (reportKey === 'fleetSummary') {
        csvContent += 'Metric,Value\n';
        csvContent += `Total Vehicles,${reportData.totalVehicles}\n`;
        csvContent += `Available,${reportData.availableVehicles}\n`;
        csvContent += `Rented,${reportData.rentedVehicles}\n`;
        csvContent += `In Maintenance,${reportData.maintenanceVehicles}\n`;
        csvContent += `Out of Service,${reportData.outOfServiceVehicles}\n`;
        csvContent += `Utilization Rate,${reportData.utilizationRate}%\n`;
      } else if (reportKey === 'revenueReport') {
        csvContent += 'Metric,Value\n';
        csvContent += `Total Revenue,$${reportData.totalRevenue}\n`;
        csvContent += `Potential Revenue,$${reportData.potentialRevenue}\n`;
        csvContent += `Average Daily Rate,$${reportData.avgDailyRate}\n`;
      }
      
      csvContent += '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSingleReport = (type, format) => {
    const filteredData = filterDataByDateRange(fleetData, dateRange.startDate, dateRange.endDate);
    const combinedData = generateCombinedReport([type], format);
    const reportData = combinedData.reports[Object.keys(combinedData.reports)[0]];
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      downloadJSON({ ...reportData, dateRange: combinedData.dateRange, generatedAt: combinedData.generatedAt }, 
        `${type}-${timestamp}.json`);
    } else if (format === 'csv') {
      downloadCombinedCSV(combinedData, `${type}-${timestamp}.csv`);
    }

    showNotification('success', 'Report Generated', `${reportData.title} has been generated successfully.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Export</h2>
        <p className="text-sm text-gray-500">Generate and export fleet management reports</p>
      </div>

      {/* Bulk Download Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Download Options</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Single Report</span>
            <button
              onClick={() => setBulkDownloadMode(!bulkDownloadMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                bulkDownloadMode ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  bulkDownloadMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">Bulk Download</span>
          </div>
        </div>

        {bulkDownloadMode && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-blue-900">Bulk Download Mode</h4>
              <button
                onClick={selectAllReports}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedBulkReports.length === reportTypes.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Select multiple reports to download them together. Choose format and download all selected reports at once.
            </p>
                          <div className="flex flex-col space-y-3">
                {isDownloading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadCombinedReport('json')}
                    disabled={selectedBulkReports.length === 0 || isDownloading}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    {isDownloading ? 'Processing...' : `JSON (${selectedBulkReports.length})`}
                  </button>
                  <button
                    onClick={() => downloadCombinedReport('csv')}
                    disabled={selectedBulkReports.length === 0 || isDownloading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    {isDownloading ? 'Processing...' : `CSV (${selectedBulkReports.length})`}
                  </button>
                  <button
                    onClick={() => downloadCombinedReport('zip')}
                    disabled={selectedBulkReports.length === 0 || isDownloading}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Package className="w-4 h-4 inline mr-1" />
                    {isDownloading ? 'Processing...' : `ZIP (${selectedBulkReports.length})`}
                  </button>
                </div>
              </div>
          </div>
        )}

        <h4 className="font-medium text-gray-900 mb-4">
          {bulkDownloadMode ? 'Select Report Types' : 'Select Report Type'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(report => {
            const IconComponent = report.icon;
            const isSelected = bulkDownloadMode 
              ? selectedBulkReports.includes(report.id)
              : selectedReportType === report.id;
            
            return (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors relative ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  if (bulkDownloadMode) {
                    handleBulkReportSelection(report.id);
                  } else {
                    setSelectedReportType(report.id);
                  }
                }}
              >
                {bulkDownloadMode && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle 
                      className={`w-5 h-5 ${
                        selectedBulkReports.includes(report.id) 
                          ? 'text-indigo-600' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </div>
                )}
                <div className="flex items-center mb-2">
                  <IconComponent className="w-5 h-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                </div>
                <p className="text-xs text-gray-500">{report.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Data Range Selection</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Filter
            </label>
            <select
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {timeFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              disabled={timeFilter !== 'custom'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              disabled={timeFilter !== 'custom'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              {timeFilter === 'all' ? 
                'Showing all current fleet data' : 
                `Showing data from ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
        
        {!bulkDownloadMode ? (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => generateSingleReport(selectedReportType, 'json')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </button>
            <button
              onClick={() => generateSingleReport(selectedReportType, 'csv')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download CSV
            </button>
            <button
              onClick={() => generateSingleReport(selectedReportType, 'print')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {selectedBulkReports.length} report(s) selected for bulk download
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              <button
                onClick={() => downloadCombinedReport('json')}
                disabled={selectedBulkReports.length === 0}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Bulk JSON ({selectedBulkReports.length})
              </button>
              <button
                onClick={() => downloadCombinedReport('csv')}
                disabled={selectedBulkReports.length === 0}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Bulk CSV ({selectedBulkReports.length})
              </button>
              <button
                onClick={() => downloadCombinedReport('zip')}
                disabled={selectedBulkReports.length === 0}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Package className="w-4 h-4 mr-2" />
                Download ZIP ({selectedBulkReports.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats Preview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{fleetData?.vehicles?.length || 0}</div>
            <div className="text-sm text-blue-600">Total Vehicles</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">
              {fleetData?.vehicles?.filter(v => v.status === 'rented').length || 0}
            </div>
            <div className="text-sm text-green-600">Currently Rented</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-900">
              {fleetData?.maintenanceRecords?.length || 0}
            </div>
            <div className="text-sm text-yellow-600">Maintenance Items</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">
              ${fleetData?.vehicles?.reduce((sum, v) => sum + (v.status === 'rented' ? v.dailyRate : 0), 0) || 0}
            </div>
            <div className="text-sm text-purple-600">Daily Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentExport;
