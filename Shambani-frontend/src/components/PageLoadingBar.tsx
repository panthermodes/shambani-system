import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoadingBarProps {
  isLoading?: boolean;
}

export function PageLoadingBar({ isLoading = false }: PageLoadingBarProps) {
  // Top progress bar disabled per user request
  // Only using glass loader now
  return null;
}

// Alternative compact loading bar
export function CompactLoadingBar({ isLoading = false }: PageLoadingBarProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 origin-left"
        >
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Page transition loading overlay with glassmorphism
interface PageTransitionLoaderProps {
  isLoading: boolean;
  pageName?: string;
}

export function PageTransitionLoader({ isLoading, pageName }: PageTransitionLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 backdrop-blur-md"
        >
          {/* Glass card with spinning loader */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 150,
              damping: 25,
              duration: 0.6,
            }}
            className="relative"
          >
            {/* Glassmorphism container */}
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
              {/* Gradient glow effect behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10" />
              
              {/* Spinning circle loader */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-16 h-16 border-4 border-blue-200/50 border-t-blue-600 rounded-full"
              />
              
              {/* Optional inner spinning circle for extra effect */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 m-auto w-10 h-10 border-2 border-purple-200/50 border-b-purple-600 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
