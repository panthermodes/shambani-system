// Feeding API Service
import apiClient from './client';

export const feedingAPI = {
  // Create feeding record
  createRecord: (data: any) => apiClient.post('/api/feeding/records', data),
  
  // Get feeding records
  getRecords: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/feeding/records', { params }),
  
  // Get single feeding record
  getRecord: (id: string) => apiClient.get(`/api/feeding/records/${id}`),
  
  // Update feeding record
  updateRecord: (id: string, data: any) =>
    apiClient.patch(`/api/feeding/records/${id}`, data),
  
  // Delete feeding record
  deleteRecord: (id: string) => apiClient.delete(`/api/feeding/records/${id}`),
  
  // Get feeding statistics
  getStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/feeding/stats', { params }),
  
  // Get feeding schedule
  getSchedule: (params?: {
    farmId?: string;
    houseId?: string;
    isActive?: boolean;
  }) => apiClient.get('/api/feeding/schedule', { params }),
  
  // Get admin feeding statistics
  getAdminStats: (params?: {
    region?: string;
    district?: string;
  }) => apiClient.get('/api/feeding/admin/stats', { params }),
};
