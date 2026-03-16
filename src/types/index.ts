
export enum AppRole {
  BUYER = 'BUYER',
  FARMER = 'FARMER',
  ADMIN = 'ADMIN',
  SHIPPER = 'SHIPPER'
}

export enum KYCStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  role: AppRole;
  avatar: string;
  email: string;
  kycStatus: KYCStatus;
  phone?: string;
  address?: string;
  shopName?: string;
  bankAccount?: string;
  description?: string;
  achievement?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  farm: string;
  distance: string;
  rating: number;
  soldCount: number;
  stock: number;
  expiry: string;
  description?: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface OrderItem {
  name: string;
  quantity: string;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',   // Farmer xác nhận → đang chuẩn bị hàng (BE enum)
  PREPARING = 'PREPARING',  // Alias UI-only (FE dùng để hiển thị thân thiện hơn)
  PAID = 'PAID',             // Đơn QR đã thanh toán thành công, chờ Farmer xác nhận
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',         // Giao thất bại / boom hàng
}

export interface ComboDish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  image: string;
  difficulty: 'Dễ' | 'Vừa' | 'Khó';
  cookingTime: string;
}


export interface CookingCombo {
  id: string;
  name: string;
  description: string;
  farm: string;
  farmImage: string;
  selectedIngredients: string[]; // Product IDs
  suggestedDishes: ComboDish[];
  price: number;
  image: string;
  rating: number;
  soldCount: number;
  createdDate: string;
}

// Build Plan Types
export interface BuildPlanResponse {
  id: number;
  buyerId: number;
  planName: string;
  planType: string;
  mealName: string;
  targetBudget: number;
  items: BuildPlanItemResponse[];
}

export interface BuildPlanItemResponse {
  id: number;
  mealName: string;
  mealTime: string;
  description?: string;
  completed: boolean;
  productId?: number;
  productName?: string;
}

export interface BuildPlanCreateRequest {
  planName: string;
  mealName: string;
  planType: 'DAILY' | 'WEEKLY';
  targetBudget: number;
}

export interface BuildPlanItemCreateRequest {
  mealName: string;
  mealTime: string;
  description?: string;
  productIds: number[]; // BE expects List<Integer>
}
