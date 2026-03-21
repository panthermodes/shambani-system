// Main API Service Index
// Exports all API services for easy import

export { default as apiClient } from './client';
export * from './auth';
export * from './users';
export * from './feeding';
export * from './health';
export * from './production';
export * from './financial';
export * from './services';
export * from './notifications';

// Re-export commonly used services
import { authAPI, usersAPI, feedingAPI, healthAPI, productionAPI, financialAPI, servicesAPI, notificationsAPI } from './index';

export const api = {
  auth: authAPI,
  users: usersAPI,
  feeding: feedingAPI,
  health: healthAPI,
  production: productionAPI,
  financial: financialAPI,
  services: servicesAPI,
  notifications: notificationsAPI,
};

export default api;
