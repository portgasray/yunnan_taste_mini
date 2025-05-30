/**
 * Enhanced UIStore with integrated error and loading handling
 * for Yunnan Taste Mini-Program
 */

import { makeAutoObservable } from 'mobx';
import Taro from '@tarojs/taro';
import { RootStore } from './RootStore';
import { loadingManager, LoadingType } from '../services/loadingManager';
import { errorHandler } from '../services/errorHandler';
import { getApiConfig, Environment, setEnvironment } from '../config/env';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
}

export interface ThemeSettings {
  darkMode: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

export class UIStore {
  rootStore: RootStore;
  
  // Toast state
  activeToast: {
    visible: boolean;
    message: string;
    type: ToastType;
    options: ToastOptions;
  } = {
    visible: false,
    message: '',
    type: 'info',
    options: {
      duration: 3000,
      position: 'bottom'
    }
  };
  
  // Loading state
  isLoading: boolean = false;
  loadingMessage: string | undefined = undefined;
  
  // Theme settings
  themeSettings: ThemeSettings = {
    darkMode: false,
    animationsEnabled: true,
    reducedMotion: false
  };
  
  // Environment settings
  currentEnvironment: Environment = Environment.DEVELOPMENT;
  
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    
    // Initialize error handler with this store
    errorHandler.setUIStore(this);
    
    // Load persisted settings
    this.loadSettings();
  }
  
  /**
   * Show toast message
   */
  showToast(message: string, type: ToastType = 'info', options?: Partial<ToastOptions>) {
    this.activeToast = {
      visible: true,
      message,
      type,
      options: {
        ...this.activeToast.options,
        ...options
      }
    };
    
    // Use Taro toast for immediate feedback
    const taroToastType = type === 'error' ? 'none' : 
                         type === 'success' ? 'success' : 
                         type === 'warning' ? 'none' : 'none';
    
    Taro.showToast({
      title: message,
      icon: taroToastType,
      duration: options?.duration || this.activeToast.options.duration
    });
    
    // Auto-hide toast after duration
    setTimeout(() => {
      this.hideToast();
    }, options?.duration || this.activeToast.options.duration);
  }
  
  /**
   * Hide toast message
   */
  hideToast() {
    this.activeToast.visible = false;
  }
  
  /**
   * Set loading state
   */
  setLoading(isLoading: boolean, message?: string, type: LoadingType = LoadingType.GLOBAL) {
    if (isLoading) {
      loadingManager.startLoading(type, message);
    } else {
      loadingManager.stopLoading(type);
    }
    
    this.isLoading = loadingManager.isLoading(LoadingType.GLOBAL);
    this.loadingMessage = loadingManager.getMessage(LoadingType.GLOBAL);
    
    // Show loading indicator using Taro
    if (this.isLoading) {
      Taro.showLoading({
        title: this.loadingMessage || '加载中...',
        mask: true
      });
    } else {
      Taro.hideLoading();
    }
  }
  
  /**
   * Check if specific type is loading
   */
  isLoadingType(type: LoadingType): boolean {
    return loadingManager.isLoading(type);
  }
  
  /**
   * Update theme settings
   */
  updateThemeSettings(settings: Partial<ThemeSettings>) {
    this.themeSettings = {
      ...this.themeSettings,
      ...settings
    };
    
    // Persist settings
    this.saveSettings();
  }
  
  /**
   * Set environment
   */
  setEnvironment(env: Environment) {
    this.currentEnvironment = env;
    setEnvironment(env);
    
    // Show toast notification
    const envNames = {
      [Environment.DEVELOPMENT]: '开发环境',
      [Environment.STAGING]: '测试环境',
      [Environment.PRODUCTION]: '生产环境'
    };
    
    this.showToast(`已切换到${envNames[env]}`, 'info');
  }
  
  /**
   * Save settings to storage
   */
  private saveSettings() {
    try {
      Taro.setStorageSync('yunnan_taste_ui_settings', JSON.stringify(this.themeSettings));
    } catch (error) {
      console.error('Failed to save UI settings:', error);
    }
  }
  
  /**
   * Load settings from storage
   */
  private loadSettings() {
    try {
      const settings = Taro.getStorageSync('yunnan_taste_ui_settings');
      if (settings) {
        this.themeSettings = {
          ...this.themeSettings,
          ...JSON.parse(settings)
        };
      }
    } catch (error) {
      console.error('Failed to load UI settings:', error);
    }
  }
  
  /**
   * Hydrate store with persisted data
   */
  async hydrate() {
    this.loadSettings();
  }
}
