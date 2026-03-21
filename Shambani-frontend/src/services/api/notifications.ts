// Notifications API Service
import apiClient from './client';

export const notificationsAPI = {
  // Create notification
  create: (data: any) => apiClient.post('/api/notifications', data),
  
  // Get notifications
  getNotifications: (params?: {
    type?: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/notifications', { params }),
  
  // Get unread count
  getUnreadCount: () => apiClient.get<{ count: number }>('/api/notifications/unread/count'),
  
  // Get single notification
  getNotification: (id: string) => apiClient.get(`/api/notifications/${id}`),
  
  // Mark as read
  markAsRead: (id: string) => apiClient.patch(`/api/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => apiClient.patch('/api/notifications/read-all'),
  
  // Delete notification
  deleteNotification: (id: string) => apiClient.delete(`/api/notifications/${id}`),
  
  // Send system notification (admin)
  sendSystem: (data: any) => apiClient.post('/api/notifications/system', data),
  
  // Send notification to role (admin)
  sendToRole: (role: string, data: any) =>
    apiClient.post(`/api/notifications/role/${role}`, data),
  
  // Broadcast notification (admin)
  broadcast: (data: any) => apiClient.post('/api/notifications/broadcast', data),
  
  // Get all notifications (admin)
  getAll: (params?: {
    page?: number;
    limit?: number;
  }) => apiClient.get('/api/notifications/admin/all', { params }),
  
  // Get notification statistics (admin)
  getStats: () => apiClient.get('/api/notifications/admin/stats'),
};
