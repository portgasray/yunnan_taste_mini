/**
 * Animation integration and validation for Yunnan Taste Mini-Program
 * Exports all animation components and provides validation utilities
 */

import { AnimationPresets, AnimationUtils, useScrollAnimation, useStaggeredAnimation, useSpringAnimation, useReducedMotion, useParallax } from './index';
import { TransitionProvider, usePageTransition, useAutoPageTransition, TransitionType } from './pageTransitions';
import { FadeIn, Parallax, StaggeredItem, StaggeredContainer, GlowContainer, ParticleBackground } from './scrollAnimations';
import { Button, Card, Toggle, Input } from './interactiveFeedback';
import { LoadingSpinner, Skeleton, SkeletonList, SkeletonCard, SuccessIndicator, ErrorIndicator, EmptyState } from './loadingStates';

// Export all animation components
export {
  // Core animation system
  AnimationPresets,
  AnimationUtils,
  useScrollAnimation,
  useStaggeredAnimation,
  useSpringAnimation,
  useReducedMotion,
  useParallax,
  
  // Page transitions
  TransitionProvider,
  usePageTransition,
  useAutoPageTransition,
  TransitionType,
  
  // Scroll animations
  FadeIn,
  Parallax,
  StaggeredItem,
  StaggeredContainer,
  GlowContainer,
  ParticleBackground,
  
  // Interactive feedback
  Button,
  Card,
  Toggle,
  Input,
  
  // Loading states
  LoadingSpinner,
  Skeleton,
  SkeletonList,
  SkeletonCard,
  SuccessIndicator,
  ErrorIndicator,
  EmptyState
};

// Animation validation utilities
export const AnimationValidation = {
  /**
   * Checks if animations should be enabled based on device performance
   */
  shouldEnableAnimations: () => {
    try {
      const systemInfo = Taro.getSystemInfoSync();
      
      // Check for low-end devices
      const isLowEndDevice = 
        (systemInfo.platform === 'android' && systemInfo.system && parseInt(systemInfo.system.split(' ')[1]) < 8) ||
        (systemInfo.platform === 'ios' && systemInfo.system && parseInt(systemInfo.system.split(' ')[1]) < 12) ||
        (systemInfo.benchmarkLevel && systemInfo.benchmarkLevel < 30);
      
      return !isLowEndDevice;
    } catch (error) {
      console.error('Failed to check device performance:', error);
      return true; // Default to enabling animations
    }
  },
  
  /**
   * Checks if reduced motion is preferred
   */
  prefersReducedMotion: () => {
    try {
      // For now, we don't have a direct way to check this in Taro
      // In the future, we could implement a setting in the app
      return false;
    } catch (error) {
      console.error('Failed to check reduced motion preference:', error);
      return false;
    }
  },
  
  /**
   * Logs animation performance metrics
   */
  logPerformance: (animationName: string) => {
    const startTime = Date.now();
    
    return {
      end: () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Animation performance: ${animationName} took ${duration}ms`);
        
        return duration;
      }
    };
  }
};

export default {
  // Core animation system
  AnimationPresets,
  AnimationUtils,
  useScrollAnimation,
  useStaggeredAnimation,
  useSpringAnimation,
  useReducedMotion,
  useParallax,
  
  // Page transitions
  TransitionProvider,
  usePageTransition,
  useAutoPageTransition,
  TransitionType,
  
  // Scroll animations
  FadeIn,
  Parallax,
  StaggeredItem,
  StaggeredContainer,
  GlowContainer,
  ParticleBackground,
  
  // Interactive feedback
  Button,
  Card,
  Toggle,
  Input,
  
  // Loading states
  LoadingSpinner,
  Skeleton,
  SkeletonList,
  SkeletonCard,
  SuccessIndicator,
  ErrorIndicator,
  EmptyState,
  
  // Validation utilities
  AnimationValidation
};
