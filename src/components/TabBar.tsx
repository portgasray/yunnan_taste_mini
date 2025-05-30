/**
 * TabBar component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';

export interface TabBarItem {
  key: string;
  title: string;
  icon: string;
  badge?: number | boolean;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeKey?: string;
  fixed?: boolean;
  glowEffect?: boolean;
  onChange?: (key: string) => void;
  className?: string;
}

const StyledTabBar = styled(View)<{
  fixed: boolean;
  glowEffect: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 56px;
  background-color: var(--color-backgroundDark);
  border-top: var(--border-width-thin) solid var(--color-border);
  
  /* Fixed position */
  position: ${props => (props.fixed ? 'fixed' : 'relative')};
  bottom: ${props => (props.fixed ? '0' : 'auto')};
  left: ${props => (props.fixed ? '0' : 'auto')};
  z-index: ${props => (props.fixed ? '100' : '1')};
  
  /* Glow effect */
  box-shadow: ${props => (props.glowEffect ? '0 -4px 12px rgba(38, 247, 199, 0.15)' : 'none')};
`;

const StyledTabBarItem = styled(View)<{
  active: boolean;
  glowEffect: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: var(--spacing-xs) 0;
  position: relative;
  
  /* Active state */
  .tab-icon {
    color: ${props => (props.active ? 'var(--color-primary)' : 'var(--color-textSecondary)')};
    transition: all var(--transition-default);
    filter: ${props => (props.active && props.glowEffect ? 'drop-shadow(0 0 8px var(--color-accent1))' : 'none')};
  }
  
  .tab-title {
    margin-top: var(--spacing-xs);
    font-size: var(--font-size-xs);
    color: ${props => (props.active ? 'var(--color-primary)' : 'var(--color-textSecondary)')};
    transition: all var(--transition-default);
  }
  
  /* Badge */
  .tab-badge {
    position: absolute;
    top: 4px;
    right: 50%;
    transform: translateX(8px);
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: var(--color-error);
    color: var(--color-textInverse);
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    box-shadow: ${props => (props.glowEffect ? '0 0 6px var(--color-error)' : 'none')};
  }
  
  .tab-dot {
    position: absolute;
    top: 4px;
    right: 50%;
    transform: translateX(8px);
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: var(--color-error);
    box-shadow: ${props => (props.glowEffect ? '0 0 6px var(--color-error)' : 'none')};
  }
  
  /* Active indicator */
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(${props => (props.active ? '1' : '0')});
    width: 24px;
    height: 3px;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
    transition: transform 0.3s ease;
    box-shadow: ${props => (props.active && props.glowEffect ? '0 0 8px var(--color-accent1)' : 'none')};
  }
  
  /* Hover/active effect */
  &:active {
    .tab-icon, .tab-title {
      transform: scale(0.95);
      opacity: 0.9;
    }
  }
`;

export const TabBar: React.FC<TabBarProps> = ({
  items,
  activeKey,
  fixed = true,
  glowEffect = true,
  onChange,
  className,
}) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(activeKey || (items.length > 0 ? items[0].key : ''));
  
  const handleItemClick = (key: string) => {
    setActive(key);
    onChange && onChange(key);
  };
  
  return (
    <StyledTabBar
      fixed={fixed}
      glowEffect={glowEffect}
      className={className}
    >
      {items.map(item => (
        <StyledTabBarItem
          key={item.key}
          active={active === item.key}
          glowEffect={glowEffect}
          onClick={() => handleItemClick(item.key)}
        >
          <View className="tab-icon">
            <Icon name={item.icon} size="md" color={active === item.key ? 'primary' : 'textSecondary'} />
          </View>
          
          <Text className="tab-title">{item.title}</Text>
          
          {item.badge && typeof item.badge === 'number' && (
            <View className="tab-badge">{item.badge > 99 ? '99+' : item.badge}</View>
          )}
          
          {item.badge && typeof item.badge === 'boolean' && (
            <View className="tab-dot" />
          )}
        </StyledTabBarItem>
      ))}
    </StyledTabBar>
  );
};

export default TabBar;
