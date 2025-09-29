// Property Types
export const PROPERTY_TYPES = [
  { value: 'room', label: 'Room', icon: '🏠' },
  { value: 'pg', label: 'PG', icon: '🏢' },
  { value: 'flat', label: 'Flat', icon: '🏘️' },
  { value: 'house', label: 'House', icon: '🏡' },
  { value: 'apartment', label: 'Apartment', icon: '🏬' }
];

// Ranchi Areas
export const RANCHI_AREAS = [
  { value: 'mesra', label: 'Mesra', coordinates: [23.4067, 85.4375] },
  { value: 'bariatu', label: 'Bariatu', coordinates: [23.3833, 85.3333] },
  { value: 'morabadi', label: 'Morabadi', coordinates: [23.3500, 85.3167] },
  { value: 'kanke', label: 'Kanke', coordinates: [23.4167, 85.3167] },
  { value: 'lalpur', label: 'Lalpur', coordinates: [23.3500, 85.3500] },
  { value: 'harmu', label: 'Harmu', coordinates: [23.3667, 85.3333] },
  { value: 'doranda', label: 'Doranda', coordinates: [23.3500, 85.3000] },
  { value: 'hindpiri', label: 'Hindpiri', coordinates: [23.3333, 85.3167] },
  { value: 'kadru', label: 'Kadru', coordinates: [23.3833, 85.3000] },
  { value: 'ratu-road', label: 'Ratu Road', coordinates: [23.4000, 85.3000] },
  { value: 'main-road', label: 'Main Road', coordinates: [23.3500, 85.3333] },
  { value: 'hec', label: 'HEC', coordinates: [23.3667, 85.3500] },
  { value: 'kokar', label: 'Kokar', coordinates: [23.3333, 85.3500] },
  { value: 'namkum', label: 'Namkum', coordinates: [23.3167, 85.3333] },
  { value: 'tatisilwai', label: 'Tatisilwai', coordinates: [23.3000, 85.3167] },
  { value: 'bundu', label: 'Bundu', coordinates: [23.1833, 85.5833] },
  { value: 'angara', label: 'Angara', coordinates: [23.2500, 85.5000] },
  { value: 'ormanjhi', label: 'Ormanjhi', coordinates: [23.4500, 85.2500] }
];

// Budget Ranges
export const BUDGET_RANGES = [
  { value: '3000', label: 'Under ₹3,000' },
  { value: '5000', label: 'Under ₹5,000' },
  { value: '8000', label: 'Under ₹8,000' },
  { value: '12000', label: 'Under ₹12,000' },
  { value: '15000', label: 'Under ₹15,000' },
  { value: '20000', label: 'Under ₹20,000' },
  { value: '25000', label: 'Under ₹25,000' },
  { value: '30000', label: 'Under ₹30,000' }
];

// Furnishing Types
export const FURNISHING_TYPES = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' }
];

// User Types
export const USER_TYPES = [
  { value: 'renter', label: 'Renter', description: 'Looking for a place to rent' },
  { value: 'owner', label: 'Property Owner', description: 'Want to list your property' }
];

// Property Categories
export const PROPERTY_CATEGORIES = [
  { value: 'student', label: 'Student' },
  { value: 'family', label: 'Family' },
  { value: 'shared', label: 'Shared' },
  { value: 'entire', label: 'Entire Property' }
];

// Bedroom Options
export const BEDROOM_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4+ BHK' }
];

// Amenities
export const AMENITIES = [
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'power_backup', label: 'Power Backup', icon: '🔋' },
  { value: 'water_supply', label: '24/7 Water', icon: '💧' },
  { value: 'gym', label: 'Gym', icon: '💪' },
  { value: 'garden', label: 'Garden', icon: '🌳' },
  { value: 'balcony', label: 'Balcony', icon: '🌅' },
  { value: 'lift', label: 'Lift', icon: '🛗' },
  { value: 'ac', label: 'AC', icon: '❄️' },
  { value: 'washing_machine', label: 'Washing Machine', icon: '🧺' },
  { value: 'refrigerator', label: 'Refrigerator', icon: '🧊' }
];

// Quick Search Options
export const QUICK_SEARCHES = [
  { text: 'PG near BIT Mesra', type: 'pg', location: 'mesra' },
  { text: 'Flat in Bariatu', type: 'flat', location: 'bariatu' },
  { text: 'Room near Ranchi University', type: 'room', location: 'morabadi' },
  { text: 'House in Morabadi', type: 'house', location: 'morabadi' },
  { text: 'Apartment in Kanke', type: 'apartment', location: 'kanke' },
  { text: 'PG near HEC', type: 'pg', location: 'hec' }
];

// App Configuration
export const APP_CONFIG = {
  name: 'Kirayedar',
  tagline: 'Your trusted rental platform in Ranchi',
  version: '1.0.0',
  contact: {
    phone: '+91 9876543210',
    email: 'info@kirayedar.com',
    address: 'Ranchi, Jharkhand'
  },
  social: {
    facebook: 'https://facebook.com/kirayedar',
    twitter: 'https://twitter.com/kirayedar',
    instagram: 'https://instagram.com/kirayedar',
    linkedin: 'https://linkedin.com/company/kirayedar'
  }
};

// Map Configuration
export const MAP_CONFIG = {
  center: [23.3441, 85.3096], // Ranchi center coordinates
  zoom: 12,
  bounds: [
    [23.2, 85.2], // Southwest corner
    [23.5, 85.5]  // Northeast corner
  ]
};

// Dummy Property Images
export const DUMMY_IMAGES = [
  '/images/property-1.jpg',
  '/images/property-2.jpg',
  '/images/property-3.jpg',
  '/images/property-4.jpg',
  '/images/property-5.jpg',
  '/images/property-6.jpg',
  '/images/property-7.jpg',
  '/images/property-8.jpg'
];
