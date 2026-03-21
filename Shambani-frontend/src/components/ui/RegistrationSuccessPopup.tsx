// Professional Registration Success Popup
// Shows success message and redirects to login after 3 seconds
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Phone, Mail, Lock } from 'lucide-react';

interface RegistrationSuccessPopupProps {
  isOpen: boolean;
  userName: string;
  userRole: string;
  onRedirectToLogin: () => void;
}

export function RegistrationSuccessPopup({ 
  isOpen, 
  userName, 
  userRole, 
  onRedirectToLogin 
}: RegistrationSuccessPopupProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      // Just close popup, don't redirect
      setCountdown(0);
    }
  }, [isOpen, countdown]);

  // Role-specific success messages and emojis
  const roleConfig = {
    FARMER: {
      emoji: '🌾',
      title: 'Farmer Account Created!',
      message: 'Your farming journey begins now. Manage crops, livestock, and boost productivity.',
      color: 'green'
    },
    EXTENSION_OFFICER: {
      emoji: '👨‍🌾',
      title: 'Extension Officer Account Ready!',
      message: 'Help farmers grow with expert agricultural guidance and support.',
      color: 'blue'
    },
    CASUAL_LABOURER: {
      emoji: '💪',
      title: 'Labour Account Activated!',
      message: 'Find agricultural work opportunities and earn with your skills.',
      color: 'orange'
    },
    LOGISTICS_PROVIDER: {
      emoji: '🚚',
      title: 'Logistics Account Ready!',
      message: 'Move agriculture forward with your transport services.',
      color: 'purple'
    },
    AGROVET_OWNER: {
      emoji: '🏥',
      title: 'Agrovet Account Active!',
      message: 'Provide veterinary care and keep animals healthy.',
      color: 'red'
    },
    MACHINERY_DEALER: {
      emoji: '🚜',
      title: 'Machinery Account Ready!',
      message: 'Power farming with quality equipment and tools.',
      color: 'indigo'
    },
    BUYER_AGGREGATOR: {
      emoji: '📦',
      title: 'Buyer Account Active!',
      message: 'Connect farmers to markets and grow agricultural trade.',
      color: 'teal'
    },
    SUPER_ADMIN: {
      emoji: '⚙️',
      title: 'Admin Account Ready!',
      message: 'Manage the Shambani ecosystem and ensure smooth operations.',
      color: 'gray'
    }
  };

  const config = roleConfig[userRole as keyof typeof roleConfig] || roleConfig.FARMER;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-2 border-green-100"
          >
            {/* Success Icon and Title */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="text-6xl mb-4"
              >
                {config.emoji}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className={`text-2xl font-bold text-${config.color}-600 mb-2`}>
                  {config.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {config.message}
                </p>
              </motion.div>
            </div>

            {/* User Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-800">
                  Welcome, {userName}!
                </span>
              </div>
              <div className="text-center text-sm text-gray-600">
                Your {userRole.replace('_', ' ')} account has been successfully created.
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Registration Successful!
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Please go to login page</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Use your email or phone number</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>Access your dashboard after login</span>
                  </div>
                </div>
              </div>

              {/* Popup closes countdown */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: countdown > 0 ? Infinity : 0 }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {countdown > 0 ? `Popup closes in ${countdown} seconds...` : 'Click to close popup'}
                  </span>
                </div>
              </div>

              {/* Manual Close Button */}
              <button
                onClick={onRedirectToLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Close & Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
