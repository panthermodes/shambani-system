import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
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
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Try to refresh token
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
              const refreshResponse = await authAPI.refreshToken(refreshToken);
              if (refreshResponse.success && refreshResponse.data) {
                localStorage.setItem("access_token", refreshResponse.data.access_token);
                localStorage.setItem("refresh_token", refreshResponse.data.refresh_token);
                setUser(refreshResponse.data.user);
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

      if (response.success && response.data) {
        const token = response.data.token;
        const userData = response.data.user;

        localStorage.setItem("authToken", token);
        setUser(userData);
        return { success: true };
      }

      return { success: false, error: response.error || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Failed to fetch" };
    }
  };

  const requestOTP = async (phone: string) => {
    try {
      const response = await authAPI.requestOTP(phone);

      if (response.success && response.data) {
        return {
          success: true,
          pid: response.data.pid,
        };
      }

      return { success: false, error: response.error || "OTP request failed" };
    } catch (error) {
      return { success: false, error: "An error occurred requesting OTP" };
    }
  };

  const loginWithOTP = async (phone: string, code: string) => {
    try {
      const response = await authAPI.verifyOTP({ phone, code });

      if (response.success && response.data) {
        const token = response.data.token;
        const userData = response.data.user;

        localStorage.setItem("authToken", token);
        setUser(userData);
        return { success: true };
      }

      return {
        success: false,
        error: response.error || "OTP verification failed",
      };
    } catch (error) {
      return { success: false, error: "An error occurred verifying OTP" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    authAPI.logout();
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || "Registration failed" };
    } catch (error) {
      return { success: false, error: "An error occurred during registration" };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      if (response.success && response.data) {
        localStorage.setItem("authToken", response.data.token);
        setUser(response.data.user);
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
        refreshToken,
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

// Re-export types and constants for convenience
export { ROLE };
export type { User, UserRole };
