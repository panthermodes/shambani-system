// Authentication API Service
import apiClient from './client';

export interface LoginCredentials {
  email?: string;
  phone?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  region: string;
  district: string;
  location: string;
  // Additional fields based on role
  farmName?: string;
  businessName?: string;
  [key: string]: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    access_token: string;
    refresh_token: string;
    expiresIn: number;
  };
}

export const authAPI = {
  // Register new user
  register: (data: RegisterData) => 
    apiClient.post<AuthResponse>('/api/auth/register', data),

  // Login with credentials
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/api/auth/login', credentials),

  // Login with phone only
  loginWithPhone: (credentials: { phone: string; password: string }) =>
    apiClient.post<AuthResponse>('/api/auth/login-phone', credentials),

  // Request OTP
  requestOtp: (data: { phone: string }) =>
    apiClient.post<{ success: boolean; message: string; pid?: string }>('/api/auth/otp/request', data),

  // Verify OTP
  verifyOtp: (data: { phone: string; code: string }) =>
    apiClient.post<AuthResponse>('/api/auth/otp/verify', data),

  // Refresh token
  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken }),

  // Get current user
  getCurrentUser: () => 
    apiClient.get<{ success: boolean; data: any }>('/api/auth/me'),

  // Logout
  logout: () => 
    apiClient.post<void>('/api/auth/logout'),
};
