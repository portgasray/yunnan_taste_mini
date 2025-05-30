/**
 * Loading and State Transition animations for Yunnan Taste Mini-Program
 * Implements themed loading indicators and state transitions with Bioluminescent Forest theme
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Canvas, Text } from '@tarojs/components';
import { styled } from 'styled-components';
import Taro from '@tarojs/taro';
import { AnimationPresets, AnimationUtils, useReducedMotion } from './index';

// Styled components
const LoadingContainer = styled(View)<{
  $size: string;
  $fullscreen: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  ${props => props.$fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-background);
    z-index: 9999;
  `}
  
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '60px';
      case 'lg': return '120px';
      default: return '80px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '60px';
      case 'lg': return '120px';
      default: return '80px';
    }
  }};
`;

const LoadingCanvas = styled(Canvas)`
  width: 100%;
  height: 100%;
`;

const LoadingText = styled(Text)<{
  $size: string;
}>`
  margin-top: var(--spacing-sm);
  color: var(--color-textSecondary);
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return 'var(--font-size-xs)';
      case 'lg': return 'var(--font-size-md)';
      default: return 'var(--font-size-sm)';
    }
  }};
  text-align: center;
`;

const SkeletonContainer = styled(View)`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const SkeletonElement = styled(View)<{
  $type: string;
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $disableAnimation: boolean;
}>`
  background-color: var(--color-backgroundAlt);
  position: relative;
  overflow: hidden;
  
  /* Dimensions based on type */
  width: ${props => props.$width || (
    props.$type === 'circle' ? '48px' :
    props.$type === 'avatar' ? '48px' :
    props.$type === 'button' ? '120px' :
    props.$type === 'title' ? '70%' :
    props.$type === 'text' ? '100%' :
    props.$type === 'thumbnail' ? '80px' :
    props.$type === 'card' ? '100%' :
    '100%'
  )};
  
  height: ${props => props.$height || (
    props.$type === 'circle' ? '48px' :
    props.$type === 'avatar' ? '48px' :
    props.$type === 'button' ? '36px' :
    props.$type === 'title' ? '24px' :
    props.$type === 'text' ? '16px' :
    props.$type === 'thumbnail' ? '80px' :
    props.$type === 'card' ? '120px' :
    '16px'
  )};
  
  border-radius: ${props => props.$borderRadius || (
    props.$type === 'circle' ? '50%' :
    props.$type === 'avatar' ? '50%' :
    props.$type === 'button' ? 'var(--radius-md)' :
    props.$type === 'title' ? 'var(--radius-sm)' :
    props.$type === 'text' ? 'var(--radius-sm)' :
    props.$type === 'thumbnail' ? 'var(--radius-md)' :
    props.$type === 'card' ? 'var(--radius-md)' :
    'var(--radius-sm)'
  )};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(92, 224, 184, 0.15) 50%,
      transparent 100%
    );
    animation: ${props => props.$disableAnimation ? 'none' : 'skeleton-pulse 1.5s infinite'};
  }
  
  @keyframes skeleton-pulse {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const SuccessContainer = styled(View)<{
  $size: string;
  $active: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
`;

const SuccessCircle = styled(View)<{
  $size: string;
  $active: boolean;
  $disableAnimation: boolean;
}>`
  position: absolute;
  border-radius: 50%;
  background-color: var(--color-accent1);
  opacity: ${props => props.$active ? 1 : 0};
  transform: ${props => props.$active ? 'scale(1)' : 'scale(0)'};
  transition: ${props => props.$disableAnimation ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'};
  
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
  
  box-shadow: ${props => props.$active ? '0 0 15px var(--color-accent1)' : 'none'};
`;

const SuccessCheckmark = styled(View)<{
  $size: string;
  $active: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  transform: ${props => props.$active ? 'scale(1)' : 'scale(0)'};
  opacity: ${props => props.$active ? 1 : 0};
  transition: ${props => props.$disableAnimation ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s'};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: white;
    border-radius: 10px;
  }
  
  &::before {
    width: ${props => {
      switch (props.$size) {
        case 'sm': return '8px';
        case 'lg': return '16px';
        default: return '12px';
      }
    }};
    
    height: ${props => {
      switch (props.$size) {
        case 'sm': return '3px';
        case 'lg': return '6px';
        default: return '4px';
      }
    }};
    
    top: ${props => {
      switch (props.$size) {
        case 'sm': return '14px';
        case 'lg': return '28px';
        default: return '20px';
      }
    }};
    
    left: ${props => {
      switch (props.$size) {
        case 'sm': return '8px';
        case 'lg': return '16px';
        default: return '12px';
      }
    }};
    
    transform: rotate(45deg);
  }
  
  &::after {
    width: ${props => {
      switch (props.$size) {
        case 'sm': return '16px';
        case 'lg': return '32px';
        default: return '24px';
      }
    }};
    
    height: ${props => {
      switch (props.$size) {
        case 'sm': return '3px';
        case 'lg': return '6px';
        default: return '4px';
      }
    }};
    
    top: ${props => {
      switch (props.$size) {
        case 'sm': return '12px';
        case 'lg': return '24px';
        default: return '18px';
      }
    }};
    
    left: ${props => {
      switch (props.$size) {
        case 'sm': return '10px';
        case 'lg': return '20px';
        default: return '14px';
      }
    }};
    
    transform: rotate(-45deg);
  }
`;

const ErrorContainer = styled(View)<{
  $size: string;
  $active: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
`;

const ErrorCircle = styled(View)<{
  $size: string;
  $active: boolean;
  $disableAnimation: boolean;
}>`
  position: absolute;
  border-radius: 50%;
  background-color: var(--color-error);
  opacity: ${props => props.$active ? 1 : 0};
  transform: ${props => props.$active ? 'scale(1)' : 'scale(0)'};
  transition: ${props => props.$disableAnimation ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'};
  
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '48px';
      case 'lg': return '96px';
      default: return '64px';
    }
  }};
  
  box-shadow: ${props => props.$active ? '0 0 15px var(--color-error)' : 'none'};
`;

const ErrorX = styled(View)<{
  $size: string;
  $active: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  transform: ${props => props.$active ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(45deg)'};
  opacity: ${props => props.$active ? 1 : 0};
  transition: ${props => props.$disableAnimation ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s'};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: white;
    border-radius: 10px;
  }
  
  &::before {
    width: ${props => {
      switch (props.$size) {
        case 'sm': return '24px';
        case 'lg': return '48px';
        default: return '32px';
      }
    }};
    
    height: ${props => {
      switch (props.$size) {
        case 'sm': return '3px';
        case 'lg': return '6px';
        default: return '4px';
      }
    }};
    
    top: ${props => {
      switch (props.$size) {
        case 'sm': return '22px';
        case 'lg': return '45px';
        default: return '30px';
      }
    }};
    
    left: ${props => {
      switch (props.$size) {
        case 'sm': return '12px';
        case 'lg': return '24px';
        default: return '16px';
      }
    }};
    
    transform: rotate(45deg);
  }
  
  &::after {
    width: ${props => {
      switch (props.$size) {
        case 'sm': return '24px';
        case 'lg': return '48px';
        default: return '32px';
      }
    }};
    
    height: ${props => {
      switch (props.$size) {
        case 'sm': return '3px';
        case 'lg': return '6px';
        default: return '4px';
      }
    }};
    
    top: ${props => {
      switch (props.$size) {
        case 'sm': return '22px';
        case 'lg': return '45px';
        default: return '30px';
      }
    }};
    
    left: ${props => {
      switch (props.$size) {
        case 'sm': return '12px';
        case 'lg': return '24px';
        default: return '16px';
      }
    }};
    
    transform: rotate(-45deg);
  }
`;

const EmptyStateContainer = styled(View)<{
  $disableAnimation: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
`;

const EmptyStateImage = styled(View)<{
  $disableAnimation: boolean;
}>`
  width: 120px;
  height: 120px;
  margin-bottom: var(--spacing-lg);
  position: relative;
  
  animation: ${props => props.$disableAnimation ? 'none' : 'empty-state-float 4s ease-in-out infinite'};
  
  @keyframes empty-state-float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const EmptyStateTitle = styled(Text)`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-textPrimary);
  margin-bottom: var(--spacing-sm);
`;

const EmptyStateDescription = styled(Text)`
  font-size: var(--font-size-md);
  color: var(--color-textSecondary);
  margin-bottom: var(--spacing-lg);
  max-width: 280px;
`;

// Props interfaces
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullscreen?: boolean;
  style?: React.CSSProperties;
}

interface SkeletonProps {
  type: 'circle' | 'avatar' | 'button' | 'title' | 'text' | 'thumbnail' | 'card';
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

interface SkeletonListProps {
  count: number;
  type: 'circle' | 'avatar' | 'button' | 'title' | 'text' | 'thumbnail' | 'card';
  width?: string;
  height?: string;
  borderRadius?: string;
  gap?: string;
  style?: React.CSSProperties;
}

interface SkeletonCardProps {
  hasImage?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  lines?: number;
  style?: React.CSSProperties;
}

interface SuccessIndicatorProps {
  active: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

interface ErrorIndicatorProps {
  active: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  image?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

// Loading spinner component with bioluminescent particles
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullscreen = false,
  style
}) => {
  const canvasRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  useEffect(() => {
    if (disableAnimation || !canvasRef.current) return;
    
    let ctx: any;
    let width: number;
    let height: number;
    let particles: any[] = [];
    let rotation = 0;
    
    const initCanvas = () => {
      try {
        ctx = Taro.createCanvasContext('loading-spinner');
        
        // Set dimensions based on size
        switch (size) {
          case 'sm':
            width = 60;
            height = 60;
            break;
          case 'lg':
            width = 120;
            height = 120;
            break;
          default:
            width = 80;
            height = 80;
        }
        
        // Create particles
        createParticles();
        
        // Start animation
        animateSpinner();
      } catch (error) {
        console.error('Failed to initialize loading spinner canvas:', error);
      }
    };
    
    const createParticles = () => {
      particles = [];
      
      // Number of particles based on size
      const particleCount = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = width * 0.35; // Distance from center
        
        particles.push({
          angle,
          distance,
          size: size === 'sm' ? 2 : size === 'lg' ? 4 : 3,
          color: 'var(--color-primary)',
          speed: 0.02 + (i % 3) * 0.01 // Slightly different speeds
        });
      }
    };
    
    const animateSpinner = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update rotation
      rotation += 0.01;
      
      // Draw center glow
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = width * 0.15;
      
      const gradient = ctx.createCircularGradient(centerX, centerY, radius * 2);
      gradient.addColorStop(0, 'rgba(92, 224, 184, 0.8)');
      gradient.addColorStop(1, 'rgba(92, 224, 184, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw particles
      particles.forEach((particle, index) => {
        // Update particle position
        particle.angle += particle.speed;
        
        const x = centerX + Math.cos(particle.angle + rotation) * particle.distance;
        const y = centerY + Math.sin(particle.angle + rotation) * particle.distance;
        
        // Calculate opacity based on position (particles fade in and out)
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(particle.angle + rotation));
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Draw glow effect
        const glowSize = particle.size * 3;
        const particleGradient = ctx.createCircularGradient(x, y, glowSize);
        particleGradient.addColorStop(0, particle.color);
        particleGradient.addColorStop(1, 'rgba(92, 224, 184, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.globalAlpha = opacity * 0.5;
        ctx.fill();
      });
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
      // Draw connecting lines between particles
      ctx.strokeStyle = 'rgba(92, 224, 184, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const x1 = centerX + Math.cos(p1.angle + rotation) * p1.distance;
        const y1 = centerY + Math.sin(p1.angle + rotation) * p1.distance;
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const x2 = centerX + Math.cos(p2.angle + rotation) * p2.distance;
          const y2 = centerY + Math.sin(p2.angle + rotation) * p2.distance;
          
          const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          
          if (distance < width * 0.3) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.globalAlpha = 0.3 * (1 - distance / (width * 0.3));
            ctx.stroke();
          }
        }
      }
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
      // Draw to canvas
      ctx.draw();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animateSpinner);
    };
    
    // Initialize canvas and start animation
    initCanvas();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, disableAnimation]);
  
  // Fallback for reduced motion
  if (disableAnimation) {
    return (
      <LoadingContainer
        $size={size}
        $fullscreen={fullscreen}
        style={style}
      >
        <View style={{
          width: size === 'sm' ? '30px' : size === 'lg' ? '60px' : '40px',
          height: size === 'sm' ? '30px' : size === 'lg' ? '60px' : '40px',
          borderRadius: '50%',
          borderTop: `${size === 'sm' ? '2px' : size === 'lg' ? '4px' : '3px'} solid var(--color-primary)`,
          borderRight: `${size === 'sm' ? '2px' : size === 'lg' ? '4px' : '3px'} solid transparent`,
          animation: 'spin 1s linear infinite'
        }} />
        
        {text && (
          <LoadingText $size={size}>
            {text}
          </LoadingText>
        )}
        
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </LoadingContainer>
    );
  }
  
  return (
    <LoadingContainer
      $size={size}
      $fullscreen={fullscreen}
      style={style}
    >
      <LoadingCanvas id="loading-spinner" canvasId="loading-spinner" ref={canvasRef} />
      
      {text && (
        <LoadingText $size={size}>
          {text}
        </LoadingText>
      )}
    </LoadingContainer>
  );
};

