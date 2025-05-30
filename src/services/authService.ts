/**
 * Authentication service for Yunnan Taste Mini-Program
 * Manages user authentication state and token handling
 */

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
