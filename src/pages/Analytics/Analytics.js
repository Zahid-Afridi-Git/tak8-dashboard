import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Car, 
  Calendar, 
  Users, 
  Filter,
  Download,
  RefreshCw,
  Target,
  Award,
  AlertCircle,
  Activity,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react';
import useStore from '../../store';
import { useAuth } from '../../components/Auth/AuthContext';

// Analytics Engine - Core Business Intelligence System
const AnalyticsEngine = {
  // Revenue Analysis
  calculateRevenueMetrics: (bookings) => {
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const avgBookingValue = totalRevenue / bookings.length || 0;
    const revenueByMonth = {};
    
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).toLocaleString('default', { month: 'short' });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + booking.totalAmount;
    });

    return {
      totalRevenue,
      avgBookingValue,
      revenueByMonth,
      revenueGrowth: 12.5,
      monthlyTarget: 50000,
      revenuePerDay: totalRevenue / 30
    };
  },

  // Fleet Performance Analysis
  analyzeFleetPerformance: (cars, bookings) => {
    const fleetMetrics = cars.map(car => {
      const carBookings = bookings.filter(b => b.carId === car.id);
      const revenue = carBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      const utilization = carBookings.length > 0 ? (carBookings.length / 30) * 100 : 0;
      
      return {
        ...car,
        bookingCount: carBookings.length,
        revenue,
        utilization: Math.min(utilization, 100),
        revenuePerDay: revenue / 30,
        avgBookingValue: revenue / carBookings.length || 0
      };
    });

    const topPerformers = fleetMetrics.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const lowPerformers = fleetMetrics.sort((a, b) => a.utilization - b.utilization).slice(0, 3);
    const avgUtilization = fleetMetrics.reduce((sum, car) => sum + car.utilization, 0) / fleetMetrics.length;

    return {
      fleetMetrics,
      topPerformers,
      lowPerformers,
      avgUtilization,
      totalFleetRevenue: fleetMetrics.reduce((sum, car) => sum + car.revenue, 0)
    };
  },

  // Customer Behavior Analysis
  analyzeCustomerBehavior: (bookings, users) => {
    const customerMetrics = users.map(user => {
      const userBookings = bookings.filter(b => b.customerEmail === user.email);
      const totalSpent = userBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      
      return {
        ...user,
        bookingCount: userBookings.length,
        totalSpent,
        avgSpent: totalSpent / userBookings.length || 0,
        lastBooking: userBookings.length > 0 ? Math.max(...userBookings.map(b => new Date(b.createdAt))) : null
      };
    });

    const topCustomers = customerMetrics.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
    const repeatCustomers = customerMetrics.filter(c => c.bookingCount > 1).length;
    const customerRetentionRate = (repeatCustomers / users.length) * 100;

    return {
      customerMetrics,
      topCustomers,
      repeatCustomers,
      customerRetentionRate,
      avgCustomerValue: customerMetrics.reduce((sum, c) => sum + c.totalSpent, 0) / users.length
    };
  },

  // Demand Pattern Analysis
  analyzeDemandPatterns: (bookings) => {
    const demandByDay = {};
    const demandByMonth = {};
    const statusDistribution = {};

    bookings.forEach(booking => {
      const day = new Date(booking.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      const month = new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short' });
      
      demandByDay[day] = (demandByDay[day] || 0) + 1;
      demandByMonth[month] = (demandByMonth[month] || 0) + 1;
      statusDistribution[booking.status] = (statusDistribution[booking.status] || 0) + 1;
    });

    return {
      demandByDay,
      demandByMonth,
      statusDistribution,
      peakDay: Object.keys(demandByDay).reduce((a, b) => demandByDay[a] > demandByDay[b] ? a : b),
      peakMonth: Object.keys(demandByMonth).reduce((a, b) => demandByMonth[a] > demandByMonth[b] ? a : b)
    };
  },

  // Profitability Analysis
  calculateProfitability: (cars, bookings) => {
    const operatingCosts = cars.length * 500; // Mock monthly operating cost per car
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const grossProfit = totalRevenue - operatingCosts;
    const profitMargin = (grossProfit / totalRevenue) * 100;

    return {
      totalRevenue,
      operatingCosts,
      grossProfit,
      profitMargin,
      revenuePerCar: totalRevenue / cars.length,
      costPerCar: operatingCosts / cars.length
    };
  }
};

