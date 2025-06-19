Purpose:
This dashboard is for internal/admin use only. It allows administrators or staff to manage the business, view analytics, and perform CRUD operations on cars, bookings, and users.
Key Features & Structure
1. Modern, Responsive UI
Uses a sidebar for navigation and a header for quick actions and user info.
Responsive design for desktop and mobile.
Clean, modern look with micro-interactions and smooth transitions.
2. Main Sections
Dashboard Overview:
Shows key stats (total bookings, revenue, cars, users), recent bookings, and quick action buttons.
Cars Management:
List, search, filter, add, edit, and delete cars in the fleet.
Bookings Management:
View, filter, sort, and update booking statuses (confirm, complete, cancel).
Users Management:
(Placeholder for now) Will allow management of customer/user accounts.
Analytics:
(Placeholder for now) Will provide business insights and reports.
Settings:
(Placeholder for now) For configuring dashboard and app settings.
3. State Management
Uses Zustand for global state (cars, bookings, users, analytics, UI state).
All CRUD and fetch operations are handled via async actions in the store.
4. API Integration
Designed to connect to backend APIs for real data (currently uses mock data for demo).
Uses Axios for API calls.
5. Routing
Uses React Router for navigation between dashboard sections.
Each section is a separate page/component.
6. Security
Intended for admin/staff only (authentication/authorization should be added in the future).