/**
 * Integration test for ProductStore
 * Tests store actions, state changes, and API interactions
 */

import { ProductStore } from '../../store/ProductStore';
import { RootStore } from '../../store/RootStore';

// Mock API service
jest.mock('../../services/api', () => ({
  getProducts: jest.fn().mockResolvedValue({
    data: {
      products: [
        { id: '1', title: 'Yunnan Black Tea', price: 68.00 },
        { id: '2', title: 'Pu\'er Tea Cake', price: 128.00 }
      ],
      total: 2,
      page: 1,
      pageSize: 10
    }
  }),
  getProductDetails: jest.fn().mockImplementation((id) => 
    Promise.resolve({
      data: {
        id,
        title: id === '1' ? 'Yunnan Black Tea' : 'Pu\'er Tea Cake',
        price: id === '1' ? 68.00 : 128.00,
        description: 'Premium tea from Yunnan province',
        images: ['image1.jpg', 'image2.jpg']
      }
    })
  ),
  getProductCategories: jest.fn().mockResolvedValue({
    data: [
      { id: 'cat1', name: 'Tea' },
      { id: 'cat2', name: 'Snacks' }
    ]
  })
}));

describe('ProductStore', () => {
  let productStore;
  let rootStore;
  
  beforeEach(() => {
    rootStore = new RootStore();
    productStore = new ProductStore(rootStore);
    
    // Clear all mocks
    jest.clearAllMocks();
  });
  
  // Test fetching products
  test('fetches products successfully', async () => {
    await productStore.fetchProducts();
    
    expect(productStore.products.length).toBe(2);
    expect(productStore.products[0].title).toBe('Yunnan Black Tea');
    expect(productStore.products[1].title).toBe('Pu\'er Tea Cake');
    expect(productStore.isLoading).toBe(false);
    expect(productStore.error).toBe(null);
  });
  
  // Test fetching product details
  test('fetches product details successfully', async () => {
    await productStore.fetchProductDetails('1');
    
    expect(productStore.currentProduct).not.toBe(null);
    expect(productStore.currentProduct.title).toBe('Yunnan Black Tea');
    expect(productStore.currentProduct.price).toBe(68.00);
    expect(productStore.isLoadingDetails).toBe(false);
    expect(productStore.error).toBe(null);
  });
  
  // Test fetching categories
  test('fetches categories successfully', async () => {
    await productStore.fetchCategories();
    
    expect(productStore.categories.length).toBe(2);
    expect(productStore.categories[0].name).toBe('Tea');
    expect(productStore.categories[1].name).toBe('Snacks');
    expect(productStore.isLoadingCategories).toBe(false);
    expect(productStore.error).toBe(null);
  });
  
  // Test filtering products
  test('filters products correctly', async () => {
    await productStore.fetchProducts();
    
    // Set filter
    productStore.setFilter({ category: 'cat1', minPrice: 50, maxPrice: 100 });
    
    // Mock filtered API call
    require('../../services/api').getProducts.mockResolvedValueOnce({
      data: {
        products: [
          { id: '1', title: 'Yunnan Black Tea', price: 68.00 }
        ],
        total: 1,
        page: 1,
        pageSize: 10
      }
    });
    
    await productStore.applyFilters();
    
    expect(productStore.products.length).toBe(1);
    expect(productStore.products[0].title).toBe('Yunnan Black Tea');
    expect(productStore.filter.category).toBe('cat1');
    expect(productStore.filter.minPrice).toBe(50);
    expect(productStore.filter.maxPrice).toBe(100);
  });
  
  // Test sorting products
  test('sorts products correctly', async () => {
    await productStore.fetchProducts();
    
    // Set sort order
    productStore.setSortOrder('price_asc');
    
    // Mock sorted API call
    require('../../services/api').getProducts.mockResolvedValueOnce({
      data: {
        products: [
          { id: '1', title: 'Yunnan Black Tea', price: 68.00 },
          { id: '2', title: 'Pu\'er Tea Cake', price: 128.00 }
        ],
        total: 2,
        page: 1,
        pageSize: 10
      }
    });
    
    await productStore.applySorting();
    
    expect(productStore.products.length).toBe(2);
    expect(productStore.products[0].price).toBe(68.00);
    expect(productStore.products[1].price).toBe(128.00);
    expect(productStore.sortOrder).toBe('price_asc');
  });
  
  // Test pagination
  test('handles pagination correctly', async () => {
    await productStore.fetchProducts();
    
    // Set page
    productStore.setPage(2);
    
    // Mock paginated API call
    require('../../services/api').getProducts.mockResolvedValueOnce({
      data: {
        products: [
          { id: '3', title: 'Dian Hong Tea', price: 88.00 },
          { id: '4', title: 'White Tea', price: 108.00 }
        ],
        total: 4,
        page: 2,
        pageSize: 2
      }
    });
    
    await productStore.fetchProducts();
    
    expect(productStore.products.length).toBe(2);
    expect(productStore.products[0].title).toBe('Dian Hong Tea');
    expect(productStore.products[1].title).toBe('White Tea');
    expect(productStore.pagination.page).toBe(2);
    expect(productStore.pagination.total).toBe(4);
  });
  
  // Test error handling
  test('handles API errors correctly', async () => {
    // Mock API error
    require('../../services/api').getProducts.mockRejectedValueOnce(
      new Error('Network error')
    );
    
    await productStore.fetchProducts();
    
    expect(productStore.isLoading).toBe(false);
    expect(productStore.error).toBe('Network error');
    expect(productStore.products.length).toBe(0);
  });
  
  // Test search functionality
  test('searches products correctly', async () => {
    // Mock search API call
    require('../../services/api').getProducts.mockResolvedValueOnce({
      data: {
        products: [
          { id: '1', title: 'Yunnan Black Tea', price: 68.00 }
        ],
        total: 1,
        page: 1,
        pageSize: 10
      }
    });
    
    await productStore.searchProducts('black tea');
    
    expect(productStore.products.length).toBe(1);
    expect(productStore.products[0].title).toBe('Yunnan Black Tea');
    expect(productStore.searchQuery).toBe('black tea');
    expect(productStore.isSearching).toBe(false);
  });
  
  // Test resetting filters
  test('resets filters correctly', async () => {
    // Set filters first
    productStore.setFilter({ category: 'cat1', minPrice: 50, maxPrice: 100 });
    productStore.setSortOrder('price_desc');
    productStore.setSearchQuery('tea');
    
    // Reset filters
    productStore.resetFilters();
    
    expect(productStore.filter.category).toBe(null);
    expect(productStore.filter.minPrice).toBe(null);
    expect(productStore.filter.maxPrice).toBe(null);
    expect(productStore.sortOrder).toBe('default');
    expect(productStore.searchQuery).toBe('');
  });
});
