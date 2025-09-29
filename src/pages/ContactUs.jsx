import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <PhoneIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">Get in touch with our team</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <PhoneIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+91 9876543210</p>
            </div>
            <div className="text-center">
              <EnvelopeIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">info@kirayedar.com</p>
            </div>
            <div className="text-center">
              <MapPinIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="text-gray-600">Ranchi, Jharkhand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
