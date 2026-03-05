import { httpClient, ApiResponse } from './http.client';

export interface SendOtpRequest { email: string; }
export interface SendOtpResponse { email?: string; verified?: boolean; }
export interface VerifyOtpRequest { email: string; otp: string; }
export interface VerifyOtpResponse { email?: string; verified?: boolean; }

class OtpService {
  async sendOtp(email: string): Promise<ApiResponse<SendOtpResponse>> {
    try {
      const response = await httpClient.post<SendOtpResponse>('/otp-verification/send-otp', { email });
      return response as unknown as ApiResponse<SendOtpResponse>;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<VerifyOtpResponse>> {
    try {
      const response = await httpClient.post<VerifyOtpResponse>('/otp-verification/verify-otp', { email, otp });
      return response as unknown as ApiResponse<VerifyOtpResponse>;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }
}

export const otpService = new OtpService();
