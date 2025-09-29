import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHouse = () => {
  const houseVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const windowGlow = {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      variants={houseVariants}
      initial="initial"
      animate="animate"
      className="relative w-80 h-80 mx-auto"
    >
      <motion.svg
        animate={floatAnimation}
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Background Circle */}
        <motion.circle
          cx="200"
          cy="200"
          r="180"
          fill="rgba(255, 255, 255, 0.1)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* House Base */}
        <motion.rect
          x="120"
          y="220"
          width="160"
          height="120"
          fill="#3b82f6"
          rx="8"
          initial={{ y: 400 }}
          animate={{ y: 220 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Roof */}
        <motion.polygon
          points="100,220 200,160 300,220"
          fill="#1e40af"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Chimney */}
        <motion.rect
          x="240"
          y="170"
          width="20"
          height="40"
          fill="#6b7280"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 170, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />

        {/* Chimney Smoke */}
        <motion.g>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={250 + i * 5}
              cy={160 - i * 15}
              r={3 + i}
              fill="rgba(255, 255, 255, 0.6)"
              animate={{
                y: [-5, -25, -5],
                opacity: [0.6, 0.2, 0.6],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.g>

        {/* Door */}
        <motion.rect
          x="180"
          y="280"
          width="40"
          height="60"
          fill="#8b5cf6"
          rx="20"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        />

        {/* Door Handle */}
        <motion.circle
          cx="210"
          cy="310"
          r="3"
          fill="#fbbf24"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />

        {/* Windows */}
        <motion.g>
          {/* Left Window */}
          <motion.rect
            x="140"
            y="240"
            width="30"
            height="30"
            fill="#fef3c7"
            rx="4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />
          <motion.rect
            x="152"
            y="240"
            width="6"
            height="30"
            fill="#3b82f6"
            animate={windowGlow}
          />
          <motion.rect
            x="140"
            y="252"
            width="30"
            height="6"
            fill="#3b82f6"
            animate={windowGlow}
          />

          {/* Right Window */}
          <motion.rect
            x="230"
            y="240"
            width="30"
            height="30"
            fill="#fef3c7"
            rx="4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          />
          <motion.rect
            x="242"
            y="240"
            width="6"
            height="30"
            fill="#3b82f6"
            animate={windowGlow}
          />
          <motion.rect
            x="230"
            y="252"
            width="30"
            height="6"
            fill="#3b82f6"
            animate={windowGlow}
          />
        </motion.g>

        {/* Garden/Ground */}
        <motion.ellipse
          cx="200"
          cy="360"
          rx="150"
          ry="20"
          fill="#10b981"
          opacity="0.6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />

        {/* Trees */}
        <motion.g>
          {/* Left Tree */}
          <motion.rect
            x="85"
            y="310"
            width="8"
            height="40"
            fill="#92400e"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          />
          <motion.circle
            cx="89"
            cy="305"
            r="15"
            fill="#16a34a"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          />

          {/* Right Tree */}
          <motion.rect
            x="307"
            y="315"
            width="8"
            height="35"
            fill="#92400e"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          />
          <motion.circle
            cx="311"
            cy="310"
            r="12"
            fill="#16a34a"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          />
        </motion.g>

        {/* Decorative Elements */}
        <motion.g>
          {/* Hearts floating around */}
          {[0, 1, 2, 3].map((i) => (
            <motion.text
              key={i}
              x={150 + i * 30}
              y={120 + (i % 2) * 20}
              fontSize="16"
              fill="#f472b6"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            >
              ♥
            </motion.text>
          ))}
        </motion.g>

        {/* Welcome Sign */}
        <motion.g
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <motion.rect
            x="120"
            y="350"
            width="160"
            height="25"
            fill="rgba(255, 255, 255, 0.9)"
            rx="12"
          />
          <motion.text
            x="200"
            y="367"
            textAnchor="middle"
            fontSize="12"
            fill="#1e40af"
            fontWeight="bold"
            fontFamily="Poppins"
          >
            Welcome to Kirayedar
          </motion.text>
        </motion.g>
      </motion.svg>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              x: [-10, 10, -10],
              opacity: [0.6, 0.2, 0.6],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AnimatedHouse;
