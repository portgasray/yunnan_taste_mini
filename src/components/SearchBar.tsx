/**
 * SearchBar component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import { styled } from 'styled-components';
import { useTheme } from '../theme';
import Icon from './Icon';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  variant?: 'default' | 'rounded' | 'minimal';
  glowEffect?: boolean;
  showHistory?: boolean;
  historyItems?: string[];
  onHistoryItemClick?: (item: string) => void;
  onHistoryClear?: () => void;
  className?: string;
}

const StyledSearchBar = styled(View)<{
  variant: 'default' | 'rounded' | 'minimal';
  glowEffect: boolean;
  focused: boolean;
}>`
  width: 100%;
  
  /* Search input container */
  .search-input-container {
    display: flex;
    align-items: center;
    padding: ${props => props.variant === 'minimal' ? 'var(--spacing-xs) 0' : 'var(--spacing-sm) var(--spacing-md)'};
    border-radius: ${props => {
      switch (props.variant) {
        case 'rounded':
          return 'var(--radius-full)';
        case 'minimal':
          return '0';
        default:
          return 'var(--radius-lg)';
      }
    }};
    background-color: ${props => props.variant === 'minimal' ? 'transparent' : 'var(--color-backgroundAlt)'};
    border-bottom: ${props => props.variant === 'minimal' ? '1px solid var(--color-border)' : 'none'};
    transition: all var(--transition-default);
    
    /* Box shadow and glow effect */
    box-shadow: ${props => {
      if (props.variant === 'minimal') return 'none';
      return props.glowEffect 
        ? props.focused 
          ? 'var(--glow-md)' 
          : 'var(--glow-sm)'
        : props.focused 
          ? 'var(--shadow-md)' 
          : 'var(--shadow-sm)';
    }};
    
    /* Search icon */
    .search-icon {
      margin-right: var(--spacing-sm);
    }
    
    /* Input field */
    .search-input {
      flex: 1;
      height: 36px;
      font-size: var(--font-size-md);
      color: var(--color-textPrimary);
      background-color: transparent;
      border: none;
      outline: none;
      
      &::placeholder {
        color: var(--color-textDisabled);
      }
    }
    
    /* Clear button */
    .clear-button {
      margin-left: var(--spacing-sm);
      opacity: 0.7;
      
      &:active {
        opacity: 1;
      }
    }
    
    /* Search button - only for default and rounded variants */
    .search-button {
      display: ${props => props.variant === 'minimal' ? 'none' : 'flex'};
      align-items: center;
      justify-content: center;
      margin-left: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      background-color: var(--color-primary);
      color: var(--color-textInverse);
      font-size: var(--font-size-sm);
      
      /* Glow effect for search button */
      ${props => props.glowEffect && `
        box-shadow: 0 0 8px rgba(var(--color-primary-rgb), 0.5);
      `}
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
  
  /* Search history */
  .search-history {
    margin-top: var(--spacing-md);
    display: ${props => props.focused ? 'block' : 'none'};
    
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
      
      .history-title {
        font-size: var(--font-size-sm);
        color: var(--color-textSecondary);
      }
      
      .history-clear {
        font-size: var(--font-size-xs);
        color: var(--color-textDisabled);
        
        &:active {
          opacity: 0.8;
        }
      }
    }
    
    .history-items {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      
      .history-item {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-md);
        background-color: var(--color-backgroundDark);
        font-size: var(--font-size-sm);
        color: var(--color-textSecondary);
        transition: all var(--transition-default);
        
        /* Glow effect for history items */
        ${props => props.glowEffect && `
          &:active {
            box-shadow: 0 0 8px rgba(var(--color-accent1-rgb), 0.3);
          }
        `}
        
        &:active {
          transform: scale(0.98);
          background-color: var(--color-backgroundAlt);
        }
      }
    }
  }
  
  /* Bioluminescent glow effect - only when glowEffect is true and focused */
  ${props => props.glowEffect && props.focused && `
    .search-input-container {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: ${props.variant === 'rounded' ? 'var(--radius-full)' : 'var(--radius-lg)'};
        box-shadow: 0 0 15px rgba(var(--color-primary-rgb), 0.3);
        opacity: 0.5;
        pointer-events: none;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% {
          opacity: 0.3;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          opacity: 0.3;
        }
      }
    }
  `}
`;

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索云南特产...',
  value = '',
  onChange,
  onSearch,
  onClear,
  variant = 'default',
  glowEffect = true,
  showHistory = false,
  historyItems = [],
  onHistoryItemClick,
  onHistoryClear,
  className,
}) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const [focused, setFocused] = useState(false);
  
  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.detail.value;
    setInputValue(newValue);
    onChange && onChange(newValue);
  };
  
  // Handle search
  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch && onSearch(inputValue.trim());
    }
  };
  
  // Handle clear
  const handleClear = () => {
    setInputValue('');
    onClear && onClear();
  };
  
  // Handle focus
  const handleFocus = () => {
    setFocused(true);
  };
  
  // Handle blur
  const handleBlur = () => {
    // Delay blur to allow click events on history items
    setTimeout(() => {
      setFocused(false);
    }, 200);
  };
  
  // Handle history item click
  const handleHistoryItemClick = (item: string) => {
    setInputValue(item);
    onHistoryItemClick && onHistoryItemClick(item);
  };
  
  // Handle history clear
  const handleHistoryClear = () => {
    onHistoryClear && onHistoryClear();
  };
  
  return (
    <StyledSearchBar
      variant={variant}
      glowEffect={glowEffect}
      focused={focused}
      className={className}
    >
      <View className="search-input-container">
        <Icon 
          name="search" 
          size="sm" 
          color={focused ? 'primary' : 'textSecondary'} 
          className="search-icon"
          glow={glowEffect && focused}
        />
        
        <Input
          className="search-input"
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onInput={handleInputChange}
          onConfirm={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          confirmType="search"
        />
        
        {inputValue && (
          <View className="clear-button" onClick={handleClear}>
            <Icon name="x-circle" size="sm" color="textDisabled" />
          </View>
        )}
        
        {variant !== 'minimal' && (
          <View className="search-button" onClick={handleSearch}>
            <Text>搜索</Text>
          </View>
        )}
      </View>
      
      {showHistory && historyItems.length > 0 && (
        <View className="search-history">
          <View className="history-header">
            <Text className="history-title">搜索历史</Text>
            <Text className="history-clear" onClick={handleHistoryClear}>清除</Text>
          </View>
          
          <View className="history-items">
            {historyItems.map((item, index) => (
              <View 
                key={index} 
                className="history-item"
                onClick={() => handleHistoryItemClick(item)}
              >
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </StyledSearchBar>
  );
};

export default SearchBar;
