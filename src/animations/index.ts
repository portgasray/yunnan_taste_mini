/**
 * Animation system for Yunnan Taste Mini-Program
 * Core animation utilities and hooks for the Bioluminescent Forest theme
 */

import { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';

// Animation timing and easing presets
export const AnimationPresets = {
  // Timing presets (in ms)
  timing: {
    quick: 200,
    standard: 300,
    emphasis: 450,
    complex: 600,
    pageTransition: 500
  },
  
  // Easing presets
  easing: {
    // Standard easings
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    
    // Custom theme easings
    forestBreeze: 'cubic-bezier(0.16, 1, 0.3, 1)',
    organicBounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    gentleReveal: 'cubic-bezier(0.22, 1, 0.36, 1)'
  }
};

// Animation utility functions
export const AnimationUtils = {
  /**
   * Creates a CSS transition string
   */
  createTransition: (
    properties = ['all'],
    duration = AnimationPresets.timing.standard,
    easing = AnimationPresets.easing.standard,
    delay = 0
  ) => {
    const props = Array.isArray(properties) ? properties.join(', ') : properties;
    return `${props} ${duration}ms ${easing} ${delay}ms`;
  },
  
  /**
   * Creates a CSS transform string with multiple transforms
   */
  createTransform: (transforms) => {
    return Object.entries(transforms)
      .map(([key, value]) => {
        // Handle special cases
        if (key === 'scale' && typeof value === 'number') {
          return `scale(${value})`;
        }
        if (key === 'rotate' && typeof value === 'number') {
          return `rotate(${value}deg)`;
        }
        return `${key}(${value})`;
      })
      .join(' ');
  },
  
  /**
   * Creates a CSS keyframes animation
   */
  createKeyframeAnimation: (
    name,
    keyframes,
    duration = AnimationPresets.timing.standard,
    easing = AnimationPresets.easing.standard,
    iterationCount = 1,
    direction = 'normal',
    fillMode = 'forwards'
  ) => {
    return `${name} ${duration}ms ${easing} ${iterationCount} ${direction} ${fillMode}`;
  },
  
  /**
   * Generates a random number between min and max
   */
  random: (min, max) => {
    return Math.random() * (max - min) + min;
  },
  
  /**
   * Clamps a value between min and max
   */
  clamp: (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  },
  
  /**
   * Maps a value from one range to another
   */
  mapRange: (value, inputMin, inputMax, outputMin, outputMax) => {
    return ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) + outputMin;
  }
};

// Animation hooks

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = (threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold
      }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [threshold]);
  
  return { ref, isVisible };
};

/**
 * Hook for staggered animations
 */
export const useStaggeredAnimation = (itemCount, staggerDelay = 50, initialDelay = 0) => {
  const getDelay = (index) => initialDelay + index * staggerDelay;
  
  return { getDelay };
};

/**
 * Hook for spring animations
 */
export const useSpringAnimation = (
  initialValue = 0,
  config = { tension: 170, friction: 26 }
) => {
  const [value, setValue] = useState(initialValue);
  const springRef = useRef({
    value: initialValue,
    velocity: 0,
    target: initialValue,
    ...config
  });
  
  const animateSpring = (targetValue) => {
    springRef.current.target = targetValue;
    
    if (!springRef.current.animating) {
      springRef.current.animating = true;
      
      const animate = () => {
        const { value, velocity, target, tension, friction } = springRef.current;
        
        // Spring physics calculation
        const force = tension * (target - value);
        const damping = friction * velocity;
        const acceleration = force - damping;
        
        const newVelocity = velocity + acceleration * 0.001;
        const newValue = value + newVelocity * 0.001;
        
        springRef.current.velocity = newVelocity;
        springRef.current.value = newValue;
        
        setValue(newValue);
        
        // Check if animation should continue
        const isSettled = Math.abs(newValue - target) < 0.01 && Math.abs(newVelocity) < 0.01;
        
        if (isSettled) {
          springRef.current.animating = false;
          springRef.current.value = target;
          springRef.current.velocity = 0;
          setValue(target);
        } else {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };
  
  return { value, animateSpring };
};

/**
 * Hook for reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check system preferences if available
    try {
      const systemInfo = Taro.getSystemInfoSync();
      if (systemInfo.platform === 'ios' || systemInfo.platform === 'android') {
        // For mobile, we could check settings if API is available
        // For now, default to false
        setPrefersReducedMotion(false);
      } else {
        // For web, we could use media query
        setPrefersReducedMotion(false);
      }
    } catch (error) {
      console.error('Failed to check reduced motion preference:', error);
      setPrefersReducedMotion(false);
    }
  }, []);
  
  return prefersReducedMotion;
};

/**
 * Hook for parallax effects
 */
export const useParallax = (depth = 0.5) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const handleScroll = () => {
      if (!ref.current) return;
      
      // Get element position
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const elementTop = rect.top + scrollY;
      
      // Calculate parallax offset
      const viewportHeight = window.innerHeight;
      const elementVisible = rect.top < viewportHeight && rect.bottom > 0;
      
      if (elementVisible) {
        const scrollPosition = scrollY + viewportHeight;
        const elementPosition = elementTop + rect.height / 2;
        const relativePosition = (scrollPosition - elementPosition) / viewportHeight;
        
        setOffset({
          x: 0, // We could add horizontal parallax if needed
          y: relativePosition * depth * 100 // Convert to pixels
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [depth]);
  
  return { ref, offset };
};

export default {
  AnimationPresets,
  AnimationUtils,
  useScrollAnimation,
  useStaggeredAnimation,
  useSpringAnimation,
  useReducedMotion,
  useParallax
};
