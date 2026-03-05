import { httpClient as api, ApiResponse } from './http.client';

export interface AddCartItemRequest {
    productId: number;
    quantity: number;
}

export interface CartItemResponse {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string; // Opt-in, since we might need to fetch this or backend might add it later
}

export interface CartResponse {
    cartId: number;
    items: CartItemResponse[];
    totalAmount: number;
}

export const cartService = {
    getCart: async (): Promise<ApiResponse<CartResponse>> => {
        return await api.get<CartResponse>('/cart');
    },

    addToCart: async (data: AddCartItemRequest): Promise<ApiResponse<CartResponse>> => {
        return await api.post<CartResponse>('/cart/add', data);
    },

    updateQuantity: async (productId: number, quantity: number): Promise<ApiResponse<CartResponse>> => {
        return await api.put<CartResponse>(`/cart/quantity?productId=${productId}&quantity=${quantity}`);
    },

    removeItem: async (productId: number): Promise<ApiResponse<string>> => {
        return await api.delete<string>(`/cart/item/${productId}`);
    },

    clearCart: async (): Promise<ApiResponse<string>> => {
        return await api.delete<string>('/cart/clear');
    }
};
