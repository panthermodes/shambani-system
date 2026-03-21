// API Configuration and utility functions
// Connected to Shambani NestJS backend
import config from "./config";
import type { ApiResponse, User, AuthResponse, FeedingRecord, HealthRecord, ProductionRecord, FinancialRecord, ServiceRequest, Notification, LoanRequest } from "./types";

const API_BASE_URL = config.apiBaseUrl;

// Generic API request function with proper error handling
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("access_token");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle 401 Unauthorized - token expired
    if (response.status === 401) {
      // Try to refresh token
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Retry original request with new token
        const newToken = localStorage.getItem("access_token");
        if (newToken) {
          defaultHeaders["Authorization"] = `Bearer ${newToken}`;
        }
        
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          credentials: "include",
        });
        
        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status} ${retryResponse.statusText}`);
        }
        
        return await retryResponse.json();
      } else {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        throw new Error("Session expired. Please login again.");
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Token refresh function
async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        return true;
      }
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return false;
}

// HTTP method helpers
export const api = {
  // GET requests
  get: <T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  // POST requests
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT requests
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH requests
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE requests
  delete: <T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),

  // File upload
  upload: <T = any>(endpoint: string, file: File, options?: RequestInit): Promise<ApiResponse<T>> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    });
  },
};

// Authentication API
export const authAPI = {
  // Register new user
  register: (data: any) => api.post<AuthResponse>("/api/auth/register", data),
  
  // Login with email/phone/username
  login: (credentials: { email?: string; phone?: string; username?: string; password: string }) =>
    api.post<AuthResponse>("/api/auth/login", credentials),
  
  // Login with phone only
  loginWithPhone: (credentials: { phone: string; password: string }) =>
    api.post<AuthResponse>("/api/auth/login-phone", credentials),
  
  // Request OTP
  requestOtp: (data: { phone: string }) =>
    api.post<{ success: boolean; message: string; pid?: string }>("/api/auth/otp/request", data),
  
  // Verify OTP
  verifyOtp: (data: { phone: string; code: string }) =>
    api.post<AuthResponse>("/api/auth/otp/verify", data),
  
  // Refresh token
  refreshToken: (refreshToken: string) =>
    api.post<AuthResponse>("/api/auth/refresh", { refresh_token: refreshToken }),
  
  // Get current user
  getCurrentUser: () => api.get<User>("/api/auth/me"),
  
  // Logout
  logout: () => api.post<void>("/api/auth/logout"),
};

// Users API
export const usersAPI = {
  // Get current user profile
  getProfile: () => api.get<User>("/api/users/profile"),
  
  // Update profile
  updateProfile: (data: Partial<User>) =>
    api.patch<User>("/api/users/profile", data),
  
  // Update password
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<void>("/api/users/password", data),
  
  // Get all users (admin)
  getAllUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    api.get<User[]>("/api/users", params as any),
  
  // Get user by ID (admin)
  getUserById: (id: string) => api.get<User>(`/api/users/${id}`),
  
  // Update user (admin)
  updateUser: (id: string, data: Partial<User>) =>
    api.patch<User>(`/api/users/${id}`, data),
  
  // Deactivate user (admin)
  deactivateUser: (id: string) => api.delete<void>(`/api/users/${id}`),
  
  // Get user statistics (admin)
  getUserStats: () => api.get<any>("/api/users/stats"),
};

// Feeding API
export const feedingAPI = {
  // Create feeding record
  createRecord: (data: any) => api.post<FeedingRecord>("/api/feeding/records", data),
  
  // Get feeding records
  getRecords: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get<FeedingRecord[]>("/api/feeding/records", params as any),
  
  // Get single feeding record
  getRecord: (id: string) => api.get<FeedingRecord>(`/api/feeding/records/${id}`),
  
  // Update feeding record
  updateRecord: (id: string, data: Partial<FeedingRecord>) =>
    api.patch<FeedingRecord>(`/api/feeding/records/${id}`, data),
  
  // Delete feeding record
  deleteRecord: (id: string) => api.delete<void>(`/api/feeding/records/${id}`),
  
  // Get feeding statistics
  getStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/feeding/stats", params as any),
  
  // Get feeding schedule
  getSchedule: (params?: {
    farmId?: string;
    houseId?: string;
    isActive?: boolean;
  }) => api.get<any[]>("/api/feeding/schedule", params as any),
  
  // Get admin feeding statistics
  getAdminStats: (params?: {
    region?: string;
    district?: string;
  }) => api.get<any>("/api/feeding/admin/stats", params as any),
};

// Health API
export const healthAPI = {
  // Create health record
  createRecord: (data: any) => api.post<HealthRecord>("/api/health/records", data),
  
  // Get health records
  getRecords: (params?: {
    farmId?: string;
    houseId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get<HealthRecord[]>("/api/health/records", params as any),
  
  // Get single health record
  getRecord: (id: string) => api.get<HealthRecord>(`/api/health/records/${id}`),
  
  // Update health record
  updateRecord: (id: string, data: Partial<HealthRecord>) =>
    api.patch<HealthRecord>(`/api/health/records/${id}`, data),
  
  // Delete health record
  deleteRecord: (id: string) => api.delete<void>(`/api/health/records/${id}`),
  
  // Get upcoming appointments
  getAppointments: () => api.get<any[]>("/api/health/appointments"),
  
  // Get vaccination schedule
  getVaccinations: (params?: {
    farmId?: string;
    houseId?: string;
    status?: string;
    upcoming?: boolean;
  }) => api.get<any[]>("/api/health/vaccinations", params as any),
  
  // Get disease outbreaks
  getDiseases: () => api.get<any[]>("/api/health/diseases"),
  
  // Get health statistics
  getStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/health/stats", params as any),
  
  // Get admin health statistics
  getAdminStats: (params?: {
    region?: string;
    district?: string;
  }) => api.get<any>("/api/health/admin/stats", params as any),
};

// Production API
export const productionAPI = {
  // Create production record
  createRecord: (data: any) => api.post<ProductionRecord>("/api/production/records", data),
  
  // Get production records
  getRecords: (params?: {
    farmId?: string;
    houseId?: string;
    recordType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get<ProductionRecord[]>("/api/production/records", params as any),
  
  // Get single production record
  getRecord: (id: string) => api.get<ProductionRecord>(`/api/production/records/${id}`),
  
  // Update production record
  updateRecord: (id: string, data: Partial<ProductionRecord>) =>
    api.patch<ProductionRecord>(`/api/production/records/${id}`, data),
  
  // Delete production record
  deleteRecord: (id: string) => api.delete<void>(`/api/production/records/${id}`),
  
  // Get egg production statistics
  getEggStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/production/eggs/stats", params as any),
  
  // Get chick hatching statistics
  getChicksStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/production/chicks/stats", params as any),
  
  // Get mortality statistics
  getMortalityStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/production/mortality/stats", params as any),
  
  // Get weight gain statistics
  getWeightStats: (params?: {
    farmId?: string;
    houseId?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/production/weight/stats", params as any),
  
  // Get production dashboard
  getDashboard: (params?: {
    farmId?: string;
    houseId?: string;
  }) => api.get<any>("/api/production/dashboard", params as any),
  
  // Get admin production statistics
  getAdminStats: (params?: {
    region?: string;
    district?: string;
  }) => api.get<any>("/api/production/admin/stats", params as any),
};

// Financial API
export const financialAPI = {
  // Create financial record
  createRecord: (data: any) => api.post<FinancialRecord>("/api/financial/records", data),
  
  // Get financial records
  getRecords: (params?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get<FinancialRecord[]>("/api/financial/records", params as any),
  
  // Get single financial record
  getRecord: (id: string) => api.get<FinancialRecord>(`/api/financial/records/${id}`),
  
  // Update financial record
  updateRecord: (id: string, data: Partial<FinancialRecord>) =>
    api.patch<FinancialRecord>(`/api/financial/records/${id}`, data),
  
  // Delete financial record
  deleteRecord: (id: string) => api.delete<void>(`/api/financial/records/${id}`),
  
  // Get financial summary
  getSummary: (params?: {
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/financial/summary", params as any),
  
  // Get profit/loss statement
  getProfitLoss: (params?: {
    startDate?: string;
    endDate?: string;
  }) => api.get<any>("/api/financial/profit-loss", params as any),
  
  // Create loan request
  createLoan: (data: any) => api.post<LoanRequest>("/api/financial/loans", data),
  
  // Get loan requests
  getLoans: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<LoanRequest[]>("/api/financial/loans", params as any),
  
  // Get admin financial statistics
  getAdminStats: () => api.get<any>("/api/financial/admin/stats"),
  
  // Get admin loan requests
  getAdminLoans: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<LoanRequest[]>("/api/financial/admin/loans", params as any),
};

// Services API
export const servicesAPI = {
  // Create service request
  createRequest: (data: any) => api.post<ServiceRequest>("/api/services/requests", data),
  
  // Get service requests
  getRequests: (params?: {
    serviceType?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) => api.get<ServiceRequest[]>("/api/services/requests", params as any),
  
  // Get single service request
  getRequest: (id: string) => api.get<ServiceRequest>(`/api/services/requests/${id}`),
  
  // Update service request
  updateRequest: (id: string, data: Partial<ServiceRequest>) =>
    api.patch<ServiceRequest>(`/api/services/requests/${id}`, data),
  
  // Delete service request
  deleteRequest: (id: string) => api.delete<void>(`/api/services/requests/${id}`),
  
  // Rate service
  rateService: (id: string, data: { rating: number; feedback?: string }) =>
    api.patch<void>(`/api/services/requests/${id}/rate`, data),
  
  // Get service statistics
  getStats: () => api.get<any>("/api/services/stats"),
  
  // Get assigned services (extension officers)
  getAssigned: () => api.get<ServiceRequest[]>("/api/services/assigned"),
  
  // Update service status
  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    api.patch<void>(`/api/services/requests/${id}/status`, data),
  
  // Get admin service statistics
  getAdminStats: () => api.get<any>("/api/services/admin/stats"),
  
  // Get admin service requests
  getAdminRequests: (params?: {
    status?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }) => api.get<ServiceRequest[]>("/api/services/admin/requests", params as any),
  
  // Assign service request (admin)
  assignRequest: (id: string, data: { assignedTo: string }) =>
    api.patch<void>(`/api/services/admin/requests/${id}/assign`, data),
};

// Notifications API
export const notificationsAPI = {
  // Create notification
  create: (data: any) => api.post<Notification>("/api/notifications", data),
  
  // Get notifications
  getNotifications: (params?: {
    type?: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
  }) => api.get<Notification[]>("/api/notifications", params as any),
  
  // Get unread count
  getUnreadCount: () => api.get<{ count: number }>("/api/notifications/unread/count"),
  
  // Get single notification
  getNotification: (id: string) => api.get<Notification>(`/api/notifications/${id}`),
  
  // Mark as read
  markAsRead: (id: string) => api.patch<void>(`/api/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: () => api.patch<void>("/api/notifications/read-all"),
  
  // Delete notification
  deleteNotification: (id: string) => api.delete<void>(`/api/notifications/${id}`),
  
  // Send system notification (admin)
  sendSystem: (data: any) => api.post<void>("/api/notifications/system", data),
  
  // Send notification to role (admin)
  sendToRole: (role: string, data: any) =>
    api.post<void>(`/api/notifications/role/${role}`, data),
  
  // Broadcast notification (admin)
  broadcast: (data: any) => api.post<void>("/api/notifications/broadcast", data),
  
  // Get all notifications (admin)
  getAll: (params?: {
    page?: number;
    limit?: number;
  }) => api.get<Notification[]>("/api/notifications/admin/all", params as any),
  
  // Get notification statistics (admin)
  getStats: () => api.get<any>("/api/notifications/admin/stats"),
};

