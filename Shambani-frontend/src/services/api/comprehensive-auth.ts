// Comprehensive Authentication API Service for ALL User Roles
// Supports: Farmer, Extension Officer, Casual Labourer, Logistics Provider, Agrovet Owner, Machinery Dealer, Buyer Aggregator, Super Admin
import apiClient from './client';
import { config } from '../../utils/config';

// ============================================
// 🔌 TYPE DEFINITIONS
// ============================================

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
  region?: string;
  district?: string;
  location?: string;
  // Additional fields based on role
  farmName?: string;
  businessName?: string;
  farmerCategory?: string;
  farmerType?: string;
  registrationNumber?: string;
  taxId?: string;
  yearsOfExperience?: number;
  farmSize?: number;
  farmSizeUnit?: string;
  crops?: string[];
  livestock?: string[];
  farmingMethods?: string[];
  certifications?: string[];
  ward?: string;
  village?: string;
  street?: string;
  houseNumber?: string;
  gpsCoordinates?: string;
  dateOfBirth?: string;
  gender?: string;
  nationalId?: string;
  alternativePhone?: string;
  preferredLanguage?: string;
  marketingConsent?: boolean;
  [key: string]: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    access_token?: string;
    refresh_token?: string;
    expiresIn?: number;
  };
}

// ============================================
// 🛡️ ROLE-SPECIFIC VALIDATION
// ============================================

const farmerValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  farmerSpecific: ['farmerType', 'farmName', 'farmerCategory', 'registrationNumber', 'taxId', 'yearsOfExperience', 'farmSize', 'farmSizeUnit']
};

const extensionOfficerValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  officerSpecific: ['employeeId', 'officeLocation', 'serviceArea']
};

const casualLabourerValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  labourerSpecific: ['skills', 'availability', 'expectedWage', 'workArea']
};

const logisticsProviderValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  logisticsSpecific: ['serviceArea', 'vehicleType', 'coverageArea']
};

const agrovetOwnerValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  agrovetSpecific: ['shopName', 'shopLocation', 'specialization', 'licenseNumber']
};

const machineryDealerValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  dealerSpecific: ['businessName', 'dealerLicense', 'specialization']
};

const buyerAggregatorValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  buyerSpecific: ['companyName', 'aggregationType', 'licenseNumber']
};

const superAdminValidation = {
  required: ['firstName', 'lastName', 'email', 'phone', 'password'],
  optional: ['middleName', 'alternativePhone', 'dateOfBirth', 'gender'],
  adminSpecific: ['adminLevel', 'permissions']
};

// ============================================
// 🔧 VALIDATION HELPERS
// ============================================

