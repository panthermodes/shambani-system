import { useState, useEffect } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { SimpleLandingPage } from "./components/SimpleLandingPage";
import { ShambaniDashboard } from "./components/ShambaniDashboard";
import { LanguageProvider } from "./components/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RegistrationSuccessHandler } from "./components/RegistrationSuccessHandler";

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // If authenticated, show dashboard; otherwise show landing page
  if (isAuthenticated && user) {
    return (
      <>
        <RegistrationSuccessHandler />
        <ShambaniDashboard />
      </>
    );
  }

  return (
    <>
      <RegistrationSuccessHandler />
      <SimpleLandingPage />
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
