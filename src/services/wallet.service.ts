import { httpClient, ApiResponse } from './http.client';

export interface WalletResponse {
    id: number;
    shopOwnerId: number;
    status: string;
    totalBalance: number;
    frozenBalance: number;
    totalRevenueAllTime: number;
    totalWithdrawn: number;
    commissionWallet: number;
    createAt: string;
}

export interface WithdrawRequestCreationRequest {
    amount: number;
    reason?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
}

export interface WithdrawRequestResponse {
    id: number;
    amount: number;
    fee: number;
    receiveAmount: number;
    reason: string;
    status: string;
    adminNote?: string;
    processedAt?: string;
    walletId: number;
    shopOwnerId: number;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
    qrCodeUrl?: string;
    checkoutUrl?: string;
}

class WalletService {
    async getMyWallet(): Promise<ApiResponse<WalletResponse>> {
        return httpClient.get<WalletResponse>('/wallets/me');
    }

    async createWithdrawRequest(data: WithdrawRequestCreationRequest): Promise<ApiResponse<WithdrawRequestResponse>> {
        return httpClient.post<WithdrawRequestResponse>('/wallets/withdraw-requests', data);
    }

    async getMyWithdrawRequests(): Promise<ApiResponse<WithdrawRequestResponse[]>> {
        return httpClient.get<WithdrawRequestResponse[]>('/wallets/withdraw-requests/my');
    }

    // Admin endpoints
    async getAllPendingWithdrawRequests(): Promise<ApiResponse<WithdrawRequestResponse[]>> {
        return httpClient.get<WithdrawRequestResponse[]>('/wallets/withdraw-requests/pending');
    }

    async getAllWithdrawRequests(): Promise<ApiResponse<WithdrawRequestResponse[]>> {
        return httpClient.get<WithdrawRequestResponse[]>('/wallets/withdraw-requests');
    }

    async confirmWithdrawSuccess(id: number, note?: string): Promise<ApiResponse<WithdrawRequestResponse>> {
        const params = note ? { note } : {};
        return httpClient.put<WithdrawRequestResponse>(`/wallets/withdraw-requests/${id}/confirm-success`, null, { params });
    }

    async rejectWithdraw(id: number, note?: string): Promise<ApiResponse<WithdrawRequestResponse>> {
        const params = note ? { note } : {};
        return httpClient.put<WithdrawRequestResponse>(`/wallets/withdraw-requests/${id}/reject`, null, { params });
    }

    async createWithdrawQr(id: number): Promise<ApiResponse<WithdrawRequestResponse>> {
        return httpClient.post<WithdrawRequestResponse>(`/wallets/withdraw-requests/${id}/create-qr`);
    }
}

export const walletService = new WalletService();
