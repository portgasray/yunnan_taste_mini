/**
 * Card component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glowing';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: string;
  radius?: string;
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled(View)<{
  variant: CardVariant;
  padding: string;
  radius: string;
}>`
  display: block;
  width: 100%;
  padding: ${props => props.padding};
  border-radius: ${props => props.radius};
  overflow: hidden;
  transition: all var(--transition-default);
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'default':
        return 'var(--color-backgroundAlt)';
      case 'elevated':
        return 'var(--color-backgroundAlt)';
      case 'outlined':
        return 'transparent';
      case 'glowing':
        return 'var(--color-backgroundAlt)';
      default:
        return 'var(--color-backgroundAlt)';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'outlined':
        return 'var(--border-width-normal) solid var(--color-border)';
      default:
        return 'none';
    }
  }};
  
  box-shadow: ${props => {
    switch (props.variant) {
      case 'elevated':
        return 'var(--shadow-md)';
      case 'glowing':
        return 'var(--glow-md)';
      default:
        return 'none';
    }
  }};
  
  /* Active state */
  &:active {
    transform: ${props => (props.onClick ? 'scale(0.99)' : 'none')};
    opacity: ${props => (props.onClick ? '0.95' : '1')};
  }
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'var(--spacing-md)',
  radius = 'var(--radius-lg)',
  className,
  onClick,
}) => {
  const { theme } = useTheme();
  
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      radius={radius}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
