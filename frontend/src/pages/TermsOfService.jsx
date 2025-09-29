import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <DocumentTextIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Our terms and conditions</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <p className="text-gray-600">Terms of service content will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
