/**
 * Button component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  block?: boolean;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledButton = styled(View)<{
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  block: boolean;
  glow: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-default);
  cursor: pointer;
  width: ${props => (props.block ? '100%' : 'auto')};
  
  /* Size styles */
  padding: ${props => {
    switch (props.size) {
      case 'small':
        return 'var(--spacing-xs) var(--spacing-sm)';
      case 'large':
        return 'var(--spacing-md) var(--spacing-lg)';
      default:
        return 'var(--spacing-sm) var(--spacing-md)';
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return 'var(--font-size-sm)';
      case 'large':
        return 'var(--font-size-lg)';
      default:
        return 'var(--font-size-md)';
    }
  }};
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return 'var(--color-primary)';
      case 'secondary':
        return 'var(--color-secondary)';
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return 'var(--color-primary)';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'primary':
        return 'var(--color-textInverse)';
      case 'secondary':
        return 'var(--color-textInverse)';
      case 'outline':
        return 'var(--color-primary)';
      case 'text':
        return 'var(--color-secondary)';
      default:
        return 'var(--color-textInverse)';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'outline':
        return 'var(--border-width-normal) solid var(--color-primary)';
      default:
        return 'none';
    }
  }};
  
  /* Disabled state */
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  
  /* Glow effect */
  box-shadow: ${props => (props.glow ? 'var(--glow-md)' : 'none')};
  
  /* Active state */
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  block = false,
  glow = false,
  onClick,
  className,
}) => {
  const { theme } = useTheme();
  
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      block={block}
      glow={glow}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
