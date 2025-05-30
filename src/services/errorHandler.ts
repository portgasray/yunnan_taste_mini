/**
 * Error handler service for Yunnan Taste Mini-Program
 * Provides centralized error handling and user-friendly error messages
 */

import Taro from '@tarojs/taro';
import { UIStore } from '../store/UIStore';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  NOT_FOUND = 'not_found',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// Error details interface
export interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: number;
  originalError?: any;
}

/**
 * Error handler service
 */
export class ErrorHandler {
  private uiStore: UIStore | null = null;
  
  /**
   * Set UI store for showing error messages
   */
  setUIStore(uiStore: UIStore) {
    this.uiStore = uiStore;
  }
  
  /**
   * Handle API error
   */
  handleApiError(error: any, defaultMessage: string = '操作失败'): ErrorDetails {
    // Extract error information
    const errorMessage = error?.message || defaultMessage;
    const errorCode = error?.code || 0;
    
    // Determine error type
    let errorType = ErrorType.UNKNOWN;
    
    if (!navigator.onLine || errorMessage.includes('network') || errorCode === 0) {
      errorType = ErrorType.NETWORK;
    } else if (errorCode === 401 || errorCode === 403) {
      errorType = ErrorType.AUTH;
    } else if (errorCode === 404) {
      errorType = ErrorType.NOT_FOUND;
    } else if (errorCode === 400 || errorCode === 422) {
      errorType = ErrorType.VALIDATION;
    } else if (errorCode >= 500) {
      errorType = ErrorType.SERVER;
    }
    
    // Create error details
    const errorDetails: ErrorDetails = {
      type: errorType,
      message: this.getUserFriendlyMessage(errorType, errorMessage),
      code: errorCode,
      originalError: error
    };
    
    // Show error message if UI store is available
    if (this.uiStore) {
      this.uiStore.showToast(errorDetails.message, 'error');
    }
    
    // Log error
    console.error('[API Error]', errorDetails);
    
    // Handle special cases
    this.handleSpecialCases(errorDetails);
    
    return errorDetails;
  }
  
  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(type: ErrorType, originalMessage: string): string {
    switch (type) {
      case ErrorType.NETWORK:
        return '网络连接失败，请检查您的网络设置后重试';
      case ErrorType.AUTH:
        return '登录已过期，请重新登录';
      case ErrorType.NOT_FOUND:
        return '请求的资源不存在';
      case ErrorType.VALIDATION:
        // Keep original message for validation errors as they are usually specific
        return originalMessage;
      case ErrorType.SERVER:
        return '服务器暂时不可用，请稍后再试';
      default:
        return originalMessage || '操作失败，请稍后再试';
    }
  }
  
  /**
   * Handle special error cases
   */
  private handleSpecialCases(errorDetails: ErrorDetails) {
    // Handle authentication errors
    if (errorDetails.type === ErrorType.AUTH) {
      // Redirect to login page after a short delay
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/login/index' });
      }, 1500);
    }
    
    // Handle network errors
    if (errorDetails.type === ErrorType.NETWORK) {
      // Show network status page for persistent network issues
      if (!navigator.onLine) {
        Taro.navigateTo({ url: '/pages/network-error/index' });
      }
    }
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();
