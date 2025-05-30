/**
 * Icon component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Image } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'primary' | 'secondary' | 'accent1' | 'accent2' | 'accent3' | 'textPrimary' | 'textSecondary';

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: IconColor;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

const StyledIcon = styled(View)<{
  size: IconSize;
  color: IconColor;
  glow: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-default);
  
  /* Size styles */
  width: ${props => {
    switch (props.size) {
      case 'xs':
        return '16px';
      case 'sm':
        return '20px';
      case 'lg':
        return '32px';
      case 'xl':
        return '40px';
      default:
        return '24px';
    }
  }};
  
  height: ${props => {
    switch (props.size) {
      case 'xs':
        return '16px';
      case 'sm':
        return '20px';
      case 'lg':
        return '32px';
      case 'xl':
        return '40px';
      default:
        return '24px';
    }
  }};
  
  /* Color styles */
  color: ${props => `var(--color-${props.color})`};
  
  /* Glow effect */
  filter: ${props => (props.glow ? 'drop-shadow(0 0 4px var(--color-accent1))' : 'none')};
  
  /* Active state */
  &:active {
    transform: ${props => (props.onClick ? 'scale(0.9)' : 'none')};
    opacity: ${props => (props.onClick ? '0.8' : '1')};
  }
  
  img {
    width: 100%;
    height: 100%;
  }
`;

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'textPrimary',
  glow = false,
  className,
  onClick,
}) => {
  const { theme } = useTheme();
  
  // Path to icons based on name
  const iconPath = `/assets/icons/${name}.png`;
  
  return (
    <StyledIcon
      size={size}
      color={color}
      glow={glow}
      className={className}
      onClick={onClick}
    >
      <Image src={iconPath} mode="aspectFit" />
    </StyledIcon>
  );
};

export default Icon;
