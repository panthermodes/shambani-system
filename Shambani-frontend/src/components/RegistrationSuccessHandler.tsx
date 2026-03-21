// Registration Success Handler Component
// Detects successful registration and shows popup
import React, { useState, useEffect } from 'react';
import { RegistrationSuccessPopup } from './ui/RegistrationSuccessPopup';

interface RegistrationSuccessData {
  userName: string;
  userRole: string;
  timestamp: string;
}

export function RegistrationSuccessHandler() {
  const [showPopup, setShowPopup] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationSuccessData | null>(null);

  useEffect(() => {
    // Check for registration success in localStorage
    const checkRegistrationSuccess = () => {
      const stored = localStorage.getItem('registration_success');
      if (stored) {
        try {
          const data: RegistrationSuccessData = JSON.parse(stored);
          const now = new Date().getTime();
          const registrationTime = new Date(data.timestamp).getTime();
          
          // Only show popup if registration was within last 10 seconds
          if (now - registrationTime < 10000) {
            console.log('🎉 Registration success detected, showing popup');
            setRegistrationData(data);
            setShowPopup(true);
          }
          
          // Clear the stored data after checking
          localStorage.removeItem('registration_success');
        } catch (error) {
          console.error('Error parsing registration success data:', error);
          localStorage.removeItem('registration_success');
        }
      }
    };

    checkRegistrationSuccess();
    
    // Also check periodically (in case localStorage changes)
    const interval = setInterval(checkRegistrationSuccess, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRedirectToLogin = () => {
    console.log('🔄 User chose to go to login page');
    setShowPopup(false);
    window.location.href = '/login';
  };

  if (!showPopup || !registrationData) {
    return null;
  }

  return (
    <RegistrationSuccessPopup
      isOpen={showPopup}
      userName={registrationData.userName}
      userRole={registrationData.userRole}
      onRedirectToLogin={handleRedirectToLogin}
    />
  );
}
