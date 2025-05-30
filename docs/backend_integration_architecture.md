# Backend Integration Architecture for Yunnan Taste Mini-Program

## Overview

This document outlines the architecture for integrating the Yunnan Taste mini-program with real backend services. The design builds upon the existing API client structure while enhancing it for production use with real endpoints, robust error handling, and environment configuration.

## Current Architecture Analysis

The current API client structure in `api.ts` provides a solid foundation with:

- Generic request handling with typed responses
- Organized API modules (Product, User, Cart, Content)
- Authentication token support
- Basic error handling

However, to support real backend integration, we need to enhance this architecture with:

1. Environment configuration management
2. Improved authentication flow
3. Enhanced error handling and retry logic
4. Request/response interceptors
5. Caching strategies
6. Mock data fallback for development

## Proposed Architecture

### 1. Environment Configuration

Create a configuration system to manage API endpoints across different environments:

```typescript
// src/config/env.ts
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  useMocks: boolean;
}

const configs: Record<Environment, ApiConfig> = {
  [Environment.DEVELOPMENT]: {
    baseUrl: 'https://dev-api.yunnan-taste.example.com/v1',
    timeout: 10000,
    useMocks: true
  },
  [Environment.STAGING]: {
    baseUrl: 'https://staging-api.yunnan-taste.example.com/v1',
    timeout: 10000,
    useMocks: false
  },
  [Environment.PRODUCTION]: {
    baseUrl: 'https://api.yunnan-taste.example.com/v1',
    timeout: 10000,
    useMocks: false
  }
};

// Default to development in mini-program environment
let currentEnv = Environment.DEVELOPMENT;

export const setEnvironment = (env: Environment) => {
  currentEnv = env;
};

export const getApiConfig = (): ApiConfig => {
  return configs[currentEnv];
};
```

### 2. Enhanced API Client

Refactor the API client to support environment configuration, interceptors, and improved error handling:

```typescript
// src/services/apiClient.ts
import Taro from '@tarojs/taro';
import { getApiConfig } from '../config/env';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface RequestInterceptor {
  onRequest: (config: any) => any;
}

export interface ResponseInterceptor {
  onResponse: (response: any) => any;
  onError: (error: any) => any;
}

export class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  
  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index !== -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }
  
  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index !== -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }
  
  /**
   * Generic API request function with interceptors and retry logic
   */
  async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    token?: string,
    retries: number = 1
  ): Promise<ApiResponse<T>> {
    const config = getApiConfig();
    
    // Apply request interceptors
    let requestConfig = {
      url: `${config.baseUrl}${endpoint}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      timeout: config.timeout
    };
    
    for (const interceptor of this.requestInterceptors) {
      requestConfig = interceptor.onRequest(requestConfig);
    }
    
    try {
      const response = await Taro.request(requestConfig);
      
      // Apply response interceptors
      let processedResponse = response;
      for (const interceptor of this.responseInterceptors) {
        processedResponse = interceptor.onResponse(processedResponse);
      }
      
      // Check for successful status code
      if (processedResponse.statusCode >= 200 && processedResponse.statusCode < 300) {
        return {
          success: true,
          data: processedResponse.data as T
        };
      } else {
        // Handle API errors
        const errorResponse = {
          success: false,
          error: processedResponse.data?.message || 'Request failed',
          code: processedResponse.statusCode
        };
        
        // Retry on server errors if retries remaining
        if (processedResponse.statusCode >= 500 && retries > 0) {
          return this.request<T>(endpoint, method, data, token, retries - 1);
        }
        
        return errorResponse;
      }
    } catch (error) {
      // Apply error interceptors
      let processedError = error;
      for (const interceptor of this.responseInterceptors) {
        processedError = interceptor.onError(processedError);
      }
      
      // Handle network errors or timeouts
      const errorResponse = {
        success: false,
        error: processedError.message || 'Network error',
        code: processedError.statusCode || 0
      };
      
      // Retry on network errors if retries remaining
      if (retries > 0) {
        return this.request<T>(endpoint, method, data, token, retries - 1);
      }
      
      return errorResponse;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
```

### 3. Authentication Service

Create a dedicated authentication service to manage tokens and session state:

```typescript
// src/services/authService.ts
import Taro from '@tarojs/taro';
import { apiClient } from './apiClient';
import { UserProfile } from '../store/UserStore';

const TOKEN_STORAGE_KEY = 'yunnan_taste_auth_token';

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  profile: UserProfile | null;
}

