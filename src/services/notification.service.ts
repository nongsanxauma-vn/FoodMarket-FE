import { httpClient, ApiResponse } from './http.client';

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  receiverType?: string;
  isRead?: boolean;
}

export interface AdminSendNotificationRequest {
  title: string;
  content: string;
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
}

export const notificationService = new NotificationService();

