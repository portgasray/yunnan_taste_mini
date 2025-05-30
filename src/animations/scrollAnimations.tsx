/**
 * Scroll Animation components for Yunnan Taste Mini-Program
 * Implements scroll-triggered animations with Bioluminescent Forest theme effects
 */

import React, { useEffect, useRef, useState } from 'react';
import { View } from '@tarojs/components';
import { styled } from 'styled-components';
import Taro from '@tarojs/taro';
import { AnimationPresets, AnimationUtils, useScrollAnimation, useStaggeredAnimation, useReducedMotion } from './index';

// Styled components
const AnimatedContainer = styled(View)<{
  $isVisible: boolean;
  $animationType: string;
  $duration: number;
  $delay: number;
  $easing: string;
  $disableAnimation: boolean;
}>`
  opacity: ${props => (props.$disableAnimation ? 1 : props.$isVisible ? 1 : 0)};
  transform: ${props => {
    if (props.$disableAnimation) return 'none';
    
    if (!props.$isVisible) {
      switch (props.$animationType) {
        case 'fade-up':
          return 'translateY(20px)';
        case 'fade-down':
          return 'translateY(-20px)';
        case 'fade-left':
          return 'translateX(20px)';
        case 'fade-right':
          return 'translateX(-20px)';
        case 'zoom-in':
          return 'scale(0.95)';
        case 'zoom-out':
          return 'scale(1.05)';
        default:
          return 'none';
      }
    }
    
    return 'none';
  }};
  transition: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : `opacity ${props.$duration}ms ${props.$easing} ${props.$delay}ms, transform ${props.$duration}ms ${props.$easing} ${props.$delay}ms`
  };
`;

const ParallaxContainer = styled(View)<{
  $offsetY: number;
  $offsetX: number;
  $disableAnimation: boolean;
}>`
  transform: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : `translate3d(${props.$offsetX}px, ${props.$offsetY}px, 0)`
  };
  transition: transform 0.1s linear;
  will-change: transform;
`;

const StaggeredContainer = styled(View)`
  position: relative;
`;

// Animation types
export type ScrollAnimationType = 
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'glow';

// Props interfaces
interface FadeInProps {
  children: React.ReactNode;
  type?: ScrollAnimationType;
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  disabled?: boolean;
}

interface ParallaxProps {
  children: React.ReactNode;
  depth?: number;
  disabled?: boolean;
}

interface StaggeredItemProps {
  children: React.ReactNode;
  index: number;
  type?: ScrollAnimationType;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  easing?: string;
  disabled?: boolean;
}

interface StaggeredContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  threshold?: number;
}

// FadeIn component - Fades in elements when they enter the viewport
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  type = 'fade-up',
  duration = AnimationPresets.timing.standard,
  delay = 0,
  easing = AnimationPresets.easing.gentleReveal,
  threshold = 0.15,
  disabled = false
}) => {
  const { ref, isVisible } = useScrollAnimation(threshold);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  return (
    <AnimatedContainer
      ref={ref}
      $isVisible={isVisible}
      $animationType={type}
      $duration={duration}
      $delay={delay}
      $easing={easing}
      $disableAnimation={disableAnimation}
    >
      {children}
    </AnimatedContainer>
  );
};

// Parallax component - Creates parallax effect on scroll
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  depth = 0.2,
  disabled = false
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const ref = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  useEffect(() => {
    if (disableAnimation || !ref.current) return;
    
    const handleScroll = () => {
      if (!ref.current) return;
      
      try {
        // Get element position relative to viewport
        const query = Taro.createSelectorQuery();
        query.select(`#${ref.current.uid}`).boundingClientRect();
        query.exec((res) => {
          if (!res || !res[0]) return;
          
          const rect = res[0];
          const windowHeight = Taro.getSystemInfoSync().windowHeight;
          
          // Calculate element position relative to viewport center
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const relativePosition = (elementCenter - viewportCenter) / windowHeight;
          
          // Apply parallax effect
          setOffsetY(-relativePosition * depth * 100);
          
          // We could also add horizontal parallax if needed
          // setOffsetX(someHorizontalValue);
        });
      } catch (error) {
        console.error('Failed to calculate parallax effect:', error);
      }
    };
    
    // Set up scroll listener
    const scrollListener = () => {
      handleScroll();
    };
    
    Taro.onPageScroll(scrollListener);
    handleScroll(); // Initial calculation
    
    return () => {
      Taro.offPageScroll(scrollListener);
    };
  }, [depth, disableAnimation]);
  
  return (
    <View ref={ref}>
      <ParallaxContainer
        $offsetY={offsetY}
        $offsetX={offsetX}
        $disableAnimation={disableAnimation}
      >
        {children}
      </ParallaxContainer>
    </View>
  );
};

// StaggeredItem component - Individual item in a staggered animation
export const StaggeredItem: React.FC<StaggeredItemProps> = ({
  children,
  index,
  type = 'fade-up',
  staggerDelay = 50,
  initialDelay = 0,
  duration = AnimationPresets.timing.standard,
  easing = AnimationPresets.easing.gentleReveal,
  disabled = false
}) => {
  const delay = initialDelay + index * staggerDelay;
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  return (
    <AnimatedContainer
      $isVisible={true} // Always visible, controlled by parent
      $animationType={type}
      $duration={duration}
      $delay={delay}
      $easing={easing}
      $disableAnimation={disableAnimation}
    >
      {children}
    </AnimatedContainer>
  );
};

