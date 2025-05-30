/**
 * Popup component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';

export type PopupPosition = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface PopupProps {
  visible: boolean;
  position?: PopupPosition;
  title?: React.ReactNode;
  closable?: boolean;
  maskClosable?: boolean;
  showMask?: boolean;
  rounded?: boolean;
  glowEffect?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const StyledPopupWrapper = styled(View)<{
  visible: boolean;
  showMask: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: ${props => (props.visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  
  /* Mask */
  background-color: ${props => (props.showMask ? 'rgba(3, 21, 22, 0.8)' : 'transparent')};
  backdrop-filter: ${props => (props.showMask ? 'blur(4px)' : 'none')};
  
  /* Animation */
  animation: ${props => (props.visible ? 'fadeIn 0.3s ease' : 'none')};
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledPopup = styled(View)<{
  position: PopupPosition;
  rounded: boolean;
  glowEffect: boolean;
  visible: boolean;
}>`
  position: fixed;
  background-color: var(--color-backgroundAlt);
  box-shadow: ${props => (props.glowEffect ? 'var(--glow-lg)' : 'var(--shadow-lg)')};
  
  /* Position styles */
  ${props => {
    switch (props.position) {
      case 'top':
        return `
          top: 0;
          left: 0;
          right: 0;
          max-height: 80%;
          border-bottom-left-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          border-bottom-right-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          animation: ${props.visible ? 'slideInTop 0.3s ease' : 'none'};
        `;
      case 'right':
        return `
          top: 0;
          right: 0;
          bottom: 0;
          max-width: 80%;
          border-top-left-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          border-bottom-left-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          animation: ${props.visible ? 'slideInRight 0.3s ease' : 'none'};
        `;
      case 'bottom':
        return `
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 80%;
          border-top-left-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          border-top-right-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          animation: ${props.visible ? 'slideInBottom 0.3s ease' : 'none'};
        `;
      case 'left':
        return `
          top: 0;
          left: 0;
          bottom: 0;
          max-width: 80%;
          border-top-right-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          border-bottom-right-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          animation: ${props.visible ? 'slideInLeft 0.3s ease' : 'none'};
        `;
      default: // center
        return `
          max-width: 80%;
          max-height: 80%;
          border-radius: ${props.rounded ? 'var(--radius-lg)' : '0'};
          animation: ${props.visible ? 'zoomIn 0.3s ease' : 'none'};
        `;
    }
  }}
  
  /* Animations */
  @keyframes slideInTop {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes slideInBottom {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Header */
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: var(--border-width-thin) solid var(--color-border);
    
    .popup-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
    }
    
    .popup-close {
      cursor: pointer;
      transition: all var(--transition-default);
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  /* Content */
  .popup-content {
    padding: var(--spacing-lg);
    overflow-y: auto;
    max-height: ${props => (props.position === 'center' ? '60vh' : '100%')};
    color: var(--color-textSecondary);
  }
`;

export const Popup: React.FC<PopupProps> = ({
  visible = false,
  position = 'bottom',
  title,
  closable = true,
  maskClosable = true,
  showMask = true,
  rounded = true,
  glowEffect = true,
  onClose,
  afterClose,
  children,
  className,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  
  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose();
    
    // Call afterClose after animation
    setTimeout(() => {
      afterClose && afterClose();
    }, 300);
  };
  
  const handleMaskClick = () => {
    if (maskClosable) {
      handleClose();
    }
  };
  
  return (
    <StyledPopupWrapper
      visible={isVisible}
      showMask={showMask}
      onClick={handleMaskClick}
      className={className}
    >
      <StyledPopup
        position={position}
        rounded={rounded}
        glowEffect={glowEffect}
        visible={isVisible}
        onClick={e => e.stopPropagation()}
      >
        {(title || closable) && (
          <View className="popup-header">
            {title && <View className="popup-title">{title}</View>}
            {closable && (
              <View className="popup-close" onClick={handleClose}>
                <Icon name="close" size="sm" color="textSecondary" />
              </View>
            )}
          </View>
        )}
        
        <View className="popup-content">
          {children}
        </View>
      </StyledPopup>
    </StyledPopupWrapper>
  );
};

export default Popup;
