/**
 * Enhanced API service for Yunnan Taste Mini-Program
 * Implements real data fetching with mock fallback
 */

import { apiClient } from './apiClient';
import { mockService } from './mockService';
import { authService } from './authService';
import { Product, Category } from '../store/ProductStore';
import { UserProfile, Address } from '../store/UserStore';
import { getApiConfig } from '../config/env';

/**
 * Product API service
 */
export const ProductApi = {
  /**
   * Get featured products
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return mockService.getFeaturedProducts();
    }
    
    const response = await apiClient.request<Product[]>('/products/featured');
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch featured products');
  },
  
  /**
   * Get new products
   */
  getNewProducts: async (): Promise<Product[]> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return mockService.getNewProducts();
    }
    
    const response = await apiClient.request<Product[]>('/products/new');
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch new products');
  },
  
  /**
   * Get popular products
   */
  getPopularProducts: async (): Promise<Product[]> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return mockService.getPopularProducts();
    }
    
    const response = await apiClient.request<Product[]>('/products/popular');
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch popular products');
  },
  
  /**
   * Get product by ID
   */
  getProduct: async (id: string): Promise<Product> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      const product = mockService.getProduct(id);
      if (product) {
        return product;
      }
      throw new Error(`Product not found: ${id}`);
    }
    
    const response = await apiClient.request<Product>(`/products/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to fetch product: ${id}`);
  },
  
  /**
   * Get products by category
   */
  getProductsByCategory: async (
    categoryId: string, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      const products = mockService.getProductsByCategory(categoryId);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      return {
        products: products.slice(startIndex, endIndex),
        total: products.length,
        page,
        pageSize
      };
    }
    
    const response = await apiClient.request<{
      products: Product[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/products?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to fetch products for category: ${categoryId}`);
  },
  
  /**
   * Search products
   */
  searchProducts: async (
    query: string, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      const products = mockService.searchProducts(query);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      return {
        products: products.slice(startIndex, endIndex),
        total: products.length,
        page,
        pageSize
      };
    }
    
    const response = await apiClient.request<{
      products: Product[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/products/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to search products: ${query}`);
  },
  
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return mockService.getAllCategories();
    }
    
    const response = await apiClient.request<Category[]>('/categories');
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch categories');
  },
  
  /**
   * Get category by ID
   */
  getCategory: async (id: string): Promise<Category> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      const category = mockService.getCategory(id);
      if (category) {
        return category;
      }
      throw new Error(`Category not found: ${id}`);
    }
    
    const response = await apiClient.request<Category>(`/categories/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to fetch category: ${id}`);
  }
};

/**
 * User API service
 */
