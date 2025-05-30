/**
 * API interceptors for Yunnan Taste Mini-Program
 * Implements common interceptors for logging, loading states, and error handling
 */

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
