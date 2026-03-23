import { httpClient, ApiResponse } from "./http.client";

export enum ReturnStatus {
    PENDING = 'PENDING',
    SHOP_APPROVED = 'SHOP_APPROVED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    DISPUTED = 'DISPUTED',
    COMPLETED = 'COMPLETED',
    REFUND_PENDING = 'REFUND_PENDING'
}

export interface ReturnRequestResponse {
    id: number;
    orderDetail: {
        id: number;
        productName: string;
        unitPrice: number;
        quantity: number;
    };
    buyer: any;
    shopOwner: any;
    reason: string;
    evidence: string;
    shopResponse?: string;
    adminRemark?: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    refundAmount: number;
    orderId: number;
    status: ReturnStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ReturnCreateRequest {
    orderDetailId: number;
    reason: string;
}

export interface ReturnActionRequest {
    response: string;
    accept: boolean;
    refundAmount?: number;
}

export interface ReturnActionResponse {
    request: ReturnRequestResponse;
    qrCodeUrl?: string;
    checkoutUrl?: string;
}

export const returnService = {
    create: async (data: ReturnCreateRequest, evidence?: File): Promise<ApiResponse<ReturnRequestResponse>> => {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (evidence) formData.append('evidence', evidence);
        return httpClient.post('/returns', formData);
    },
    getMyReturns: async (): Promise<ApiResponse<ReturnRequestResponse[]>> => {
        return httpClient.get('/returns/me');
    },
    getShopReturns: async (): Promise<ApiResponse<ReturnRequestResponse[]>> => {
        return httpClient.get('/returns/shop');
    },
    getDisputes: async (): Promise<ApiResponse<ReturnRequestResponse[]>> => {
        return httpClient.get('/returns/disputes');
    },
    shopAction: async (id: number, data: ReturnActionRequest): Promise<ApiResponse<ReturnActionResponse>> => {
        return httpClient.put(`/returns/${id}/shop-action`, data);
    },
    dispute: async (id: number, reason: string): Promise<ApiResponse<ReturnRequestResponse>> => {
        return httpClient.put(`/returns/${id}/dispute?reason=${encodeURIComponent(reason)}`, {});
    },
    adminAction: async (id: number, data: ReturnActionRequest): Promise<ApiResponse<ReturnActionResponse>> => {
        return httpClient.put(`/returns/${id}/admin-action`, data);
    },
    getById: async (id: number): Promise<ApiResponse<ReturnRequestResponse>> => {
        return httpClient.get(`/returns/${id}`);
    },
    checkPayoutStatus: async (id: number): Promise<ApiResponse<ReturnActionResponse>> => {
        return httpClient.get(`/returns/${id}/check-payout`);
    },
    autoCheckPayout: async (orderCode: number): Promise<ApiResponse<ReturnActionResponse>> => {
        return httpClient.get('/returns/auto-check-payout', { params: { orderCode } });
    }
};
