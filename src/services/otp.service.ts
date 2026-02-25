/**
 * OTP Verification Service
 * Xử lý gửi và xác thực OTP
 */

import { httpClient, ApiResponse } from './http.client';

/**
 * Request/Response Types
 */
export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
}

/**
 * OTP Service Class
 */
class OtpService {
  /**
   * Gửi OTP đến email
   */
  async sendOtp(email: string): Promise<ApiResponse<SendOtpResponse>> {
    try {
      const response = await httpClient.post<SendOtpResponse>('/otp-verification/send-otp', {
        email,
      });
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  /**
   * Xác thực OTP
   */
  async verifyOtp(email: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> {
    try {
      const response = await httpClient.post<VerifyOtpResponse>('/otp-verification/verify-otp', {
        email,
        otp,
      });
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const otpService = new OtpService();
