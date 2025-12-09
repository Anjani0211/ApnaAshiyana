import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative perspective-1000" style={{ transformStyle: 'preserve-3d' }}>
        {/* Outer Ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-terracotta-200 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-transparent border-t-ochre-500 rounded-full absolute top-0 left-0`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-transparent border-r-forest-500 rounded-full absolute top-0 left-0`}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-terracotta-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;


