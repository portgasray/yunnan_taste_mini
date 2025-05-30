/**
 * Test configuration for Yunnan Taste Mini-Program
 * Sets up Jest for unit and integration testing
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // File extensions to process
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Transform files with babel
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Module name mapper for non-JS imports
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app.config.ts',
    '!src/app.ts',
    '!src/index.html',
  ],
  coverageDirectory: 'coverage',
  
  // Test paths
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Global variables
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
