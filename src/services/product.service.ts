import { httpClient, ApiResponse } from './http.client';

export interface ProductResponse {
    id: number;
    productName: string;
    unit: string;
    sellingPrice: number;
    stockQuantity: number;
    description: string;
    imageUrl: string;
    status?: string;
    shopOwnerId?: number;
    shopId?: number;
    shopName?: string;
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

    async getByShopId(shopId: number): Promise<ApiResponse<ProductResponse[]>> {
        return httpClient.get<ProductResponse[]>(`/products/shop/${shopId}`);
    }

    async createProduct(data: ProductCreationRequest, image?: File): Promise<ApiResponse<ProductResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (image) {
            formData.append('image', image);
        }
        return httpClient.post<ProductResponse>('/products', formData);
    }

    async updateProduct(id: number, data: Partial<ProductCreationRequest>, image?: File): Promise<ApiResponse<ProductResponse>> {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (image) {
            formData.append('image', image);
        }
        return httpClient.put<ProductResponse>(`/products/${id}`, formData);
    }

    async deleteProduct(id: number): Promise<ApiResponse<void>> {
        return httpClient.delete<void>(`/products/${id}`);
    }
}

export const productService = new ProductService();
