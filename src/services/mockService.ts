/**
 * Mock data service for Yunnan Taste Mini-Program
 * Provides mock data for development and testing
 */

import { getApiConfig } from '../config/env';
import { Product, Category } from '../store/ProductStore';
import { UserProfile, Address } from '../store/UserStore';

// Mock product data
const mockProducts: Product[] = [
  {
    id: 'p1',
    title: '云南普洱茶 - 古树熟茶',
    price: 128.00,
    originalPrice: 168.00,
    image: 'https://example.com/products/tea1.jpg',
    images: [
      'https://example.com/products/tea1.jpg',
      'https://example.com/products/tea1_detail1.jpg',
      'https://example.com/products/tea1_detail2.jpg'
    ],
    description: '采自云南西双版纳千年古树，经传统工艺精制而成的优质熟茶，口感醇厚回甘。',
    categoryId: 'c1',
    tags: ['普洱茶', '熟茶', '古树茶'],
    rating: 4.8,
    sold: 1256,
    featured: true,
    specifications: [
      {
        name: '规格',
        options: ['357g饼', '200g小饼', '50g小沱']
      },
      {
        name: '年份',
        options: ['2023年', '2022年', '2021年']
      }
    ]
  },
  {
    id: 'p2',
    title: '野生松茸 - 新鲜直发',
    price: 299.00,
    originalPrice: 399.00,
    image: 'https://example.com/products/mushroom1.jpg',
    images: [
      'https://example.com/products/mushroom1.jpg',
      'https://example.com/products/mushroom1_detail1.jpg',
      'https://example.com/products/mushroom1_detail2.jpg'
    ],
    description: '云南高海拔地区野生松茸，48小时内采摘直发，保持最佳风味和营养价值。',
    categoryId: 'c2',
    tags: ['松茸', '野生菌', '新鲜'],
    rating: 4.9,
    sold: 876,
    featured: true,
    specifications: [
      {
        name: '规格',
        options: ['精品礼盒500g', '家庭装300g', '尝鲜装100g']
      }
    ]
  },
  {
    id: 'p3',
    title: '云南小粒咖啡豆',
    price: 68.00,
    originalPrice: 88.00,
    image: 'https://example.com/products/coffee1.jpg',
    images: [
      'https://example.com/products/coffee1.jpg',
      'https://example.com/products/coffee1_detail1.jpg',
      'https://example.com/products/coffee1_detail2.jpg'
    ],
    description: '云南保山小粒咖啡豆，中度烘焙，具有独特的果香和巧克力风味。',
    categoryId: 'c3',
    tags: ['咖啡豆', '小粒咖啡', '中度烘焙'],
    rating: 4.7,
    sold: 2341,
    featured: false,
    specifications: [
      {
        name: '规格',
        options: ['454g袋装', '227g袋装', '1kg袋装']
      },
      {
        name: '研磨度',
        options: ['咖啡豆', '粗研磨', '中研磨', '细研磨']
      }
    ]
  },
  {
    id: 'p4',
    title: '云南黑糖玫瑰花茶',
    price: 45.00,
    originalPrice: 59.00,
    image: 'https://example.com/products/rosetea1.jpg',
    images: [
      'https://example.com/products/rosetea1.jpg',
      'https://example.com/products/rosetea1_detail1.jpg',
      'https://example.com/products/rosetea1_detail2.jpg'
    ],
    description: '精选云南高原玫瑰花与黑糖手工制作，具有调理气血、美容养颜的功效。',
    categoryId: 'c1',
    tags: ['花茶', '玫瑰花', '黑糖'],
    rating: 4.6,
    sold: 1892,
    featured: false,
    specifications: [
      {
        name: '规格',
        options: ['150g罐装', '300g罐装', '10g*12袋装']
      }
    ]
  },
  {
    id: 'p5',
    title: '傣族手工银饰手镯',
    price: 328.00,
    originalPrice: 398.00,
    image: 'https://example.com/products/silver1.jpg',
    images: [
      'https://example.com/products/silver1.jpg',
      'https://example.com/products/silver1_detail1.jpg',
      'https://example.com/products/silver1_detail2.jpg'
    ],
    description: '云南傣族传统工艺制作的纯银手镯，每件都是独特的艺术品，展现少数民族文化魅力。',
    categoryId: 'c4',
    tags: ['银饰', '手工', '傣族'],
    rating: 4.9,
    sold: 562,
    featured: true,
    specifications: [
      {
        name: '款式',
        options: ['孔雀纹', '花卉纹', '传统纹']
      },
      {
        name: '尺寸',
        options: ['小号', '中号', '大号']
      }
    ]
  }
];

