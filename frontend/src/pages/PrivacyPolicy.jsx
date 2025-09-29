import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">How we protect your data</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <p className="text-gray-600">Privacy policy content will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
