import { httpClient, ApiResponse } from './http.client';

export interface CreatePaymentRequest {
    orderId: number;
    amount: number;
    method?: string;
    paymentGateway?: string;
}

export interface PaymentResponse {
    id: number;
    orderId: number;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId?: string;
    payOsCheckoutUrl?: string; // Tùy thuộc vào design BE trả về gì, nhưng ta cứ đón nhận URL nếu có
}

class PaymentService {
    async createPayment(data: CreatePaymentRequest): Promise<ApiResponse<PaymentResponse>> {
        return httpClient.post<PaymentResponse>('/payments', data);
    }

    async getById(id: number): Promise<ApiResponse<PaymentResponse>> {
        return httpClient.get<PaymentResponse>(`/payments/${id}`);
    }

    async updateStatus(id: number, status: string): Promise<ApiResponse<PaymentResponse>> {
        return httpClient.put<PaymentResponse>(`/payments/${id}/status`, null, { params: { status } });
    }

    async createPaymentPayOS(data: CreatePaymentRequest): Promise<ApiResponse<PaymentResponse>> {
        return httpClient.post<PaymentResponse>('/payments/payos', data);
    }
}

export const paymentService = new PaymentService();
