/**
 * Services Index
 * Export tất cả các services để dễ dàng import
 */

// Export services
export { authService } from './auth.service';
export { otpService } from './otp.service';
export { passwordService } from './password.service';
export { userService } from './user.service';
export { shipperService } from './shipper.service';
export { notificationService } from './notification.service';
export { mysteryBoxService } from './mysteryBox.service';
export { httpClient } from './http.client';

// Export types
export type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from './auth.service';
export type { SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse } from './otp.service';
export type { ResetPasswordRequest, ResetPasswordResponse } from './password.service';
export type { ShipperRegisterRequest, ShipperRegisterResponse } from './shipper.service';
export type { NotificationItem, AdminSendNotificationRequest } from './notification.service';
export type { MysteryBox } from './mysteryBox.service';
export type { ApiResponse, RequestConfig } from './http.client';

// Export constants
export { API_BASE_URL, TOKEN_KEY, USER_INFO_KEY } from './api.config';
