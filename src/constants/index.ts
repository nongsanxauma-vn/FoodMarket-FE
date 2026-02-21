
import { Product, Order, OrderStatus, CookingCombo, ComboDish } from '../types/index';

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
  }
];

// Dish suggestions based on ingredients
export const DISH_SUGGESTIONS: { [key: string]: ComboDish[] } = {
  '1': [ // Cà chua
    {
      id: 'd1',
      name: 'Canh Cà Chua Trứng',
      description: 'Các mặt nước ngọt với cà chua tươi, trứng và nấm',
      ingredients: ['1'],
      image: 'https://picsum.photos/seed/soup/400/400',
      difficulty: 'Dễ',
      cookingTime: '15 phút'
    },
    {
      id: 'd2',
      name: 'Salad Cà Chua Mozzarella',
      description: 'Salad cà chua tươi với phô mai mozzarella và dầu ô liu',
      ingredients: ['1'],
      image: 'https://picsum.photos/seed/salad/400/400',
      difficulty: 'Dễ',
      cookingTime: '5 phút'
    },
    {
      id: 'd3',
      name: 'Cà Chua Nướng Nhân',
      description: 'Cà chua nướng chế biến truyền thống, tươi ngon',
      ingredients: ['1'],
      image: 'https://picsum.photos/seed/roasted/400/400',
      difficulty: 'Vừa',
      cookingTime: '25 phút'
    }
  ],
  '2': [ // Cải bẹ xanh
    {
      id: 'd4',
      name: 'Cải Xanh Xào Tỏi',
      description: 'Cải bẹ xanh xào với tỏi, mềm ngọt',
      ingredients: ['2'],
      image: 'https://picsum.photos/seed/stir-fry/400/400',
      difficulty: 'Dễ',
      cookingTime: '10 phút'
    },
    {
      id: 'd5',
      name: 'Canh Cải Xanh Cua',
      description: 'Canh thanh từ từ với cải xanh tươi và cua biển',
      ingredients: ['2'],
      image: 'https://picsum.photos/seed/soup/400/400',
      difficulty: 'Vừa',
      cookingTime: '20 phút'
    },
    {
      id: 'd6',
      name: 'Cải Xanh Luộc Nước Tương',
      description: 'Cải xanh luộc vàng với nước tương chua ngọt',
      ingredients: ['2'],
      image: 'https://picsum.photos/seed/vegetable/400/400',
      difficulty: 'Dễ',
      cookingTime: '8 phút'
    }
  ],
  '3': [ // Bưởi
    {
      id: 'd7',
      name: 'Salad Bưởi Tôm',
      description: 'Salad bưởi tươi kết hợp với tôm sú, vị chua ngọt hấp dẫn',
      ingredients: ['3'],
      image: 'https://picsum.photos/seed/pomelo-salad/400/400',
      difficulty: 'Vừa',
      cookingTime: '15 phút'
    },
    {
      id: 'd8',
      name: 'Bưởi Xào Gừng',
      description: 'Bưởi xào với gừng, hành tây, vị thơm lạ',
      ingredients: ['3'],
      image: 'https://picsum.photos/seed/stir-fry/400/400',
      difficulty: 'Vừa',
      cookingTime: '12 phút'
    }
  ],
  '4': [ // Khoai lang
    {
      id: 'd9',
      name: 'Khoai Lang Nướng Còi',
      description: 'Khoai lang nướng nguyên vỏ, dẻo ngon',
      ingredients: ['4'],
      image: 'https://picsum.photos/seed/roasted-potato/400/400',
      difficulty: 'Dễ',
      cookingTime: '30 phút'
    },
    {
      id: 'd10',
      name: 'Cơm Chiên Khoai Lang',
      description: 'Cơm chiên với khoai lang, xu hướng ăn lành mạnh',
      ingredients: ['4'],
      image: 'https://picsum.photos/seed/fried-rice/400/400',
      difficulty: 'Vừa',
      cookingTime: '18 phút'
    },
    {
      id: 'd11',
      name: 'Chè Khoai Lang Nước Cốt Dừa',
      description: 'Chè ngọt từ khoai lang với nước cốt dừa thơm',
      ingredients: ['4'],
      image: 'https://picsum.photos/seed/dessert/400/400',
      difficulty: 'Dễ',
      cookingTime: '25 phút'
    }
  ]
};

export const MOCK_COMBOS: CookingCombo[] = [
  {
    id: 'combo-1',
    name: 'Combo Salad Tươi Mát',
    description: 'Bộ combo salad hoàn chỉnh với các rau tươi, tốt cho sức khỏe',
    farm: 'Vườn Chú Bảy - Đà Lạt',
    farmImage: 'https://picsum.photos/seed/farm/100/100',
    selectedIngredients: ['1', '2'],
    suggestedDishes: [
      {
        id: 'd2',
        name: 'Salad Cà Chua Mozzarella',
        description: 'Salad cà chua với phô mai mozzarella',
        ingredients: ['1'],
        image: 'https://picsum.photos/seed/salad/400/400',
        difficulty: 'Dễ',
        cookingTime: '5 phút'
      },
      {
        id: 'd5',
        name: 'Canh Cải Xanh Cua',
        description: 'Canh thanh từ từ với cải xanh tươi',
        ingredients: ['2'],
        image: 'https://picsum.photos/seed/soup/400/400',
        difficulty: 'Vừa',
        cookingTime: '20 phút'
      }
    ],
    price: 95000,
    image: 'https://picsum.photos/seed/combo1/400/400',
    rating: 4.8,
    soldCount: 320,
    createdDate: '2024-01-15'
  }
];

