/**
 * Page Transition system for Yunnan Taste Mini-Program
 * Implements custom transitions between pages with Bioluminescent Forest theme effects
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Canvas } from '@tarojs/components';
import { styled } from 'styled-components';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import { AnimationPresets, AnimationUtils } from './index';

// Styled components
const TransitionContainer = styled(View)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  
  &.active {
    pointer-events: auto;
  }
`;

const TransitionCanvas = styled(Canvas)`
  width: 100%;
  height: 100%;
`;

// Transition types
export enum TransitionType {
  NONE = 'none',
  FADE = 'fade',
  SLIDE_UP = 'slide-up',
  SLIDE_DOWN = 'slide-down',
  SLIDE_LEFT = 'slide-left',
  SLIDE_RIGHT = 'slide-right',
  REVEAL = 'reveal',
  EXPAND = 'expand',
  FOREST_REVEAL = 'forest-reveal',
  ENERGY_TRANSFER = 'energy-transfer'
}

// Transition context
export const TransitionContext = React.createContext({
  startTransition: (type: TransitionType, options?: any) => {},
  isTransitioning: false
});

// Transition provider props
interface TransitionProviderProps {
  children: React.ReactNode;
}

// Transition provider component
export const TransitionProvider: React.FC<TransitionProviderProps> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>(TransitionType.NONE);
  const [transitionOptions, setTransitionOptions] = useState<any>({});
  const canvasRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  
  // Start transition
  const startTransition = (type: TransitionType, options: any = {}) => {
    setTransitionType(type);
    setTransitionOptions(options);
    setIsTransitioning(true);
    
    // Schedule end of transition
    const duration = options.duration || AnimationPresets.timing.pageTransition;
    setTimeout(() => {
      setIsTransitioning(false);
    }, duration);
  };
  
  // Handle canvas drawing for particle effects
  useEffect(() => {
    if (!isTransitioning || !canvasRef.current) return;
    
    let ctx: any;
    let width: number;
    let height: number;
    let particles: any[] = [];
    let startTime: number;
    
    const initCanvas = () => {
      try {
        ctx = Taro.createCanvasContext('transition-canvas');
        const info = Taro.getSystemInfoSync();
        width = info.windowWidth;
        height = info.windowHeight;
        
        // Create particles based on transition type
        createParticles();
        
        // Start animation
        startTime = Date.now();
        animateParticles();
      } catch (error) {
        console.error('Failed to initialize transition canvas:', error);
      }
    };
    
    const createParticles = () => {
      particles = [];
      
      // Number of particles based on device performance
      const particleCount = 100;
      
      for (let i = 0; i < particleCount; i++) {
        let particle;
        
        switch (transitionType) {
          case TransitionType.FOREST_REVEAL:
            particle = createForestRevealParticle();
            break;
          case TransitionType.ENERGY_TRANSFER:
            particle = createEnergyTransferParticle();
            break;
          default:
            particle = createDefaultParticle();
        }
        
        particles.push(particle);
      }
    };
    
    const createForestRevealParticle = () => {
      // Create particles that flow from bottom to top with varying speeds
      return {
        x: AnimationUtils.random(0, width),
        y: height + AnimationUtils.random(0, 100),
        size: AnimationUtils.random(1, 4),
        speed: AnimationUtils.random(1, 3),
        opacity: AnimationUtils.random(0.3, 0.8),
        color: getParticleColor()
      };
    };
    
    const createEnergyTransferParticle = () => {
      // Create particles that flow from source to destination
      const source = transitionOptions.source || { x: width / 2, y: height / 2 };
      
      return {
        x: source.x + AnimationUtils.random(-20, 20),
        y: source.y + AnimationUtils.random(-20, 20),
        size: AnimationUtils.random(1, 4),
        speed: AnimationUtils.random(1, 5),
        opacity: AnimationUtils.random(0.3, 0.8),
        angle: AnimationUtils.random(0, Math.PI * 2),
        color: getParticleColor()
      };
    };
    
    const createDefaultParticle = () => {
      // Default particles for generic transitions
      return {
        x: AnimationUtils.random(0, width),
        y: AnimationUtils.random(0, height),
        size: AnimationUtils.random(1, 4),
        speed: AnimationUtils.random(0.5, 2),
        opacity: AnimationUtils.random(0.3, 0.8),
        angle: AnimationUtils.random(0, Math.PI * 2),
        color: getParticleColor()
      };
    };
    
    const getParticleColor = () => {
      // Colors based on Bioluminescent Forest theme
      const colors = [
        '#5CE0B8', // Primary teal
        '#3D88F2', // Secondary blue
        '#A78BFA', // Purple accent
        '#90E0EF', // Light blue
        '#48BFE3'  // Medium blue
      ];
      
      return colors[Math.floor(AnimationUtils.random(0, colors.length))];
    };
    
    const animateParticles = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate progress
      const elapsed = Date.now() - startTime;
      const duration = transitionOptions.duration || AnimationPresets.timing.pageTransition;
      const progress = Math.min(elapsed / duration, 1);
      
      // Update and draw particles
      particles.forEach((particle) => {
        updateParticle(particle, progress);
        drawParticle(particle, progress);
      });
      
      // Draw transition overlay if needed
      drawTransitionOverlay(progress);
      
      // Draw to canvas
      ctx.draw();
      
      // Continue animation if still transitioning
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateParticles);
      }
    };
    
    const updateParticle = (particle: any, progress: number) => {
      switch (transitionType) {
        case TransitionType.FOREST_REVEAL:
          // Move particles upward
          particle.y -= particle.speed * (1 + progress * 2);
          
          // Fade out as they reach the top
          if (particle.y < 0) {
            particle.y = height + AnimationUtils.random(0, 50);
            particle.x = AnimationUtils.random(0, width);
          }
          break;
          
        case TransitionType.ENERGY_TRANSFER:
          // Move particles toward destination
          const destination = transitionOptions.destination || { x: width / 2, y: 0 };
          const dx = destination.x - particle.x;
          const dy = destination.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            particle.x += (dx / distance) * particle.speed * (1 + progress * 3);
            particle.y += (dy / distance) * particle.speed * (1 + progress * 3);
          } else {
            // Reset particle to source
            const source = transitionOptions.source || { x: width / 2, y: height / 2 };
            particle.x = source.x + AnimationUtils.random(-20, 20);
            particle.y = source.y + AnimationUtils.random(-20, 20);
          }
          break;
          
        default:
          // Default particle movement
          particle.x += Math.cos(particle.angle) * particle.speed;
          particle.y += Math.sin(particle.angle) * particle.speed;
          
          // Wrap around edges
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
      }
    };
    
    const drawParticle = (particle: any, progress: number) => {
      // Calculate particle opacity based on progress
      let opacity = particle.opacity;
      
      if (progress < 0.3) {
        // Fade in
        opacity *= progress / 0.3;
      } else if (progress > 0.7) {
        // Fade out
        opacity *= (1 - progress) / 0.3;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      
      // Draw glow effect
      const glowSize = particle.size * 2;
      const gradient = ctx.createCircularGradient(particle.x, particle.y, glowSize);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = opacity * 0.5;
      ctx.fill();
      
      // Reset global alpha
      ctx.globalAlpha = 1;
    };
    
    const drawTransitionOverlay = (progress: number) => {
      switch (transitionType) {
        case TransitionType.FADE:
          // Simple fade overlay
          ctx.fillStyle = '#0A0F1E'; // Deep blue background
          
          if (transitionOptions.direction === 'in') {
            ctx.globalAlpha = 1 - progress;
          } else {
            ctx.globalAlpha = progress;
          }
          
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1;
          break;
          
        case TransitionType.REVEAL:
          // Reveal effect with gradient
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#0A0F1E');
          gradient.addColorStop(1, 'rgba(10, 15, 30, 0.7)');
          
          ctx.fillStyle = gradient;
          
          if (transitionOptions.direction === 'in') {
            ctx.globalAlpha = 1 - progress;
          } else {
            ctx.globalAlpha = progress;
          }
          
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1;
          break;
          
        case TransitionType.EXPAND:
          // Expanding circle overlay
          const centerX = transitionOptions.centerX || width / 2;
          const centerY = transitionOptions.centerY || height / 2;
          const maxRadius = Math.sqrt(width * width + height * height);
          
          let radius;
          if (transitionOptions.direction === 'in') {
            radius = maxRadius * (1 - progress);
          } else {
            radius = maxRadius * progress;
          }
          
          ctx.fillStyle = '#0A0F1E';
          ctx.globalAlpha = 0.8;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          
          if (transitionOptions.direction === 'in') {
            ctx.rect(width, 0, -width, height);
          } else {
            ctx.rect(0, 0, width, height);
          }
          
          ctx.fill('evenodd');
          ctx.globalAlpha = 1;
          break;
      }
    };
    
    // Initialize canvas and start animation
    initCanvas();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTransitioning, transitionType, transitionOptions]);
  
  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      <TransitionContainer className={isTransitioning ? 'active' : ''}>
        <TransitionCanvas id="transition-canvas" canvasId="transition-canvas" ref={canvasRef} />
      </TransitionContainer>
    </TransitionContext.Provider>
  );
};

// Hook to use transition
export const usePageTransition = () => {
  const context = React.useContext(TransitionContext);
  
  if (!context) {
    throw new Error('usePageTransition must be used within a TransitionProvider');
  }
  
  return context;
};

// Hook to automatically handle page transitions
export const useAutoPageTransition = (type: TransitionType = TransitionType.FOREST_REVEAL, options: any = {}) => {
  const { startTransition } = usePageTransition();
  
  // Start transition when page shows
  useDidShow(() => {
    startTransition(type, { ...options, direction: 'in' });
  });
  
  // Start transition when page hides
  useDidHide(() => {
    startTransition(type, { ...options, direction: 'out' });
  });
};

export default {
  TransitionProvider,
  usePageTransition,
  useAutoPageTransition,
  TransitionType
};
