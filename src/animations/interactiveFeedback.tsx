/**
 * Interactive Feedback components for Yunnan Taste Mini-Program
 * Implements micro-interactions and feedback animations with Bioluminescent Forest theme
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Canvas } from '@tarojs/components';
import { styled } from 'styled-components';
import Taro from '@tarojs/taro';
import { AnimationPresets, AnimationUtils, useReducedMotion } from './index';

// Styled components for interactive elements
const InteractiveButton = styled(View)<{
  $variant: string;
  $size: string;
  $isPressed: boolean;
  $isDisabled: boolean;
  $glow: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ${AnimationPresets.easing.organicBounce},
              background-color 0.3s ${AnimationPresets.easing.standard},
              box-shadow 0.3s ${AnimationPresets.easing.standard};
  
  /* Size variants */
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return 'var(--spacing-xs) var(--spacing-sm)';
      case 'lg': return 'var(--spacing-md) var(--spacing-lg)';
      default: return 'var(--spacing-sm) var(--spacing-md)';
    }
  }};
  
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return 'var(--font-size-sm)';
      case 'lg': return 'var(--font-size-lg)';
      default: return 'var(--font-size-md)';
    }
  }};
  
  /* Color variants */
  background-color: ${props => {
    if (props.$isDisabled) return 'var(--color-disabled)';
    
    switch (props.$variant) {
      case 'primary': return 'var(--color-primary)';
      case 'secondary': return 'var(--color-secondary)';
      case 'accent': return 'var(--color-accent1)';
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return 'var(--color-primary)';
    }
  }};
  
  color: ${props => {
    if (props.$isDisabled) return 'var(--color-textDisabled)';
    
    switch (props.$variant) {
      case 'primary': return 'var(--color-textInverse)';
      case 'secondary': return 'var(--color-textInverse)';
      case 'accent': return 'var(--color-textInverse)';
      case 'outline': return 'var(--color-primary)';
      case 'ghost': return 'var(--color-textPrimary)';
      default: return 'var(--color-textInverse)';
    }
  }};
  
  border: ${props => {
    switch (props.$variant) {
      case 'outline': return '1px solid var(--color-primary)';
      default: return 'none';
    }
  }};
  
  /* Glow effect */
  box-shadow: ${props => {
    if (props.$isDisabled || !props.$glow) return 'none';
    
    const color = props.$variant === 'primary' ? 'var(--color-primary)' : 
                 props.$variant === 'secondary' ? 'var(--color-secondary)' :
                 props.$variant === 'accent' ? 'var(--color-accent1)' :
                 'var(--color-primary)';
    
    return props.$isPressed 
      ? `0 0 15px ${color}80, 0 0 5px ${color}40` 
      : `0 0 10px ${color}40, 0 0 2px ${color}20`;
  }};
  
  /* Pressed state */
  transform: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : props.$isPressed && !props.$isDisabled 
        ? 'scale(0.95)' 
        : 'scale(1)'
  };
  
  /* Disabled state */
  opacity: ${props => props.$isDisabled ? 0.6 : 1};
  pointer-events: ${props => props.$isDisabled ? 'none' : 'auto'};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    opacity: ${props => props.$isPressed && !props.$isDisabled ? 0.5 : 0};
    transition: opacity 0.3s ${AnimationPresets.easing.standard};
  }
`;

const RippleContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
`;

const Ripple = styled(View)<{
  $size: number;
  $x: number;
  $y: number;
  $color: string;
  $active: boolean;
}>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  top: ${props => props.$y - props.$size / 2}px;
  left: ${props => props.$x - props.$size / 2}px;
  opacity: ${props => props.$active ? 0.3 : 0};
  transform: ${props => props.$active ? 'scale(1)' : 'scale(0)'};
  transition: transform 0.6s ${AnimationPresets.easing.standard},
              opacity 0.6s ${AnimationPresets.easing.standard};
