import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RANCHI_AREAS, MAP_CONFIG } from '../constants';

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

const RanchiMap = ({ properties = [] }) => {
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      // Fit map to Ranchi bounds
      map.fitBounds(MAP_CONFIG.bounds, { padding: [20, 20] });
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


        {/* Property markers */}
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={property.coordinates || MAP_CONFIG.center}
            icon={createPropertyIcon(property.type, property.verified)}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[250px]">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {property.title}
                  </h3>
                  {property.verified && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                      ✓ Verified
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">📍</span>
                    {property.location}
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2">🏠</span>
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)} • {property.bedrooms || 1} BHK
                  </div>
                  <div className="flex items-center font-semibold text-primary-600">
                    <span className="w-4 h-4 mr-2">💰</span>
                    ₹{property.rent.toLocaleString()}/month
                  </div>
                  {property.ratings && (
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2">⭐</span>
                      {property.ratings} ({property.reviews || 0} reviews)
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/properties/${property.id}`}
                    className="flex-1 bg-primary-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: property.title,
                          text: property.description,
                          url: window.location.href
                        });
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    📤
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-[200px]">
        <h4 className="font-semibold text-sm mb-3 text-gray-900">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Available Properties</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Verified Properties</span>
          </div>
        </div>
      </div>

      {/* Property count */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-900">{properties.length}</div>
          <div>Properties Listed</div>
        </div>
      </div>
    </div>
  );
};

export default RanchiMap;
