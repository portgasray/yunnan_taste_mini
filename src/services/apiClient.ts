/**
 * Enhanced API client for Yunnan Taste Mini-Program
 * Handles all backend API interactions with interceptors and retry logic
 */

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
