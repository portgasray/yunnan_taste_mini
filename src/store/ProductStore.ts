/**
 * Enhanced ProductStore with integrated API, error handling, and loading states
 * for Yunnan Taste Mini-Program
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Api } from '../services/api';
import { errorHandler } from '../services/errorHandler';
import { loadingManager, LoadingType } from '../services/loadingManager';
import Taro from '@tarojs/taro';

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  categoryId: string;
  tags: string[];
  rating?: number;
  sold?: number;
  featured?: boolean;
  specifications?: Array<{
    name: string;
    options: string[];
  }>;
}

export interface Category {
  id: string;
  title: string;
  image: string;
  description: string;
  parentId: string | null;
  productCount: number;
}

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
}

export class ProductStore {
  rootStore: RootStore;
  
  // Product data
  products: Record<string, Product> = {};
  categories: Record<string, Category> = {};
  
  // Product collections
  featuredProducts: string[] = [];
  newProducts: string[] = [];
  popularProducts: string[] = [];
  
  // Search and filter state
  searchQuery: string = '';
  searchResults: string[] = [];
  searchHistory: string[] = [];
  currentFilter: ProductFilter = {};
  filteredProducts: string[] = [];
  
  // Pagination state
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  hasMoreProducts: boolean = false;
  
  // Loading states
  isLoadingFeatured: boolean = false;
  isLoadingNew: boolean = false;
  isLoadingPopular: boolean = false;
  isLoadingCategories: boolean = false;
  isLoadingProduct: boolean = false;
  isLoadingSearch: boolean = false;
  isLoadingFiltered: boolean = false;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  
  /**
   * Fetch featured products from API
   */
  async fetchFeaturedProducts() {
    if (this.isLoadingFeatured) return;
    
    this.isLoadingFeatured = true;
    loadingManager.startLoading(LoadingType.PRODUCTS, '加载精选商品...');
    
    try {
      const products = await Api.Product.getFeaturedProducts();
      
      runInAction(() => {
        // Update store with fetched products
        products.forEach(product => {
          this.products[product.id] = product;
        });
        
        this.featuredProducts = products.map(product => product.id);
        this.isLoadingFeatured = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingFeatured = false;
        errorHandler.handleApiError(error, '加载精选商品失败');
      });
    } finally {
      loadingManager.stopLoading(LoadingType.PRODUCTS);
    }
  }
  
  /**
   * Fetch new products from API
   */
  async fetchNewProducts() {
    if (this.isLoadingNew) return;
    
    this.isLoadingNew = true;
    loadingManager.startLoading(LoadingType.PRODUCTS, '加载新品...');
    
    try {
      const products = await Api.Product.getNewProducts();
      
      runInAction(() => {
        // Update store with fetched products
        products.forEach(product => {
          this.products[product.id] = product;
        });
        
        this.newProducts = products.map(product => product.id);
        this.isLoadingNew = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingNew = false;
        errorHandler.handleApiError(error, '加载新品失败');
      });
    } finally {
      loadingManager.stopLoading(LoadingType.PRODUCTS);
    }
  }
  
  /**
   * Fetch popular products from API
   */
  async fetchPopularProducts() {
    if (this.isLoadingPopular) return;
    
    this.isLoadingPopular = true;
    loadingManager.startLoading(LoadingType.PRODUCTS, '加载热门商品...');
    
    try {
      const products = await Api.Product.getPopularProducts();
      
      runInAction(() => {
        // Update store with fetched products
        products.forEach(product => {
          this.products[product.id] = product;
        });
        
        this.popularProducts = products.map(product => product.id);
        this.isLoadingPopular = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingPopular = false;
        errorHandler.handleApiError(error, '加载热门商品失败');
      });
    } finally {
      loadingManager.stopLoading(LoadingType.PRODUCTS);
    }
  }
  
  /**
   * Fetch product by ID from API
   */
  async fetchProduct(id: string) {
    if (this.isLoadingProduct) return;
    
    // Check if product is already in store
    if (this.products[id]) {
      return this.products[id];
    }
    
    this.isLoadingProduct = true;
    loadingManager.startLoading(LoadingType.PRODUCTS, '加载商品详情...');
    
    try {
      const product = await Api.Product.getProduct(id);
      
      runInAction(() => {
        this.products[id] = product;
        this.isLoadingProduct = false;
      });
      
      return product;
    } catch (error) {
      runInAction(() => {
        this.isLoadingProduct = false;
        errorHandler.handleApiError(error, '加载商品详情失败');
      });
      return null;
    } finally {
      loadingManager.stopLoading(LoadingType.PRODUCTS);
    }
  }
  
  /**
   * Fetch all categories from API
   */
  async fetchCategories() {
    if (this.isLoadingCategories) return;
    
    this.isLoadingCategories = true;
    loadingManager.startLoading(LoadingType.CATEGORIES, '加载分类...');
    
    try {
      const categories = await Api.Product.getCategories();
      
      runInAction(() => {
        // Update store with fetched categories
        this.categories = {};
        categories.forEach(category => {
          this.categories[category.id] = category;
        });
        
        this.isLoadingCategories = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingCategories = false;
        errorHandler.handleApiError(error, '加载分类失败');
      });
    } finally {
      loadingManager.stopLoading(LoadingType.CATEGORIES);
    }
  }
  
  /**
   * Search products by query
   */
  async searchProducts(query: string, page: number = 1) {
    if (this.isLoadingSearch) return;
    if (!query.trim()) {
      this.searchResults = [];
      this.searchQuery = '';
      return;
    }
    
    this.searchQuery = query;
    this.isLoadingSearch = true;
    loadingManager.startLoading(LoadingType.PRODUCTS, '搜索商品...');
    
    try {
      const result = await Api.Product.searchProducts(query, page, this.pageSize);
      
      runInAction(() => {
        // Update store with fetched products
        result.products.forEach(product => {
          this.products[product.id] = product;
        });
        
        this.searchResults = result.products.map(product => product.id);
        this.currentPage = result.page;
        this.totalPages = Math.ceil(result.total / result.pageSize);
        this.hasMoreProducts = this.currentPage < this.totalPages;
        this.isLoadingSearch = false;
        
        // Add to search history if not already present
        if (!this.searchHistory.includes(query)) {
          this.searchHistory = [query, ...this.searchHistory].slice(0, 10);
          this.saveSearchHistory();
        }
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingSearch = false;
        errorHandler.handleApiError(error, '搜索商品失败');
      });
    } finally {
      loadingManager.stopLoading(LoadingType.PRODUCTS);
    }
  }
  
  /**
   * Load more search results
   */
  async loadMoreSearchResults() {
    if (this.isLoadingSearch || !this.hasMoreProducts) return;
    
    const nextPage = this.currentPage + 1;
    this.isLoadingSearch = true;
    
    try {
      const result = await Api.Product.searchProducts(this.searchQuery, nextPage, this.pageSize);
      
      runInAction(() => {
        // Update store with fetched products
        result.products.forEach(product => {
          this.products[product.id] = product;
        });
        
        this.searchResults = [...this.searchResults, ...result.products.map(product => product.id)];
        this.currentPage = result.page;
        this.totalPages = Math.ceil(result.total / result.pageSize);
        this.hasMoreProducts = this.currentPage < this.totalPages;
        this.isLoadingSearch = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingSearch = false;
        errorHandler.handleApiError(error, '加载更多搜索结果失败');
      });
    }
  }
  
  /**
   * Filter products by category and other criteria
   */
  async filterProducts(filter: ProductFilter, page: number = 1) {
    if (this.isLoadingFiltered) return;
    
    this.currentFilter = filter;
    this.isLoadingFiltered = true;
    loadingManager.startLoading(LoadingType.PRODUCTS, '筛选商品...');
    
    try {
      // For now, we only support filtering by category
      if (filter.categoryId) {
        const result = await Api.Product.getProductsByCategory(filter.categoryId, page, this.pageSize);
        
        runInAction(() => {
          // Update store with fetched products
          result.products.forEach(product => {
            this.products[product.id] = product;
          });
          
          this.filteredProducts = result.products.map(product => product.id);
          this.currentPage = result.page;
          this.totalPages = Math.ceil(result.total / result.pageSize);
          this.hasMoreProducts = this.currentPage < this.totalPages;
          this.isLoadingFiltered = false;
        });
      } else {
        // No filter criteria, reset filtered products
        runInAction(() => {
          this.filteredProducts = [];
          this.currentPage = 1;
          this.totalPages = 1;
          this.hasMoreProducts = false;
          this.isLoadingFiltered = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.isLoadingFiltered = false;
        errorHandler.handleApiError(error, '筛选商品失败');
      });
    } finally {
      loadingManager.stopLoading(LoadingType.PRODUCTS);
    }
  }
  
  /**
   * Load more filtered products
   */
  async loadMoreFilteredProducts() {
    if (this.isLoadingFiltered || !this.hasMoreProducts) return;
    
    const nextPage = this.currentPage + 1;
    this.isLoadingFiltered = true;
    
    try {
      if (this.currentFilter.categoryId) {
        const result = await Api.Product.getProductsByCategory(
          this.currentFilter.categoryId, 
          nextPage, 
          this.pageSize
        );
        
        runInAction(() => {
          // Update store with fetched products
          result.products.forEach(product => {
            this.products[product.id] = product;
          });
          
          this.filteredProducts = [...this.filteredProducts, ...result.products.map(product => product.id)];
          this.currentPage = result.page;
          this.totalPages = Math.ceil(result.total / result.pageSize);
          this.hasMoreProducts = this.currentPage < this.totalPages;
          this.isLoadingFiltered = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.isLoadingFiltered = false;
        errorHandler.handleApiError(error, '加载更多筛选商品失败');
      });
    }
  }
  
  /**
   * Clear search history
   */
  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }
  
  /**
   * Save search history to storage
   */
  private saveSearchHistory() {
    try {
      Taro.setStorageSync('yunnan_taste_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }
  
  /**
   * Load search history from storage
   */
  private loadSearchHistory() {
    try {
      const history = Taro.getStorageSync('yunnan_taste_search_history');
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }
  
  /**
   * Hydrate store with persisted data
   */
  async hydrate() {
    this.loadSearchHistory();
  }
}
