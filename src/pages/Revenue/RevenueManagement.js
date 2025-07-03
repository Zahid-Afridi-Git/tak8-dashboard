import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Receipt,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

const RevenueManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Revenue and financial data
  const [revenueData] = useState({
    summary: {
      totalRevenue: 125000,
      monthlyGrowth: 12.5,
      totalBookings: 450,
      averageBookingValue: 278,
      totalExpenses: 35000,
      netProfit: 90000,
      profitMargin: 72
    },
    monthlyRevenue: [
      { month: 'Jan', revenue: 98000, bookings: 380, expenses: 28000 },
      { month: 'Feb', revenue: 112000, bookings: 420, expenses: 32000 },
      { month: 'Mar', revenue: 125000, bookings: 450, expenses: 35000 }
    ],
    revenueByCategory: [
      { category: 'Economy Cars', revenue: 45000, percentage: 36, growth: 8.2 },
      { category: 'Luxury Cars', revenue: 35000, percentage: 28, growth: 15.7 },
      { category: 'SUVs', revenue: 30000, percentage: 24, growth: 6.3 },
      { category: 'Electric Vehicles', revenue: 15000, percentage: 12, growth: 22.1 }
    ],
    recentTransactions: [
      {
        id: 1,
        type: 'booking',
        amount: 450,
        customer: 'John Doe',
        vehicle: 'Toyota Camry',
        date: '2024-01-15T10:30:00Z',
        status: 'completed',
        paymentMethod: 'Credit Card'
      },
      {
        id: 2,
        type: 'booking',
        amount: 780,
        customer: 'Jane Smith',
        vehicle: 'Tesla Model 3',
        date: '2024-01-14T14:20:00Z',
        status: 'completed',
        paymentMethod: 'Debit Card'
      },
      {
        id: 3,
        type: 'expense',
        amount: -150,
        description: 'Vehicle Maintenance',
        vehicle: 'Honda CR-V',
        date: '2024-01-13T09:15:00Z',
        status: 'completed',
        category: 'Maintenance'
      }
    ],
    expenses: [
      { category: 'Vehicle Maintenance', amount: 15000, percentage: 43, trend: 'up' },
      { category: 'Insurance', amount: 8000, percentage: 23, trend: 'stable' },
      { category: 'Fuel/Electricity', amount: 7000, percentage: 20, trend: 'down' },
      { category: 'Marketing', amount: 3000, percentage: 8, trend: 'up' },
      { category: 'Other', amount: 2000, percentage: 6, trend: 'stable' }
    ],
    paymentMethods: [
      { method: 'Credit Card', count: 280, percentage: 62, amount: 77500 },
      { method: 'Debit Card', count: 120, percentage: 27, amount: 33750 },
      { method: 'Bank Transfer', count: 30, percentage: 7, amount: 8750 },
      { method: 'Cash', count: 20, percentage: 4, amount: 5000 }
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Revenue Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Financial Analytics', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: PieChart }
  ];

  const RevenueOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                AUD ${revenueData.summary.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm font-semibold text-green-600">
              +{revenueData.summary.monthlyGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {revenueData.summary.totalBookings}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm font-semibold text-green-600">+8.2%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">
                AUD ${revenueData.summary.averageBookingValue}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm font-semibold text-green-600">+3.8%</span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">
                AUD ${revenueData.summary.netProfit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-emerald-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-500">
              {revenueData.summary.profitMargin}% margin
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Chart and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {revenueData.monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{month.month}</h4>
                  <p className="text-sm text-gray-600">{month.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${month.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">-${month.expenses.toLocaleString()} expenses</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Vehicle Category</h3>
          <div className="space-y-4">
            {revenueData.revenueByCategory.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ${category.revenue.toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {revenueData.recentTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === 'booking' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'booking' ? (
                    <DollarSign className={`h-4 w-4 ${
                      transaction.type === 'booking' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  ) : (
                    <Receipt className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.type === 'booking' ? transaction.customer : transaction.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.vehicle} • {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                </p>
                <p className="text-sm text-gray-600">{transaction.paymentMethod || transaction.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FinancialAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="btn-secondary text-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            {revenueData.expenses.map((expense, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      expense.trend === 'up' ? 'bg-red-500' : 
                      expense.trend === 'down' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${expense.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {revenueData.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{method.method}</p>
                    <p className="text-sm text-gray-600">{method.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${method.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{method.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TransactionManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
        <button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Types</option>
          <option value="booking">Bookings</option>
          <option value="expense">Expenses</option>
          <option value="refund">Refunds</option>
        </select>
        <button className="btn-secondary">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        transaction.type === 'booking' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'booking' ? (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        ) : (
                          <Receipt className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === 'booking' ? transaction.customer : transaction.description}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.vehicle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <RevenueOverview />;
      case 'analytics':
        return <FinancialAnalytics />;
      case 'transactions':
        return <TransactionManagement />;
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
              <p className="text-gray-600">Create detailed financial reports and export data</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
          <p className="mt-2 text-gray-600">Track income, expenses, and financial performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-5 w-5 mr-2" />
            Export Data
          </button>
          <button className="btn-primary">
            <BarChart3 className="h-5 w-5 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default RevenueManagement; 