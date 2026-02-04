
import type { Product, Order } from './types';
import { OrderStatus } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cà chua Bi vườn hữu cơ',
    category: 'Rau ăn quả',
    price: 38250,
    originalPrice: 45000,
    unit: '1kg',
    image: 'https://picsum.photos/seed/tomato/400/400',
    farm: 'Vườn Chú Bảy - Đà Lạt',
    distance: '3.5 km',
    rating: 4.9,
    soldCount: 1200,
    stock: 50,
    expiry: '3-5 ngày'
  },
  {
    id: '2',
    name: 'Cải bẹ xanh Đà Lạt',
    category: 'Rau ăn lá',
    price: 25000,
    unit: '1kg',
    image: 'https://picsum.photos/seed/lettuce/400/400',
    farm: 'Vườn Chú Tư',
    distance: '1.2 km',
    rating: 4.8,
    soldCount: 850,
    stock: 100,
    expiry: '2 ngày'
  },
  {
    id: '3',
    name: 'Bưởi Da Xanh Bến Tre',
    category: 'Trái cây',
    price: 85000,
    unit: 'Quả',
    image: 'https://picsum.photos/seed/pomelo/400/400',
    farm: 'Vườn Trái Cây Miền Tây',
    distance: '5.1 km',
    rating: 4.7,
    soldCount: 420,
    stock: 30,
    expiry: '10 ngày'
  },
  {
    id: '4',
    name: 'Khoai Lang Mật Đà Lạt',
    category: 'Củ & hạt',
    price: 32000,
    unit: '1kg',
    image: 'https://picsum.photos/seed/potato/400/400',
    farm: 'Nhà Vườn Hóc Môn',
    distance: '0.8 km',
    rating: 4.8,
    soldCount: 1560,
    stock: 200,
    expiry: '15 ngày'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-5521',
    date: '14:20, 24/10/2023',
    status: OrderStatus.PENDING,
    total: 285000,
    items: [
      { name: 'Xà lách thủy canh', quantity: '2kg', price: 45000 },
      { name: 'Cà rốt hữu cơ', quantity: '3kg', price: 65000 }
    ],
    customer: {
      name: 'Nguyễn Thị Thu Hà',
      phone: '0908 *** 123',
      address: 'Quận 7, TP.HCM'
    }
  },
  {
    id: 'ORD-5518',
    date: '10:15, 24/10/2023',
    status: OrderStatus.SHIPPING,
    total: 150000,
    items: [
      { name: 'Blind Box Rau Củ', quantity: '2 túi', price: 75000 }
    ],
    customer: {
      name: 'Lê Văn Hùng',
      phone: '0934 *** 889',
      address: 'Quận 1, TP.HCM'
    }
  }
];
