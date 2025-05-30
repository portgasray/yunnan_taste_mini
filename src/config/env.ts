/**
 * Environment configuration for Yunnan Taste Mini-Program
 * Manages API endpoints and settings across different environments
 */

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

/**
 * Set current environment
 */
export const setEnvironment = (env: Environment) => {
  currentEnv = env;
};

/**
 * Get current environment
 */
export const getCurrentEnvironment = (): Environment => {
  return currentEnv;
};

/**
 * Get API configuration for current environment
 */
export const getApiConfig = (): ApiConfig => {
  return configs[currentEnv];
};