// Jobs API (for Casual Labourer)
export const jobsAPI = {
  // Get available jobs
  getAvailableJobs: (params?: {
    location?: string;
    jobType?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/jobs/available", params as any),
  
  // Get my jobs
  getMyJobs: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/jobs/my", params as any),
  
  // Apply for job
  applyForJob: (jobId: string, data: any) => api.post<any>(`/api/jobs/${jobId}/apply`, data),
  
  // Update job status
  updateJobStatus: (jobId: string, data: { status: string; notes?: string }) =>
    api.patch<any>(`/api/jobs/${jobId}/status`, data),
  
  // Get job details
  getJobDetails: (jobId: string) => api.get<any>(`/api/jobs/${jobId}`),
  
  // Get job statistics
  getStats: () => api.get<any>("/api/jobs/stats"),
};

// Earnings API (for Casual Labourer)
export const earningsAPI = {
  // Get earnings summary
  getSummary: (params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) => api.get<any>("/api/earnings/summary", params as any),
  
  // Get earnings history
  getHistory: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => api.get<any[]>("/api/earnings/history", params as any),
  
  // Get payment records
  getPayments: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/earnings/payments", params as any),
  
  // Request payout
  requestPayout: (data: { amount: number; method: string }) =>
    api.post<any>("/api/earnings/request-payout", data),
  
  // Get earnings stats
  getStats: () => api.get<any>("/api/earnings/stats"),
};

// Logistics API
export const logisticsAPI = {
  // Get deliveries
  getDeliveries: (params?: {
    status?: string;
    driverId?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/logistics/deliveries", params as any),
  
  // Create delivery
  createDelivery: (data: any) => api.post<any>("/api/logistics/deliveries", data),
  
  // Update delivery status
  updateDeliveryStatus: (deliveryId: string, data: { status: string; notes?: string; location?: any }) =>
    api.patch<any>(`/api/logistics/deliveries/${deliveryId}/status`, data),
  
  // Get delivery details
  getDeliveryDetails: (deliveryId: string) => api.get<any>(`/api/logistics/deliveries/${deliveryId}`),
  
  // Get fleet vehicles
  getFleet: (params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/logistics/fleet", params as any),
  
  // Update vehicle status
  updateVehicleStatus: (vehicleId: string, data: { status: string; location?: any; fuelLevel?: number }) =>
    api.patch<any>(`/api/logistics/fleet/${vehicleId}/status`, data),
  
  // Get routes
  getRoutes: (params?: {
    status?: string;
    driverId?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/logistics/routes", params as any),
  
  // Get logistics statistics
  getStats: () => api.get<any>("/api/logistics/stats"),
};

// Products API (for Agrovet)
export const productsAPI = {
  // Get products
  getProducts: (params?: {
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/products", params as any),
  
  // Create product
  createProduct: (data: any) => api.post<any>("/api/products", data),
  
  // Update product
  updateProduct: (productId: string, data: any) => api.patch<any>(`/api/products/${productId}`, data),
  
  // Delete product
  deleteProduct: (productId: string) => api.delete<void>(`/api/products/${productId}`),
  
  // Update stock
  updateStock: (productId: string, data: { quantity: number; operation: 'add' | 'subtract' }) =>
    api.patch<any>(`/api/products/${productId}/stock`, data),
  
  // Get low stock products
  getLowStock: () => api.get<any[]>("/api/products/low-stock"),
  
  // Get product statistics
  getStats: () => api.get<any>("/api/products/stats"),
};

// Orders API (for Agrovet and general use)
export const ordersAPI = {
  // Get orders
  getOrders: (params?: {
    status?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/orders", params as any),
  
  // Create order
  createOrder: (data: any) => api.post<any>("/api/orders", data),
  
  // Update order status
  updateOrderStatus: (orderId: string, data: { status: string; notes?: string }) =>
    api.patch<any>(`/api/orders/${orderId}/status`, data),
  
  // Get order details
  getOrderDetails: (orderId: string) => api.get<any>(`/api/orders/${orderId}`),
  
  // Process payment
  processPayment: (orderId: string, data: any) => api.post<any>(`/api/orders/${orderId}/payment`, data),
  
  // Get order statistics
  getStats: () => api.get<any>("/api/orders/stats"),
};

// Equipment API (for Machinery Dealer)
export const equipmentAPI = {
  // Get equipment
  getEquipment: (params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/equipment", params as any),
  
  // Create equipment
  createEquipment: (data: any) => api.post<any>("/api/equipment", data),
  
  // Update equipment
  updateEquipment: (equipmentId: string, data: any) => api.patch<any>(`/api/equipment/${equipmentId}`, data),
  
  // Delete equipment
  deleteEquipment: (equipmentId: string) => api.delete<void>(`/api/equipment/${equipmentId}`),
  
  // Update equipment status
  updateEquipmentStatus: (equipmentId: string, data: { status: string; notes?: string }) =>
    api.patch<any>(`/api/equipment/${equipmentId}/status`, data),
  
  // Get equipment rentals
  getRentals: (params?: {
    status?: string;
    equipmentId?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/equipment/rentals", params as any),
  
  // Create rental
  createRental: (data: any) => api.post<any>("/api/equipment/rentals", data),
  
  // Update rental status
  updateRentalStatus: (rentalId: string, data: { status: string; notes?: string }) =>
    api.patch<any>(`/api/equipment/rentals/${rentalId}/status`, data),
  
  // Get equipment statistics
  getStats: () => api.get<any>("/api/equipment/stats"),
};

// Suppliers API (for Buyer Aggregator)
export const suppliersAPI = {
  // Get suppliers
  getSuppliers: (params?: {
    region?: string;
    category?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/suppliers", params as any),
  
  // Create supplier
  createSupplier: (data: any) => api.post<any>("/api/suppliers", data),
  
  // Update supplier
  updateSupplier: (supplierId: string, data: any) => api.patch<any>(`/api/suppliers/${supplierId}`, data),
  
  // Get supplier details
  getSupplierDetails: (supplierId: string) => api.get<any>(`/api/suppliers/${supplierId}`),
  
  // Rate supplier
  rateSupplier: (supplierId: string, data: { rating: number; feedback?: string }) =>
    api.post<any>(`/api/suppliers/${supplierId}/rate`, data),
  
  // Get supplier statistics
  getStats: () => api.get<any>("/api/suppliers/stats"),
};

// Contracts API (for Buyer Aggregator)
export const contractsAPI = {
  // Get contracts
  getContracts: (params?: {
    status?: string;
    supplierId?: string;
    page?: number;
    limit?: number;
  }) => api.get<any[]>("/api/contracts", params as any),
  
  // Create contract
  createContract: (data: any) => api.post<any>("/api/contracts", data),
  
  // Update contract
  updateContract: (contractId: string, data: any) => api.patch<any>(`/api/contracts/${contractId}`, data),
  
  // Get contract details
  getContractDetails: (contractId: string) => api.get<any>(`/api/contracts/${contractId}`),
  
  // Update contract status
  updateContractStatus: (contractId: string, data: { status: string; notes?: string }) =>
    api.patch<any>(`/api/contracts/${contractId}/status`, data),
  
  // Get contract statistics
  getStats: () => api.get<any>("/api/contracts/stats"),
};

// Export all APIs
export default {
  api,
  authAPI,
  usersAPI,
  feedingAPI,
  healthAPI,
  productionAPI,
  financialAPI,
  servicesAPI,
  notificationsAPI,
  jobsAPI,
  earningsAPI,
  logisticsAPI,
  productsAPI,
  ordersAPI,
  equipmentAPI,
  suppliersAPI,
  contractsAPI,
};
