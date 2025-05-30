/**
 * Input component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Input as TaroInput } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';

export type InputVariant = 'default' | 'filled' | 'outlined' | 'glowing';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorMessage?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  maxLength?: number;
  type?: 'text' | 'number' | 'password' | 'idcard' | 'digit';
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

const StyledInputWrapper = styled(View)<{
  variant: InputVariant;
  size: InputSize;
  disabled: boolean;
  error: boolean;
  focused: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: var(--radius-md);
  transition: all var(--transition-default);
  
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
    
    if (props.focused) {
      return 'var(--color-primary)';
    }
    
    return 'var(--color-border)';
  }};
  
  box-shadow: ${props => {
    if (props.variant === 'glowing') {
      if (props.error) {
        return 'var(--glow-sm) var(--color-error)';
      }
      
      if (props.focused) {
        return 'var(--glow-sm) var(--color-accent1)';
      }
      
      return 'var(--glow-sm) var(--color-accent1)';
    }
    
    return 'none';
  }};
  
  /* Disabled state */
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  
  /* Focus state */
  ${props => props.focused && `
    border-color: var(--color-primary);
    box-shadow: ${props.variant === 'glowing' ? 'var(--glow-md) var(--color-accent1)' : 'none'};
  `}
  
  /* Error state */
  ${props => props.error && `
    border-color: var(--color-error);
    box-shadow: ${props.variant === 'glowing' ? 'var(--glow-sm) var(--color-error)' : 'none'};
  `}
  
  /* Prefix and suffix */
  .input-prefix {
    margin-right: var(--spacing-xs);
    color: var(--color-textSecondary);
  }
  
  .input-suffix {
    margin-left: var(--spacing-xs);
    color: var(--color-textSecondary);
  }
  
  /* Native input */
  .taro-input {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
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
    
    &::placeholder {
      color: var(--color-textDisabled);
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
`;

export const Input: React.FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  variant = 'default',
  size = 'medium',
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage,
  prefix,
  suffix,
  maxLength,
  type = 'text',
  onChange,
  onFocus,
  onBlur,
  className,
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  
  const handleFocus = () => {
    setFocused(true);
    onFocus && onFocus();
  };
  
  const handleBlur = () => {
    setFocused(false);
    onBlur && onBlur();
  };
  
  const handleChange = (e) => {
    const newValue = e.detail.value;
    setInputValue(newValue);
    onChange && onChange(newValue);
  };
  
  return (
    <StyledInputWrapper
      variant={variant}
      size={size}
      disabled={disabled}
      error={error}
      focused={focused}
      className={className}
    >
      {prefix && <View className="input-prefix">{prefix}</View>}
      
      <TaroInput
        className="taro-input"
        value={value !== undefined ? value : inputValue}
        type={type}
        placeholder={placeholder}
        maxlength={maxLength}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleChange}
      />
      
      {suffix && <View className="input-suffix">{suffix}</View>}
      
      {error && errorMessage && (
        <View className="error-message">{errorMessage}</View>
      )}
    </StyledInputWrapper>
  );
};

export default Input;
