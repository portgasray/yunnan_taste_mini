/**
 * ProductFilter component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { styled } from 'styled-components';
import { useTheme } from '../theme';
import Icon from './Icon';
import Badge from './Badge';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

export interface ProductFilterProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, selectedIds: string[]) => void;
  onReset?: () => void;
  glowEffect?: boolean;
  className?: string;
}

const StyledProductFilter = styled(View)<{
  glowEffect: boolean;
}>`
  width: 100%;
  border-radius: var(--radius-lg);
  background-color: var(--color-backgroundAlt);
  overflow: hidden;
  transition: all var(--transition-default);
  
  /* Box shadow and glow effect */
  box-shadow: ${props => props.glowEffect ? 'var(--glow-sm)' : 'var(--shadow-sm)'};
  
  /* Header */
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    
    .filter-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
      
      /* Glow effect for title */
      ${props => props.glowEffect && `
        text-shadow: 0 0 4px rgba(var(--color-primary-rgb), 0.3);
      `}
    }
    
    .filter-reset {
      display: flex;
      align-items: center;
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      
      .reset-icon {
        margin-right: var(--spacing-xs);
      }
      
      &:active {
        opacity: 0.8;
      }
    }
  }
  
  /* Filter groups */
  .filter-groups {
    padding: var(--spacing-md);
    
    .filter-group {
      margin-bottom: var(--spacing-lg);
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .group-title {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-textPrimary);
        margin-bottom: var(--spacing-sm);
      }
      
      .group-options {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        
        .option-item {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-md);
          background-color: var(--color-backgroundDark);
          font-size: var(--font-size-sm);
          color: var(--color-textSecondary);
          transition: all var(--transition-default);
          display: flex;
          align-items: center;
          
          &.selected {
            background-color: var(--color-primary);
            color: var(--color-textInverse);
            
            /* Glow effect for selected options */
            ${props => props.glowEffect && `
              box-shadow: 0 0 8px rgba(var(--color-primary-rgb), 0.5);
            `}
            
            .option-count {
              background-color: rgba(255, 255, 255, 0.2);
            }
          }
          
          &:active {
            transform: scale(0.98);
          }
          
          .option-label {
            margin-right: ${props => props.glowEffect ? 'var(--spacing-xs)' : '0'};
          }
          
          .option-count {
            margin-left: var(--spacing-xs);
            padding: 0 var(--spacing-xs);
            border-radius: var(--radius-sm);
            background-color: var(--color-backgroundAlt);
            font-size: var(--font-size-xs);
            min-width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
  
  /* Bioluminescent particles effect - only when glowEffect is true */
  ${props => props.glowEffect && `
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at 70% 30%,
        rgba(var(--color-primary-rgb), 0.05) 0%,
        rgba(var(--color-primary-rgb), 0) 70%
      );
      pointer-events: none;
    }
  `}
`;

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onReset,
  glowEffect = true,
  className,
}) => {
  const { theme } = useTheme();
  
  // Handle option click
  const handleOptionClick = (groupId: string, optionId: string, multiSelect: boolean) => {
    const currentSelected = selectedFilters[groupId] || [];
    let newSelected: string[];
    
    if (multiSelect) {
      // For multi-select, toggle the option
      if (currentSelected.includes(optionId)) {
        newSelected = currentSelected.filter(id => id !== optionId);
      } else {
        newSelected = [...currentSelected, optionId];
      }
    } else {
      // For single-select, replace with the new option or clear if already selected
      newSelected = currentSelected.includes(optionId) && currentSelected.length === 1
        ? []
        : [optionId];
    }
    
    onFilterChange(groupId, newSelected);
  };
  
  // Handle reset
  const handleReset = () => {
    onReset && onReset();
  };
  
  // Check if an option is selected
  const isOptionSelected = (groupId: string, optionId: string) => {
    return (selectedFilters[groupId] || []).includes(optionId);
  };
  
  // Count total selected filters
  const countSelectedFilters = () => {
    return Object.values(selectedFilters).reduce((total, group) => total + group.length, 0);
  };
  
  return (
    <StyledProductFilter
      glowEffect={glowEffect}
      className={className}
    >
      <View className="filter-header">
        <Text className="filter-title">筛选</Text>
        
        {countSelectedFilters() > 0 && (
          <View className="filter-reset" onClick={handleReset}>
            <Icon name="refresh-cw" size="xs" color="textSecondary" className="reset-icon" />
            <Text>重置</Text>
          </View>
        )}
      </View>
      
      <View className="filter-groups">
        {filters.map(group => (
          <View key={group.id} className="filter-group">
            <Text className="group-title">{group.title}</Text>
            
            <View className="group-options">
              {group.options.map(option => (
                <View
                  key={option.id}
                  className={`option-item ${isOptionSelected(group.id, option.id) ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(group.id, option.id, !!group.multiSelect)}
                >
                  <Text className="option-label">{option.label}</Text>
                  {option.count !== undefined && (
                    <Text className="option-count">{option.count}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </StyledProductFilter>
  );
};

export default ProductFilter;
