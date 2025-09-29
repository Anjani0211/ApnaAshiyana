import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, HomeIcon } from '@heroicons/react/24/outline';

const PropertyList = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Home</h1>
          <p className="text-gray-600">Discover amazing rental properties in Ranchi</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Search</h2>
            <p className="text-gray-600">Search functionality will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
