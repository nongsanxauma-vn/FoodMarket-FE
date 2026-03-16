import { httpClient as api, ApiResponse } from './http.client';

export interface AddCartItemRequest {
    productId?: number;      // dùng khi thêm sản phẩm thường
    mysteryBoxId?: number;   // dùng khi thêm túi mù
    quantity: number;
}

export interface CartItemResponse {
    productId?: number;       // null nếu là mystery box
    mysteryBoxId?: number;    // null nếu là sản phẩm thường
    productName: string;      // tên sản phẩm hoặc boxType của túi mù
    quantity: number;
    price: number;
    imageUrl?: string;
    shopName?: string;
    itemType: 'PRODUCT' | 'MYSTERY_BOX'; // backend trả về để phân biệt
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

    // Cập nhật số lượng sản phẩm thường
    updateQuantity: async (productId: number, quantity: number): Promise<ApiResponse<CartResponse>> => {
        return await api.put<CartResponse>(`/cart/quantity?productId=${productId}&quantity=${quantity}`);
    },

    // Cập nhật số lượng túi mù
    updateMysteryBoxQuantity: async (mysteryBoxId: number, quantity: number): Promise<ApiResponse<CartResponse>> => {
        return await api.put<CartResponse>(`/cart/mystery-box/quantity?mysteryBoxId=${mysteryBoxId}&quantity=${quantity}`);
    },

    // Xóa sản phẩm thường
    removeItem: async (productId: number): Promise<ApiResponse<string>> => {
        return await api.delete<string>(`/cart/item/${productId}`);
    },

    // Xóa túi mù
    removeMysteryBox: async (mysteryBoxId: number): Promise<ApiResponse<string>> => {
        return await api.delete<string>(`/cart/mystery-box/${mysteryBoxId}`);
    },

    clearCart: async (): Promise<ApiResponse<string>> => {
        return await api.delete<string>('/cart/clear');
    }
};