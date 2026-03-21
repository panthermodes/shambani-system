// Services API Service
import apiClient from './client';

export const servicesAPI = {
  // Create service request
  createRequest: (data: any) => apiClient.post('/api/services/requests', data),
  
  // Get service requests
  getRequests: (params?: {
    serviceType?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/services/requests', { params }),
  
  // Get single service request
  getRequest: (id: string) => apiClient.get(`/api/services/requests/${id}`),
  
  // Update service request
  updateRequest: (id: string, data: any) =>
    apiClient.patch(`/api/services/requests/${id}`, data),
  
  // Delete service request
  deleteRequest: (id: string) => apiClient.delete(`/api/services/requests/${id}`),
  
  // Rate service
  rateService: (id: string, data: { rating: number; feedback?: string }) =>
    apiClient.patch(`/api/services/requests/${id}/rate`, data),
  
  // Get service statistics
  getStats: () => apiClient.get('/api/services/stats'),
  
  // Get assigned services (extension officers)
  getAssigned: () => apiClient.get('/api/services/assigned'),
  
  // Update service status
  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    apiClient.patch(`/api/services/requests/${id}/status`, data),
  
  // Get admin service statistics
  getAdminStats: () => apiClient.get('/api/services/admin/stats'),
  
  // Get admin service requests
  getAdminRequests: (params?: {
    status?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/services/admin/requests', { params }),
  
  // Assign service request (admin)
  assignRequest: (id: string, data: { assignedTo: string }) =>
    apiClient.patch(`/api/services/admin/requests/${id}/assign`, data),
};