`;

const InteractiveCard = styled(View)<{
  $isPressed: boolean;
  $elevation: number;
  $glowIntensity: number;
  $glowColor: string;
  $disableAnimation: boolean;
}>`
  position: relative;
  border-radius: var(--radius-md);
  background-color: var(--color-backgroundAlt);
  overflow: hidden;
  transition: transform 0.3s ${AnimationPresets.easing.organicBounce},
              box-shadow 0.3s ${AnimationPresets.easing.standard};
  
  /* Elevation and pressed state */
  transform: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : props.$isPressed 
        ? 'translateY(-2px) scale(0.99)' 
        : 'translateY(0) scale(1)'
  };
  
  box-shadow: ${props => {
    const elevation = props.$isPressed ? props.$elevation + 4 : props.$elevation;
    const shadowOpacity = 0.1 + (elevation * 0.02);
    const shadowBlur = elevation * 2;
    const shadowSpread = elevation * 0.5;
    
    return `0 ${elevation}px ${shadowBlur}px ${shadowSpread}px rgba(0,0,0,${shadowOpacity})`;
  }};
  
  /* Glow effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    box-shadow: ${props => {
      const intensity = props.$isPressed ? props.$glowIntensity * 1.5 : props.$glowIntensity;
      return props.$disableAnimation 
        ? 'none' 
        : `0 0 15px ${props.$glowColor}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`;
    }};
    opacity: ${props => props.$disableAnimation ? 0 : 1};
    transition: box-shadow 0.3s ${AnimationPresets.easing.standard};
    pointer-events: none;
    z-index: -1;
  }
`;

const ToggleContainer = styled(View)<{
  $isActive: boolean;
  $size: string;
  $disableAnimation: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  
  /* Size variants */
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '36px';
      case 'lg': return '60px';
      default: return '48px';
    }
  }};
  
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '20px';
      case 'lg': return '32px';
      default: return '26px';
    }
  }};
`;

const ToggleTrack = styled(View)<{
  $isActive: boolean;
  $disableAnimation: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 999px;
  background-color: ${props => 
    props.$isActive ? 'var(--color-primary)' : 'var(--color-disabled)'
  };
  transition: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
  
  /* Glow effect */
  box-shadow: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : props.$isActive 
        ? '0 0 8px var(--color-primary)80' 
        : 'none'
  };
`;

const ToggleThumb = styled(View)<{
  $isActive: boolean;
  $size: string;
  $disableAnimation: boolean;
}>`
  position: absolute;
  top: 2px;
  left: ${props => props.$isActive ? 'calc(100% - 2px)' : '2px'};
  transform: ${props => props.$isActive ? 'translateX(-100%)' : 'translateX(0)'};
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '16px';
      case 'lg': return '28px';
      default: return '22px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '16px';
      case 'lg': return '28px';
      default: return '22px';
    }
  }};
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
`;

const ToggleParticles = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const InputContainer = styled(View)<{
  $isFocused: boolean;
  $hasError: boolean;
  $disableAnimation: boolean;
}>`
  position: relative;
  border-radius: var(--radius-md);
  background-color: var(--color-backgroundAlt);
  border: 1px solid ${props => {
    if (props.$hasError) return 'var(--color-error)';
    return props.$isFocused ? 'var(--color-primary)' : 'var(--color-border)';
  }};
  padding: var(--spacing-sm);
  transition: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
  
  /* Glow effect */
  box-shadow: ${props => {
    if (props.$hasError) return '0 0 5px var(--color-error)40';
    return props.$isFocused && !props.$disableAnimation 
      ? '0 0 5px var(--color-primary)40' 
      : 'none';
  }};
`;

