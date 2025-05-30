/**
 * Badge component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type BadgeVariant = 'primary' | 'secondary' | 'accent1' | 'accent2' | 'accent3' | 'success' | 'warning' | 'error';
export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeProps {
  content?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  max?: number;
  glow?: boolean;
  standalone?: boolean;
  position?: BadgePosition;
  children?: React.ReactNode;
  className?: string;
}

const StyledBadgeWrapper = styled(View)`
  position: relative;
  display: inline-flex;
`;

const StyledBadge = styled(View)<{
  variant: BadgeVariant;
  size: BadgeSize;
  dot: boolean;
  glow: boolean;
  standalone: boolean;
  position: BadgePosition;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  
  /* Standalone vs positioned */
  position: ${props => (props.standalone ? 'relative' : 'absolute')};
  
  /* Position styles */
  ${props => {
    if (props.standalone) return '';
    
    switch (props.position) {
      case 'top-left':
        return `
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
        `;
      case 'bottom-right':
        return `
          bottom: 0;
          right: 0;
          transform: translate(50%, 50%);
        `;
      case 'bottom-left':
        return `
          bottom: 0;
          left: 0;
          transform: translate(-50%, 50%);
        `;
      default: // top-right
        return `
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        `;
    }
  }}
  
  /* Size styles */
  min-width: ${props => {
    if (props.dot) {
      switch (props.size) {
        case 'small':
          return '8px';
        case 'large':
          return '12px';
        default:
          return '10px';
      }
    } else {
      switch (props.size) {
        case 'small':
          return '16px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }
  }};
  
  height: ${props => {
    if (props.dot) {
      switch (props.size) {
        case 'small':
          return '8px';
        case 'large':
          return '12px';
        default:
          return '10px';
      }
    } else {
      switch (props.size) {
        case 'small':
          return '16px';
        case 'large':
          return '24px';
        default:
          return '20px';
      }
    }
  }};
  
  padding: ${props => {
    if (props.dot) return '0';
    return props.size === 'small' ? '0 var(--spacing-xs)' : '0 var(--spacing-sm)';
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return 'var(--font-size-xs)';
      case 'large':
        return 'var(--font-size-sm)';
      default:
        return 'var(--font-size-xs)';
    }
  }};
  
  /* Variant styles */
  background-color: ${props => `var(--color-${props.variant})`};
  color: var(--color-textInverse);
  
  /* Glow effect */
  box-shadow: ${props => (props.glow ? `0 0 8px var(--color-${props.variant})` : 'none')};
  
  /* Animation for bioluminescent effect */
  animation: ${props => (props.glow ? 'pulse 2s infinite' : 'none')};
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 4px var(--color-${props => props.variant});
    }
    50% {
      box-shadow: 0 0 12px var(--color-${props => props.variant});
    }
    100% {
      box-shadow: 0 0 4px var(--color-${props => props.variant});
    }
  }
`;

export const Badge: React.FC<BadgeProps> = ({
  content,
  variant = 'primary',
  size = 'medium',
  dot = false,
  max = 99,
  glow = false,
  standalone = false,
  position = 'top-right',
  children,
  className,
}) => {
  const { theme } = useTheme();
  
  // Format content if it's a number and exceeds max
  const formattedContent = () => {
    if (dot) return null;
    
    if (typeof content === 'number' && content > max) {
      return `${max}+`;
    }
    
    return content;
  };
  
  const badge = (
    <StyledBadge
      variant={variant}
      size={size}
      dot={dot}
      glow={glow}
      standalone={standalone}
      position={position}
      className={className}
    >
      {!dot && formattedContent()}
    </StyledBadge>
  );
  
  // If standalone, return just the badge
  if (standalone) {
    return badge;
  }
  
  // Otherwise, wrap it with children
  return (
    <StyledBadgeWrapper>
      {children}
      {badge}
    </StyledBadgeWrapper>
  );
};

export default Badge;