// Mock category data
const mockCategories: Category[] = [
  {
    id: 'c1',
    title: '茶叶',
    image: 'https://example.com/categories/tea.jpg',
    description: '云南特色茶叶，包括普洱茶、滇红茶、花茶等多种类型',
    parentId: null,
    productCount: 24
  },
  {
    id: 'c2',
    title: '野生菌',
    image: 'https://example.com/categories/mushroom.jpg',
    description: '云南高原特色野生菌，包括松茸、牛肝菌、鸡枞菌等',
    parentId: null,
    productCount: 18
  },
  {
    id: 'c3',
    title: '咖啡',
    image: 'https://example.com/categories/coffee.jpg',
    description: '云南小粒咖啡，产自云南保山、普洱等咖啡产区',
    parentId: null,
    productCount: 12
  },
  {
    id: 'c4',
    title: '手工艺品',
    image: 'https://example.com/categories/crafts.jpg',
    description: '云南少数民族手工艺品，包括银饰、织锦、扎染等',
    parentId: null,
    productCount: 36
  },
  {
    id: 'c1-1',
    title: '普洱茶',
    image: 'https://example.com/categories/puer.jpg',
    description: '云南特产普洱茶，分为生茶和熟茶两大类',
    parentId: 'c1',
    productCount: 15
  },
  {
    id: 'c1-2',
    title: '滇红茶',
    image: 'https://example.com/categories/blacktea.jpg',
    description: '云南出产的红茶，香气高锐持久，滋味浓强鲜爽',
    parentId: 'c1',
    productCount: 9
  }
];

// Mock user profile
const mockUserProfile: UserProfile = {
  id: 'u1',
  username: 'test_user',
  nickname: '云南美食爱好者',
  avatar: 'https://example.com/avatars/default.jpg',
  phone: '13800138000',
  email: 'test@example.com',
  level: '黄金会员',
  points: 2580,
  memberSince: '2023-01-15'
};

// Mock addresses
const mockAddresses: Address[] = [
  {
    id: 'a1',
    name: '张三',
    phone: '13800138000',
    province: '云南省',
    city: '昆明市',
    district: '五华区',
    address: '人民中路123号云南大厦5楼',
    isDefault: true
  },
  {
    id: 'a2',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '建国路88号现代城5号楼2单元801',
    isDefault: false
  }
];

// Mock cart items
const mockCartItems = [
  {
    id: 'ci1',
    productId: 'p1',
    quantity: 2,
    selectedSpecs: { '规格': '357g饼', '年份': '2023年' },
    price: 128.00,
    addedAt: Date.now() - 86400000 // 1 day ago
  },
  {
    id: 'ci2',
    productId: 'p2',
    quantity: 1,
    selectedSpecs: { '规格': '精品礼盒500g' },
    price: 299.00,
    addedAt: Date.now() - 3600000 // 1 hour ago
  }
];

export class MockService {
  /**
   * Check if mocks should be used
   */
  shouldUseMocks(): boolean {
    return getApiConfig().useMocks;
  }
  
  /**
   * Get all mock products
   */
  getAllProducts(): Product[] {
    return mockProducts;
  }
  
  /**
   * Get featured products
   */
  getFeaturedProducts(): Product[] {
    return mockProducts.filter(p => p.featured);
  }
  
  /**
   * Get new products (simulated by most recent IDs)
   */
  getNewProducts(): Product[] {
    return [...mockProducts].sort((a, b) => {
      // Sort by ID in reverse order to simulate newest first
      return b.id.localeCompare(a.id);
    }).slice(0, 3);
  }
  
  /**
   * Get popular products (simulated by highest sold count)
   */
  getPopularProducts(): Product[] {
    return [...mockProducts].sort((a, b) => {
      return (b.sold || 0) - (a.sold || 0);
    }).slice(0, 3);
  }
  
  /**
   * Get product by ID
   */
  getProduct(id: string): Product | undefined {
    return mockProducts.find(p => p.id === id);
  }
  
  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: string): Product[] {
    return mockProducts.filter(p => p.categoryId === categoryId);
  }
  
  /**
   * Search products
   */
  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  /**
   * Get all categories
   */
  getAllCategories(): Category[] {
    return mockCategories;
  }
  
  /**
   * Get category by ID
   */
  getCategory(id: string): Category | undefined {
    return mockCategories.find(c => c.id === id);
  }
  
  /**
   * Get child categories
   */
  getChildCategories(parentId: string): Category[] {
    return mockCategories.filter(c => c.parentId === parentId);
  }
  
  /**
   * Get user profile
   */
  getUserProfile(): UserProfile {
    return mockUserProfile;
  }
  
  /**
   * Get user addresses
   */
  getUserAddresses(): Address[] {
    return mockAddresses;
  }
  
  /**
   * Get cart items
   */
  getCartItems(): typeof mockCartItems {
    return mockCartItems;
  }
}

// Create singleton instance
export const mockService = new MockService();
