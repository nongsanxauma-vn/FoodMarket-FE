import { httpClient, ApiResponse } from './http.client';

export interface ProductResponse {
    id: number;
    productName: string;
    unit: string;
    sellingPrice: number;
    stockQuantity: number;
    description: string;
    imageUrl: string;
}

export interface ProductCreationRequest {
    productName: string;
    unit: string;
    sellingPrice: number;
    stockQuantity: number;
    description: string;
    imageUrl?: string;
    categoryId?: number;
}

class ProductService {
    async getAll(): Promise<ApiResponse<ProductResponse[]>> {
        return httpClient.get<ProductResponse[]>('/products');
    }

    async getById(id: number): Promise<ApiResponse<ProductResponse>> {
        return httpClient.get<ProductResponse>(`/products/${id}`);
    }

    async createProduct(data: ProductCreationRequest): Promise<ApiResponse<ProductResponse>> {
        return httpClient.post<ProductResponse>('/products', data);
    }

    async updateProduct(id: number, data: Partial<ProductCreationRequest>): Promise<ApiResponse<ProductResponse>> {
        return httpClient.put<ProductResponse>(`/products/${id}`, data);
    }

    async deleteProduct(id: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`/products/${id}`);
    }
}

export const productService = new ProductService();
