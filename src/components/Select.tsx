/**
 * Select component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Picker } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';

export type SelectVariant = 'default' | 'filled' | 'outlined' | 'glowing';
export type SelectSize = 'small' | 'medium' | 'large';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  options: SelectOption[];
  variant?: SelectVariant;
  size?: SelectSize;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  onChange?: (value: string | number) => void;
  className?: string;
}

const StyledSelectWrapper = styled(View)<{
  variant: SelectVariant;
  size: SelectSize;
  disabled: boolean;
  error: boolean;
  active: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: var(--radius-md);
  transition: all var(--transition-default);
  cursor: pointer;
  
  /* Size styles */
  height: ${props => {
    switch (props.size) {
      case 'small':
        return '32px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  }};
  
  padding: ${props => {
    switch (props.size) {
      case 'small':
        return '0 var(--spacing-sm)';
      case 'large':
        return '0 var(--spacing-lg)';
      default:
        return '0 var(--spacing-md)';
    }
  }};
  
  /* Variant styles */
  background-color: ${props => {
    switch (props.variant) {
      case 'filled':
        return 'var(--color-backgroundAlt)';
      case 'default':
      case 'outlined':
      case 'glowing':
        return 'transparent';
      default:
        return 'transparent';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'outlined':
      case 'glowing':
        return 'var(--border-width-normal) solid var(--color-border)';
      default:
        return 'none';
    }
  }};
  
  border-color: ${props => {
    if (props.error) {
      return 'var(--color-error)';
    }
    
    if (props.active) {
      return 'var(--color-primary)';
    }
    
    return 'var(--color-border)';
  }};
  
  box-shadow: ${props => {
    if (props.variant === 'glowing') {
      if (props.error) {
        return 'var(--glow-sm) var(--color-error)';
      }
      
      if (props.active) {
        return 'var(--glow-sm) var(--color-accent1)';
      }
      
      return 'var(--glow-sm) var(--color-accent1)';
    }
    
    return 'none';
  }};
  
  /* Disabled state */
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  
  /* Active state */
  ${props => props.active && `
    border-color: var(--color-primary);
    box-shadow: ${props.variant === 'glowing' ? 'var(--glow-md) var(--color-accent1)' : 'none'};
  `}
  
  /* Error state */
  ${props => props.error && `
    border-color: var(--color-error);
    box-shadow: ${props.variant === 'glowing' ? 'var(--glow-sm) var(--color-error)' : 'none'};
  `}
  
  /* Select content */
  .select-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .select-value {
      color: var(--color-textPrimary);
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
    }
    
    .select-placeholder {
      color: var(--color-textDisabled);
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
    }
    
    .select-arrow {
      margin-left: var(--spacing-sm);
      transition: transform 0.3s ease;
      transform: ${props => (props.active ? 'rotate(180deg)' : 'rotate(0)')};
    }
  }
  
  /* Error message */
  .error-message {
    position: absolute;
    left: 0;
    bottom: -20px;
    font-size: var(--font-size-xs);
    color: var(--color-error);
  }
  
  /* Native picker */
  .taro-picker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
`;

export const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  placeholder = '请选择',
  options,
  variant = 'default',
  size = 'medium',
  disabled = false,
  error = false,
  errorMessage,
  onChange,
  className,
}) => {
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(value !== undefined ? value : defaultValue);
  const [active, setActive] = useState(false);
  
  // Convert options to format required by Taro Picker
  const pickerRange = options.map(option => option.label);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === selectedValue);
  
  const handleChange = (e) => {
    const index = e.detail.value;
    const newValue = options[index].value;
    setSelectedValue(newValue);
    onChange && onChange(newValue);
  };
  
  return (
    <StyledSelectWrapper
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      active={active}
      className={className}
    >
      <View className="select-content">
        {selectedOption ? (
          <View className="select-value">{selectedOption.label}</View>
        ) : (
          <View className="select-placeholder">{placeholder}</View>
        )}
        
        <View className="select-arrow">
          <Icon name="arrow-down" size="sm" color="textSecondary" />
        </View>
      </View>
      
      <Picker
        className="taro-picker"
        mode="selector"
        range={pickerRange}
        value={selectedOption ? options.findIndex(option => option.value === selectedValue) : 0}
        disabled={disabled}
        onChange={handleChange}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />
      
      {error && errorMessage && (
        <View className="error-message">{errorMessage}</View>
      )}
    </StyledSelectWrapper>
  );
};

export default Select;
