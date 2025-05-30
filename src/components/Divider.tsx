/**
 * Divider component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'glowing';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  variant?: DividerVariant;
  orientation?: DividerOrientation;
  color?: string;
  thickness?: string;
  spacing?: string;
  text?: string;
  className?: string;
}

const StyledDivider = styled(View)<{
  variant: DividerVariant;
  orientation: DividerOrientation;
  color: string;
  thickness: string;
  spacing: string;
  hasText: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => (props.orientation === 'horizontal' ? '100%' : props.thickness)};
  height: ${props => (props.orientation === 'vertical' ? '100%' : props.thickness)};
  margin: ${props => {
    if (props.orientation === 'horizontal') {
      return `${props.spacing} 0`;
    } else {
      return `0 ${props.spacing}`;
    }
  }};
  
  /* Variant styles */
  background-color: ${props => {
    if (props.hasText) {
      return 'transparent';
    }
    
    return props.variant === 'glowing' ? 'transparent' : props.color;
  }};
  
  border-style: ${props => {
    switch (props.variant) {
      case 'dashed':
        return 'dashed';
      case 'dotted':
        return 'dotted';
      default:
        return 'solid';
    }
  }};
  
  border-width: ${props => {
    if (props.hasText) {
      return props.orientation === 'horizontal' 
        ? `0 0 ${props.thickness} 0` 
        : `0 ${props.thickness} 0 0`;
    }
    
    return props.variant === 'glowing' ? '0' : '0';
  }};
  
  border-color: ${props => props.color};
  
  box-shadow: ${props => (props.variant === 'glowing' ? `0 0 6px ${props.color}` : 'none')};
  
  /* Text styles */
  .divider-text {
    position: relative;
    padding: 0 var(--spacing-md);
    background-color: var(--color-background);
    color: ${props => props.color};
    font-size: var(--font-size-sm);
    z-index: 1;
  }
  
  /* Line with text */
  &.with-text {
    background-color: transparent;
    border: none;
    
    &:before, &:after {
      content: '';
      flex: 1;
      height: ${props => props.thickness};
      background-color: ${props => props.color};
      box-shadow: ${props => (props.variant === 'glowing' ? `0 0 6px ${props.color}` : 'none')};
      border-style: ${props => {
        switch (props.variant) {
          case 'dashed':
            return 'dashed';
          case 'dotted':
            return 'dotted';
          default:
            return 'solid';
        }
      }};
      border-width: 0;
    }
  }
`;

export const Divider: React.FC<DividerProps> = ({
  variant = 'solid',
  orientation = 'horizontal',
  color = 'var(--color-divider)',
  thickness = '1px',
  spacing = 'var(--spacing-md)',
  text,
  className,
}) => {
  const { theme } = useTheme();
  const hasText = Boolean(text) && orientation === 'horizontal';
  
  return (
    <StyledDivider
      variant={variant}
      orientation={orientation}
      color={color}
      thickness={thickness}
      spacing={spacing}
      hasText={hasText}
      className={`${className || ''} ${hasText ? 'with-text' : ''}`}
    >
      {hasText && <View className="divider-text">{text}</View>}
    </StyledDivider>
  );
};

export default Divider;
