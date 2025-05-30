/**
 * Subpackage configuration for Yunnan Taste Mini-Program
 * Optimizes loading by splitting the app into main package and subpackages
 */

import * as path from 'path';

// Define the main package pages
const mainPackagePages = [
  'pages/home/index',
  'pages/category/index',
  'pages/search/index',
  'pages/user/index',
];

// Define subpackages for better performance and loading
const subpackages = [
  {
    root: 'subpackages/product',
    name: 'product',
    pages: [
      'pages/detail',
      'pages/list',
      'pages/review',
    ]
  },
  {
    root: 'subpackages/order',
    name: 'order',
    pages: [
      'pages/cart',
      'pages/checkout',
      'pages/payment',
      'pages/history',
    ]
  },
  {
    root: 'subpackages/content',
    name: 'content',
    pages: [
      'pages/article',
      'pages/heritage',
      'pages/story',
    ]
  },
  {
    root: 'subpackages/settings',
    name: 'settings',
    pages: [
      'pages/profile',
      'pages/address',
      'pages/preferences',
      'pages/about',
    ]
  }
];

/**
 * Updates app.config.ts to use subpackages
 * @returns Configuration object for app.config.ts
 */
export const generateAppConfig = () => {
  return {
    pages: mainPackagePages,
    subpackages: subpackages.map(subpackage => ({
      root: subpackage.root,
      pages: subpackage.pages.map(page => page.replace('pages/', ''))
    })),
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#0A0F1E',
      navigationBarTitleText: 'Yunnan Taste',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      custom: true,
      color: '#8A8F9C',
      selectedColor: '#5CE0B8',
      backgroundColor: '#0A0F1E',
      list: [
        {
          pagePath: 'pages/home/index',
          text: 'Home'
        },
        {
          pagePath: 'pages/category/index',
          text: 'Category'
        },
        {
          pagePath: 'pages/search/index',
          text: 'Search'
        },
        {
          pagePath: 'pages/user/index',
          text: 'User'
        }
      ]
    },
    lazyCodeLoading: 'requiredComponents'
  };
};

/**
 * Creates directory structure for subpackages
 */
export const createSubpackageDirectories = () => {
  const fs = require('fs');
  
  subpackages.forEach(subpackage => {
    const subpackagePath = path.resolve(__dirname, '../src', subpackage.root);
    
    // Create subpackage directory if it doesn't exist
    if (!fs.existsSync(subpackagePath)) {
      fs.mkdirSync(subpackagePath, { recursive: true });
    }
  });
};

export default {
  mainPackagePages,
  subpackages,
  generateAppConfig,
  createSubpackageDirectories
};
