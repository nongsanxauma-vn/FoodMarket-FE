/**
 * User Service
 * Xử lý các chức năng quản lý user (Admin)
 */

import { httpClient, ApiResponse } from './http.client';
import { UserResponse } from './auth.service';

/**
 * User Service Class
 */
class UserService {
  /**
   * Lấy thông tin user theo ID (Admin only)
   */
  async getUserById(userId: number): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await httpClient.get<UserResponse>(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách tất cả users (Admin only)
   */
  async getAllUsers(): Promise<ApiResponse<UserResponse[]>> {
    try {
      const response = await httpClient.get<UserResponse[]>('/users');
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin user (Admin only)
   */
  async updateUser(
    userId: number,
    userData: Partial<UserResponse>
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await httpClient.put<UserResponse>(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Xóa user (Admin only)
   */
  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.delete<void>(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Kích hoạt user (Admin only)
   */
  async activateUser(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.patch<void>(`/users/${userId}/activate`);
      return response;
    } catch (error) {
      console.error('Activate user error:', error);
      throw error;
    }
  }

  /**
   * Vô hiệu hóa user (Admin only)
   */
  async deactivateUser(userId: number): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.patch<void>(`/users/${userId}/deactivate`);
      return response;
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
