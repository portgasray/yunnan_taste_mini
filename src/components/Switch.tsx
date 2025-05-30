/**
 * Switch component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState } from 'react';
import { View, Switch as TaroSwitch } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  onChange?: (checked: boolean) => void;
  className?: string;
}

const StyledSwitchWrapper = styled(View)<{
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  
  /* Size styles */
  .taro-switch {
    transform: scale(${props => {
      switch (props.size) {
        case 'small':
          return '0.8';
        case 'large':
          return '1.2';
        default:
          return '1';
      }
    }});
  }
  
  /* Disabled state */
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  
  /* Custom styles for bioluminescent effect */
  .taro-switch.taro-switch-checked {
    box-shadow: 0 0 10px var(--color-accent1);
    transition: box-shadow 0.3s ease;
  }
`;

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked,
  disabled = false,
  color = 'var(--color-accent1)',
  size = 'medium',
  onChange,
  className,
}) => {
  const { theme } = useTheme();
  const [isChecked, setIsChecked] = useState(defaultChecked || false);
  
  const handleChange = (e) => {
    const newChecked = e.detail.value;
    setIsChecked(newChecked);
    onChange && onChange(newChecked);
  };
  
  return (
    <StyledSwitchWrapper
      size={size}
      disabled={disabled}
      className={className}
    >
      <TaroSwitch
        className={`taro-switch ${(checked !== undefined ? checked : isChecked) ? 'taro-switch-checked' : ''}`}
        checked={checked !== undefined ? checked : isChecked}
        disabled={disabled}
        color={color}
        onChange={handleChange}
      />
    </StyledSwitchWrapper>
  );
};

export default Switch;