const InputLabel = styled(Text)<{
  $isFocused: boolean;
  $hasValue: boolean;
  $hasError: boolean;
  $disableAnimation: boolean;
}>`
  position: absolute;
  left: var(--spacing-sm);
  top: ${props => 
    (props.$isFocused || props.$hasValue) ? '-10px' : '50%'
  };
  transform: ${props => 
    (props.$isFocused || props.$hasValue) ? 'translateY(0)' : 'translateY(-50%)'
  };
  font-size: ${props => 
    (props.$isFocused || props.$hasValue) ? 'var(--font-size-xs)' : 'var(--font-size-sm)'
  };
  color: ${props => {
    if (props.$hasError) return 'var(--color-error)';
    return props.$isFocused ? 'var(--color-primary)' : 'var(--color-textSecondary)';
  }};
  background-color: ${props => 
    (props.$isFocused || props.$hasValue) ? 'var(--color-background)' : 'transparent'
  };
  padding: ${props => 
    (props.$isFocused || props.$hasValue) ? '0 var(--spacing-xs)' : '0'
  };
  transition: ${props => 
    props.$disableAnimation 
      ? 'none' 
      : 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
`;

const InputParticles = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Props interfaces
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface CardProps {
  children: React.ReactNode;
  elevation?: number;
  glowIntensity?: number;
  glowColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface ToggleProps {
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (active: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  style?: React.CSSProperties;
}

// Button component with ripple effect and glow
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  disabled = false,
  onClick,
  style
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    active: boolean;
  }>>([]);
  const rippleIdRef = useRef(0);
  const buttonRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  const handleTouchStart = (e: any) => {
    if (disabled) return;
    
    setIsPressed(true);
    
    if (!disableAnimation) {
      // Create ripple effect
      const rect = e.target.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      // Calculate ripple size based on button dimensions
      const size = Math.max(rect.width, rect.height) * 2;
      
      const id = rippleIdRef.current++;
      setRipples(prev => [...prev, { id, x, y, size, active: true }]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples(prev => prev.map(ripple => 
          ripple.id === id ? { ...ripple, active: false } : ripple
        ));
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 600);
      }, 600);
    }
  };
  
  const handleTouchEnd = () => {
    if (disabled) return;
    setIsPressed(false);
    
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <InteractiveButton
      ref={buttonRef}
      $variant={variant}
      $size={size}
      $isPressed={isPressed}
      $isDisabled={disabled}
      $glow={glow}
      $disableAnimation={disableAnimation}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={style}
    >
      {children}
      
      {!disableAnimation && (
        <RippleContainer>
          {ripples.map(ripple => (
            <Ripple
              key={ripple.id}
              $size={ripple.size}
              $x={ripple.x}
              $y={ripple.y}
              $color={variant === 'outline' || variant === 'ghost' ? 'var(--color-primary)' : '#fff'}
              $active={ripple.active}
            />
          ))}
        </RippleContainer>
      )}
    </InteractiveButton>
  );
};

