/**
 * Enhanced UserStore with integrated API, error handling, and loading states
 * for Yunnan Taste Mini-Program
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { RootStore } from './RootStore';
import { Api } from '../services/api';
import { authService } from '../services/authService';
import { errorHandler } from '../services/errorHandler';
import { loadingManager, LoadingType } from '../services/loadingManager';
import Taro from '@tarojs/taro';

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  phone?: string;
  email?: string;
  level?: string;
  points?: number;
  memberSince?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

export class UserStore {
  rootStore: RootStore;
  
  // Authentication state
  isAuthenticated: boolean = false;
  token: string | null = null;
  
  // User data
  profile: UserProfile | null = null;
  addresses: Address[] = [];
  
  // User preferences
  favorites: string[] = [];
  viewHistory: string[] = [];
  
  // Loading states
  isLoading: boolean = false;
  isLoadingProfile: boolean = false;
  isLoadingAddresses: boolean = false;
  isAuthenticating: boolean = false;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  
  /**
   * Initialize authentication state
   */
  async initialize() {
    this.isLoading = true;
    loadingManager.startLoading(LoadingType.USER, '初始化用户状态...');
    
    try {
      const authState = await authService.initialize();
      
      runInAction(() => {
        this.isAuthenticated = authState.isAuthenticated;
        this.token = authState.token;
        this.profile = authState.profile;
      });
      
      // If authenticated, fetch additional user data
      if (this.isAuthenticated) {
        await this.fetchAddresses();
        await this.loadFavorites();
        await this.loadViewHistory();
      }
    } catch (error) {
      errorHandler.handleApiError(error, '初始化用户状态失败');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<boolean> {
    if (this.isAuthenticating) return false;
    
    this.isAuthenticating = true;
    loadingManager.startLoading(LoadingType.USER, '登录中...');
    
    try {
      const authState = await authService.login(username, password);
      
      runInAction(() => {
        this.isAuthenticated = authState.isAuthenticated;
        this.token = authState.token;
        this.profile = authState.profile;
        this.isAuthenticating = false;
      });
      
      // If login successful, fetch additional user data
      if (this.isAuthenticated) {
        await this.fetchAddresses();
        await this.loadFavorites();
        await this.loadViewHistory();
        
        this.rootStore.uiStore.showToast('登录成功', 'success');
        return true;
      } else {
        this.rootStore.uiStore.showToast('登录失败', 'error');
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.isAuthenticating = false;
      });
      errorHandler.handleApiError(error, '登录失败');
      return false;
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Register new user
   */
  async register(username: string, password: string, nickname: string): Promise<boolean> {
    if (this.isAuthenticating) return false;
    
    this.isAuthenticating = true;
    loadingManager.startLoading(LoadingType.USER, '注册中...');
    
    try {
      const result = await Api.User.register(username, password, nickname);
      
      runInAction(() => {
        this.isAuthenticated = true;
        this.token = result.token;
        this.profile = result.profile;
        this.isAuthenticating = false;
      });
      
      // Initialize empty user data
      this.favorites = [];
      this.viewHistory = [];
      this.addresses = [];
      
      this.rootStore.uiStore.showToast('注册成功', 'success');
      return true;
    } catch (error) {
      runInAction(() => {
        this.isAuthenticating = false;
      });
      errorHandler.handleApiError(error, '注册失败');
      return false;
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Logout current user
   */
  async logout() {
    loadingManager.startLoading(LoadingType.USER, '退出登录...');
    
    try {
      await authService.logout();
      
      runInAction(() => {
        this.isAuthenticated = false;
        this.token = null;
        this.profile = null;
        this.addresses = [];
        this.favorites = [];
        this.viewHistory = [];
      });
      
      this.rootStore.uiStore.showToast('已退出登录', 'info');
    } catch (error) {
      errorHandler.handleApiError(error, '退出登录失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Fetch user profile
   */
  async fetchProfile() {
    if (!this.isAuthenticated || this.isLoadingProfile) return;
    
    this.isLoadingProfile = true;
    loadingManager.startLoading(LoadingType.USER, '加载用户信息...');
    
    try {
      const profile = await Api.User.getProfile();
      
      runInAction(() => {
        this.profile = profile;
        this.isLoadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingProfile = false;
      });
      errorHandler.handleApiError(error, '加载用户信息失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>) {
    if (!this.isAuthenticated || this.isLoadingProfile) return;
    
    this.isLoadingProfile = true;
    loadingManager.startLoading(LoadingType.USER, '更新用户信息...');
    
    try {
      const updatedProfile = await Api.User.updateProfile(updates);
      
      runInAction(() => {
        this.profile = updatedProfile;
        this.isLoadingProfile = false;
      });
      
      this.rootStore.uiStore.showToast('用户信息已更新', 'success');
    } catch (error) {
      runInAction(() => {
        this.isLoadingProfile = false;
      });
      errorHandler.handleApiError(error, '更新用户信息失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Fetch user addresses
   */
  async fetchAddresses() {
    if (!this.isAuthenticated || this.isLoadingAddresses) return;
    
    this.isLoadingAddresses = true;
    loadingManager.startLoading(LoadingType.USER, '加载地址信息...');
    
    try {
      const addresses = await Api.User.getAddresses();
      
      runInAction(() => {
        this.addresses = addresses;
        this.isLoadingAddresses = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingAddresses = false;
      });
      errorHandler.handleApiError(error, '加载地址信息失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Add new address
   */
  async addAddress(address: Omit<Address, 'id'>) {
    if (!this.isAuthenticated || this.isLoadingAddresses) return;
    
    this.isLoadingAddresses = true;
    loadingManager.startLoading(LoadingType.USER, '添加地址...');
    
    try {
      const newAddress = await Api.User.addAddress(address);
      
      runInAction(() => {
        // If new address is default, update other addresses
        if (newAddress.isDefault) {
          this.addresses = this.addresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
        }
        
        this.addresses = [...this.addresses, newAddress];
        this.isLoadingAddresses = false;
      });
      
      this.rootStore.uiStore.showToast('地址已添加', 'success');
    } catch (error) {
      runInAction(() => {
        this.isLoadingAddresses = false;
      });
      errorHandler.handleApiError(error, '添加地址失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Update address
   */
  async updateAddress(id: string, updates: Partial<Omit<Address, 'id'>>) {
    if (!this.isAuthenticated || this.isLoadingAddresses) return;
    
    this.isLoadingAddresses = true;
    loadingManager.startLoading(LoadingType.USER, '更新地址...');
    
    try {
      const updatedAddress = await Api.User.updateAddress(id, updates);
      
      runInAction(() => {
        // If updated address is default, update other addresses
        if (updatedAddress.isDefault) {
          this.addresses = this.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
          }));
        } else {
          this.addresses = this.addresses.map(addr => 
            addr.id === id ? updatedAddress : addr
          );
        }
        
        this.isLoadingAddresses = false;
      });
      
      this.rootStore.uiStore.showToast('地址已更新', 'success');
    } catch (error) {
      runInAction(() => {
        this.isLoadingAddresses = false;
      });
      errorHandler.handleApiError(error, '更新地址失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Delete address
   */
  async deleteAddress(id: string) {
    if (!this.isAuthenticated || this.isLoadingAddresses) return;
    
    this.isLoadingAddresses = true;
    loadingManager.startLoading(LoadingType.USER, '删除地址...');
    
    try {
      await Api.User.deleteAddress(id);
      
      runInAction(() => {
        this.addresses = this.addresses.filter(addr => addr.id !== id);
        this.isLoadingAddresses = false;
      });
      
      this.rootStore.uiStore.showToast('地址已删除', 'success');
    } catch (error) {
      runInAction(() => {
        this.isLoadingAddresses = false;
      });
      errorHandler.handleApiError(error, '删除地址失败');
    } finally {
      loadingManager.stopLoading(LoadingType.USER);
    }
  }
  
  /**
   * Toggle product favorite status
   */
  toggleFavorite(productId: string) {
    if (!this.isAuthenticated) {
      this.rootStore.uiStore.showToast('请先登录', 'info');
      return;
    }
    
    const isFavorite = this.favorites.includes(productId);
    
    if (isFavorite) {
      this.favorites = this.favorites.filter(id => id !== productId);
      this.rootStore.uiStore.showToast('已取消收藏', 'info');
    } else {
      this.favorites = [...this.favorites, productId];
      this.rootStore.uiStore.showToast('已加入收藏', 'success');
    }
    
    this.saveFavorites();
  }
  
  /**
   * Add product to view history
   */
  addToViewHistory(productId: string) {
    if (!this.isAuthenticated) return;
    
    // Remove if already exists (to move to front)
    this.viewHistory = this.viewHistory.filter(id => id !== productId);
    
    // Add to front of array
    this.viewHistory = [productId, ...this.viewHistory];
    
    // Limit to 50 items
    if (this.viewHistory.length > 50) {
      this.viewHistory = this.viewHistory.slice(0, 50);
    }
    
    this.saveViewHistory();
  }
  
  /**
   * Save favorites to storage
   */
  private saveFavorites() {
    try {
      Taro.setStorageSync('yunnan_taste_favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }
  
  /**
   * Load favorites from storage
   */
  private loadFavorites() {
    try {
      const favorites = Taro.getStorageSync('yunnan_taste_favorites');
      if (favorites) {
        this.favorites = JSON.parse(favorites);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }
  
  /**
   * Save view history to storage
   */
  private saveViewHistory() {
    try {
      Taro.setStorageSync('yunnan_taste_view_history', JSON.stringify(this.viewHistory));
    } catch (error) {
      console.error('Failed to save view history:', error);
    }
  }
  
  /**
   * Load view history from storage
   */
  private loadViewHistory() {
    try {
      const history = Taro.getStorageSync('yunnan_taste_view_history');
      if (history) {
        this.viewHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Failed to load view history:', error);
    }
  }
  
  /**
   * Hydrate store with persisted data
   */
  async hydrate() {
    await this.initialize();
  }
}
