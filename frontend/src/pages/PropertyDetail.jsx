import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  WifiIcon,
  Square3Stack3DIcon,
  ShieldCheckIcon,
  BoltIcon,
  BeakerIcon,
  FireIcon,
  SparklesIcon,
  SunIcon,
  Cog6ToothIcon,
  CubeIcon,
  CloudIcon,
  ArrowLeftIcon,
  CameraIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { AMENITIES, DUMMY_IMAGES } from '../constants';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockProperty = {
        id: parseInt(id),
        title: 'Beautiful 2BHK Apartment near BIT Mesra',
        type: 'apartment',
        rent: 12000,
        deposit: 24000,
        location: 'Mesra, Ranchi',
        area: 'mesra',
        coordinates: [23.4067, 85.4375],
        images: DUMMY_IMAGES.slice(0, 6),
        verified: true,
        description: 'Beautiful 2BHK apartment located in the heart of Mesra, just 5 minutes walk from BIT Mesra campus. This modern apartment offers all the amenities you need for comfortable living.',
        ratings: 4.5,
        reviews: 23,
        bedrooms: 2,
        bathrooms: 2,
        furnished: 'furnished',
        availableFrom: '2024-02-01',
        amenities: ['wifi', 'parking', 'security', 'power_backup', 'water_supply', 'gym', 'garden', 'balcony', 'lift', 'ac'],
        owner: {
          name: 'Rajesh Kumar',
          phone: '+91 9876543210',
          email: 'rajesh@example.com',
          verified: true,
          memberSince: '2022-01-15',
          propertiesListed: 5,
          rating: 4.8
        },
        nearbyPlaces: [
          { name: 'BIT Mesra', distance: '0.5 km', type: 'university' },
          { name: 'Mesra Market', distance: '0.3 km', type: 'market' },
          { name: 'Ranchi Railway Station', distance: '8 km', type: 'transport' },
          { name: 'Birsa Munda Airport', distance: '12 km', type: 'transport' }
        ],
        features: [
          'Spacious living room with modern furniture',
          'Well-equipped kitchen with gas connection',
          'Master bedroom with attached bathroom',
          'Balcony with city view',
          '24/7 security and CCTV surveillance',
          'Power backup for common areas',
          'Nearby bus stop and auto stand'
        ]
      };
      
      setProperty(mockProperty);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    setShowContactForm(false);
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: WifiIcon,
      parking: Square3Stack3DIcon,
      security: ShieldCheckIcon,
      power_backup: BoltIcon,
      water_supply: BeakerIcon,
      gym: FireIcon,
      garden: SparklesIcon,
      balcony: SunIcon,
      washing_machine: Cog6ToothIcon,
      refrigerator: CubeIcon,
      ac: CloudIcon
    };
    return iconMap[amenity] || HomeIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/properties')}
            className="btn-primary"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full ${
                  isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <HeartIcon className="w-6 h-6" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-6 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span>{property.location}</span>
                    {property.verified && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{property.ratings}</span>
                      <span className="text-gray-500 ml-1">({property.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <HomeIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms} BHK</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CalendarIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ClockIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">Available</div>
                  <div className="text-gray-600">From {new Date(property.availableFrom).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Icon className="w-6 h-6 text-primary-600 mr-3" />
                        <span className="text-gray-700 capitalize">{amenity.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nearby Places</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {property.nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{place.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{place.type}</div>
                      </div>
                      <div className="text-sm text-gray-500">{place.distance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  ₹{property.rent.toLocaleString()}
                </div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-gray-500 mt-2">
                  Security Deposit: ₹{property.deposit.toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full btn-primary mb-4"
              >
                Contact Owner
              </button>
              
              <button className="w-full btn-secondary">
                Schedule Visit
              </button>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Owner</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{property.owner.name}</div>
                  <div className="flex items-center text-sm text-gray-600">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    {property.owner.rating} ({property.owner.propertiesListed} properties)
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {property.owner.phone}
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {property.owner.email}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Member since {new Date(property.owner.memberSince).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="I'm interested in this property..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;