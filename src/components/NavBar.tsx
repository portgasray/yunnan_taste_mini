/**
 * NavBar component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';

export interface NavBarProps {
  title?: React.ReactNode;
  leftIcon?: string;
  rightIcon?: string;
  leftText?: string;
  rightText?: string;
  fixed?: boolean;
  transparent?: boolean;
  glowEffect?: boolean;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
}

const StyledNavBar = styled(View)<{
  fixed: boolean;
  transparent: boolean;
  glowEffect: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  padding: 0 var(--spacing-md);
  
  /* Fixed position */
  position: ${props => (props.fixed ? 'fixed' : 'relative')};
  top: ${props => (props.fixed ? '0' : 'auto')};
  left: ${props => (props.fixed ? '0' : 'auto')};
  z-index: ${props => (props.fixed ? '100' : '1')};
  
  /* Background */
  background-color: ${props => (props.transparent ? 'transparent' : 'var(--color-backgroundDark)')};
  border-bottom: ${props => (props.transparent ? 'none' : 'var(--border-width-thin) solid var(--color-border)')};
  
  /* Glow effect */
  box-shadow: ${props => {
    if (props.transparent) return 'none';
    return props.glowEffect ? '0 4px 12px rgba(38, 247, 199, 0.15)' : 'none';
  }};
  
  /* Left section */
  .navbar-left {
    display: flex;
    align-items: center;
    
    .navbar-left-icon {
      margin-right: ${props => (props.leftText ? 'var(--spacing-xs)' : '0')};
    }
    
    .navbar-left-text {
      font-size: var(--font-size-sm);
      color: var(--color-primary);
    }
  }
  
  /* Title */
  .navbar-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-textPrimary);
    text-align: center;
    flex: 1;
    
    /* Ensure title doesn't overflow */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--spacing-md);
  }
  
  /* Right section */
  .navbar-right {
    display: flex;
    align-items: center;
    
    .navbar-right-text {
      font-size: var(--font-size-sm);
      color: var(--color-primary);
      margin-right: ${props => (props.rightIcon ? 'var(--spacing-xs)' : '0')};
    }
    
    .navbar-right-icon {
      margin-left: ${props => (props.rightText ? 'var(--spacing-xs)' : '0')};
    }
  }
`;

export const NavBar: React.FC<NavBarProps> = ({
  title,
  leftIcon = 'arrow-left',
  rightIcon,
  leftText,
  rightText,
  fixed = false,
  transparent = false,
  glowEffect = true,
  onLeftClick,
  onRightClick,
  className,
}) => {
  const { theme } = useTheme();
  
  return (
    <StyledNavBar
      fixed={fixed}
      transparent={transparent}
      glowEffect={glowEffect}
      className={className}
    >
      <View className="navbar-left" onClick={onLeftClick}>
        {leftIcon && (
          <View className="navbar-left-icon">
            <Icon name={leftIcon} size="md" color="primary" glow={glowEffect} />
          </View>
        )}
        
        {leftText && (
          <Text className="navbar-left-text">{leftText}</Text>
        )}
      </View>
      
      {title && (
        <View className="navbar-title">{title}</View>
      )}
      
      <View className="navbar-right" onClick={onRightClick}>
        {rightText && (
          <Text className="navbar-right-text">{rightText}</Text>
        )}
        
        {rightIcon && (
          <View className="navbar-right-icon">
            <Icon name={rightIcon} size="md" color="primary" glow={glowEffect} />
          </View>
        )}
      </View>
    </StyledNavBar>
  );
};

export default NavBar;
