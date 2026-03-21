// Users API Service
import apiClient from './client';

export const usersAPI = {
  // Get current user profile
  getProfile: () => apiClient.get('/api/users/profile'),
  
  // Update profile
  updateProfile: (data: any) => apiClient.patch('/api/users/profile', data),
  
  // Update password
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.patch('/api/users/password', data),
  
  // Get all users (admin)
  getAllUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    apiClient.get('/api/users', { params }),
  
  // Get user by ID (admin)
  getUserById: (id: string) => apiClient.get(`/api/users/${id}`),
  
  // Update user (admin)
  updateUser: (id: string, data: any) => apiClient.patch(`/api/users/${id}`, data),
  
  // Deactivate user (admin)
  deactivateUser: (id: string) => apiClient.delete(`/api/users/${id}`),
  
  // Get user statistics (admin)
  getUserStats: () => apiClient.get('/api/users/stats'),
};
