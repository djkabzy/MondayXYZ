"use client";

import { motion } from "framer-motion";

interface BitcoinLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  variant?: "default" | "mobile";
}

export default function BitcoinLoader({ size = "md", text, className = "", variant = "default" }: BitcoinLoaderProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const shouldUseMobileVariant = variant === "mobile" || isMobile;
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        className={`relative ${sizes[size]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          transform: shouldUseMobileVariant ? 'scale(0.8)' : 'none'
        }}
      >
        {/* Spinning outer ring */}
        <motion.div 
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border-4 border-[#F2A900] border-t-transparent" />
        </motion.div>
        
        {/* Pulsing middle ring */}
        <motion.div 
          className="absolute inset-1 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity, 
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#F2A900]"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translateY(-150%)`,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
        
        {/* Inner Bitcoin symbol */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-[#F2A900] font-bold"
          style={{ fontSize: size === "lg" ? "1.5rem" : size === "md" ? "1.2rem" : "1rem" }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
            rotateY: [0, 360]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ₿
        </motion.div>
      </motion.div>
      
      {text && (
        <motion.div 
          className="flex flex-col items-center space-y-1"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#F2A900] font-medium text-center">
            {text}
          </p>
          <motion.div 
            className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#F2A900] to-transparent"
            animate={{ 
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
