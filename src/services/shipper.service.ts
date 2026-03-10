import { httpClient, ApiResponse } from './http.client';
import { API_BASE_URL, TOKEN_KEY } from './api.config';

// ===================== TYPES =====================

export interface ShipperRegisterRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  license: string;
  vehicleNumber: string;
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

/** Response từ GET /shipper/orders/nearby */
export interface AvailableOrderResponse {
  orderId: number;
  shopName: string;
  shopAddress: string;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  shippingFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  distanceKm: number | null; // khoảng cách thực tế từ Goong (null nếu không geocode được)
}

/** Response từ POST /shipper/orders/{id}/accept và /status */
export interface ShipperOrderResponse {
  orderId: number;
  buyerName: string;
  buyerPhone: string;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  shippingFee: number;
  status: string;
  createdAt: string;
  estimatedDeliveryDate: string | null;
  note: string | null;
}

export type UpdateOrderStatus = 'DELIVERED' | 'FAILED';

export interface UpdateOrderStatusRequest {
  status: UpdateOrderStatus;
  note?: string;
}

/** Response từ GET /shipper/location/order/{orderId} */
export interface ShipperLocationResponse {
  shipperId: number;
  shipperName: string;
  orderId: number;
  latitude: number;
  longitude: number;
  updatedAt: string;
  // ✅ Tọa độ điểm đến để vẽ đường trên map
  destLatitude?: number | null;
  destLongitude?: number | null;
}

// ===================== SERVICE =====================

class ShipperService {

  /**
   * Đăng ký tài khoản shipper
   */
  async register(
    shipperData: ShipperRegisterRequest,
    documents?: { driverLicense?: File; portrait?: File }
  ): Promise<ApiResponse<ShipperRegisterResponse>> {
    const formData = new FormData();
    formData.append('data', JSON.stringify({
      ...shipperData,
      roleName: 'SHIPPER',
    }));
    if (documents?.portrait) formData.append('logoUrl', documents.portrait);
    if (documents?.driverLicense) formData.append('achievement', documents.driverLicense);

    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw { status: response.status, data };
    return data;
  }

  /**
   * Lấy top 6 đơn gần nhất dựa vào GPS hiện tại của shipper
   * FE cần gọi navigator.geolocation trước, rồi truyền lat/lng vào đây
   */
  async getNearbyOrders(lat: number, lng: number): Promise<ApiResponse<AvailableOrderResponse[]>> {
    return httpClient.get<AvailableOrderResponse[]>(
      `/shipper/orders/nearby?lat=${lat}&lng=${lng}`
    );
  }

  /**
   * Shipper nhận đơn hàng
   */
  async acceptOrder(orderId: number): Promise<ApiResponse<ShipperOrderResponse>> {
    return httpClient.post<ShipperOrderResponse>(
      `/shipper/orders/${orderId}/accept`,
      {}
    );
  }

  /**
   * Cập nhật trạng thái đơn hàng (DELIVERED / FAILED)
   */
  async updateOrderStatus(
    orderId: number,
    request: UpdateOrderStatusRequest
  ): Promise<ApiResponse<ShipperOrderResponse>> {
    return httpClient.post<ShipperOrderResponse>(
      `/shipper/orders/${orderId}/status`,
      request
    );
  }

  /**
   * Xem tất cả đơn của shipper hiện tại
   */
  async getMyOrders(): Promise<ApiResponse<ShipperOrderResponse[]>> {
    return httpClient.get<ShipperOrderResponse[]>('/shipper/orders/my');
  }

  /**
   * Lấy vị trí shipper đang giao đơn (REST fallback, dùng khi mới mở trang)
   */
  async getShipperLocation(orderId: number): Promise<ApiResponse<ShipperLocationResponse>> {
    return httpClient.get<ShipperLocationResponse>(
      `/shipper/location/order/${orderId}`
    );
  }
}

export const shipperService = new ShipperService();