// Health API Service
import apiClient from './client';

export const healthAPI = {
  // Create health record
  createRecord: (data: any) => apiClient.post('/api/health/records', data),
  
  // Get health records
  getRecords: (params?: {
    farmId?: string;
    houseId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/health/records', { params }),
  
  // Get single health record
  getRecord: (id: string) => apiClient.get(`/api/health/records/${id}`),
  
  // Update health record
  updateRecord: (id: string, data: any) =>
    apiClient.patch(`/api/health/records/${id}`, data),
  
  // Delete health record
  deleteRecord: (id: string) => apiClient.delete(`/api/health/records/${id}`),
  
  // Get upcoming appointments
  getAppointments: () => apiClient.get('/api/health/appointments'),
  
  // Get vaccination schedule
  getVaccinations: (params?: {
    farmId?: string;
    houseId?: string;
    status?: string;
    upcoming?: boolean;
  }) => apiClient.get('/api/health/vaccinations', { params }),
  
  // Get disease outbreaks
  getDiseases: () => apiClient.get('/api/health/diseases'),
  
  // Get health statistics
  getStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/health/stats', { params }),
  
  // Get admin health statistics
  getAdminStats: (params?: {
    region?: string;
    district?: string;
  }) => apiClient.get('/api/health/admin/stats', { params }),
};
