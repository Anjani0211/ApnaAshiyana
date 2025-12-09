import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import { 
  PlusIcon,
  HomeIcon,
  CalendarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserIcon,
  ChartBarIcon,
  CreditCardIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { PropertyCard, PropertySearchForm } from '../modules/shared/components';
import { propertyService } from '../services/propertyService';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { listRooms, fetchMessages, sendMessage as sendChatMessage, markRead } from '../services/chatService';
import { io } from 'socket.io-client';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { hasPaid, handlePayment } = usePayment();
  const [activeTab, setActiveTab] = useState('overview');
  const [chatRooms, setChatRooms] = useState([]);
  const [chatFilter, setChatFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [chatHasMore, setChatHasMore] = useState(false);
  const [chatCursor, setChatCursor] = useState(null);
  const socketRef = React.useRef(null);
  const chatBodyRef = React.useRef(null);
  const [myProperties, setMyProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    favorites: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user's properties (if they have any)
      try {
        const propertiesResponse = await propertyService.getUserProperties();
        const propertiesData = propertiesResponse.data || propertiesResponse || [];
        
        const formattedProperties = propertiesData.map(property => ({
          id: property._id || property.id,
          title: property.title,
          type: property.propertyType,
          rent: property.rent,
          deposit: property.deposit,
          location: property.address ? `${property.address.area || ''}, ${property.address.city || 'Ranchi'}` : 'Ranchi',
          area: property.address?.area || '',
          image: property.images && property.images.length > 0 
            ? (property.images[0].startsWith('http') || property.images[0].startsWith('/')
                ? property.images[0]
                : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/properties/${property.images[0]}`)
            : '/images/apartment-placeholder.svg',
          verified: property.isVerified || false,
          description: property.description,
          status: property.isAvailable ? 'available' : 'occupied'
        }));
        
        setMyProperties(formattedProperties);
        setStats(prev => ({
          ...prev,
          totalProperties: formattedProperties.length
        }));
      } catch (error) {
        console.error('Error loading properties:', error);
        setMyProperties([]);
      }

      // Load user's bookings
      try {
        const bookingsResponse = await bookingService.getUserBookings();
        const bookingsData = bookingsResponse.data || bookingsResponse || [];
        setMyBookings(bookingsData);
        setStats(prev => ({
          ...prev,
          activeBookings: bookingsData.filter(b => b.status === 'pending' || b.status === 'approved').length
        }));
      } catch (error) {
        console.error('Error loading bookings:', error);
        setMyBookings([]);
      }

      // Load favorites
      try {
        const favoritesResponse = await userService.getFavorites();
        const favData = favoritesResponse.data || favoritesResponse || [];
        const formattedFavorites = favData.map((p) => ({
          id: p._id || p.id,
          title: p.title,
          type: p.propertyType || p.type,
          rent: p.rent,
          deposit: p.deposit,
          location: p.address ? `${p.address.area || ''}, ${p.address.city || 'Ranchi'}` : 'Ranchi',
          area: p.address?.area || '',
          images: p.images || [],
          image: p.images && p.images[0],
          verified: p.isVerified || false,
          description: p.description,
          status: p.isAvailable ? 'available' : 'occupied'
        }));
        setFavorites(formattedFavorites);
        setStats(prev => ({
          ...prev,
          favorites: formattedFavorites.length
        }));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      const response = await propertyService.getProperties(searchData);
      const properties = response.data?.data || response.data || [];
      setSearchResults(properties);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chat: load rooms
  const loadChatRooms = async (filter = chatFilter) => {
    try {
      setChatLoading(true);
      const rooms = await listRooms(filter);
      // dedupe by roomId and sort by lastMessage time desc
      const unique = [];
      const seen = new Set();
      rooms.forEach((r) => {
        if (!seen.has(r.roomId)) {
          seen.add(r.roomId);
          unique.push(r);
        }
      });
      unique.sort((a, b) => {
        const ta = a.lastMessage?.time || a.lastMessage?.createdAt;
        const tb = b.lastMessage?.time || b.lastMessage?.createdAt;
        return (tb ? new Date(tb).getTime() : 0) - (ta ? new Date(ta).getTime() : 0);
      });
      setChatRooms(unique);
      const totalUnread = unique.reduce((sum, r) => sum + (r.unread || 0), 0);
      setUnreadTotal(totalUnread);
      localStorage.setItem('chatUnread', String(totalUnread || 0));
    } catch (err) {
      console.error('Error loading chat rooms:', err);
      setChatRooms([]);
      setUnreadTotal(0);
      localStorage.setItem('chatUnread', '0');
    } finally {
      setChatLoading(false);
    }
  };

  // Chat: open room
  const openRoom = async (room) => {
    setSelectedRoom(room);
    try {
      setChatLoading(true);
      const { data: msgs, hasMore } = await fetchMessages(room.roomId, { limit: 30 });
      const mapped = msgs.map((m) => ({
        from: m.sender === (user?._id || user?.id) ? 'me' : 'owner',
        text: m.text,
        time: new Date(m.createdAt || m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setChatMessages(mapped);
      setChatHasMore(hasMore);
      setChatCursor(msgs.length ? msgs[0].createdAt : null);
      await markRead(room.roomId);
      if (socketRef.current) {
        socketRef.current.emit('read_messages', { roomId: room.roomId, userId: user?._id || user?.id });
      }
      // refresh rooms to update unread
      loadChatRooms(chatFilter);
      // join socket room
      if (socketRef.current) {
        socketRef.current.emit('join_room', {
          roomId: room.roomId,
          userId: user?._id || user?.id,
          name: user?.name || 'You',
          role: 'renter'
        });
      }
    } catch (err) {
      console.error('Error opening room:', err);
      setChatMessages([]);
    } finally {
      setChatLoading(false);
    }
  };

  // Chat: send
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !chatInput.trim()) return;
    const text = chatInput.trim();
    try {
      // optimistic append
      const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [...prev, { from: 'me', text, time: timeLabel }]);
      await sendChatMessage(selectedRoom.roomId, text);
      setChatInput('');
    } catch (err) {
      console.error('Send chat error:', err);
    }
  };

  const loadOlderMessages = async () => {
    if (!selectedRoom || !chatHasMore || chatLoading || !chatCursor) return;
    try {
      setChatLoading(true);
      const { data: msgs, hasMore } = await fetchMessages(selectedRoom.roomId, { limit: 30, before: chatCursor });
      const mapped = msgs.map((m) => ({
        from: m.sender === (user?._id || user?.id) ? 'me' : 'owner',
        text: m.text,
        time: new Date(m.createdAt || m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setChatMessages((prev) => [...mapped, ...prev]);
      setChatHasMore(hasMore);
      setChatCursor(msgs.length ? msgs[0].createdAt : chatCursor);
    } catch (err) {
      console.error('Load older messages error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // typing indicator: emit on input change
  useEffect(() => {
    if (!selectedRoom || !socketRef.current) return;
    const handler = setTimeout(() => {
      socketRef.current.emit('typing', {
        roomId: selectedRoom.roomId,
        userId: user?._id || user?.id,
        name: user?.name || 'You'
      });
    }, 150);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatInput]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Socket for chat notifications/messages
  useEffect(() => {
    if (!isAuthenticated) return;
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
      || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000');
    const socket = io(SOCKET_URL, { withCredentials: true, transports: ['websocket'] });
    socketRef.current = socket;

    const userId = user?._id || user?.id;
    if (userId) {
      socket.emit('join_user', { userId });
    }

    socket.on('chat_message', (msg) => {
      if (selectedRoom && msg.roomId === selectedRoom.roomId) {
        setChatMessages((prev) => [
          ...prev,
          {
            from: msg.senderId === userId ? 'me' : 'owner',
            text: msg.text,
            time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        // mark read on active room
        markRead(selectedRoom.roomId).catch(() => {});
        socket.emit('read_messages', { roomId: selectedRoom.roomId, userId });
      } else {
        // toast notification for incoming message in other room
        const senderLabel = msg.senderId === userId ? 'You' : 'New message';
        import('react-toastify').then(({ toast }) => {
          toast.info(`${senderLabel}: ${msg.text.substring(0, 60)}`);
        }).catch(() => {});
        loadChatRooms(chatFilter); // refresh counts when inactive
      }
    });

    socket.on('chat_notify', () => {
      // reload rooms for unread counts
      loadChatRooms(chatFilter);
    });

    socket.on('typing', (payload) => {
      if (payload.roomId === selectedRoom?.roomId && payload.userId !== userId) {
        setTypingUser(payload.name || 'Someone');
        setTimeout(() => setTypingUser(null), 1200);
      }
    });

    socket.on('read_receipt', (payload) => {
      if (payload.roomId === selectedRoom?.roomId && payload.userId !== userId) {
        // mark read locally
        markRead(selectedRoom.roomId).catch(() => {});
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // load rooms when chat tab active or filter changes
  // initial tab from query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (isAuthenticated) {
      loadChatRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatFilter, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'my-properties', label: 'My Properties', icon: HomeIcon },
    { id: 'bookings', label: 'My Bookings', icon: CalendarIcon },
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    { id: 'search', label: 'Search', icon: MagnifyingGlassIcon },
    { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon, badge: unreadTotal }
  ];

  return (
    <div className="min-h-screen bg-earth-50 earth-texture pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">{user?.name || 'User'}</span>
          </h1>
          <p className="text-gray-600">Manage your properties, bookings, and more</p>
        </motion.div>

        {/* Payment Banner */}
        {!hasPaid && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-terracotta-600 via-ochre-500 to-terracotta-600 text-white rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <LockClosedIcon className="w-8 h-8" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Unlock Premium Access</h3>
                  <p className="text-white/90 text-sm">Pay ₹199 to view property details, contact owners, and list your own properties</p>
                </div>
              </div>
              <motion.button
                onClick={handlePayment}
                className="bg-white text-terracotta-700 px-6 py-3 rounded-xl font-bold shadow-2xl hover:bg-ochre-50 transition-all duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <CreditCardIcon className="w-5 h-5 inline mr-2" />
                Pay ₹199 Now
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'My Properties', value: stats.totalProperties, icon: HomeIcon, color: 'terracotta' },
            { label: 'Active Bookings', value: stats.activeBookings, icon: CalendarIcon, color: 'ochre' },
            { label: 'Favorites', value: stats.favorites, icon: HeartIcon, color: 'forest' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-earth-100"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-earth-100 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-terracotta-600 text-terracotta-600 bg-terracotta-50'
                      : 'border-transparent text-gray-600 hover:text-terracotta-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="relative">
                    {tab.label}
                    {tab.badge > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                          onClick={() => navigate('/properties/add')}
                          disabled={!hasPaid}
                          className="bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white p-6 rounded-xl font-bold shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: hasPaid ? 1.02 : 1 }}
                          whileTap={{ scale: hasPaid ? 0.98 : 1 }}
                        >
                          <PlusIcon className="w-6 h-6 inline mr-2" />
                          List Property
                        </motion.button>
                        <motion.button
                          onClick={() => navigate('/properties')}
                          className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white p-6 rounded-xl font-bold shadow-lg hover:from-ochre-600 hover:to-ochre-700 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MagnifyingGlassIcon className="w-6 h-6 inline mr-2" />
                          Browse Properties
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('bookings')}
                          className="bg-gradient-to-r from-forest-500 to-forest-600 text-white p-6 rounded-xl font-bold shadow-lg hover:from-forest-600 hover:to-forest-700 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CalendarIcon className="w-6 h-6 inline mr-2" />
                          View Bookings
                        </motion.button>
                      </div>
                    </div>
                    {myProperties.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">My Properties</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myProperties.slice(0, 3).map((property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onViewDetails={(id) => navigate(`/properties/${id}`)}
                              hasPaid={hasPaid}
                              isAuthenticated={isAuthenticated}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'my-properties' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">My Properties</h3>
                      <motion.button
                        onClick={() => navigate('/properties/add')}
                        disabled={!hasPaid}
                        className="bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: hasPaid ? 1.05 : 1 }}
                        whileTap={{ scale: hasPaid ? 0.95 : 1 }}
                      >
                        <PlusIcon className="w-5 h-5 inline mr-2" />
                        Add Property
                      </motion.button>
                    </div>
                    {myProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myProperties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            onViewDetails={(id) => navigate(`/properties/${id}`)}
                            hasPaid={hasPaid}
                            isAuthenticated={isAuthenticated}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={HomeIcon}
                        title="No Properties Listed"
                        description={hasPaid ? "Start listing your properties to earn rental income" : "Pay ₹199 to unlock the ability to list properties"}
                        action={hasPaid ? () => navigate('/properties/add') : handlePayment}
                        actionLabel={hasPaid ? "Add Property" : "Pay to Unlock"}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h3>
                    {myBookings.length > 0 ? (
                      <div className="space-y-4">
                        {myBookings.map((booking) => (
                          <div key={booking.id} className="bg-gray-50 rounded-xl p-4">
                            <p className="font-semibold">{booking.property?.title || 'Property'}</p>
                            <p className="text-sm text-gray-600">Status: {booking.status}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={CalendarIcon}
                        title="No Bookings Yet"
                        description="Your booking requests will appear here"
                      />
                    )}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Favorites</h3>
                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isFavorited
                            onViewDetails={(id) => navigate(`/properties/${id}`)}
                            hasPaid={hasPaid}
                            isAuthenticated={isAuthenticated}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={HeartIcon}
                        title="No Favorites Yet"
                        description="Properties you favorite will appear here"
                      />
                    )}
                  </div>
                )}

                {activeTab === 'search' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Search Properties</h3>
                    <PropertySearchForm onSearch={handleSearch} />
                    {searchResults.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {searchResults.map((property) => (
                          <PropertyCard
                            key={property.id || property._id}
                            property={property}
                            onViewDetails={(id) => navigate(`/properties/${id}`)}
                            hasPaid={hasPaid}
                            isAuthenticated={isAuthenticated}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-4 lg:col-span-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Messages</h3>
                        <div className="flex gap-2">
                          {['all', 'renter', 'owner'].map((f) => (
                            <button
                              key={f}
                              onClick={() => setChatFilter(f)}
                              className={`px-3 py-1 text-sm rounded-lg border ${
                                chatFilter === f ? 'border-terracotta-500 text-terracotta-600 bg-terracotta-50' : 'border-gray-200 text-gray-600'
                              }`}
                            >
                              {f === 'all' ? 'All' : f === 'renter' ? 'Renter' : 'Owner'}
                            </button>
                          ))}
                        </div>
                      </div>
                      {chatLoading && (
                        <div className="text-sm text-gray-500 mb-2">Loading chats...</div>
                      )}
                      <div className="space-y-3 max-h-[520px] overflow-y-auto">
                        {chatRooms.length === 0 && !chatLoading && (
                          <EmptyState
                            icon={ChatBubbleLeftRightIcon}
                            title="No chats yet"
                            description="Conversations will appear here"
                          />
                        )}
                        {chatRooms.map((room) => (
                          <button
                            key={room.roomId}
                            onClick={() => openRoom(room)}
                            className={`w-full text-left p-3 rounded-xl border transition ${
                              selectedRoom?.roomId === room.roomId ? 'border-terracotta-500 bg-terracotta-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-semibold text-gray-900 line-clamp-1">{room.propertyTitle || 'Property'}</div>
                              {room.unread > 0 && (
                                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{room.unread}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              With: {room.owner?.name && room.renter?.name
                                ? `${room.owner?.name} / ${room.renter?.name}`
                                : 'Participants'}
                            </div>
                            {room.lastMessage && (
                              <div className="text-sm text-gray-700 line-clamp-1">
                                {room.lastMessage.text}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-earth-100 shadow-sm p-4 lg:col-span-2 min-h-[520px] flex flex-col">
                      {selectedRoom ? (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="font-bold text-gray-900">{selectedRoom.propertyTitle || 'Chat'}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                    {selectedRoom.owner && selectedRoom.owner.name ? selectedRoom.owner.name : 'Owner'} &amp; {selectedRoom.renter && selectedRoom.renter.name ? selectedRoom.renter.name : 'Renter'}
                              </div>
                              <div className="text-xs text-gray-500">Room: {selectedRoom.roomId}</div>
                              {typingUser && (
                                <div className="text-xs text-terracotta-600 mt-1">{typingUser} is typing...</div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                              Filter: {chatFilter === 'all' ? 'All' : chatFilter === 'renter' ? 'Renter' : 'Owner'}
                              <div className="text-[11px] text-gray-400">Scroll to load older</div>
                            </div>
                          </div>

                          {chatHasMore && (
                            <button
                              onClick={loadOlderMessages}
                              disabled={chatLoading}
                              className="self-center mb-2 text-xs text-terracotta-600 hover:text-terracotta-700"
                            >
                              {chatLoading ? 'Loading...' : 'Load older'}
                            </button>
                          )}

                          <div ref={chatBodyRef} className="flex-1 border border-gray-100 rounded-xl p-3 bg-gray-50 overflow-y-auto space-y-3 mb-3 max-h-[520px]">
                            {chatMessages.map((msg, idx) => (
                              <div key={idx} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                                    msg.from === 'me' ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
                                  }`}
                                >
                                  <div>{msg.text}</div>
                                  <div className={`text-[11px] mt-1 ${msg.from === 'me' ? 'text-white/80' : 'text-gray-500'}`}>
                                    {msg.time}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {chatMessages.length === 0 && (
                              <div className="text-center text-sm text-gray-500">No messages yet.</div>
                            )}
                          </div>

                          <form onSubmit={handleSendChat} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              placeholder="Type a message..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                            >
                              Send
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                          Select a conversation to start chatting.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
