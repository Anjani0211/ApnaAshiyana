import React from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <KeyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
