/**
 * API Configuration
 * Cấu hình cơ bản cho việc gọi API
 */

// Base URL của backend API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Base URL để lấy ảnh (bỏ phần /api/v1)
export const IMAGE_BASE_URL = API_BASE_URL.replace('/api/v1', '');

// Timeout cho các request (30 giây)
export const API_TIMEOUT = 30000;

// Key để lưu token trong localStorage
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_INFO_KEY = 'user_info';

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * API Response Code (từ backend)
 */
export const API_CODE = {
  SUCCESS: 1000,
  USER_NOT_EXISTED: 1001,
  PASSWORD_WRONG: 1002,
  UNAUTHENTICATED: 1003,
  UNAUTHORIZED: 1004,
  USER_EXISTED: 1005,
} as const;
