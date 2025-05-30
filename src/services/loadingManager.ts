/**
 * Loading state manager for Yunnan Taste Mini-Program
 * Provides centralized loading state management
 */

import { makeAutoObservable } from 'mobx';

export enum LoadingType {
  GLOBAL = 'global',
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  USER = 'user',
  CART = 'cart',
  CONTENT = 'content'
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export class LoadingManager {
  private loadingStates: Record<LoadingType, LoadingState> = {
    [LoadingType.GLOBAL]: { isLoading: false },
    [LoadingType.PRODUCTS]: { isLoading: false },
    [LoadingType.CATEGORIES]: { isLoading: false },
    [LoadingType.USER]: { isLoading: false },
    [LoadingType.CART]: { isLoading: false },
    [LoadingType.CONTENT]: { isLoading: false }
  };
  
  constructor() {
    makeAutoObservable(this);
  }
  
  /**
   * Start loading for a specific type
   */
  startLoading(type: LoadingType, message?: string) {
    this.loadingStates[type] = { 
      isLoading: true,
      message
    };
    
    // Also set global loading if not already set
    if (type !== LoadingType.GLOBAL && !this.loadingStates[LoadingType.GLOBAL].isLoading) {
      this.loadingStates[LoadingType.GLOBAL] = { 
        isLoading: true,
        message: message || this.loadingStates[LoadingType.GLOBAL].message
      };
    }
  }
  
  /**
   * Stop loading for a specific type
   */
  stopLoading(type: LoadingType) {
    this.loadingStates[type] = { 
      isLoading: false
    };
    
    // Check if any other types are still loading
    if (type === LoadingType.GLOBAL) {
      return;
    }
    
    const anyLoading = Object.entries(this.loadingStates)
      .filter(([key]) => key !== LoadingType.GLOBAL)
      .some(([_, state]) => state.isLoading);
    
    // If no other types are loading, stop global loading
    if (!anyLoading) {
      this.loadingStates[LoadingType.GLOBAL] = { isLoading: false };
    }
  }
  
  /**
   * Check if a specific type is loading
   */
  isLoading(type: LoadingType): boolean {
    return this.loadingStates[type].isLoading;
  }
  
  /**
   * Get loading message for a specific type
   */
  getMessage(type: LoadingType): string | undefined {
    return this.loadingStates[type].message;
  }
  
  /**
   * Get all loading states
   */
  getLoadingStates(): Record<LoadingType, LoadingState> {
    return this.loadingStates;
  }
}

// Create singleton instance
export const loadingManager = new LoadingManager();
