import { httpClient, ApiResponse } from './http.client';

export interface ProductResponse {
    id: number;
    productId?: number; // some endpoints return productId instead of id
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

// Normalize product to always have a valid numeric id
function normalizeProduct(p: ProductResponse): ProductResponse {
    return { ...p, id: p.id || p.productId || 0 };
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
        const res = await httpClient.get<ProductResponse[]>('/products');
        if (res.result) res.result = res.result.map(normalizeProduct);
        return res;
    }

    async getById(id: number): Promise<ApiResponse<ProductResponse>> {
        const res = await httpClient.get<ProductResponse>(`/products/${id}`);
        if (res.result) res.result = normalizeProduct(res.result);
        return res;
    }

    async getByShopId(shopId: number): Promise<ApiResponse<ProductResponse[]>> {
        const res = await httpClient.get<ProductResponse[]>(`/products/shop/${shopId}`);
        if (res.result) res.result = res.result.map(normalizeProduct);
        return res;
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
