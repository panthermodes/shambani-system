import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import type { User, UserRole } from "../utils/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithOTP: (
    phone: string,
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  requestOTP: (
    phone: string
  ) => Promise<{ success: boolean; error?: string; pid?: string }>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.data.success && response.data.data) {
            setUser(response.data.data);
          } else {
            // Try to refresh token
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
              const refreshResponse = await authAPI.refreshToken(refreshToken);
              if (refreshResponse.data.success && refreshResponse.data.data) {
                localStorage.setItem("access_token", refreshResponse.data.data.accessToken);
                localStorage.setItem("refresh_token", refreshResponse.data.data.refreshToken);
                setUser(refreshResponse.data.data.user);
              } else {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
              }
            } else {
              localStorage.removeItem("access_token");
            }
          }
        } catch (error) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (usernameOrPhone: string, password: string) => {
    try {
      // Detect input type: email, phone, or username
      const identifier = usernameOrPhone.trim();
      let credentials: {
        email?: string;
        phone?: string;
        username?: string;
        password: string;
      };

      if (identifier.includes("@")) {
        // Email format
        credentials = { email: identifier, password };
      } else if (/^[\d+]/.test(identifier) && /\d{7,}/.test(identifier)) {
        // Phone format (starts with + or 0, and has 7+ digits)
        credentials = { phone: identifier, password };
      } else {
        // Username format
        credentials = { username: identifier, password };
      }

      const response = await authAPI.login(credentials);
      const data = response.data;

      if (data.success && data.data) {
        localStorage.setItem("access_token", data.data.accessToken);
        localStorage.setItem("refresh_token", data.data.refreshToken);
        setUser(data.data.user);
        return { success: true };
      }

      return { success: false, error: data.message || "Login failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const requestOTP = async (phone: string) => {
    try {
      const response = await authAPI.requestOtp({ phone });

      if (response.data.success) {
        return {
          success: true,
          pid: response.data.data?.pid,
        };
      }

      return { success: false, error: response.data.message || "OTP request failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred requesting OTP" };
    }
  };

  const loginWithOTP = async (phone: string, code: string) => {
    try {
      const response = await authAPI.verifyOtp({ phone, code });

      if (response.data.success && response.data.data) {
        localStorage.setItem("access_token", response.data.data.accessToken);
        localStorage.setItem("refresh_token", response.data.data.refreshToken);
        setUser(response.data.data.user);
        return { success: true };
      }

      return {
        success: false,
        error: response.data.message || "OTP verification failed",
      };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred verifying OTP" };
    }
  };

  const logout = async () => {
    try {
      // Try to call logout API, but don't fail if it errors
      try {
        await authAPI.logout();
      } catch (error) {
        console.log("Logout API call failed:", error);
        // Continue with local cleanup even if API fails
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // Always clear local storage and user state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);

      if (response.data.success && response.data.data) {
        // Store tokens and user data after successful registration
        if (response.data.data.accessToken && response.data.data.refreshToken) {
          localStorage.setItem("access_token", response.data.data.accessToken);
          localStorage.setItem("refresh_token", response.data.data.refreshToken);
          setUser(response.data.data.user);
        }
        return { success: true };
      }

      return { success: false, error: response.data.message || "Registration failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred during registration" };
    }
  };

  const refreshTokenFunc = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await authAPI.refreshToken(refreshToken);
        if (response.data.success && response.data.data) {
          localStorage.setItem("access_token", response.data.data.accessToken);
          localStorage.setItem("refresh_token", response.data.data.refreshToken);
          setUser(response.data.data.user);
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithOTP,
        requestOTP,
        logout,
        register,
        refreshToken: refreshTokenFunc,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Re-export types for convenience
export type { User, UserRole };