const validateRoleSpecificFields = (role: string, data: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  // Base validation for all roles
  const baseRequired = ['firstName', 'lastName', 'email', 'phone', 'password'];
  baseRequired.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    }
  });

  // Email format validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
    isValid = false;
  }

  // Phone format validation (Tanzanian format)
  if (data.phone && !/^\+255\d{9}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Invalid Tanzanian phone number format (+255 XXX XXX XXX)';
    isValid = false;
  }

  // Password validation
  if (data.password && data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  } else if (data.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(data.password)) {
    errors.password = 'Password must contain uppercase, lowercase, number and special character';
    isValid = false;
  }

  // Role-specific validation
  const validationRules = {
    FARMER: farmerValidation,
    EXTENSION_OFFICER: extensionOfficerValidation,
    CASUAL_LABOURER: casualLabourerValidation,
    LOGISTICS_PROVIDER: logisticsProviderValidation,
    AGROVET_OWNER: agrovetOwnerValidation,
    MACHINERY_DEALER: machineryDealerValidation,
    BUYER_AGGREGATOR: buyerAggregatorValidation,
    SUPER_ADMIN: superAdminValidation
  };

  const roleValidation = validationRules[role as keyof typeof validationRules];
  if (roleValidation) {
    // Add role-specific required fields
    roleValidation.required?.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    // Add role-specific optional fields
    roleValidation.optional?.forEach(field => {
      if (data[field] && typeof data[field] === 'string' && !data[field].trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`;
        isValid = false;
      }
    });
  }

  return { isValid, errors };
};

// ============================================
// 🚀 COMPREHENSIVE AUTH API
// ============================================

export const comprehensiveAuthAPI = {
  // 🔐 ENHANCED REGISTER - Works for ALL roles
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('🔌 SHAMBANI COMPREHENSIVE Registration:', {
        url: `${config.apiBaseUrl}/api/auth/register`,
        role: data.role,
        timestamp: new Date().toISOString()
      });

      // Validate data
      const validation = validateRoleSpecificFields(data.role || 'FARMER', data);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${Object.values(validation.errors).join(', ')}`,
          data: undefined
        };
      }

      // Clean and prepare data
      const cleanData = {
        role: data.role || 'FARMER',
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        password: data.password,
        // Only include role-specific fields if they exist
        ...(data.farmerType && { farmerType: data.farmerType }),
        ...(data.farmName && { farmName: data.farmName?.trim() }),
        ...(data.businessName && { businessName: data.businessName?.trim() }),
        ...(data.farmerCategory && { farmerCategory: data.farmerCategory }),
        ...(data.registrationNumber && { registrationNumber: data.registrationNumber?.trim() }),
        ...(data.taxId && { taxId: data.taxId?.trim() }),
        ...(data.yearsOfExperience && { yearsOfExperience: parseInt(data.yearsOfExperience.toString()) }),
        ...(data.farmSize && { farmSize: parseFloat(data.farmSize.toString()) }),
        ...(data.farmSizeUnit && { farmSizeUnit: data.farmSizeUnit || 'acres' }),
        ...(data.crops && { crops: data.crops }),
        ...(data.livestock && { livestock: data.livestock }),
        ...(data.farmingMethods && { farmingMethods: data.farmingMethods }),
        ...(data.certifications && { certifications: data.certifications }),
        ...(data.region && { region: data.region?.trim() }),
        ...(data.district && { district: data.district?.trim() }),
        ...(data.ward && { ward: data.ward?.trim() }),
        ...(data.village && { village: data.village?.trim() }),
        ...(data.street && { street: data.street?.trim() }),
        ...(data.houseNumber && { houseNumber: data.houseNumber?.trim() }),
        ...(data.gpsCoordinates && { gpsCoordinates: data.gpsCoordinates?.trim() }),
        ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
        ...(data.gender && { gender: data.gender }),
        ...(data.nationalId && { nationalId: data.nationalId?.trim() }),
        ...(data.alternativePhone && { alternativePhone: data.alternativePhone?.trim() }),
        ...(data.preferredLanguage && { preferredLanguage: data.preferredLanguage || 'en' }),
        ...(data.marketingConsent !== undefined && { marketingConsent: data.marketingConsent })
      };

      console.log('📤 Clean Registration Data:', cleanData);

      const response = await apiClient.post<AuthResponse>('/api/auth/register', cleanData);
      
      console.log('✅ Registration Response:', response.data);
      
      // 🎉 Show success popup on successful registration
      if (response.data?.success) {
        const userName = `${data.firstName} ${data.lastName}`;
        const userRole = data.role || 'FARMER';
        
        console.log('🎉 Showing registration success popup for:', userName);
        
        // Store registration success for popup display
        localStorage.setItem('registration_success', JSON.stringify({
          userName,
          userRole,
          timestamp: new Date().toISOString()
        }));
        
        console.log('✅ Registration success stored for popup display');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      // Enhanced error handling for ALL status codes
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || 'Invalid data provided. Please check all fields.',
          data: undefined
        };
      }

      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Invalid credentials. Please check your information and try again.',
          data: undefined
        };
      }

      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'Account already exists. Please try logging in or use different credentials.',
          data: undefined
        };
      }

      if (error.response?.status === 422) {
        return {
          success: false,
          message: 'Validation failed. Please check all required fields.',
          data: undefined
        };
      }

      if (error.response?.status === 500) {
        return {
          success: false,
          message: 'Server error. Please try again later.',
          data: undefined
        };
      }

      // Network errors
      if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
        return {
          success: false,
          message: 'Network error. Please check your connection and try again.',
          data: undefined
        };
      }

      return {
        success: false,
        message: 'Registration failed. Please try again.',
        data: undefined
      };
    }
  },

  // 🔐 ENHANCED LOGIN - Works for ALL roles
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const loginData = {
        email: credentials.email?.trim().toLowerCase(),
        phone: credentials.phone?.trim(),
        username: credentials.username?.trim(),
        password: credentials.password
      };

      // Remove empty fields
      Object.keys(loginData).forEach(key => {
        if (!loginData[key as keyof LoginCredentials]) {
          delete loginData[key as keyof LoginCredentials];
        }
      });

      console.log('🔌 SHAMBANI COMPREHENSIVE Login:', {
        url: `${config.apiBaseUrl}/api/auth/login`,
        method: 'POST',
        data: loginData,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.post<AuthResponse>('/api/auth/login', loginData);
      
      console.log('✅ Login Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login Error:', {
        message: error.message,
        status: error.response?.status
      });

      // Enhanced error handling for ALL status codes
      if (error.response?.status === 400) {
        return {
          success: false,
          message: 'Invalid credentials. Please check your email/phone and password.',
          data: undefined
        };
      }

      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Invalid credentials. Please check your information and try again.',
          data: undefined
        };
      }

      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'User not found. Please check your credentials or register.',
          data: undefined
        };
      }

      if (error.response?.status === 429) {
        return {
          success: false,
          message: 'Too many login attempts. Please try again later.',
          data: undefined
        };
      }

      return {
        success: false,
        message: 'Login failed. Please try again.',
        data: undefined
      };
    }
  },

  // 📱 PHONE-SPECIFIC LOGIN
  loginWithPhone: async (phone: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('🔌 SHAMBANI Phone Login:', {
        url: `${config.apiBaseUrl}/api/auth/login-phone`,
        method: 'POST',
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.post<AuthResponse>('/api/auth/login-phone', { 
        phone: phone.trim(), 
        password 
      });
      
      console.log('✅ Phone Login Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Phone Login Error:', error);
      
      return {
        success: false,
        message: 'Phone login failed. Please try again.',
        data: undefined
      };
    }
  },

  // 🔄 TOKEN REFRESH - Enhanced with better error handling
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('🔄 SHAMBANI Token Refresh:', {
        url: `${config.apiBaseUrl}/api/auth/refresh`,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.post<AuthResponse>('/api/auth/refresh', {
        refreshToken
      });
      
      if (response.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        console.log('✅ Token refreshed successfully');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Token Refresh Error:', error);
      
      // Clear tokens on refresh failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      return {
        success: false,
        message: 'Session expired. Please log in again.',
        data: undefined
      };
    }
  },

  // 🚪 LOGOUT - Enhanced with comprehensive cleanup
  logout: async (): Promise<void> => {
    try {
      console.log('🚪 SHAMBANI Logout:', {
        url: `${config.apiBaseUrl}/api/auth/logout`,
        timestamp: new Date().toISOString()
      });

      await apiClient.post('/api/auth/logout');
      
      // Clear all auth data comprehensively
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('permissions');
      
      console.log('✅ Logged out successfully');
    } catch (error: any) {
      console.error('❌ Logout Error:', error);
      
      // Still clear local data even on error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('permissions');
    }
  },

  // 👤 GET CURRENT USER - Enhanced with role detection
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return null;
      }

      console.log('👤 SHAMBANI Get Current User:', {
        url: `${config.apiBaseUrl}/api/auth/me`,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.get('/api/auth/me');
      
      if (response.data?.user) {
        // Store user data with role
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.role || 'FARMER');
        
        console.log('✅ Current user retrieved:', {
          role: response.data.user.role,
          name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          timestamp: new Date().toISOString()
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Current User Error:', error);
      return null;
    }
  },

  // 🔐 GET USER PROFILE - Role-specific data fetching
  getUserProfile: async (userId: string): Promise<any> => {
    try {
      console.log('🔐 SHAMBANI Get User Profile:', {
        url: `${config.apiBaseUrl}/api/users/${userId}`,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get User Profile Error:', error);
      return null;
    }
  },

  // 📝 UPDATE USER PROFILE - Enhanced validation
  updateUserProfile: async (userId: string, data: any): Promise<any> => {
    try {
      console.log('📝 SHAMBANI Update User Profile:', {
        url: `${config.apiBaseUrl}/api/users/${userId}`,
        method: 'PATCH',
        data,
        timestamp: new Date().toISOString()
      });

      // Get current user to determine role for validation
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = currentUser.role || 'FARMER';
      
      // Validate based on user role
      const validation = validateRoleSpecificFields(userRole, data);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Validation failed: ${Object.values(validation.errors).join(', ')}`,
          data: undefined
        };
      }

      const response = await apiClient.patch(`/api/users/${userId}`, data);
      
      console.log('✅ Profile Updated:', {
        userId,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Profile Error:', error);
      
      return {
        success: false,
        message: 'Profile update failed. Please try again.',
        data: undefined
      };
    }
  },

  // 📊 GET USER STATS - Enhanced for all roles
  getUserStats: async (userId: string): Promise<any> => {
    try {
      console.log('📊 SHAMBANI Get User Stats:', {
        url: `${config.apiBaseUrl}/api/users/${userId}/stats`,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.get(`/api/users/${userId}/stats`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get User Stats Error:', error);
      return null;
    }
  },

  // 🔔 CHECK TOKEN VALIDITY
  isTokenValid: (): boolean => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  },

  // 🎯 GET USER ROLE
  getUserRole: (): string => {
    return localStorage.getItem('userRole') || 'FARMER';
  },

  // 🔑 GET USER PERMISSIONS
  getUserPermissions: (): string[] => {
    const role = localStorage.getItem('userRole') || 'FARMER';
    
    const permissions = {
      FARMER: [
        'view_dashboard', 'manage_production', 'manage_feeding', 'manage_health',
        'manage_financial', 'view_services', 'manage_profile'
      ],
      EXTENSION_OFFICER: [
        'view_dashboard', 'manage_farmers', 'provide_extension', 'view_reports',
        'manage_training', 'approve_registrations'
      ],
      CASUAL_LABOURER: [
        'view_jobs', 'apply_jobs', 'manage_profile', 'view_earnings',
        'track_work_history'
      ],
      LOGISTICS_PROVIDER: [
        'view_dashboard', 'manage_deliveries', 'track_vehicles',
        'manage_routes', 'view_orders'
      ],
      AGROVET_OWNER: [
        'view_dashboard', 'manage_products', 'manage_inventory',
        'view_orders', 'process_payments'
      ],
      MACHINERY_DEALER: [
        'view_dashboard', 'manage_equipment', 'track_rentals',
        'manage_maintenance', 'view_analytics'
      ],
      BUYER_AGGREGATOR: [
        'view_dashboard', 'manage_suppliers', 'manage_contracts',
        'process_payments', 'view_market_prices'
      ],
      SUPER_ADMIN: [
        'view_dashboard', 'manage_users', 'manage_roles',
        'view_analytics', 'system_administration'
      ]
    };
    
    return permissions[role as keyof typeof permissions] || [];
  }
};