export class AuthService {
  private state: AuthState = {
    token: null,
    isAuthenticated: false,
    profile: null
  };
  
  /**
   * Initialize auth state from storage
   */
  async initialize(): Promise<AuthState> {
    try {
      const token = Taro.getStorageSync(TOKEN_STORAGE_KEY);
      if (token) {
        this.state.token = token;
        this.state.isAuthenticated = true;
        
        // Validate token and get profile
        const profileResponse = await apiClient.request<UserProfile>(
          '/user/profile',
          'GET',
          undefined,
          token
        );
        
        if (profileResponse.success && profileResponse.data) {
          this.state.profile = profileResponse.data;
        } else {
          // Token invalid, clear auth state
          await this.logout();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
      await this.logout();
    }
    
    return this.state;
  }
  
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<AuthState> {
    const response = await apiClient.request<{
      token: string;
      profile: UserProfile;
    }>('/auth/login', 'POST', { username, password });
    
    if (response.success && response.data) {
      this.state.token = response.data.token;
      this.state.isAuthenticated = true;
      this.state.profile = response.data.profile;
      
      // Save token to storage
      Taro.setStorageSync(TOKEN_STORAGE_KEY, response.data.token);
    }
    
    return this.state;
  }
  
  /**
   * Logout and clear auth state
   */
  async logout(): Promise<void> {
    this.state.token = null;
    this.state.isAuthenticated = false;
    this.state.profile = null;
    
    // Remove token from storage
    Taro.removeStorageSync(TOKEN_STORAGE_KEY);
  }
  
  /**
   * Get current auth state
   */
  getState(): AuthState {
    return this.state;
  }
  
  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.state.token;
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }
}

// Create singleton instance
export const authService = new AuthService();
```

### 4. Mock Data Service

Create a service to provide mock data for development:

```typescript
// src/services/mockService.ts
import { getApiConfig } from '../config/env';
import { Product, Category } from '../store/ProductStore';
import { UserProfile, Address } from '../store/UserStore';

// Import mock data
import mockProducts from '../mocks/products.json';
import mockCategories from '../mocks/categories.json';
import mockUsers from '../mocks/users.json';

export class MockService {
  /**
   * Check if mocks should be used
   */
  shouldUseMocks(): boolean {
    return getApiConfig().useMocks;
  }
  
  /**
   * Get mock products
   */
  getProducts(): Product[] {
    return mockProducts;
  }
  
  /**
   * Get mock categories
   */
  getCategories(): Category[] {
    return mockCategories;
  }
  
  /**
   * Get mock user profile
   */
  getUserProfile(): UserProfile {
    return mockUsers.profile;
  }
  
