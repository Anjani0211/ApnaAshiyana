import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const EmptyState = ({ 
  icon: Icon = InboxIcon, 
  title = "No items found", 
  description = "There are no items to display at the moment.",
  action,
  actionLabel = "Get Started"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mb-6 perspective-1000"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-200/30 to-ochre-200/30 rounded-full blur-2xl"></div>
        
        {/* Icon Container */}
        <motion.div
          className="relative w-24 h-24 bg-gradient-to-br from-earth-50 to-earth-100 rounded-full flex items-center justify-center border-4 border-earth-200 shadow-2xl"
          whileHover={{ rotateY: 15, rotateX: 5, scale: 1.1 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Icon className="w-12 h-12 text-terracotta-600" />
        </motion.div>
        
        {/* Floating Elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-ochre-400 rounded-full"
            style={{
              top: `${20 + i * 30}%`,
              left: `${10 + i * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 max-w-md mb-6"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={action}
          className="bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;


