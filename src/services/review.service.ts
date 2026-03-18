import { httpClient, ApiResponse } from './http.client';
import { PageResponse } from './product.service';

export interface ReviewResponse {
    id: number;
    buyerId: number;
    fullName?: string;
    shopOwnerId: number;
    orderDetailId: number;
    ratingStar: number;
    comment: string;
    evidence?: string;
    replyFromShop?: string;
}

export interface ReviewCreateRequest {
    orderDetailId?: number;
    mysteryBoxId?: number;
    ratingStar: number;
    comment: string;
}

export interface ReviewReplyRequest {
    replyFromShop: string;
}

class ReviewService {
    async getAll(): Promise<ApiResponse<ReviewResponse[]>> {
        return httpClient.get<ReviewResponse[]>('/reviews');
    }

    async getById(id: number): Promise<ApiResponse<ReviewResponse>> {
        return httpClient.get<ReviewResponse>(`/reviews/${id}`);
    }

    async getByShopId(shopId: number): Promise<ApiResponse<ReviewResponse[]>> {
        return httpClient.get<ReviewResponse[]>(`/reviews/shop/${shopId}`);
    }

    async getByShopIdPaged(shopId: number, page = 0, size = 10): Promise<ApiResponse<PageResponse<ReviewResponse>>> {
        return httpClient.get<PageResponse<ReviewResponse>>(`/reviews/shop/${shopId}/paged?page=${page}&size=${size}`);
    }

    async createReview(data: ReviewCreateRequest, evidence?: File): Promise<ApiResponse<ReviewResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (evidence) formData.append('evidence', evidence);
        return httpClient.post<ReviewResponse>('/reviews', formData);
    }

    async updateReview(id: number, data: Partial<ReviewCreateRequest>, evidence?: File): Promise<ApiResponse<ReviewResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (evidence) formData.append('evidence', evidence);
        return httpClient.put<ReviewResponse>(`/reviews/${id}`, formData);
    }

    async deleteReview(id: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`/reviews/${id}`);
    }

    async replyReview(id: number, request: ReviewReplyRequest): Promise<ApiResponse<ReviewResponse>> {
        return httpClient.post<ReviewResponse>(`/reviews/${id}/reply`, request);
    }
}

export const reviewService = new ReviewService();
