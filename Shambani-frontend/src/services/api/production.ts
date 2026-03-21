// Production API Service
import apiClient from './client';

export const productionAPI = {
  // Create production record
  createRecord: (data: any) => apiClient.post('/api/production/records', data),
  
  // Get production records
  getRecords: (params?: {
    farmId?: string;
    houseId?: string;
    recordType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/production/records', { params }),
  
  // Get single production record
  getRecord: (id: string) => apiClient.get(`/api/production/records/${id}`),
  
  // Update production record
  updateRecord: (id: string, data: any) =>
    apiClient.patch(`/api/production/records/${id}`, data),
  
  // Delete production record
  deleteRecord: (id: string) => apiClient.delete(`/api/production/records/${id}`),
  
  // Get egg production statistics
  getEggStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/production/eggs/stats', { params }),
  
  // Get chick hatching statistics
  getChicksStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/production/chicks/stats', { params }),
  
  // Get mortality statistics
  getMortalityStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/production/mortality/stats', { params }),
  
  // Get weight gain statistics
  getWeightStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/production/weight/stats', { params }),
  
  // Get production dashboard
  getDashboard: (params?: {
    farmId?: string;
    houseId?: string;
  }) => apiClient.get('/api/production/dashboard', { params }),
  
  // Get admin production statistics
  getAdminStats: (params?: {
    region?: string;
    district?: string;
  }) => apiClient.get('/api/production/admin/stats', { params }),
};
