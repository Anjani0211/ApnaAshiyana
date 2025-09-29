# Kirayedar - Ranchi Rental Platform

A comprehensive rental platform built with React and Node.js, designed specifically for Ranchi, Jharkhand.

## 🏗️ Project Structure

```
kirayedar-ranchi/
├── frontend/                 # React Vite Frontend
│   ├── src/
│   │   ├── modules/         # Microservices modules
│   │   │   ├── landing/     # Landing page module
│   │   │   ├── renter/      # Renter dashboard module
│   │   │   ├── rentowner/   # Rent owner dashboard module
│   │   │   └── shared/      # Shared components & utilities
│   │   ├── components/      # Global components
│   │   ├── pages/           # Legacy pages
│   │   ├── services/        # API services
│   │   ├── context/         # React contexts
│   │   └── utils/           # Utilities
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js Express Backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Custom middlewares
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Backend utilities
│   └── server.js            # Main server file
└── package.json             # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   This will start both frontend (port 3000) and backend (port 5000) concurrently.

3. **Or start individually:**
   ```bash
   # Frontend only
   npm run dev:frontend
   
   # Backend only
   npm run dev:backend
   ```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kirayedar
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@kirayedar.com
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Features

### Frontend Modules

#### Landing Module (`/modules/landing/`)
- **LandingPage**: Main homepage with property search and featured listings
- Hero section with animated house component
- Advanced property search form
- Featured properties grid
- Interactive Ranchi map

#### Renter Module (`/modules/renter/`)
- **RenterDashboard**: Complete dashboard for property seekers
- Search properties with advanced filters
- View booking requests and status
- Manage favorite properties
- Contact property owners

#### Rent Owner Module (`/modules/rentowner/`)
- **RentOwnerDashboard**: Comprehensive dashboard for property owners
- Manage property listings
- View and respond to booking requests
- Analytics and performance metrics
- **PropertyAddForm**: Multi-step form for adding new properties

#### Shared Module (`/modules/shared/`)
- **PropertyCard**: Reusable property display component
- **PropertySearchForm**: Advanced search form with filters
- Common utilities and hooks

### Backend Features

- **Authentication**: JWT-based authentication
- **Property Management**: CRUD operations for properties
- **Booking System**: Property booking and management
- **File Upload**: Image upload for properties
- **Email Service**: Automated email notifications
- **Geocoding**: Location-based property search
- **Security**: Rate limiting, CORS, XSS protection

## 🔧 Technology Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for routing
- **Axios** for API calls
- **React Leaflet** for maps
- **React Toastify** for notifications

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for emails
- **Node-geocoder** for geocoding

## 📱 User Flows

### Renter Flow
1. **Landing Page** → Search properties with filters
2. **Renter Dashboard** → View search results, manage bookings
3. **Property Details** → View full information, contact owner
4. **Booking Request** → Submit booking request
5. **Track Status** → Monitor booking status

### Rent Owner Flow
1. **Register/Login** → Create account
2. **Rent Owner Dashboard** → Access dashboard
3. **Add Property** → Multi-step property listing form
4. **Manage Bookings** → Review and respond to requests
5. **Analytics** → View property performance

### Key Features
- **No Broker Policy**: Direct owner-tenant connection
- **Complete Transparency**: Verified property details
- **Legal Agreement Support**: Standardized rental agreements
- **Ranchi-Specific**: Location-based search and features



**Kirayedar** - Making rental experiences transparent, trustworthy, and hassle-free in Ranchi! 🏠✨