  // Add more mock data methods as needed
}

// Create singleton instance
export const mockService = new MockService();
```

### 5. API Service Implementation

Refactor the API services to use the enhanced client and support mock data:

```typescript
// src/services/api.ts
import { apiClient } from './apiClient';
import { mockService } from './mockService';
import { authService } from './authService';
import { Product, Category } from '../store/ProductStore';
import { UserProfile, Address } from '../store/UserStore';

/**
 * Product API service
 */
export const ProductApi = {
  /**
   * Get featured products
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    if (mockService.shouldUseMocks()) {
      return mockService.getProducts().filter(p => p.featured);
    }
    
    const response = await apiClient.request<Product[]>('/products/featured');
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch featured products');
  },
  
  // Implement other product API methods similarly
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
    const authState = await authService.login(username, password);
    
    if (authState.isAuthenticated && authState.token && authState.profile) {
      return {
        token: authState.token,
        profile: authState.profile
      };
    }
    
    throw new Error('Authentication failed');
  },
  
  // Implement other user API methods similarly
};

// Implement Cart and Content APIs similarly

// Export all APIs
export const Api = {
  Product: ProductApi,
  User: UserApi,
  // Add Cart and Content APIs
};
```

### 6. API Interceptors

Implement common interceptors for logging, analytics, and error handling:

```typescript
// src/services/interceptors.ts
import { apiClient, RequestInterceptor, ResponseInterceptor } from './apiClient';
import { UIStore } from '../store/UIStore';

/**
 * Logger interceptor
 */
export const createLoggerInterceptor = () => {
  const requestInterceptor: RequestInterceptor = {
    onRequest: (config) => {
      console.log(`[API] ${config.method} ${config.url}`, config.data);
      return config;
    }
  };
  
  const responseInterceptor: ResponseInterceptor = {
    onResponse: (response) => {
      console.log(`[API] Response:`, response.statusCode, response.data);
      return response;
    },
    onError: (error) => {
      console.error(`[API] Error:`, error);
      return error;
    }
  };
  
  apiClient.addRequestInterceptor(requestInterceptor);
  apiClient.addResponseInterceptor(responseInterceptor);
};

/**
 * Loading state interceptor
 */
export const createLoadingInterceptor = (uiStore: UIStore) => {
  const requestInterceptor: RequestInterceptor = {
    onRequest: (config) => {
      uiStore.setLoading(true);
      return config;
    }
  };
  
  const responseInterceptor: ResponseInterceptor = {
    onResponse: (response) => {
      uiStore.setLoading(false);
      return response;
    },
    onError: (error) => {
      uiStore.setLoading(false);
      return error;
    }
  };
  
  apiClient.addRequestInterceptor(requestInterceptor);
  apiClient.addResponseInterceptor(responseInterceptor);
};

/**
 * Error notification interceptor
 */
export const createErrorNotificationInterceptor = (uiStore: UIStore) => {
  const responseInterceptor: ResponseInterceptor = {
    onResponse: (response) => {
      if (response.statusCode >= 400) {
        const errorMessage = response.data?.message || `Error ${response.statusCode}`;
        uiStore.showToast(errorMessage, 'error');
      }
      return response;
    },
    onError: (error) => {
      const errorMessage = error.message || 'Network error';
      uiStore.showToast(errorMessage, 'error');
      return error;
    }
  };
  
  apiClient.addResponseInterceptor(responseInterceptor);
};
```

## Integration with Store System

The existing store system will be updated to use the real API services:

```typescript
// src/store/ProductStore.ts (example update)
import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Api } from '../services/api';

export class ProductStore {
  // ... existing state properties
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  
  /**
   * Fetch featured products from API
   */
  async fetchFeaturedProducts() {
    this.isLoadingFeatured = true;
    
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
        this.rootStore.uiStore.showToast(`Failed to load featured products: ${error.message}`, 'error');
      });
    }
  }
  
  // Update other methods similarly
}
```

## Implementation Plan

1. Create environment configuration system
2. Implement enhanced API client with interceptors
3. Develop authentication service
4. Set up mock data service for development
5. Refactor API services to use the new architecture
6. Update store classes to integrate with real APIs
7. Implement comprehensive error handling
8. Add loading state management
9. Create validation tools for testing API integration

## Conclusion

This architecture provides a robust foundation for integrating the Yunnan Taste mini-program with real backend services. It maintains the existing structure while enhancing it with environment configuration, improved error handling, authentication management, and development tools. The design ensures a smooth transition from mock to real data while maintaining type safety and a clean separation of concerns.
