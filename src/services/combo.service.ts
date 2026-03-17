import { httpClient, ApiResponse } from './http.client';

export interface ProductComboRequest {
    productId: number;
    quantity: number;
}

export type Region = 'MIEN_BAC' | 'MIEN_TRUNG' | 'MIEN_NAM';

export interface BuildComboCreationRequest {
    comboName: string;
    discountPrice: number;
    description: string;
    type: string;
    region?: Region;
    items: ProductComboRequest[];
}

export interface BuildComboUpdateRequest extends BuildComboCreationRequest { }

export interface ProductComboResponse {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface BuildComboResponse {
    id: number;
    comboName: string;
    discountPrice: number;
    description: string;
    type: string;
    region?: Region;
    shopOwnerId: number;
    items: ProductComboResponse[];
}

class ComboService {
    private readonly baseUrl = '/build-combos';

    async getAll(): Promise<ApiResponse<BuildComboResponse[]>> {
        const response = await httpClient.get<BuildComboResponse[]>(this.baseUrl);
        return response;
    }

    async create(request: BuildComboCreationRequest): Promise<ApiResponse<BuildComboResponse>> {
        console.log('[ComboService] create payload:', JSON.stringify(request));
        const response = await httpClient.post<BuildComboResponse>(this.baseUrl, request);
        return response;
    }

    async update(id: number, request: BuildComboUpdateRequest): Promise<ApiResponse<BuildComboResponse>> {
        console.log('[ComboService] update payload:', JSON.stringify(request));
        const response = await httpClient.put<BuildComboResponse>(`${this.baseUrl}/${id}`, request);
        return response;
    }

    async delete(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<void>(`${this.baseUrl}/${id}`);
        return response;
    }

    async getById(id: number): Promise<ApiResponse<BuildComboResponse>> {
        const response = await httpClient.get<BuildComboResponse>(`${this.baseUrl}/${id}`);
        return response;
    }

    async getByShop(shopId: number): Promise<ApiResponse<BuildComboResponse[]>> {
        const response = await httpClient.get<BuildComboResponse[]>(`${this.baseUrl}/shop/${shopId}`);
        return response;
    }

    async getMyCombos(): Promise<ApiResponse<BuildComboResponse[]>> {
        const response = await httpClient.get<BuildComboResponse[]>(`${this.baseUrl}/my-combos`);
        return response;
    }
}

export const comboService = new ComboService();
