import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Plus,
  Eye,
  BarChart3,
  MapPin,
  Star,
  Fuel,
  Activity,
  Target,
  Award,
  Zap,
  Shield,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Bell,
  Settings
} from 'lucide-react';
import useStore from '../../store';
import { useAuth } from '../../components/Auth/AuthContext';

// Advanced Chart Components
const AdvancedLineChart = ({ data, title, subtitle, color = "rgb(59, 130, 246)", height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={color}
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${item.label}: ${item.displayValue || item.value}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, change, changeType, icon: Icon, color, target, subtitle }) => (
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
          <span>Progress to target</span>
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

const AdvancedDonutChart = ({ data, title, centerValue, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-32 h-32">
          <svg width="128" height="128" className="transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="16"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 3.51} 351`;
              const strokeDashoffset = -cumulativePercentage * 3.51;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={item.color.replace('bg-', '').replace('-500', '')}
                  strokeWidth="16"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:stroke-width-20"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{centerValue}</div>
              <div className="text-xs text-gray-600">{centerLabel}</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 ml-6 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((item.value / total) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RevenueMetrics = ({ data }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
      <div className="flex items-center space-x-2">
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <Filter className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">$24,580</div>
        <div className="text-sm text-gray-600">Today</div>
        <div className="text-xs text-green-600">+12.5%</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">$168,420</div>
        <div className="text-sm text-gray-600">This Week</div>
        <div className="text-xs text-blue-600">+8.2%</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">$672,150</div>
        <div className="text-sm text-gray-600">This Month</div>
        <div className="text-xs text-purple-600">+15.7%</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">$2.1M</div>
        <div className="text-sm text-gray-600">This Quarter</div>
        <div className="text-xs text-orange-600">+22.1%</div>
      </div>
    </div>
    
    <div className="h-48">
      <AdvancedLineChart 
        data={data}
        title=""
        height={180}
        color="rgb(34, 197, 94)"
      />
    </div>
  </div>
);

const FleetOverview = ({ cars }) => {
  const fleetData = {
    available: cars.filter(car => car.status === 'available').length,
    rented: cars.filter(car => car.status === 'rented').length,
    maintenance: cars.filter(car => car.status === 'maintenance').length,
    total: cars.length
  };
  
  const utilizationRate = fleetData.total > 0 ? ((fleetData.rented / fleetData.total) * 100).toFixed(1) : 0;
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Fleet Overview</h3>
        <Link to="/cars" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All Cars →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-green-600">{fleetData.available}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-blue-600">{fleetData.rented}</div>
          <div className="text-sm text-gray-600">Rented</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <Wrench className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-yellow-600">{fleetData.maintenance}</div>
          <div className="text-sm text-gray-600">Maintenance</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-xl font-bold text-purple-600">{utilizationRate}%</div>
          <div className="text-sm text-gray-600">Utilization</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fleet Utilization</span>
          <span className="font-medium">{utilizationRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${utilizationRate}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500">
          Target: 75% • Current: {utilizationRate}%
        </div>
      </div>
    </div>
  );
};

const BookingTrends = ({ bookings }) => {
  const trendData = [
    { label: 'Jan', value: 45, displayValue: '45 bookings' },
    { label: 'Feb', value: 52, displayValue: '52 bookings' },
    { label: 'Mar', value: 48, displayValue: '48 bookings' },
    { label: 'Apr', value: 61, displayValue: '61 bookings' },
    { label: 'May', value: 55, displayValue: '55 bookings' },
    { label: 'Jun', value: 67, displayValue: '67 bookings' }
  ];
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Growth:</span>
          <span className="text-sm font-semibold text-green-600">+18.5%</span>
        </div>
      </div>
      
      <AdvancedLineChart 
        data={trendData}
        height={200}
        color="rgb(168, 85, 247)"
      />
    </div>
  );
};

const TopPerformers = ({ cars, bookings }) => {
  const carBookings = cars.map(car => ({
    ...car,
    bookingCount: bookings.filter(booking => booking.carId === car.id).length,
    revenue: bookings
      .filter(booking => booking.carId === car.id)
      .reduce((sum, booking) => sum + booking.totalAmount, 0)
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Cars</h3>
        <Award className="h-5 w-5 text-yellow-500" />
      </div>
      
      <div className="space-y-4">
        {carBookings.map((car, index) => (
          <div key={car.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' :
                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">{car.make} {car.model}</div>
                <div className="text-sm text-gray-600">{car.bookingCount} bookings</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">${car.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentActivity = ({ bookings, cars }) => {
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
    
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Link to="/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All →
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentBookings.map((booking) => {
          const car = cars.find(c => c.id === booking.carId);
          return (
            <div key={booking.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                booking.status === 'active' ? 'bg-green-500' :
                booking.status === 'confirmed' ? 'bg-blue-500' :
                booking.status === 'completed' ? 'bg-gray-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {booking.customerName} booked {car ? `${car.make} ${car.model}` : 'a car'}
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(booking.createdAt).toLocaleDateString()} • ${booking.totalAmount}
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === 'active' ? 'bg-green-100 text-green-800' :
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Vehicle Maintenance Due',
      message: 'Tesla Model 3 (TSL-456) requires scheduled maintenance',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'booking',
      title: 'High Demand Period',
      message: 'Weekend bookings are 85% full. Consider dynamic pricing.',
      priority: 'medium',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'revenue',
      title: 'Revenue Milestone',
      message: 'Monthly revenue target achieved! $50k reached.',
      priority: 'low',
      time: '1 day ago'
    }
  ];
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        <Bell className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
            alert.priority === 'high' ? 'bg-red-50 border-red-400' :
            alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
            'bg-green-50 border-green-400'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900">{alert.title}</div>
                <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                <div className="text-xs text-gray-500 mt-2">{alert.time}</div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {alert.priority}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { cars, bookings, users, analytics, fetchCars, fetchBookings, fetchUsers } = useStore();
  const { user, hasPermission } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchCars(),
          fetchBookings(), 
          fetchUsers()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchCars, fetchBookings, fetchUsers]);

  // Calculate key metrics
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const activeBookings = bookings.filter(booking => booking.status === 'active').length;
  const availableCars = cars.filter(car => car.status === 'available').length;
  const utilizationRate = cars.length > 0 ? ((cars.filter(car => car.status === 'rented').length / cars.length) * 100).toFixed(1) : 0;

  // Revenue trend data
  const revenueData = [
    { label: 'Jan', value: 12400, displayValue: '$12.4k' },
    { label: 'Feb', value: 11800, displayValue: '$11.8k' },
    { label: 'Mar', value: 15600, displayValue: '$15.6k' },
    { label: 'Apr', value: 18200, displayValue: '$18.2k' },
    { label: 'May', value: 21500, displayValue: '$21.5k' },
    { label: 'Jun', value: 24800, displayValue: '$24.8k' }
  ];

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Here's what's happening with your car rental business.
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
          </select>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          color="bg-green-500"
          target={100000}
          subtitle="This month"
        />
        <KPICard
          title="Active Bookings"
          value={activeBookings.toString()}
          change="+8.2%"
          changeType="positive"
          icon={Calendar}
          color="bg-blue-500"
          subtitle="Currently active"
        />
        <KPICard
          title="Available Cars"
          value={availableCars.toString()}
          change="-2.1%"
          changeType="negative"
          icon={Car}
          color="bg-purple-500"
          subtitle="Ready to rent"
        />
        <KPICard
          title="Fleet Utilization"
          value={`${utilizationRate}%`}
          change="+5.7%"
          changeType="positive"
          icon={Activity}
          color="bg-orange-500"
          target={75}
          subtitle="Current rate"
        />
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueMetrics data={revenueData} />
        <FleetOverview cars={cars} />
      </div>

      {/* Secondary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingTrends bookings={bookings} />
        <AdvancedDonutChart
          title="Fleet Status Distribution"
          centerValue={cars.length}
          centerLabel="Total Cars"
          data={[
            { label: 'Available', value: cars.filter(car => car.status === 'available').length, color: 'bg-green-500' },
            { label: 'Rented', value: cars.filter(car => car.status === 'rented').length, color: 'bg-blue-500' },
            { label: 'Maintenance', value: cars.filter(car => car.status === 'maintenance').length, color: 'bg-yellow-500' }
          ]}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopPerformers cars={cars} bookings={bookings} />
        <RecentActivity bookings={bookings} cars={cars} />
        <AlertsPanel />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/cars/new" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Add New Car</div>
              <div className="text-sm text-gray-600">Expand your fleet</div>
            </div>
          </Link>
          <Link to="/bookings" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">View Bookings</div>
              <div className="text-sm text-gray-600">Manage reservations</div>
            </div>
          </Link>
          <Link to="/analytics" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-600">Detailed insights</div>
            </div>
          </Link>
          <Link to="/maintenance" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <Wrench className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Maintenance</div>
              <div className="text-sm text-gray-600">Schedule service</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 