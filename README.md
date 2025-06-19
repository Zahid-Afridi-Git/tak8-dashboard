# Car Rental Fleet Management Dashboard

A comprehensive, modern web application for managing car rental businesses with advanced fleet management capabilities, maintenance tracking, and MongoDB integration.

## 🚗 Features

### Fleet Management
- **Complete Vehicle Management**: Add, edit, delete, and track vehicles
- **Real-time Status Tracking**: Available, Rented, Maintenance, Unavailable
- **Advanced Search & Filtering**: By make, model, status, category, and more
- **Vehicle Details**: Comprehensive information including VIN, insurance, maintenance history
- **Image Management**: Upload and manage vehicle photos
- **Fleet Statistics**: Utilization rates, availability metrics, and performance tracking

### Maintenance Management
- **Scheduled Maintenance**: Track service schedules and intervals
- **Maintenance Records**: Complete history of all maintenance activities
- **Priority System**: High, medium, low priority maintenance tasks
- **Status Tracking**: Scheduled, In-Progress, Completed, Overdue
- **Cost Tracking**: Monitor maintenance expenses
- **Alerts & Notifications**: Overdue maintenance and upcoming service reminders

### Booking Management
- **Real-time Booking Status**: Active, Confirmed, Completed, Cancelled
- **Customer Information**: Complete customer profiles and contact details
- **Booking Analytics**: Revenue tracking and booking patterns
- **Status Updates**: Easy booking status management
- **Search & Filter**: Find bookings by customer, car, date, or status

### Analytics & Reporting
- **Revenue Analytics**: Total and monthly revenue tracking
- **Fleet Utilization**: Real-time utilization rates and trends
- **Popular Vehicles**: Most booked cars and performance metrics
- **Customer Analytics**: User engagement and booking patterns
- **Maintenance Costs**: Track and analyze maintenance expenses

### User Management
- **Customer Profiles**: Complete customer information management
- **Booking History**: Track customer rental history
- **Contact Management**: Phone, email, and address information
- **User Status**: Active/inactive user management

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API requests

### Backend Integration Ready
- **MongoDB**: Document database for flexible data storage
- **Express.js**: Node.js web framework (backend setup ready)
- **JWT Authentication**: Secure user authentication
- **File Upload**: Image upload and management
- **RESTful API**: Complete API structure defined

## 📁 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── Header.js          # Top navigation bar
│       ├── Sidebar.js         # Side navigation menu
│       └── Layout.js          # Main layout wrapper
├── pages/
│   ├── Dashboard/
│   │   └── Dashboard.js       # Main dashboard with fleet overview
│   ├── Cars/
│   │   ├── Cars.js           # Vehicle listing and management
│   │   └── AddCar.js         # Add new vehicle form
│   ├── Bookings/
│   │   └── Bookings.js       # Booking management
│   ├── Maintenance/
│   │   └── Maintenance.js    # Maintenance tracking
│   ├── Users/
│   │   └── Users.js          # Customer management
│   ├── Analytics/
│   │   └── Analytics.js      # Business analytics
│   └── Settings/
│       └── Settings.js       # Application settings
├── services/
│   └── api.js                # MongoDB API integration layer
├── store/
│   └── index.js              # Zustand state management
└── App.js                    # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tak8web-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

## 🗄 MongoDB Integration

### Database Schema

#### Cars Collection
```javascript
{
  _id: ObjectId,
  make: String,
  model: String,
  year: Number,
  color: String,
  licensePlate: String,
  vin: String,
  category: String, // sedan, suv, hatchback, etc.
  fuelType: String, // gasoline, diesel, electric, hybrid
  transmission: String, // automatic, manual, cvt
  mileage: Number,
  dailyRate: Number,
  status: String, // available, rented, maintenance, unavailable
  features: [String],
  description: String,
  image: String,
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    serviceInterval: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  carId: ObjectId,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  startDate: Date,
  endDate: Date,
  totalAmount: Number,
  status: String, // confirmed, active, completed, cancelled
  paymentStatus: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Maintenance Collection
```javascript
{
  _id: ObjectId,
  carId: ObjectId,
  type: String, // oil change, brake inspection, etc.
  description: String,
  scheduledDate: Date,
  completedDate: Date,
  status: String, // scheduled, in-progress, completed, overdue
  priority: String, // low, medium, high
  cost: Number,
  mileage: Number,
  serviceProvider: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Cars API
- `GET /api/cars` - Get all cars with filtering
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `PATCH /api/cars/:id/status` - Update car status
- `POST /api/cars/:id/image` - Upload car image

#### Bookings API
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `GET /api/bookings/analytics` - Get booking analytics

#### Maintenance API
- `GET /api/maintenance` - Get maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record
- `GET /api/maintenance/overdue` - Get overdue maintenance

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray Scale**: Various shades for text and backgrounds

### Components
- **Cards**: Consistent card design with shadows and rounded corners
- **Buttons**: Primary, secondary, and danger button styles
- **Forms**: Styled input fields, selects, and textareas
- **Tables**: Responsive tables with hover effects
- **Badges**: Status indicators with color coding

## 📊 Fleet Management Features

### Dashboard Overview
- **Fleet Statistics**: Total cars, available, rented, in maintenance
- **Utilization Rates**: Real-time fleet utilization percentage
- **Revenue Tracking**: Total and monthly revenue metrics
- **Maintenance Alerts**: Overdue and upcoming maintenance notifications
- **Recent Activity**: Latest bookings and fleet changes

### Vehicle Management
- **Comprehensive Forms**: Detailed vehicle information capture
- **Status Management**: Easy status updates (Available, Rented, Maintenance)
- **Search & Filter**: Advanced filtering by multiple criteria
- **Bulk Operations**: Mass status updates and operations
- **Image Gallery**: Multiple photos per vehicle

### Maintenance Tracking
- **Service Schedules**: Automated maintenance scheduling
- **Cost Analysis**: Track maintenance expenses and trends
- **Vendor Management**: Service provider information
- **Parts Tracking**: Inventory and parts usage
- **Compliance**: Ensure regulatory compliance

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- Consistent naming conventions
- Component-based architecture

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set up MongoDB database
2. Configure environment variables
3. Deploy backend API
4. Deploy frontend to hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: React Native mobile application
- **GPS Tracking**: Real-time vehicle location tracking
- **Payment Integration**: Stripe/PayPal payment processing
- **Notifications**: Email and SMS notifications
- **Reporting**: Advanced reporting and export features
- **Multi-location**: Support for multiple rental locations
- **Insurance Integration**: Direct insurance provider integration
- **Fuel Management**: Fuel consumption tracking
- **Driver Management**: Driver verification and management

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Caching**: Redis caching for better performance
- **Microservices**: Break down into microservices architecture
- **Testing**: Comprehensive test coverage
- **Documentation**: API documentation with Swagger
- **Monitoring**: Application performance monitoring
- **Security**: Enhanced security features
- **Scalability**: Auto-scaling capabilities

---

**Built with ❤️ for efficient fleet management**
#   t a k 8 - d a s h b o a r d  
 