// Card component with lift and glow effect
export const Card: React.FC<CardProps> = ({
  children,
  elevation = 2,
  glowIntensity = 0.2,
  glowColor = 'rgba(92, 224, 184, 0.5)', // Default teal glow
  onClick,
  style
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  const handleTouchStart = () => {
    if (onClick) {
      setIsPressed(true);
    }
  };
  
  const handleTouchEnd = () => {
    if (onClick) {
      setIsPressed(false);
      onClick();
    }
  };
  
  return (
    <InteractiveCard
      $isPressed={isPressed}
      $elevation={elevation}
      $glowIntensity={glowIntensity}
      $glowColor={glowColor}
      $disableAnimation={disableAnimation}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={style}
    >
      {children}
    </InteractiveCard>
  );
};

// Toggle component with particle effect
export const Toggle: React.FC<ToggleProps> = ({
  isActive,
  size = 'md',
  onChange,
  disabled = false,
  style
}) => {
  const canvasRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const prevActiveRef = useRef(isActive);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = disabled || prefersReducedMotion;
  
  const handleToggle = () => {
    if (disabled) return;
    
    if (onChange) {
      onChange(!isActive);
    }
  };
  
  // Particle animation effect when toggle changes state
  useEffect(() => {
    if (disableAnimation || !canvasRef.current) return;
    if (prevActiveRef.current === isActive) return;
    
    prevActiveRef.current = isActive;
    
    let ctx: any;
    let width: number;
    let height: number;
    let particles: any[] = [];
    let startTime: number;
    
    const initCanvas = () => {
      try {
        ctx = Taro.createCanvasContext('toggle-particles');
        
        // Get toggle dimensions
        let toggleWidth = 48;
        let toggleHeight = 26;
        
        if (size === 'sm') {
          toggleWidth = 36;
          toggleHeight = 20;
        } else if (size === 'lg') {
          toggleWidth = 60;
          toggleHeight = 32;
        }
        
        width = toggleWidth;
        height = toggleHeight;
        
        // Create particles
        createParticles();
        
        // Start animation
        startTime = Date.now();
        animateParticles();
      } catch (error) {
        console.error('Failed to initialize toggle particles canvas:', error);
      }
    };
    
    const createParticles = () => {
      particles = [];
      
      // Calculate thumb position
      const thumbSize = height - 4;
      const thumbX = isActive ? width - thumbSize - 2 : 2;
      const thumbY = height / 2;
      
      // Create particles around thumb
      const particleCount = 10;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: thumbX + thumbSize / 2,
          y: thumbY,
          size: AnimationUtils.random(1, 3),
          speed: AnimationUtils.random(1, 3),
          angle: AnimationUtils.random(0, Math.PI * 2),
          life: 1,
          color: isActive ? 'var(--color-primary)' : 'var(--color-disabled)'
        });
      }
    };
    
    const animateParticles = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate progress
      const elapsed = Date.now() - startTime;
      const duration = 600; // Animation duration in ms
      const progress = Math.min(elapsed / duration, 1);
      
      // Update and draw particles
      let hasActiveParticles = false;
      
      particles.forEach((particle) => {
        // Update position
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Update life
        particle.life = 1 - progress;
        
        if (particle.life > 0) {
          hasActiveParticles = true;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.life * 0.7;
          ctx.fill();
          
          // Draw glow effect
          const glowSize = particle.size * 2 * particle.life;
          const gradient = ctx.createCircularGradient(particle.x, particle.y, glowSize);
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.globalAlpha = particle.life * 0.3;
          ctx.fill();
        }
      });
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
      // Draw to canvas
      ctx.draw();
      
      // Continue animation if particles are still active
      if (hasActiveParticles) {
        animationRef.current = requestAnimationFrame(animateParticles);
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
  }, [isActive, size, disableAnimation]);
  
  return (
    <ToggleContainer
      $isActive={isActive}
      $size={size}
      $disableAnimation={disableAnimation}
      onClick={handleToggle}
      style={style}
    >
      <ToggleTrack
        $isActive={isActive}
        $disableAnimation={disableAnimation}
      />
      <ToggleThumb
        $isActive={isActive}
        $size={size}
        $disableAnimation={disableAnimation}
      />
      {!disableAnimation && (
        <ToggleParticles id="toggle-particles" canvasId="toggle-particles" ref={canvasRef} />
      )}
    </ToggleContainer>
  );
};

