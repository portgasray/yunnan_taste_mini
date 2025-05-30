/**
 * Toast component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'center' | 'bottom';

export interface ToastProps {
  visible?: boolean;
  type?: ToastType;
  position?: ToastPosition;
  message: string;
  duration?: number;
  icon?: boolean;
  glowEffect?: boolean;
  onClose?: () => void;
  className?: string;
}

const StyledToastWrapper = styled(View)<{
  visible: boolean;
  position: ToastPosition;
}>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  pointer-events: none;
  
  /* Position styles */
  ${props => {
    switch (props.position) {
      case 'top':
        return 'top: 80px;';
      case 'bottom':
        return 'bottom: 80px;';
      default:
        return 'top: 50%; transform: translate(-50%, -50%);';
    }
  }}
  
  /* Visibility */
  opacity: ${props => (props.visible ? '1' : '0')};
  transition: opacity 0.3s ease;
`;

const StyledToast = styled(View)<{
  type: ToastType;
  glowEffect: boolean;
}>`
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  background-color: var(--color-backgroundDark);
  box-shadow: ${props => (props.glowEffect ? `0 0 15px var(--color-${props.type})` : 'var(--shadow-md)')};
  max-width: 80%;
  
  /* Animation */
  animation: toastEnter 0.3s ease;
  
  @keyframes toastEnter {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Icon */
  .toast-icon {
    margin-right: var(--spacing-sm);
  }
  
  /* Message */
  .toast-message {
    color: var(--color-textPrimary);
    font-size: var(--font-size-md);
    text-align: center;
  }
`;

// Singleton pattern for toast management
let toastInstance: any = null;

export const Toast = {
  show: (options: Omit<ToastProps, 'visible'>) => {
    if (toastInstance) {
      toastInstance.update(options);
    } else {
      toastInstance = ToastComponent.show(options);
    }
    return toastInstance;
  },
  
  info: (message: string, duration = 3000) => {
    return Toast.show({ message, type: 'info', duration });
  },
  
  success: (message: string, duration = 3000) => {
    return Toast.show({ message, type: 'success', duration });
  },
  
  warning: (message: string, duration = 3000) => {
    return Toast.show({ message, type: 'warning', duration });
  },
  
  error: (message: string, duration = 3000) => {
    return Toast.show({ message, type: 'error', duration });
  },
  
  hide: () => {
    if (toastInstance) {
      toastInstance.hide();
    }
  },
};

// Internal component for rendering
const ToastComponent: React.FC<ToastProps> & { show: (options: Omit<ToastProps, 'visible'>) => any } = ({
  visible = false,
  type = 'info',
  position = 'center',
  message,
  duration = 3000,
  icon = true,
  glowEffect = true,
  onClose,
  className,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
    
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);
  
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      default:
        return 'info-circle';
    }
  };
  
  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };
  
  return (
    <StyledToastWrapper
      visible={isVisible}
      position={position}
      className={className}
    >
      <StyledToast
        type={type}
        glowEffect={glowEffect}
      >
        {icon && (
          <View className="toast-icon">
            <Icon name={getIconName()} color={getIconColor()} size="sm" glow={glowEffect} />
          </View>
        )}
        <Text className="toast-message">{message}</Text>
      </StyledToast>
    </StyledToastWrapper>
  );
};

// Static method for showing toast
ToastComponent.show = (options: Omit<ToastProps, 'visible'>) => {
  // Implementation would depend on Taro's API for dynamic component rendering
  // This is a simplified version
  const instance = {
    update: (newOptions: Omit<ToastProps, 'visible'>) => {
      // Update toast with new options
    },
    hide: () => {
      // Hide toast
    },
  };
  
  return instance;
};

export default Toast;
