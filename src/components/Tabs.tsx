/**
 * Tabs component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export interface TabItem {
  key: string;
  title: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  scrollable?: boolean;
  centered?: boolean;
  variant?: 'default' | 'card' | 'line';
  size?: 'small' | 'medium' | 'large';
  glowEffect?: boolean;
  onChange?: (key: string) => void;
  className?: string;
}

const StyledTabsWrapper = styled(View)<{
  variant: 'default' | 'card' | 'line';
  glowEffect: boolean;
}>`
  width: 100%;
  
  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'card':
        return `
          background-color: var(--color-backgroundAlt);
          border-radius: var(--radius-lg);
          padding: var(--spacing-sm);
          box-shadow: ${props.glowEffect ? 'var(--glow-sm)' : 'var(--shadow-sm)'};
        `;
      case 'line':
        return `
          border-bottom: var(--border-width-normal) solid var(--color-border);
        `;
      default:
        return '';
    }
  }}
`;

const StyledTabsScroll = styled(ScrollView)`
  width: 100%;
  white-space: nowrap;
`;

const StyledTabsBar = styled(View)<{
  centered: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.centered ? 'center' : 'flex-start')};
  width: 100%;
`;

const StyledTabItem = styled(View)<{
  active: boolean;
  disabled: boolean;
  variant: 'default' | 'card' | 'line';
  size: 'small' | 'medium' | 'large';
  glowEffect: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  margin: 0 var(--spacing-xs);
  cursor: pointer;
  transition: all var(--transition-default);
  
  /* Size styles */
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
  ${props => {
    switch (props.variant) {
      case 'card':
        return `
          border-radius: var(--radius-md);
          background-color: ${props.active ? 'var(--color-primary)' : 'transparent'};
          color: ${props.active ? 'var(--color-textInverse)' : 'var(--color-textSecondary)'};
          box-shadow: ${props.active && props.glowEffect ? 'var(--glow-sm)' : 'none'};
        `;
      case 'line':
        return `
          color: ${props.active ? 'var(--color-primary)' : 'var(--color-textSecondary)'};
          font-weight: ${props.active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'};
          
          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%) scaleX(${props.active ? '1' : '0'});
            width: 70%;
            height: 3px;
            background-color: var(--color-primary);
            border-radius: var(--radius-full);
            transition: transform 0.3s ease;
            box-shadow: ${props.active && props.glowEffect ? '0 0 8px var(--color-accent1)' : 'none'};
          }
        `;
      default:
        return `
          color: ${props.active ? 'var(--color-primary)' : 'var(--color-textSecondary)'};
          font-weight: ${props.active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'};
          
          &:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: ${props.active ? 'var(--color-primary)' : 'transparent'};
            box-shadow: ${props.active && props.glowEffect ? '0 0 8px var(--color-accent1)' : 'none'};
          }
        `;
    }
  }}
  
  /* Disabled state */
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  
  /* Active state */
  &:active {
    transform: ${props => (props.disabled ? 'none' : 'scale(0.98)')};
    opacity: ${props => (props.disabled ? '0.5' : '0.9')};
  }
`;

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  scrollable = true,
  centered = false,
  variant = 'default',
  size = 'medium',
  glowEffect = true,
  onChange,
  className,
}) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(activeKey || (items.length > 0 ? items[0].key : ''));
  
  const handleTabClick = (key: string) => {
    setActive(key);
    onChange && onChange(key);
  };
  
  const renderTabs = () => {
    return items.map(item => (
      <StyledTabItem
        key={item.key}
        active={active === item.key}
        disabled={!!item.disabled}
        variant={variant}
        size={size}
        glowEffect={glowEffect}
        onClick={() => handleTabClick(item.key)}
      >
        {item.title}
      </StyledTabItem>
    ));
  };
  
  return (
    <StyledTabsWrapper
      variant={variant}
      glowEffect={glowEffect}
      className={className}
    >
      {scrollable ? (
        <StyledTabsScroll
          scrollX
          scrollWithAnimation
          showScrollbar={false}
        >
          <StyledTabsBar centered={false}>
            {renderTabs()}
          </StyledTabsBar>
        </StyledTabsScroll>
      ) : (
        <StyledTabsBar centered={centered}>
          {renderTabs()}
        </StyledTabsBar>
      )}
    </StyledTabsWrapper>
  );
};

export default Tabs;
