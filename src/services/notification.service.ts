import { httpClient, ApiResponse } from './http.client';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  evidence?: string;
  createAt: string;
  receiverType?: string;
  isRead?: boolean;
  adminId?: number;
  adminName?: string;
}

export interface AdminSendNotificationRequest {
  title: string;
  message: string;
  receiverTypes: string[];
}

class NotificationService {
  async getMyNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    return httpClient.get<NotificationItem[]>('/api/notifications/my');
  }

  async getAllNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    return httpClient.get<NotificationItem[]>('/api/notifications/all');
  }

  async adminSendToGroups(
    payload: AdminSendNotificationRequest
  ): Promise<ApiResponse<void>> {
    return httpClient.post<void>('/api/notifications/admin/send-to-groups', payload);
  }

  async markAsRead(id: number): Promise<ApiResponse<void>> {
    return httpClient.put<void>(`/api/notifications/${id}/read`);
  }

  async deleteNotification(id: number): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/api/notifications/${id}`);
  }
}

export const notificationService = new NotificationService();