// StaggeredContainer component - Container for staggered animations
export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  staggerDelay = 50,
  initialDelay = 0,
  threshold = 0.15
}) => {
  const { ref, isVisible } = useScrollAnimation(threshold);
  const [isRendered, setIsRendered] = useState(false);
  
  // Only render children when container is visible
  useEffect(() => {
    if (isVisible && !isRendered) {
      setIsRendered(true);
    }
  }, [isVisible, isRendered]);
  
  return (
    <StaggeredContainer ref={ref}>
      {isRendered ? children : null}
    </StaggeredContainer>
  );
};

// GlowContainer component - Container with bioluminescent glow effect
const GlowWrapper = styled(View)<{
  $isVisible: boolean;
  $glowColor: string;
  $glowIntensity: number;
  $pulseEnabled: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: ${props => props.$glowColor};
    opacity: ${props => 
      props.$disableAnimation 
        ? props.$glowIntensity * 0.5 
        : props.$isVisible 
          ? props.$glowIntensity * 0.5 
          : 0
    };
    filter: blur(15px);
    border-radius: inherit;
    z-index: -1;
    transition: opacity ${AnimationPresets.timing.standard}ms ${AnimationPresets.easing.gentleReveal};
    animation: ${props => 
      props.$disableAnimation || !props.$pulseEnabled 
        ? 'none' 
        : 'glow-pulse 3s infinite alternate'
    };
    
    @keyframes glow-pulse {
      0% {
        opacity: ${props => props.$glowIntensity * 0.3};
      }
      100% {
        opacity: ${props => props.$glowIntensity * 0.7};
      }
    }
  }
`;

interface GlowContainerProps {
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: number;
  pulseEnabled?: boolean;
  threshold?: number;
  disabled?: boolean;
}

export const GlowContainer: React.FC<GlowContainerProps> = ({
  children,
  glowColor = 'rgba(92, 224, 184, 0.5)', // Default teal glow
  glowIntensity = 0.5,
  pulseEnabled = true,
  threshold = 0.15,
  disabled = false
}) => {
  const { ref, isVisible } = useScrollAnimation(threshold);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  return (
    <GlowWrapper
      ref={ref}
      $isVisible={isVisible}
      $glowColor={glowColor}
      $glowIntensity={glowIntensity}
      $pulseEnabled={pulseEnabled}
      $disableAnimation={disableAnimation}
    >
      {children}
    </GlowWrapper>
  );
};

// ParticleBackground component - Adds bioluminescent particle background
const ParticleBackgroundContainer = styled(View)`
  position: relative;
  overflow: hidden;
`;

const ParticleCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const ParticleContent = styled(View)`
  position: relative;
  z-index: 1;
`;

interface ParticleBackgroundProps {
  children: React.ReactNode;
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  particleSpeed?: number;
  disabled?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  children,
  particleCount = 30,
  particleColor = '#5CE0B8',
  particleSize = 2,
  particleSpeed = 1,
  disabled = false
}) => {
  const canvasRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  useEffect(() => {
    if (disableAnimation || !canvasRef.current) return;
    
    let ctx: any;
    let width: number;
    let height: number;
    let particles: any[] = [];
    
    const initCanvas = () => {
      try {
        ctx = Taro.createCanvasContext('particle-canvas');
        const info = Taro.getSystemInfoSync();
        width = info.windowWidth;
        height = info.windowHeight;
        
        // Create particles
        createParticles();
        
        // Start animation
        animateParticles();
      } catch (error) {
        console.error('Failed to initialize particle canvas:', error);
      }
    };
    
    const createParticles = () => {
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: AnimationUtils.random(0, width),
          y: AnimationUtils.random(0, height),
          size: AnimationUtils.random(particleSize * 0.5, particleSize * 1.5),
          speed: AnimationUtils.random(particleSpeed * 0.5, particleSpeed * 1.5),
          angle: AnimationUtils.random(0, Math.PI * 2),
          opacity: AnimationUtils.random(0.3, 0.8),
          color: particleColor
        });
      }
    };
    
    const animateParticles = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Draw glow effect
        const glowSize = particle.size * 2;
        const gradient = ctx.createCircularGradient(particle.x, particle.y, glowSize);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.fill();
      });
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
      // Draw to canvas
      ctx.draw();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animateParticles);
    };
    
    // Initialize canvas and start animation
    initCanvas();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [disableAnimation, particleCount, particleColor, particleSize, particleSpeed]);
  
  return (
    <ParticleBackgroundContainer>
      {!disableAnimation && (
        <ParticleCanvas id="particle-canvas" canvasId="particle-canvas" ref={canvasRef} />
      )}
      <ParticleContent>
        {children}
      </ParticleContent>
    </ParticleBackgroundContainer>
  );
};

export default {
  FadeIn,
  Parallax,
  StaggeredItem,
  StaggeredContainer,
  GlowContainer,
  ParticleBackground
};