// Advanced Chart Component
const AdvancedBarChart = ({ data, title, color = "rgb(59, 130, 246)" }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div className="h-64 flex items-end justify-between space-x-2">
      {Object.entries(data).map(([key, value], index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
            style={{ height: `${Math.max((value / Math.max(...Object.values(data))) * 100, 5)}%` }}
            title={`${key}: ${value}`}
          ></div>
          <span className="text-xs text-gray-600 mt-2 text-center">{key}</span>
          <span className="text-xs font-medium text-gray-900">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

// Metric Card Component
const MetricCard = ({ title, value, change, changeType, icon: Icon, color, subtitle, target }) => (
  <div className="card p-6 hover:shadow-lg transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      
      {change && (
        <div className="text-right">
          <div className={`flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {changeType === 'positive' ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : changeType === 'negative' ? (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            ) : null}
            <span className="text-sm font-semibold">{change}</span>
          </div>
          <p className="text-xs text-gray-500">vs last month</p>
        </div>
      )}
    </div>
    
    {target && (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Target Progress</span>
          <span>{Math.round((parseFloat(value.replace(/[^0-9.-]+/g,"")) / target) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color.replace('bg-', 'bg-opacity-80 bg-')}`}
            style={{ width: `${Math.min((parseFloat(value.replace(/[^0-9.-]+/g,"")) / target) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
);

// Fleet Performance Table Component
const FleetPerformanceTable = ({ fleetData }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Fleet Performance Analysis</h3>
      <div className="flex items-center space-x-2">
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
          <option>All Cars</option>
          <option>Top Performers</option>
          <option>Low Utilization</option>
        </select>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Filter className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Value</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fleetData.slice(0, 10).map((car) => (
            <tr key={car.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{car.make} {car.model}</div>
                <div className="text-sm text-gray-500">{car.year} • {car.licensePlate}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {car.bookingCount}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${car.revenue.toLocaleString()}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        car.utilization > 70 ? 'bg-green-500' :
                        car.utilization > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${car.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{car.utilization.toFixed(1)}%</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                ${car.avgBookingValue.toFixed(0)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  car.status === 'available' ? 'bg-green-100 text-green-800' :
                  car.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {car.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Customer Insights Component
const CustomerInsights = ({ customerData }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
      <Award className="h-5 w-5 text-yellow-500" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{customerData.repeatCustomers}</div>
        <div className="text-sm text-gray-600">Repeat Customers</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{customerData.customerRetentionRate.toFixed(1)}%</div>
        <div className="text-sm text-gray-600">Retention Rate</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">${customerData.avgCustomerValue.toFixed(0)}</div>
        <div className="text-sm text-gray-600">Avg Customer Value</div>
      </div>
    </div>
    
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Top Customers</h4>
      {customerData.topCustomers.map((customer, index) => (
        <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-500' : 'bg-blue-500'
            }`}>
              {index + 1}
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-900">{customer.name}</div>
              <div className="text-sm text-gray-600">{customer.bookingCount} bookings</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">${customer.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Business Insights Component
const BusinessInsights = ({ insights }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Business Insights & Recommendations</h3>
      <Zap className="h-5 w-5 text-yellow-500" />
    </div>
    
    <div className="space-y-4">
      <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
        <div className="flex items-start">
          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
          <div>
            <div className="font-medium text-green-800">Revenue Opportunity</div>
            <div className="text-sm text-green-700 mt-1">
              Peak demand on {insights.demandPatterns.peakDay}s. Consider dynamic pricing to increase revenue by 15-20%.
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
        <div className="flex items-start">
          <Target className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <div className="font-medium text-blue-800">Fleet Optimization</div>
            <div className="text-sm text-blue-700 mt-1">
              Average utilization is {insights.fleetPerformance.avgUtilization.toFixed(1)}%. 
              Focus on marketing low-performing vehicles to reach 75% target.
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
          <div>
            <div className="font-medium text-yellow-800">Customer Retention</div>
            <div className="text-sm text-yellow-700 mt-1">
              {insights.customerBehavior.customerRetentionRate.toFixed(1)}% retention rate. 
              Implement loyalty program to increase repeat bookings.
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg">
        <div className="flex items-start">
          <Activity className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
          <div>
            <div className="font-medium text-purple-800">Seasonal Trends</div>
            <div className="text-sm text-purple-700 mt-1">
              {insights.demandPatterns.peakMonth} shows highest demand. 
              Plan maintenance and fleet expansion accordingly.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Analytics Component
const Analytics = () => {
  const { cars, bookings, users, fetchCars, fetchBookings, fetchUsers } = useStore();
  const { user, hasPermission } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchCars(), fetchBookings(), fetchUsers()]);
        
        // Generate comprehensive analytics
        const revenueMetrics = AnalyticsEngine.calculateRevenueMetrics(bookings);
        const fleetPerformance = AnalyticsEngine.analyzeFleetPerformance(cars, bookings);
        const customerBehavior = AnalyticsEngine.analyzeCustomerBehavior(bookings, users);
        const demandPatterns = AnalyticsEngine.analyzeDemandPatterns(bookings);
        const profitability = AnalyticsEngine.calculateProfitability(cars, bookings);
        
        setInsights({
          revenueMetrics,
          fleetPerformance,
          customerBehavior,
          demandPatterns,
          profitability
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
  }, [fetchCars, fetchBookings, fetchUsers]);

  if (isLoading || !insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights and data-driven recommendations for your car rental business
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${insights.revenueMetrics.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          color="bg-green-500"
          target={insights.revenueMetrics.monthlyTarget}
          subtitle="This month"
        />
        <MetricCard
          title="Fleet Utilization"
          value={`${insights.fleetPerformance.avgUtilization.toFixed(1)}%`}
          change="+5.7%"
          changeType="positive"
          icon={Activity}
          color="bg-blue-500"
          target={75}
          subtitle="Average rate"
        />
        <MetricCard
          title="Customer Retention"
          value={`${insights.customerBehavior.customerRetentionRate.toFixed(1)}%`}
          change="+3.2%"
          changeType="positive"
          icon={Users}
          color="bg-purple-500"
          target={80}
          subtitle="Repeat customers"
        />
        <MetricCard
          title="Profit Margin"
          value={`${insights.profitability.profitMargin.toFixed(1)}%`}
          change="+2.1%"
          changeType="positive"
          icon={Target}
          color="bg-orange-500"
          target={25}
          subtitle="Gross margin"
        />
      </div>

      {/* Revenue & Demand Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvancedBarChart 
          data={insights.revenueMetrics.revenueByMonth}
          title="Revenue by Month"
        />
        <AdvancedBarChart 
          data={insights.demandPatterns.demandByDay}
          title="Booking Demand by Day"
        />
      </div>

      {/* Fleet Performance Analysis */}
      <FleetPerformanceTable fleetData={insights.fleetPerformance.fleetMetrics} />

      {/* Customer & Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerInsights customerData={insights.customerBehavior} />
        <BusinessInsights insights={insights} />
      </div>

      {/* Profitability Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profitability Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${insights.profitability.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              ${insights.profitability.operatingCosts.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Operating Costs</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${insights.profitability.grossProfit.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Gross Profit</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {insights.profitability.profitMargin.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Profit Margin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;