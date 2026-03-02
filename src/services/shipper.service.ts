/**
 * Shipper Service
 * Xử lý các chức năng liên quan đến shipper
 */

import { httpClient, ApiResponse } from './http.client';
import { API_BASE_URL, TOKEN_KEY } from './api.config';

/**
 * Request/Response Types
 */
export interface ShipperRegisterRequest {
  // Thông tin cá nhân
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;

  // Thông tin phương tiện (shipper specific)
  license: string; // Số bằng lái xe
  vehicleNumber: string; // Biển số xe

  // Thông tin bổ sung (không bắt buộc)
  bankAccount?: string;
  description?: string;
}

export interface ShipperRegisterResponse {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: string;
}

/**
 * Shipper Service Class
 */
class ShipperService {
  /**
   * Đăng ký tài khoản shipper mới
   * Backend sử dụng multipart/form-data format
   */
  async register(shipperData: ShipperRegisterRequest, documents?: {
    driverLicense?: File;
    vehicleRegistration?: File;
    portrait?: File;
  }): Promise<ApiResponse<ShipperRegisterResponse>> {
    try {
      const formData = new FormData();

      // Tạo data object với roleName là SHIPPER
      const data = {
        email: shipperData.email,
        password: shipperData.password,
        roleName: 'SHIPPER',
        fullName: shipperData.fullName,
        phoneNumber: shipperData.phoneNumber,
        address: shipperData.address,
        license: shipperData.license,
        vehicleNumber: shipperData.vehicleNumber,
        bankAccount: shipperData.bankAccount,
        description: shipperData.description,
      };

      // Thêm data dưới dạng JSON string
      formData.append('data', JSON.stringify(data));

      // Thêm các file documents nếu có
      // BE expects: logoUrl (chân dung) and achievement (bằng lái xe)
      if (documents?.portrait) formData.append('logoUrl', documents.portrait);
      if (documents?.driverLicense) formData.append('achievement', documents.driverLicense);
      // Note: vehicleRegistration chưa có field tương ứng ở BE

      // Gọi API với fetch trực tiếp vì cần multipart/form-data
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        body: formData,
        // Không set Content-Type header, để browser tự động set với boundary
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          data: responseData,
        };
      }

      return responseData;
    } catch (error) {
      console.error('Shipper register error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const shipperService = new ShipperService();
