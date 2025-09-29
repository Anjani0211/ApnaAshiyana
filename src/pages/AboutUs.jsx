import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <InformationCircleIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About Kirayedar</h1>
          <p className="text-gray-600">Your trusted rental platform in Ranchi, Jharkhand</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Brokers, Complete Transparency</h2>
            <p className="text-gray-600 mb-4">
              Kirayedar is Ranchi's first broker-free rental platform that connects property owners directly with tenants. 
              We believe in transparency, fair pricing, and hassle-free rental agreements.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              To revolutionize the rental market in Ranchi by eliminating middlemen, reducing costs, and providing 
              a seamless experience for both property owners and tenants.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Choose Kirayedar?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Zero broker fees - Save money on every transaction</li>
              <li>Direct communication between owners and tenants</li>
              <li>Transparent pricing with no hidden charges</li>
              <li>Legal rental agreements for secure transactions</li>
              <li>Verified properties and trusted owners</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