export const UserApi = {
  /**
   * Login with username and password
   */
  login: async (username: string, password: string): Promise<{
    token: string;
    profile: UserProfile;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate successful login with mock data
      return {
        token: 'mock-auth-token',
        profile: mockService.getUserProfile()
      };
    }
    
    const response = await apiClient.request<{
      token: string;
      profile: UserProfile;
    }>('/auth/login', 'POST', { username, password });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Authentication failed');
  },
  
  /**
   * Register new user
   */
  register: async (username: string, password: string, nickname: string): Promise<{
    token: string;
    profile: UserProfile;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate successful registration with mock data
      return {
        token: 'mock-auth-token',
        profile: {
          ...mockService.getUserProfile(),
          username,
          nickname
        }
      };
    }
    
    const response = await apiClient.request<{
      token: string;
      profile: UserProfile;
    }>('/auth/register', 'POST', { username, password, nickname });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Registration failed');
  },
  
  /**
   * Get user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return mockService.getUserProfile();
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<UserProfile>('/user/profile', 'GET', undefined, token);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch user profile');
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate profile update with mock data
      return {
        ...mockService.getUserProfile(),
        ...updates
      };
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<UserProfile>('/user/profile', 'PUT', updates, token);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update user profile');
  },
  
  /**
   * Get user addresses
   */
  getAddresses: async (): Promise<Address[]> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return mockService.getUserAddresses();
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<Address[]>('/user/addresses', 'GET', undefined, token);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch addresses');
  },
  
  /**
   * Add new address
   */
  addAddress: async (address: Omit<Address, 'id'>): Promise<Address> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate adding address with mock data
      return {
        id: `a${Date.now()}`,
        ...address
      };
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<Address>('/user/addresses', 'POST', address, token);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to add address');
  },
  
  /**
   * Update address
   */
  updateAddress: async (id: string, updates: Partial<Omit<Address, 'id'>>): Promise<Address> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate updating address with mock data
      const addresses = mockService.getUserAddresses();
      const address = addresses.find(a => a.id === id);
      if (!address) {
        throw new Error(`Address not found: ${id}`);
      }
      
      return {
        ...address,
        ...updates
      };
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<Address>(`/user/addresses/${id}`, 'PUT', updates, token);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to update address: ${id}`);
  },
  
  /**
   * Delete address
   */
  deleteAddress: async (id: string): Promise<void> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // No need to do anything for mock data
      return;
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<void>(`/user/addresses/${id}`, 'DELETE', undefined, token);
    if (!response.success) {
      throw new Error(response.error || `Failed to delete address: ${id}`);
    }
  }
};

/**
 * Cart API service
 */
export const CartApi = {
  /**
   * Get cart items
   */
  getCart: async (): Promise<{
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      selectedSpecs: Record<string, string>;
      price: number;
      addedAt: number;
    }>;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      return {
        items: mockService.getCartItems()
      };
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<{
      items: Array<{
        id: string;
        productId: string;
        quantity: number;
        selectedSpecs: Record<string, string>;
        price: number;
        addedAt: number;
      }>;
    }>('/cart', 'GET', undefined, token);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch cart');
  },
  
  /**
   * Add item to cart
   */
  addToCart: async (
    productId: string, 
    quantity: number, 
    selectedSpecs: Record<string, string>
  ): Promise<{
    cartId: string;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate adding item to cart
      return {
        cartId: `ci${Date.now()}`
      };
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<{
      cartId: string;
    }>('/cart/items', 'POST', { productId, quantity, selectedSpecs }, token);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to add item to cart');
  },
  
  /**
   * Update cart item
   */
  updateCartItem: async (itemId: string, quantity: number): Promise<void> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // No need to do anything for mock data
      return;
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<void>(`/cart/items/${itemId}`, 'PUT', { quantity }, token);
    if (!response.success) {
      throw new Error(response.error || `Failed to update cart item: ${itemId}`);
    }
  },
  
  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: string): Promise<void> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // No need to do anything for mock data
      return;
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<void>(`/cart/items/${itemId}`, 'DELETE', undefined, token);
    if (!response.success) {
      throw new Error(response.error || `Failed to remove item from cart: ${itemId}`);
    }
  },
  
  /**
   * Clear cart
   */
  clearCart: async (): Promise<void> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // No need to do anything for mock data
      return;
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<void>('/cart', 'DELETE', undefined, token);
    if (!response.success) {
      throw new Error(response.error || 'Failed to clear cart');
    }
  },
  
  /**
   * Create order from cart
   */
  checkout: async (addressId: string, paymentMethod: string): Promise<{
    orderId: string;
    total: number;
    paymentUrl?: string;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Simulate checkout with mock data
      return {
        orderId: `ord${Date.now()}`,
        total: 427.00, // Sum of mock cart items
        paymentUrl: 'https://example.com/payment'
      };
    }
    
    const token = authService.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const response = await apiClient.request<{
      orderId: string;
      total: number;
      paymentUrl?: string;
    }>('/orders', 'POST', { addressId, paymentMethod }, token);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Checkout failed');
  }
};

/**
 * Content API service for articles and heritage items
 */
export const ContentApi = {
  /**
   * Get featured articles
   */
  getFeaturedArticles: async (): Promise<Array<{
    id: string;
    title: string;
    image: string;
    author: string;
    date: string;
    category: string;
    summary: string;
    readTime: number;
  }>> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Return mock articles (would need to be added to mockService)
      return [
        {
          id: 'a1',
          title: '云南高山茶的四季采摘指南',
          image: 'https://example.com/article1.jpg',
          author: '茶道专家',
          date: '2025-05-15',
          category: '茶文化',
          summary: '不同季节采摘的高山茶，风味各异，本文为您详解四季茶叶的特点',
          readTime: 5
        },
        {
          id: 'a2',
          title: '探访云南野生菌的秘密森林',
          image: 'https://example.com/article2.jpg',
          author: '美食探险家',
          date: '2025-05-10',
          category: '美食探索',
          summary: '深入云南原始森林，寻找珍稀野生菌的生长环境与采摘技巧',
          readTime: 8
        }
      ];
    }
    
    const response = await apiClient.request<Array<{
      id: string;
      title: string;
      image: string;
      author: string;
      date: string;
      category: string;
      summary: string;
      readTime: number;
    }>>('/content/articles/featured');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch featured articles');
  },
  
  /**
   * Get article by ID
   */
  getArticle: async (id: string): Promise<{
    id: string;
    title: string;
    image: string;
    author: string;
    date: string;
    category: string;
    content: string;
    readTime: number;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Return mock article based on ID
      if (id === 'a1') {
        return {
          id: 'a1',
          title: '云南高山茶的四季采摘指南',
          image: 'https://example.com/article1.jpg',
          author: '茶道专家',
          date: '2025-05-15',
          category: '茶文化',
          content: '云南高山茶因其独特的地理环境和气候条件，形成了四季各异的风味特点...',
          readTime: 5
        };
      }
      
      throw new Error(`Article not found: ${id}`);
    }
    
    const response = await apiClient.request<{
      id: string;
      title: string;
      image: string;
      author: string;
      date: string;
      category: string;
      content: string;
      readTime: number;
    }>(`/content/articles/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to fetch article: ${id}`);
  },
  
  /**
   * Get heritage items
   */
  getHeritageItems: async (): Promise<Array<{
    id: string;
    title: string;
    image: string;
    location: string;
    category: string;
    description: string;
  }>> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Return mock heritage items
      return [
        {
          id: 'h1',
          title: '普洱茶制作工艺',
          image: 'https://example.com/heritage1.jpg',
          location: '云南省西双版纳',
          category: '传统工艺',
          description: '千年传承的普洱茶制作技艺，融合了云南少数民族的智慧'
        },
        {
          id: 'h2',
          title: '傣族织锦技艺',
          image: 'https://example.com/heritage2.jpg',
          location: '云南省德宏州',
          category: '传统工艺',
          description: '色彩绚丽的傣族织锦，记录着傣族人民的历史与文化'
        }
      ];
    }
    
    const response = await apiClient.request<Array<{
      id: string;
      title: string;
      image: string;
      location: string;
      category: string;
      description: string;
    }>>('/content/heritage');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch heritage items');
  },
  
  /**
   * Get heritage item by ID
   */
  getHeritageItem: async (id: string): Promise<{
    id: string;
    title: string;
    image: string;
    images: string[];
    location: string;
    category: string;
    description: string;
    content: string;
  }> => {
    // Use mock data if configured
    if (mockService.shouldUseMocks()) {
      // Return mock heritage item based on ID
      if (id === 'h1') {
        return {
          id: 'h1',
          title: '普洱茶制作工艺',
          image: 'https://example.com/heritage1.jpg',
          images: [
            'https://example.com/heritage1.jpg',
            'https://example.com/heritage1_detail1.jpg',
            'https://example.com/heritage1_detail2.jpg'
          ],
          location: '云南省西双版纳',
          category: '传统工艺',
          description: '千年传承的普洱茶制作技艺，融合了云南少数民族的智慧',
          content: '普洱茶制作工艺是云南特有的传统技艺，历史可追溯至唐代...'
        };
      }
      
      throw new Error(`Heritage item not found: ${id}`);
    }
    
    const response = await apiClient.request<{
      id: string;
      title: string;
      image: string;
      images: string[];
      location: string;
      category: string;
      description: string;
      content: string;
    }>(`/content/heritage/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || `Failed to fetch heritage item: ${id}`);
  }
};

// Export all APIs
export const Api = {
  Product: ProductApi,
  User: UserApi,
  Cart: CartApi,
  Content: ContentApi
};
