import { httpClient, ApiResponse } from './http.client';
import { UserResponse } from './auth.service';

class UserService {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers(): Promise<ApiResponse<UserResponse[]>> {
    return httpClient.get<UserResponse[]>('/users');
  }

  /**
   * Get user by ID (Admin only)
   */
  async getUserById(userId: number): Promise<ApiResponse<UserResponse>> {
    return httpClient.get<UserResponse>(`/users/${userId}`);
  }

  /**
   * Approve shop owner (Admin only)
   */
  async approveShopOwner(userId: number): Promise<ApiResponse<UserResponse>> {
    return httpClient.patch<UserResponse>(`/users/${userId}/approve-shop-owner`, {});
  }

  /**
   * Approve shipper (Admin only)
   */
  async approveShipper(userId: number): Promise<ApiResponse<UserResponse>> {
    return httpClient.patch<UserResponse>(`/users/${userId}/approve-shipper`, {});
  }

  /**
   * Activate user (Admin only)
   */
  async activateUser(userId: number): Promise<ApiResponse<void>> {
    return httpClient.patch<void>(`/users/${userId}/activate`, {});
  }

  /**
   * Deactivate user (Admin only)
   */
  async deactivateUser(userId: number): Promise<ApiResponse<void>> {
    return httpClient.patch<void>(`/users/${userId}/deactivate`, {});
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/users/${userId}`);
  }
}

export const userService = new UserService();
