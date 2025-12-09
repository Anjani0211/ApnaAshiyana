import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RANCHI_AREAS, MAP_CONFIG } from '../constants';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom property marker icon
const createPropertyIcon = (type, verified = false) => {
  const color = verified ? '#10b981' : '#3b82f6';
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${type === 'pg' ? 'PG' : type === 'house' ? 'H' : type === 'apartment' ? 'A' : 'R'}
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Area marker icon
const createAreaIcon = (areaName) => {
  const iconHtml = `
    <div style="
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
      text-align: center;
      min-width: 60px;
    ">
      ${areaName}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-area-marker',
    iconSize: [80, 25],
    iconAnchor: [40, 12]
  });
};

const RanchiMap = ({ properties = [], showPaymentGate = false, onPaymentClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { hasPaid } = usePayment();
  const [areaCounts, setAreaCounts] = useState([]);
  const [propertyPoints, setPropertyPoints] = useState([]);

  useEffect(() => {
    loadAreaCounts();
    if (hasPaid && isAuthenticated) {
      loadPropertyPoints();
    } else {
      setPropertyPoints([]);
    }
  }, [hasPaid, isAuthenticated, properties]);

  const loadAreaCounts = async () => {
    try {
      const response = await propertyService.getAreaCounts();
      const data = response.data || response || [];
      setAreaCounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading area counts:', error);
      // Fallback: calculate from properties prop if available
      if (properties && properties.length > 0) {
        const counts = {};
        properties.forEach(prop => {
          const area = prop.address?.area || prop.area || 'Unknown';
          counts[area] = (counts[area] || 0) + 1;
        });
        setAreaCounts(Object.entries(counts).map(([area, count]) => ({ area, count })));
      }
    }
  };

  const loadPropertyPoints = async () => {
    try {
      const response = await propertyService.getProperties({ limit: 100 });
      const props = response.data?.data || response.data || [];
      setPropertyPoints(props.filter(p => p.location?.coordinates));
    } catch (error) {
      console.error('Error loading property points:', error);
    }
  };

  const handleAreaClick = (area) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    if (!hasPaid) {
      onPaymentClick && onPaymentClick();
      return;
    }
    navigate(`/properties?area=${area.value}`);
  };
  
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      // Fit map to Ranchi bounds
      map.fitBounds(MAP_CONFIG.bounds, { padding: [10, 10] });
    }, [map]);

    return null;
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        style={{ height: '100%', width: '100%' }}
        maxBounds={MAP_CONFIG.bounds}
        maxBoundsViscosity={1.0}
        minZoom={10}
        maxZoom={16}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />

        {/* Area markers with counts - shown when user hasn't paid */}
        {!hasPaid && areaCounts.map((areaData) => {
          const areaInfo = RANCHI_AREAS.find(a => a.value === areaData.area);
          if (!areaInfo || !areaData.count || areaData.count === 0) return null;
          
          return (
            <Marker
              key={areaData.area}
              position={areaInfo.coordinates}
              icon={createAreaIcon(`${areaInfo.label} (${areaData.count})`)}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[180px]">
                  <h3 className="font-semibold text-terracotta-600 text-sm mb-1.5">
                    {areaInfo.label}
                  </h3>
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <span className="w-3 h-3 mr-1.5">🏘️</span>
                    {areaData.count} {areaData.count === 1 ? 'property' : 'properties'} available
                  </div>
                  <button
                    onClick={() => handleAreaClick(areaInfo)}
                    className="w-full bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white text-xs py-1.5 px-2 rounded-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-colors duration-200 font-semibold"
                  >
                    {!isAuthenticated 
                      ? 'Register to View' 
                      : 'Pay ₹199 to View Details'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Property pin points (only if user has paid) */}
        {hasPaid && (() => {
          // Use properties prop if available, otherwise use propertyPoints from API
          const propertiesToShow = properties && properties.length > 0 
            ? properties.filter(p => p.coordinates || p.location?.coordinates)
            : propertyPoints;
          
          return propertiesToShow.map((property) => {
            // Handle both coordinate formats: [lng, lat] from API or [lat, lng] from props
            let coordinates = property.location?.coordinates || property.coordinates;
            if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) return null;
            
            // Convert [lng, lat] to [lat, lng] for Leaflet if needed
            // Check if first value is > 90 (likely longitude), then swap
            const [first, second] = coordinates;
            const position = first > 90 ? [second, first] : [first, second];
            
            return (
              <Marker
                key={property._id || property.id}
                position={position}
                icon={createPropertyIcon(
                  property.propertyType || property.type || 'room',
                  property.isVerified || property.verified
                )}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1.5">
                      {property.title}
                    </h3>
                    <div className="text-xs text-gray-600 mb-2">
                      <div className="font-medium">₹{property.rent?.toLocaleString()}/month</div>
                      <div>{property.address?.area || property.area || 'Ranchi'}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/properties/${property._id || property.id}`)}
                      className="w-full bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white text-xs py-1.5 px-2 rounded-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-colors duration-200 font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          });
        })()}

      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-lg p-2 z-[1000] max-w-[180px]">
        <h4 className="font-semibold text-xs mb-2 text-gray-900">Legend</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1.5"></div>
            <span>Available Properties</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1.5"></div>
            <span>Verified Properties</span>
          </div>
        </div>
      </div>

      {/* Property count */}
      <div className="absolute top-3 right-3 bg-white rounded-lg shadow-lg p-2 z-[1000]">
        <div className="text-xs text-gray-600">
          <div className="font-semibold text-gray-900">{properties.length}</div>
          <div>Properties Listed</div>
        </div>
      </div>
    </div>
  );
};

export default RanchiMap;
