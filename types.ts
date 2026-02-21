
export const AppRole = {
  BUYER: 'BUYER',
  FARMER: 'FARMER',
  ADMIN: 'ADMIN',
  SHIPPER: 'SHIPPER'
} as const;
export type AppRole = typeof AppRole[keyof typeof AppRole];

export const KYCStatus = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;
export type KYCStatus = typeof KYCStatus[keyof typeof KYCStatus];

export interface User {
  id: string;
  name: string;
  role: AppRole;
  avatar: string;
  email: string;
  kycStatus: KYCStatus;
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

export const OrderStatus = {
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
