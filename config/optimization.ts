/**
 * Optimization utilities for Yunnan Taste Mini-Program
 * Provides functions to optimize bundle size and performance
 */

import * as path from 'path';
import * as fs from 'fs';

/**
 * Analyzes the bundle size and provides recommendations
 * @param distPath Path to the distribution directory
 * @returns Analysis results with recommendations
 */
export const analyzeBundleSize = (distPath: string = path.resolve(__dirname, '../dist')) => {
  try {
    // Get all JS files in the dist directory
    const jsFiles = getAllFiles(distPath).filter(file => file.endsWith('.js'));
    
    // Calculate total size
    const totalSize = jsFiles.reduce((acc, file) => {
      const stats = fs.statSync(file);
      return acc + stats.size;
    }, 0);
    
    // Get individual file sizes
    const fileSizes = jsFiles.map(file => {
      const stats = fs.statSync(file);
      return {
        file: path.relative(distPath, file),
        size: stats.size,
        sizeInKB: Math.round(stats.size / 1024 * 100) / 100
      };
    }).sort((a, b) => b.size - a.size);
    
    // WeChat Mini-Program size limits
    const WECHAT_PACKAGE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB
    const WECHAT_SUBPACKAGE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB
    
    // Check if we're exceeding limits
    const isExceedingMainLimit = totalSize > WECHAT_PACKAGE_SIZE_LIMIT;
    
    // Generate recommendations
    const recommendations = [];
    
    if (isExceedingMainLimit) {
      recommendations.push('Consider using subpackages to split your Mini-Program');
    }
    
    // Check for large files that could be split
    const largeFiles = fileSizes.filter(file => file.size > 100 * 1024); // Files larger than 100KB
    if (largeFiles.length > 0) {
      recommendations.push(`Consider optimizing large files: ${largeFiles.map(f => f.file).join(', ')}`);
    }
    
    return {
      totalSize,
      totalSizeInKB: Math.round(totalSize / 1024 * 100) / 100,
      totalSizeInMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      isExceedingMainLimit,
      fileSizes: fileSizes.slice(0, 10), // Top 10 largest files
      recommendations
    };
  } catch (error) {
    console.error('Error analyzing bundle size:', error);
    return {
      error: 'Failed to analyze bundle size',
      details: error.message
    };
  }
};

/**
 * Gets all files in a directory recursively
 * @param dirPath Directory path
 * @returns Array of file paths
 */
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });
  
  return arrayOfFiles;
};

/**
 * Creates a subpackage configuration for the Mini-Program
 * @param mainPackage Main package configuration
 * @param subpackages Subpackage configurations
 * @returns Updated configuration
 */
export const createSubpackageConfig = (mainPackage: any, subpackages: any[]) => {
  return {
    ...mainPackage,
    subpackages: subpackages.map(subpackage => ({
      root: subpackage.root,
      name: subpackage.name,
      pages: subpackage.pages
    }))
  };
};

/**
 * Optimizes images in the project
 * @param srcPath Source directory path
 * @returns Optimization results
 */
export const optimizeImages = async (srcPath: string = path.resolve(__dirname, '../src')) => {
  try {
    // This is a placeholder for actual image optimization
    // In a real implementation, we would use libraries like imagemin
    console.log('Image optimization would process images in:', srcPath);
    
    return {
      success: true,
      message: 'Image optimization is configured in the build process'
    };
  } catch (error) {
    console.error('Error optimizing images:', error);
    return {
      success: false,
      error: 'Failed to optimize images',
      details: error.message
    };
  }
};

/**
 * Analyzes and optimizes the use of third-party libraries
 * @param packageJsonPath Path to package.json
 * @returns Analysis results with recommendations
 */
export const analyzeThirdPartyLibraries = (packageJsonPath: string = path.resolve(__dirname, '../package.json')) => {
  try {
    const packageJson = require(packageJsonPath);
    const dependencies = packageJson.dependencies || {};
    
    // Libraries that might be too large for Mini-Programs
    const potentiallyLargeLibraries = [
      'moment',
      'lodash',
      'chart.js',
      'three.js',
      'axios'
    ];
    
    // Check for large libraries
    const foundLargeLibraries = Object.keys(dependencies).filter(dep => 
      potentiallyLargeLibraries.some(lib => dep === lib || dep.includes(lib))
    );
    
    // Generate recommendations
    const recommendations = [];
    
    if (foundLargeLibraries.length > 0) {
      recommendations.push(`Consider replacing or optimizing these libraries: ${foundLargeLibraries.join(', ')}`);
      
      // Specific recommendations
      if (foundLargeLibraries.includes('moment')) {
        recommendations.push('Replace moment.js with day.js or date-fns for smaller bundle size');
      }
      
      if (foundLargeLibraries.includes('lodash')) {
        recommendations.push('Import specific lodash functions instead of the entire library');
      }
      
      if (foundLargeLibraries.some(lib => lib.includes('chart'))) {
        recommendations.push('Consider using a lighter charting library or custom implementation');
      }
    }
    
    return {
      totalDependencies: Object.keys(dependencies).length,
      potentiallyLargeLibraries: foundLargeLibraries,
      recommendations
    };
  } catch (error) {
    console.error('Error analyzing third-party libraries:', error);
    return {
      error: 'Failed to analyze third-party libraries',
      details: error.message
    };
  }
};

export default {
  analyzeBundleSize,
  createSubpackageConfig,
  optimizeImages,
  analyzeThirdPartyLibraries
};
