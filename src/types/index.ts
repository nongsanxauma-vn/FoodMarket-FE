
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

export enum OrderStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
