// API Response Helper Utilities
// Standardizes response handling across all components

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Handles API response consistently across the application
 * @param response - API response object
 * @returns Response data or throws error
 */
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.message || response.error || 'API request failed');
};

/**
 * Checks if API response was successful
 * @param response - API response object
 * @returns Boolean indicating success
 */
export const isApiSuccess = <T>(response: ApiResponse<T>): boolean => {
  return response.success;
};

/**
 * Extracts error message from API response
 * @param response - API response object
 * @returns Error message string
 */
export const getApiError = <T>(response: ApiResponse<T>): string => {
  return response.message || response.error || 'Unknown error occurred';
};

/**
 * Handles API errors with user-friendly messages
 * @param error - Error object
 * @returns User-friendly error message
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
};
