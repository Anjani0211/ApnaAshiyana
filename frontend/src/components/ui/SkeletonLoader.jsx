import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const shimmerVariants = {
    shimmer: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const CardSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image Skeleton */}
      <motion.div
        className="w-full h-56 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100"
        variants={shimmerVariants}
        animate="shimmer"
        style={{
          backgroundSize: '200% 100%',
        }}
      />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <motion.div
          className="h-6 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg"
          variants={shimmerVariants}
          animate="shimmer"
          style={{
            backgroundSize: '200% 100%',
            width: '80%'
          }}
        />
        <motion.div
          className="h-4 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg"
          variants={shimmerVariants}
          animate="shimmer"
          style={{
            backgroundSize: '200% 100%',
            width: '60%'
          }}
        />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-6 w-16 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-full"
              variants={shimmerVariants}
              animate="shimmer"
              style={{
                backgroundSize: '200% 100%',
              }}
            />
          ))}
        </div>
        <motion.div
          className="h-10 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg"
          variants={shimmerVariants}
          animate="shimmer"
          style={{
            backgroundSize: '200% 100%',
            width: '40%'
          }}
        />
      </div>
    </motion.div>
  );

  const ListSkeleton = () => (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex gap-4">
        <motion.div
          className="w-20 h-20 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg flex-shrink-0"
          variants={shimmerVariants}
          animate="shimmer"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
        <div className="flex-1 space-y-3">
          <motion.div
            className="h-5 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg"
            variants={shimmerVariants}
            animate="shimmer"
            style={{
              backgroundSize: '200% 100%',
              width: '70%'
            }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg"
            variants={shimmerVariants}
            animate="shimmer"
            style={{
              backgroundSize: '200% 100%',
              width: '50%'
            }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg"
            variants={shimmerVariants}
            animate="shimmer"
            style={{
              backgroundSize: '200% 100%',
              width: '40%'
            }}
          />
        </div>
      </div>
    </motion.div>
  );

  const StatSkeleton = () => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-full mx-auto mb-4"
        variants={shimmerVariants}
        animate="shimmer"
        style={{
          backgroundSize: '200% 100%',
        }}
      />
      <motion.div
        className="h-8 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg mx-auto mb-2"
        variants={shimmerVariants}
        animate="shimmer"
        style={{
          backgroundSize: '200% 100%',
          width: '60%'
        }}
      />
      <motion.div
        className="h-4 bg-gradient-to-r from-earth-100 via-earth-50 to-earth-100 rounded-lg mx-auto"
        variants={shimmerVariants}
        animate="shimmer"
        style={{
          backgroundSize: '200% 100%',
          width: '40%'
        }}
      />
    </motion.div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'stat':
        return <StatSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;


