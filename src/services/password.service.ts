/**
 * Password Service
 * Xử lý đặt lại mật khẩu
 */

import { httpClient, ApiResponse } from './http.client';

/**
 * Request/Response Types
 */
export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}

/**
 * Password Service Class
 */
class PasswordService {
  /**
   * Đặt lại mật khẩu
   * Flow: sendOtp -> verifyOtp -> resetPassword
   */
  async resetPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse<ResetPasswordResponse>> {
    try {
      const response = await httpClient.post<ResetPasswordResponse>(
        `/forgot-password/reset/${email}`,
        {
          newPassword,
          confirmPassword,
        }
      );
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const passwordService = new PasswordService();
