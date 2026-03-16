import { httpClient, ApiResponse } from './http.client';

export interface OrderItemRequest {
    productId?: number;
    mysteryBoxId?: number;
    quantity: number;
}

export interface OrderCreationRequest {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: string;
    items: OrderItemRequest[];
}

export interface OrderItemResponse {
    orderDetailId?: number;
    productId?: number;
    mysteryBoxId?: number;
    productName?: string;
    mysteryBoxType?: string;
    quantity: number;
    unitPrice: number;
    itemType: 'PRODUCT' | 'MYSTERY_BOX';
    category?: string; // Added for personalization
}

export interface OrderResponse {
    id: number;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    note: string;
    shippingFee: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItemResponse[];
}

class OrderService {
    async getAllOrders(): Promise<ApiResponse<OrderResponse[]>> {
        return httpClient.get<OrderResponse[]>('/orders');
    }

    async getOrdersByUserId(userId: number): Promise<ApiResponse<OrderResponse[]>> {
        return httpClient.get<OrderResponse[]>(`/orders/user/${userId}`);
    }

    async getOrderById(id: number): Promise<ApiResponse<OrderResponse>> {
        return httpClient.get<OrderResponse>(`/orders/${id}`);
    }

    async createOrder(data: OrderCreationRequest): Promise<ApiResponse<OrderResponse>> {
        return httpClient.post<OrderResponse>('/orders', data);
    }

    async updateOrder(id: number, data: { status: string }): Promise<ApiResponse<OrderResponse>> {
        console.log('[OrderService] Updating order:', id, 'with data:', data);
        return httpClient.patch<OrderResponse>(`/orders/${id}`, data);
    }

    async deleteOrder(id: number): Promise<ApiResponse<string>> {
        return httpClient.delete<string>(`/orders/${id}`);
    }
}

export const orderService = new OrderService();
