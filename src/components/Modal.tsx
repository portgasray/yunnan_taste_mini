/**
 * Modal component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Button from './Button';
import Icon from './Icon';

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface ModalProps {
  visible: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closable?: boolean;
  maskClosable?: boolean;
  showMask?: boolean;
  centered?: boolean;
  glowEffect?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const StyledModalWrapper = styled(View)<{
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

const StyledModal = styled(View)<{
  size: ModalSize;
  centered: boolean;
  glowEffect: boolean;
  visible: boolean;
}>`
  position: relative;
  background-color: var(--color-backgroundAlt);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: ${props => (props.glowEffect ? 'var(--glow-lg)' : 'var(--shadow-lg)')};
  
  /* Size styles */
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '300px';
      case 'large':
        return '90%';
      case 'fullscreen':
        return '100%';
      default:
        return '80%';
    }
  }};
  
  max-width: ${props => (props.size === 'fullscreen' ? '100%' : '600px')};
  
  height: ${props => (props.size === 'fullscreen' ? '100%' : 'auto')};
  max-height: ${props => (props.size === 'fullscreen' ? '100%' : '90%')};
  
  /* Position */
  margin: ${props => (props.centered ? '0 auto' : '50px auto')};
  
  /* Animation */
  animation: ${props => (props.visible ? 'modalEnter 0.3s ease' : 'none')};
  
  @keyframes modalEnter {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Header */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: var(--border-width-thin) solid var(--color-border);
    
    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
    }
    
    .modal-close {
      cursor: pointer;
      transition: all var(--transition-default);
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  /* Content */
  .modal-content {
    padding: var(--spacing-lg);
    overflow-y: auto;
    max-height: ${props => (props.size === 'fullscreen' ? 'calc(100% - 120px)' : '400px')};
    color: var(--color-textSecondary);
  }
  
  /* Footer */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: var(--border-width-thin) solid var(--color-border);
    
    .modal-btn {
      margin-left: var(--spacing-sm);
    }
  }
`;

export const Modal: React.FC<ModalProps> = ({
  visible = false,
  title,
  content,
  footer,
  size = 'medium',
  closable = true,
  maskClosable = true,
  showMask = true,
  centered = true,
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
  
  const renderFooter = () => {
    if (footer === null) {
      return null;
    }
    
    if (footer) {
      return <View className="modal-footer">{footer}</View>;
    }
    
    return (
      <View className="modal-footer">
        <Button 
          variant="outline" 
          size="medium" 
          onClick={handleClose}
          className="modal-btn"
        >
          取消
        </Button>
        <Button 
          variant="primary" 
          size="medium" 
          glow={glowEffect}
          className="modal-btn"
        >
          确定
        </Button>
      </View>
    );
  };
  
  return (
    <StyledModalWrapper
      visible={isVisible}
      showMask={showMask}
      onClick={handleMaskClick}
      className={className}
    >
      <StyledModal
        size={size}
        centered={centered}
        glowEffect={glowEffect}
        visible={isVisible}
        onClick={e => e.stopPropagation()}
      >
        {(title || closable) && (
          <View className="modal-header">
            {title && <View className="modal-title">{title}</View>}
            {closable && (
              <View className="modal-close" onClick={handleClose}>
                <Icon name="close" size="sm" color="textSecondary" />
              </View>
            )}
          </View>
        )}
        
        <View className="modal-content">
          {content || children}
        </View>
        
        {renderFooter()}
      </StyledModal>
    </StyledModalWrapper>
  );
};

export default Modal;
