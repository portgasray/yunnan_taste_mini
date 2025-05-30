/**
 * Loading component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme with bioluminescent animation
 */

import React from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled, keyframes } from 'styled-components';

export type LoadingSize = 'small' | 'medium' | 'large';
export type LoadingVariant = 'dots' | 'spinner' | 'pulse';

export interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: string;
  fullscreen?: boolean;
  text?: string;
  className?: string;
}

// Keyframe animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
`;

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const StyledLoading = styled(View)<{
  size: LoadingSize;
  variant: LoadingVariant;
  color: string;
  fullscreen: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* Fullscreen styles */
  position: ${props => (props.fullscreen ? 'fixed' : 'relative')};
  top: ${props => (props.fullscreen ? '0' : 'auto')};
  left: ${props => (props.fullscreen ? '0' : 'auto')};
  right: ${props => (props.fullscreen ? '0' : 'auto')};
  bottom: ${props => (props.fullscreen ? '0' : 'auto')};
  z-index: ${props => (props.fullscreen ? '9999' : '1')};
  background-color: ${props => (props.fullscreen ? 'rgba(4, 31, 32, 0.8)' : 'transparent')};
  
  .loading-text {
    margin-top: var(--spacing-md);
    color: ${props => props.color};
    font-size: var(--font-size-sm);
    animation: ${floatAnimation} 2s infinite ease-in-out;
  }
`;

const DotsContainer = styled(View)<{
  size: LoadingSize;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => {
    switch (props.size) {
      case 'small':
        return 'var(--spacing-xs)';
      case 'large':
        return 'var(--spacing-md)';
      default:
        return 'var(--spacing-sm)';
    }
  }};
`;

const Dot = styled(View)<{
  size: LoadingSize;
  color: string;
  index: number;
}>`
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '8px';
      case 'large':
        return '16px';
      default:
        return '12px';
    }
  }};
  
  height: ${props => {
    switch (props.size) {
      case 'small':
        return '8px';
      case 'large':
        return '16px';
      default:
        return '12px';
    }
  }};
  
  border-radius: 50%;
  background-color: ${props => props.color};
  animation: ${pulseAnimation} 1.5s infinite ease-in-out;
  animation-delay: ${props => props.index * 0.2}s;
  box-shadow: 0 0 10px ${props => props.color};
`;

const Spinner = styled(View)<{
  size: LoadingSize;
  color: string;
}>`
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '24px';
      case 'large':
        return '48px';
      default:
        return '36px';
    }
  }};
  
  height: ${props => {
    switch (props.size) {
      case 'small':
        return '24px';
      case 'large':
        return '48px';
      default:
        return '36px';
    }
  }};
  
  border: 3px solid rgba(38, 247, 199, 0.1);
  border-top: 3px solid ${props => props.color};
  border-radius: 50%;
  animation: ${spinAnimation} 1s infinite linear;
  box-shadow: 0 0 15px rgba(38, 247, 199, 0.3);
`;

const PulseCircle = styled(View)<{
  size: LoadingSize;
  color: string;
}>`
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '30px';
      case 'large':
        return '60px';
      default:
        return '45px';
    }
  }};
  
  height: ${props => {
    switch (props.size) {
      case 'small':
        return '30px';
      case 'large':
        return '60px';
      default:
        return '45px';
    }
  }};
  
  border-radius: 50%;
  background-color: ${props => props.color};
  opacity: 0.6;
  animation: ${pulseAnimation} 2s infinite ease-in-out;
  box-shadow: 0 0 20px ${props => props.color};
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background-color: rgba(38, 247, 199, 0.8);
    box-shadow: 0 0 15px rgba(38, 247, 199, 0.8);
  }
`;

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  variant = 'dots',
  color = 'var(--color-accent1)',
  fullscreen = false,
  text,
  className,
}) => {
  const { theme } = useTheme();
  
  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return (
          <DotsContainer size={size} color={color}>
            <Dot size={size} color={color} index={0} />
            <Dot size={size} color={color} index={1} />
            <Dot size={size} color={color} index={2} />
          </DotsContainer>
        );
      case 'spinner':
        return <Spinner size={size} color={color} />;
      case 'pulse':
        return <PulseCircle size={size} color={color} />;
      default:
        return null;
    }
  };
  
  return (
    <StyledLoading
      size={size}
      variant={variant}
      color={color}
      fullscreen={fullscreen}
      className={className}
    >
      {renderLoadingIndicator()}
      {text && <View className="loading-text">{text}</View>}
    </StyledLoading>
  );
};

export default Loading;