// Input component with focus animation
export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  label,
  error,
  style
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const canvasRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const inputRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const disableAnimation = prefersReducedMotion;
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const handleInput = (e: any) => {
    onChange(e.detail.value);
  };
  
  // Particle animation effect when input is focused
  useEffect(() => {
    if (disableAnimation || !canvasRef.current || !isFocused) return;
    
    let ctx: any;
    let width: number;
    let height: number;
    let particles: any[] = [];
    
    const initCanvas = () => {
      try {
        ctx = Taro.createCanvasContext('input-particles');
        
        // Get input dimensions from ref
        if (inputRef.current) {
          const query = Taro.createSelectorQuery();
          query.select(`#${inputRef.current.uid}`).boundingClientRect();
          query.exec((res) => {
            if (!res || !res[0]) return;
            
            width = res[0].width;
            height = res[0].height;
            
            // Create particles
            createParticles();
            
            // Start animation
            animateParticles();
          });
        }
      } catch (error) {
        console.error('Failed to initialize input particles canvas:', error);
      }
    };
    
    const createParticles = () => {
      particles = [];
      
      // Create particles around input border
      const particleCount = 20;
      const borderPoints = [];
      
      // Top border
      for (let x = 0; x < width; x += width / 5) {
        borderPoints.push({ x, y: 0 });
      }
      
      // Right border
      for (let y = 0; y < height; y += height / 3) {
        borderPoints.push({ x: width, y });
      }
      
      // Bottom border
      for (let x = width; x > 0; x -= width / 5) {
        borderPoints.push({ x, y: height });
      }
      
      // Left border
      for (let y = height; y > 0; y -= height / 3) {
        borderPoints.push({ x: 0, y });
      }
      
      // Create particles at border points
      for (let i = 0; i < particleCount; i++) {
        const point = borderPoints[Math.floor(AnimationUtils.random(0, borderPoints.length))];
        
        particles.push({
          x: point.x + AnimationUtils.random(-5, 5),
          y: point.y + AnimationUtils.random(-5, 5),
          size: AnimationUtils.random(1, 2),
          speed: AnimationUtils.random(0.2, 0.5),
          angle: AnimationUtils.random(0, Math.PI * 2),
          opacity: AnimationUtils.random(0.3, 0.7),
          color: error ? 'var(--color-error)' : 'var(--color-primary)'
        });
      }
    };
    
    const animateParticles = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((particle) => {
        // Update position with circular motion
        particle.angle += particle.speed * 0.05;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Keep particles near the border
        const distanceFromCenter = {
          x: particle.x - width / 2,
          y: particle.y - height / 2
        };
        
        const distanceFromBorder = Math.min(
          Math.abs(particle.x),
          Math.abs(particle.y),
          Math.abs(width - particle.x),
          Math.abs(height - particle.y)
        );
        
        if (distanceFromBorder > 10) {
          // Pull particle back toward border
          const angle = Math.atan2(distanceFromCenter.y, distanceFromCenter.x);
          const targetX = width / 2 + Math.cos(angle) * (width / 2);
          const targetY = height / 2 + Math.sin(angle) * (height / 2);
          
          particle.x += (targetX - particle.x) * 0.01;
          particle.y += (targetY - particle.y) * 0.01;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Draw glow effect
        const glowSize = particle.size * 3;
        const gradient = ctx.createCircularGradient(particle.x, particle.y, glowSize);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fill();
      });
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
      // Draw to canvas
      ctx.draw();
      
      // Continue animation if still focused
      if (isFocused) {
        animationRef.current = requestAnimationFrame(animateParticles);
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
  }, [isFocused, error, disableAnimation]);
  
  return (
    <InputContainer
      ref={inputRef}
      $isFocused={isFocused}
      $hasError={!!error}
      $disableAnimation={disableAnimation}
      style={style}
    >
      {label && (
        <InputLabel
          $isFocused={isFocused}
          $hasValue={!!value}
          $hasError={!!error}
          $disableAnimation={disableAnimation}
        >
          {label}
        </InputLabel>
      )}
      
      <input
        value={value}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--color-textPrimary)',
          fontSize: 'var(--font-size-md)',
          padding: label ? 'var(--spacing-sm) 0 0 0' : '0'
        }}
      />
      
      {error && (
        <Text style={{
          color: 'var(--color-error)',
          fontSize: 'var(--font-size-xs)',
          marginTop: 'var(--spacing-xs)'
        }}>
          {error}
        </Text>
      )}
      
      {!disableAnimation && (
        <InputParticles id="input-particles" canvasId="input-particles" ref={canvasRef} />
      )}
    </InputContainer>
  );
};

export default {
  Button,
  Card,
  Toggle,
  Input
};