// Skeleton component for loading states
export const Skeleton: React.FC<SkeletonProps> = ({
  type,
  width,
  height,
  borderRadius,
  style
}) => {
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  return (
    <SkeletonElement
      $type={type}
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      $disableAnimation={disableAnimation}
      style={style}
    />
  );
};

// Skeleton list component for multiple loading elements
export const SkeletonList: React.FC<SkeletonListProps> = ({
  count,
  type,
  width,
  height,
  borderRadius,
  gap = 'var(--spacing-md)',
  style
}) => {
  const items = Array.from({ length: count }, (_, i) => i);
  
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {items.map((item) => (
        <Skeleton
          key={item}
          type={type}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      ))}
    </View>
  );
};

// Skeleton card component for card loading states
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = true,
  hasTitle = true,
  hasDescription = true,
  lines = 3,
  style
}) => {
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-backgroundAlt)',
      borderRadius: 'var(--radius-md)',
      ...style
    }}>
      {hasImage && (
        <Skeleton
          type="thumbnail"
          width="100%"
          height="160px"
        />
      )}
      
      {hasTitle && (
        <Skeleton
          type="title"
          width="80%"
        />
      )}
      
      {hasDescription && (
        <View style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {Array.from({ length: lines }, (_, i) => (
            <Skeleton
              key={i}
              type="text"
              width={`${100 - (i * 10)}%`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Success indicator component
export const SuccessIndicator: React.FC<SuccessIndicatorProps> = ({
  active,
  size = 'md',
  style
}) => {
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  return (
    <SuccessContainer
      $size={size}
      $active={active}
      $disableAnimation={disableAnimation}
      style={style}
    >
      <SuccessCircle
        $size={size}
        $active={active}
        $disableAnimation={disableAnimation}
      />
      <SuccessCheckmark
        $size={size}
        $active={active}
        $disableAnimation={disableAnimation}
      />
    </SuccessContainer>
  );
};

// Error indicator component
export const ErrorIndicator: React.FC<ErrorIndicatorProps> = ({
  active,
  size = 'md',
  style
}) => {
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  return (
    <ErrorContainer
      $size={size}
      $active={active}
      $disableAnimation={disableAnimation}
      style={style}
    >
      <ErrorCircle
        $size={size}
        $active={active}
        $disableAnimation={disableAnimation}
      />
      <ErrorX
        $size={size}
        $active={active}
        $disableAnimation={disableAnimation}
      />
    </ErrorContainer>
  );
};

// Empty state component
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  image,
  action,
  style
}) => {
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  return (
    <EmptyStateContainer
      $disableAnimation={disableAnimation}
      style={style}
    >
      <EmptyStateImage $disableAnimation={disableAnimation}>
        {image}
      </EmptyStateImage>
      
      <EmptyStateTitle>{title}</EmptyStateTitle>
      
      {description && (
        <EmptyStateDescription>{description}</EmptyStateDescription>
      )}
      
      {action}
    </EmptyStateContainer>
  );
};

export default {
  LoadingSpinner,
  Skeleton,
  SkeletonList,
  SkeletonCard,
  SuccessIndicator,
  ErrorIndicator,
  EmptyState
};
