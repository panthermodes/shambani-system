// Financial API Service
import apiClient from './client';

export const financialAPI = {
  // Create financial record
  createRecord: (data: any) => apiClient.post('/api/financial/records', data),
  
  // Get financial records
  getRecords: (params?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/financial/records', { params }),
  
  // Get single financial record
  getRecord: (id: string) => apiClient.get(`/api/financial/records/${id}`),
  
  // Update financial record
  updateRecord: (id: string, data: any) =>
    apiClient.patch(`/api/financial/records/${id}`, data),
  
  // Delete financial record
  deleteRecord: (id: string) => apiClient.delete(`/api/financial/records/${id}`),
  
  // Get financial summary
  getSummary: (params?: {
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/financial/summary', { params }),
  
  // Get profit/loss statement
  getProfitLoss: (params?: {
    startDate?: string;
    endDate?: string;
  }) => apiClient.get('/api/financial/profit-loss', { params }),
  
  // Create loan request
  createLoan: (data: any) => apiClient.post('/api/financial/loans', data),
  
  // Get loan requests
  getLoans: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/financial/loans', { params }),
  
  // Get admin financial statistics
  getAdminStats: () => apiClient.get('/api/financial/admin/stats'),
  
  // Get admin loan requests
  getAdminLoans: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/financial/admin/loans', { params }),
};
