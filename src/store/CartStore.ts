/**
 * Enhanced CartStore with integrated API, error handling, and loading states
 * for Yunnan Taste Mini-Program
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Api } from '../services/api';
import { errorHandler } from '../services/errorHandler';
import { loadingManager, LoadingType } from '../services/loadingManager';
import Taro from '@tarojs/taro';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedSpecs: Record<string, string>;
  price: number;
  addedAt: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  addressId: string;
  paymentMethod: string;
  createdAt: number;
}

export class CartStore {
  rootStore: RootStore;
  
  // Cart data
  items: CartItem[] = [];
  
  // Order data
  orders: Order[] = [];
  
  // Loading states
  isLoadingCart: boolean = false;
  isLoadingOrders: boolean = false;
  isProcessingOrder: boolean = false;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  
  /**
   * Fetch cart items from API
   */
  async fetchCart() {
    if (!this.rootStore.userStore.isAuthenticated) {
      this.loadLocalCart();
      return;
    }
    
    if (this.isLoadingCart) return;
    
    this.isLoadingCart = true;
    loadingManager.startLoading(LoadingType.CART, '加载购物车...');
    
    try {
      const result = await Api.Cart.getCart();
      
      runInAction(() => {
        this.items = result.items;
        this.isLoadingCart = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingCart = false;
      });
      errorHandler.handleApiError(error, '加载购物车失败');
    } finally {
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Add item to cart
   */
  async addItem(productId: string, quantity: number, selectedSpecs: Record<string, string>) {
    if (this.isLoadingCart) return;
    
    this.isLoadingCart = true;
    loadingManager.startLoading(LoadingType.CART, '添加到购物车...');
    
    try {
      // Check if product exists
      const product = await this.rootStore.productStore.fetchProduct(productId);
      if (!product) {
        throw new Error('商品不存在');
      }
      
      if (this.rootStore.userStore.isAuthenticated) {
        // Add to server cart
        const result = await Api.Cart.addToCart(productId, quantity, selectedSpecs);
        
        runInAction(() => {
          // Add new item to cart
          this.items.push({
            id: result.cartId,
            productId,
            quantity,
            selectedSpecs,
            price: product.price,
            addedAt: Date.now()
          });
        });
      } else {
        // Add to local cart
        runInAction(() => {
          // Check if item with same specs already exists
          const existingItemIndex = this.items.findIndex(item => 
            item.productId === productId && 
            JSON.stringify(item.selectedSpecs) === JSON.stringify(selectedSpecs)
          );
          
          if (existingItemIndex >= 0) {
            // Update existing item
            this.items[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            this.items.push({
              id: `local-${Date.now()}`,
              productId,
              quantity,
              selectedSpecs,
              price: product.price,
              addedAt: Date.now()
            });
          }
          
          this.saveLocalCart();
        });
      }
      
      this.rootStore.uiStore.showToast('已添加到购物车', 'success');
    } catch (error) {
      errorHandler.handleApiError(error, '添加到购物车失败');
    } finally {
      runInAction(() => {
        this.isLoadingCart = false;
      });
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Update cart item quantity
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    if (this.isLoadingCart) return;
    if (quantity < 1) return;
    
    this.isLoadingCart = true;
    loadingManager.startLoading(LoadingType.CART, '更新购物车...');
    
    try {
      if (this.rootStore.userStore.isAuthenticated) {
        // Update server cart
        await Api.Cart.updateCartItem(itemId, quantity);
      }
      
      runInAction(() => {
        // Update local state
        this.items = this.items.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
        
        // If not authenticated, save to local storage
        if (!this.rootStore.userStore.isAuthenticated) {
          this.saveLocalCart();
        }
      });
    } catch (error) {
      errorHandler.handleApiError(error, '更新购物车失败');
    } finally {
      runInAction(() => {
        this.isLoadingCart = false;
      });
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Remove item from cart
   */
  async removeItem(itemId: string) {
    if (this.isLoadingCart) return;
    
    this.isLoadingCart = true;
    loadingManager.startLoading(LoadingType.CART, '移除商品...');
    
    try {
      if (this.rootStore.userStore.isAuthenticated) {
        // Remove from server cart
        await Api.Cart.removeFromCart(itemId);
      }
      
      runInAction(() => {
        // Remove from local state
        this.items = this.items.filter(item => item.id !== itemId);
        
        // If not authenticated, save to local storage
        if (!this.rootStore.userStore.isAuthenticated) {
          this.saveLocalCart();
        }
      });
      
      this.rootStore.uiStore.showToast('商品已移除', 'success');
    } catch (error) {
      errorHandler.handleApiError(error, '移除商品失败');
    } finally {
      runInAction(() => {
        this.isLoadingCart = false;
      });
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Clear cart
   */
  async clearCart() {
    if (this.isLoadingCart) return;
    
    this.isLoadingCart = true;
    loadingManager.startLoading(LoadingType.CART, '清空购物车...');
    
    try {
      if (this.rootStore.userStore.isAuthenticated) {
        // Clear server cart
        await Api.Cart.clearCart();
      }
      
      runInAction(() => {
        // Clear local state
        this.items = [];
        
        // If not authenticated, save to local storage
        if (!this.rootStore.userStore.isAuthenticated) {
          this.saveLocalCart();
        }
      });
      
      this.rootStore.uiStore.showToast('购物车已清空', 'success');
    } catch (error) {
      errorHandler.handleApiError(error, '清空购物车失败');
    } finally {
      runInAction(() => {
        this.isLoadingCart = false;
      });
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Checkout cart
   */
  async checkout(addressId: string, paymentMethod: string): Promise<string | null> {
    if (!this.rootStore.userStore.isAuthenticated) {
      this.rootStore.uiStore.showToast('请先登录', 'info');
      return null;
    }
    
    if (this.isProcessingOrder) return null;
    if (this.items.length === 0) {
      this.rootStore.uiStore.showToast('购物车为空', 'info');
      return null;
    }
    
    this.isProcessingOrder = true;
    loadingManager.startLoading(LoadingType.CART, '提交订单...');
    
    try {
      const result = await Api.Cart.checkout(addressId, paymentMethod);
      
      runInAction(() => {
        // Clear cart after successful checkout
        this.items = [];
      });
      
      this.rootStore.uiStore.showToast('订单提交成功', 'success');
      
      // Return payment URL or order ID
      return result.paymentUrl || result.orderId;
    } catch (error) {
      errorHandler.handleApiError(error, '提交订单失败');
      return null;
    } finally {
      runInAction(() => {
        this.isProcessingOrder = false;
      });
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Calculate cart total
   */
  get cartTotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  /**
   * Get cart item count
   */
  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
  
  /**
   * Save cart to local storage (for non-authenticated users)
   */
  private saveLocalCart() {
    try {
      Taro.setStorageSync('yunnan_taste_cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  }
  
  /**
   * Load cart from local storage (for non-authenticated users)
   */
  private loadLocalCart() {
    try {
      const cart = Taro.getStorageSync('yunnan_taste_cart');
      if (cart) {
        this.items = JSON.parse(cart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }
  
  /**
   * Merge local cart with server cart after login
   */
  async mergeWithServerCart() {
    if (!this.rootStore.userStore.isAuthenticated) return;
    
    // Load local cart
    const localCart = Taro.getStorageSync('yunnan_taste_cart');
    if (!localCart) return;
    
    const localItems: CartItem[] = JSON.parse(localCart);
    if (localItems.length === 0) return;
    
    loadingManager.startLoading(LoadingType.CART, '同步购物车...');
    
    try {
      // Fetch server cart first
      await this.fetchCart();
      
      // Add local items to server cart
      for (const item of localItems) {
        await Api.Cart.addToCart(
          item.productId,
          item.quantity,
          item.selectedSpecs
        );
      }
      
      // Fetch updated cart
      await this.fetchCart();
      
      // Clear local cart
      Taro.removeStorageSync('yunnan_taste_cart');
      
      this.rootStore.uiStore.showToast('购物车已同步', 'success');
    } catch (error) {
      errorHandler.handleApiError(error, '同步购物车失败');
    } finally {
      loadingManager.stopLoading(LoadingType.CART);
    }
  }
  
  /**
   * Hydrate store with persisted data
   */
  async hydrate() {
    if (this.rootStore.userStore.isAuthenticated) {
      await this.fetchCart();
      await this.mergeWithServerCart();
    } else {
      this.loadLocalCart();
    }
  }
}
