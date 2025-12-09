import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { ensureRoom, fetchMessages, sendMessage } from '../services/chatService';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
  ShareIcon,
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
  ClockIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { AMENITIES, DUMMY_IMAGES } from '../constants';
import { toast } from 'react-toastify';
import { propertyService } from '../services/propertyService';
import { LockClosedIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPaid, handlePayment } = usePayment();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { from: 'owner', text: 'Hi, thanks for your interest. How can I help you?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [ownerOnline, setOwnerOnline] = useState(true);
  const socketRef = useRef(null);
  const messageIdsRef = useRef(new Set());
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyPress = (e) => {
      if (property && property.images && property.images.length > 0) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevImage();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextImage();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setShowImageModal(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, property, selectedImageIndex]);


  const loadProperty = async () => {
    try {
      setLoading(true);
      
      // Load property from API
      const response = await propertyService.getPropertyById(id);
      const propertyData = response.data || response;
      
      // Transform backend data to frontend format
      const formattedProperty = {
        id: propertyData._id || propertyData.id,
        title: propertyData.title || 'Property',
        type: propertyData.propertyType || propertyData.type,
        rent: propertyData.rent || 0,
        deposit: propertyData.deposit || 0,
        location: propertyData.address 
          ? `${propertyData.address.area || ''}, ${propertyData.address.city || 'Ranchi'}, ${propertyData.address.state || 'Jharkhand'}`
          : 'Ranchi',
        area: propertyData.address?.area || '',
        coordinates: propertyData.location?.coordinates || [85.3096, 23.3441],
        images: propertyData.images && propertyData.images.length > 0 
          ? propertyData.images.map(img => {
              // Handle both Cloudinary URLs and local file paths
              if (img.startsWith('http') || img.startsWith('/')) {
                return img;
              }
              // Local file path - construct full URL
              return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/properties/${img}`;
            })
          : DUMMY_IMAGES.slice(0, 1),
        verified: propertyData.isVerified || false,
        description: propertyData.description || '',
        bedrooms: propertyData.bedrooms || propertyData.furnishingDetails?.beds || 0,
        bathrooms: propertyData.bathrooms || 0,
        furnished: propertyData.furnishingStatus || 'unfurnished',
        availableFrom: propertyData.availableFrom || new Date().toISOString(),
        amenities: propertyData.amenities ? Object.keys(propertyData.amenities).filter(key => propertyData.amenities[key] === true) : [],
        owner: propertyData.owner || {
          name: 'Owner',
          phone: '',
          email: '',
          verified: false
        },
        nearbyPlaces: propertyData.nearbyPlaces ? [
          ...(propertyData.nearbyPlaces.colleges || []).map(c => ({ name: c, type: 'university', distance: 'Nearby' })),
          ...(propertyData.nearbyPlaces.hospitals || []).map(h => ({ name: h, type: 'hospital', distance: 'Nearby' })),
          ...(propertyData.nearbyPlaces.markets || []).map(m => ({ name: m, type: 'market', distance: 'Nearby' })),
          ...(propertyData.nearbyPlaces.landmarks || []).map(l => ({ name: l, type: 'landmark', distance: 'Nearby' }))
        ] : [],
        features: [
          propertyData.description?.split('.').filter(f => f.trim()) || []
        ].flat().slice(0, 7)
      };
      
      setProperty(formattedProperty);
      setCurrentImageIndex(0);
      setSelectedImageIndex(0);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleNextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
      setSelectedImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
      setSelectedImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setCurrentImageIndex(index);
    setShowImageModal(true);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    if (!chatRoomId) return;
    try {
      const sent = await sendMessage(chatRoomId, message);
      // Prevent duplicates
      if (!messageIdsRef.current.has(String(sent._id))) {
        messageIdsRef.current.add(String(sent._id));
        setChatMessages((prev) => [...prev, {
          from: sent.senderId === (user?._id || user?.id) ? 'me' : 'owner',
          text: sent.text,
          time: new Date(sent.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setChatInput('');
    }
  };

  // Socket connection for chat
  // Load room + history when chat opens
  useEffect(() => {
    const setupChat = async () => {
      if (!showChatModal || !property || !isAuthenticated || !hasPaid) return;
      try {
        const room = await ensureRoom(property.id);
        setChatRoomId(room.roomId);

        const history = await fetchMessages(room.roomId);
        const mapped = history.map((m) => {
          messageIdsRef.current.add(String(m._id));
          return {
            from: (m.sender === (user?._id || user?.id)) ? 'me' : 'owner',
            text: m.text,
            time: new Date(m.createdAt || m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        setChatMessages(mapped);

        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
          || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');

        const socket = io(SOCKET_URL, {
          withCredentials: true,
          transports: ['websocket']
        });

        socketRef.current = socket;

        const userId = user?._id || user?.id || 'guest';
        const name = user?.name || user?.username || 'You';
        const ownerId = room.ownerId;

        socket.emit('join_room', {
          roomId: room.roomId,
          userId,
          name,
          role: 'renter'
        });

        socket.on('chat_message', (msg) => {
          if (!msg || !msg._id) return;
          if (messageIdsRef.current.has(String(msg._id))) return;
          messageIdsRef.current.add(String(msg._id));
          const timeLabel = msg.time
            ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Now';
          setChatMessages((prev) => [...prev, { from: msg.senderId === userId ? 'me' : 'owner', text: msg.text, time: timeLabel }]);
        });

        socket.on('presence', (payload) => {
          if (payload.userId === ownerId) {
            setOwnerOnline(payload.online);
          }
        });
      } catch (err) {
        console.error('Chat setup error:', err);
      }
    };

    setupChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [showChatModal, property, isAuthenticated, hasPaid, user]);

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
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Unlock Payment Modal */}
      
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
            {/* Enhanced Image Gallery with Adivasi Theme */}
            <motion.div 
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-earth-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative group">
                {/* Main Image with 3D Effect */}
                <motion.div
                  className="relative h-[500px] overflow-hidden bg-gradient-to-br from-earth-50 to-earth-100"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    key={currentImageIndex}
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openImageModal(currentImageIndex)}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      e.target.src = '/images/property-1.jpg';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Navigation Arrows with Adivasi Theme */}
                  {property.images.length > 1 && (
                    <>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white p-3 rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          boxShadow: '0 8px 24px rgba(194, 65, 12, 0.4)',
                        }}
                      >
                        <ChevronLeftIcon className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white p-3 rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          boxShadow: '0 8px 24px rgba(194, 65, 12, 0.4)',
                        }}
                      >
                        <ChevronRightIcon className="w-6 h-6" />
                      </motion.button>
                    </>
                  )}
                  
                  {/* Image Counter with Adivasi Styling */}
                  <motion.div 
                    className="absolute bottom-4 left-4 bg-gradient-to-r from-terracotta-700/90 to-ochre-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <CameraIcon className="w-4 h-4 inline mr-2" />
                    {currentImageIndex + 1} / {property.images.length}
                  </motion.div>
                  
                  {/* Click to view fullscreen hint */}
                  {property.images.length > 0 && (
                    <motion.div 
                      className="absolute top-4 right-4 bg-gradient-to-r from-forest-600/90 to-forest-700/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white/20 shadow-xl"
                      style={{
                        boxShadow: '0 4px 12px rgba(45, 80, 22, 0.3)',
                      }}
                    >
                      <CameraIcon className="w-3 h-3 inline mr-1" />
                      Click to view fullscreen
                    </motion.div>
                  )}
                </motion.div>
              </div>
              
              {/* Enhanced Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="p-4 bg-gradient-to-br from-earth-50 to-white border-t-2 border-earth-100">
                  <div className="grid grid-cols-6 gap-3">
                    {property.images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          currentImageIndex === index 
                            ? 'ring-4 ring-terracotta-500 border-terracotta-600 scale-105 shadow-2xl' 
                            : 'border-earth-200 hover:border-terracotta-400 hover:scale-105 shadow-md'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          boxShadow: currentImageIndex === index 
                            ? '0 8px 24px rgba(194, 65, 12, 0.4)' 
                            : '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/property-1.jpg';
                          }}
                        />
                        {currentImageIndex === index && (
                          <motion.div
                            className="absolute inset-0 bg-terracotta-500/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Enhanced Fullscreen Image Modal with Adivasi Theme */}
            {showImageModal && property.images && (
              <motion.div 
                className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowImageModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white p-3 rounded-full shadow-2xl z-10 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 8px 24px rgba(194, 65, 12, 0.5)',
                  }}
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
                
                <motion.div 
                  className="relative max-w-7xl max-h-[90vh] w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    key={selectedImageIndex}
                    src={property.images[selectedImageIndex]}
                    alt={`${property.title} ${selectedImageIndex + 1}`}
                    className="max-w-full max-h-[90vh] mx-auto object-contain rounded-2xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                    onError={(e) => {
                      e.target.src = '/images/property-1.jpg';
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {property.images.length > 1 && (
                    <>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-terracotta-600/90 to-terracotta-700/90 hover:from-terracotta-700 hover:to-terracotta-800 backdrop-blur-md text-white p-4 rounded-full shadow-2xl border-2 border-white/20 transition-all"
                        whileHover={{ scale: 1.15, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          boxShadow: '0 8px 24px rgba(194, 65, 12, 0.5)',
                        }}
                      >
                        <ChevronLeftIcon className="w-8 h-8" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-terracotta-600/90 to-terracotta-700/90 hover:from-terracotta-700 hover:to-terracotta-800 backdrop-blur-md text-white p-4 rounded-full shadow-2xl border-2 border-white/20 transition-all"
                        whileHover={{ scale: 1.15, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          boxShadow: '0 8px 24px rgba(194, 65, 12, 0.5)',
                        }}
                      >
                        <ChevronRightIcon className="w-8 h-8" />
                      </motion.button>
                      
                      <motion.div 
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-ochre-600/90 to-ochre-700/90 backdrop-blur-md text-white px-6 py-3 rounded-full text-base font-bold shadow-2xl border-2 border-white/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          boxShadow: '0 8px 24px rgba(212, 160, 23, 0.4)',
                        }}
                      >
                        <CameraIcon className="w-5 h-5 inline mr-2" />
                        {selectedImageIndex + 1} / {property.images.length}
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {hasPaid && isAuthenticated ? (
                      <span>{property.location}</span>
                    ) : (
                      <span className="blur-sm select-none">Location hidden - Pay to unlock</span>
                    )}
                    {property.verified && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                    )}
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
              
              <motion.button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.info('Please register to contact owner');
                    navigate('/register', { state: { from: `/properties/${id}` } });
                    return;
                  }
                  if (!hasPaid) {
                    toast.info('Please make payment to contact owner');
                    handlePayment();
                    return;
                  }
                  setShowChatModal(true);
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center"
                style={{
                  boxShadow: '0 8px 24px rgba(194, 65, 12, 0.4)',
                }}
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                {!isAuthenticated ? 'Register to Contact' : !hasPaid ? 'Pay to Contact Owner' : 'Contact Owner'}
              </motion.button>
            </div>

            {/* Owner Info - Only show after payment */}
            {hasPaid && isAuthenticated && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Owner</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{property.owner?.name || 'Owner'}</div>
                    <div className="text-sm text-gray-600">
                      {property.owner?.propertiesListed || 0} properties listed
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {property.owner?.phone || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {property.owner?.email || 'N/A'}
                  </div>
                  {property.owner?.memberSince && (
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Member since {new Date(property.owner.memberSince).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {(!hasPaid || !isAuthenticated) && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl shadow-sm p-6 text-center">
                <LockClosedIcon className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Property Details</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {!isAuthenticated
                    ? 'Register and pay ₹199 to view owner contact details, exact location, and full property information'
                    : 'Pay ₹199 to unlock full property details including owner contact and exact location'}
                </p>
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate('/register', { state: { from: `/properties/${id}` } })}
                    className="w-full btn-primary"
                  >
                    Register Now
                  </button>
                ) : (
                  <button
                    onClick={handlePayment}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <LockClosedIcon className="w-5 h-5 mr-2" />
                    Unlock for ₹199
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Chat with {property.owner?.name || 'Owner'}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2 ${ownerOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  {ownerOnline ? 'Online' : 'Offline'}
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-3 h-72 overflow-y-auto bg-gray-50 mb-4">
              <div className="space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                        msg.from === 'me'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div>{msg.text}</div>
                      <div className={`text-[11px] mt-1 ${msg.from === 'me' ? 'text-white/80' : 'text-gray-500'}`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;