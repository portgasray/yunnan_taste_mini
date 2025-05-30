/**
 * Container component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type ContainerWidth = 'full' | 'wide' | 'medium' | 'narrow';
export type ContainerPadding = string;

export interface ContainerProps {
  width?: ContainerWidth;
  padding?: ContainerPadding;
  centered?: boolean;
  background?: boolean;
  glowEffect?: boolean;
  children: React.ReactNode;
  className?: string;
}

const StyledContainer = styled(View)<{
  width: ContainerWidth;
  padding: ContainerPadding;
  centered: boolean;
  background: boolean;
  glowEffect: boolean;
}>`
  width: 100%;
  max-width: ${props => {
    switch (props.width) {
      case 'narrow':
        return '600px';
      case 'medium':
        return '800px';
      case 'wide':
        return '1200px';
      default:
        return '100%';
    }
  }};
  padding: ${props => props.padding};
  margin: ${props => (props.centered ? '0 auto' : '0')};
  
  /* Background and effects */
  background-color: ${props => (props.background ? 'var(--color-backgroundAlt)' : 'transparent')};
  border-radius: ${props => (props.background ? 'var(--radius-lg)' : '0')};
  box-shadow: ${props => {
    if (props.background && props.glowEffect) {
      return 'var(--glow-sm)';
    } else if (props.background) {
      return 'var(--shadow-sm)';
    } else {
      return 'none';
    }
  }};
`;

export const Container: React.FC<ContainerProps> = ({
  width = 'full',
  padding = 'var(--spacing-md)',
  centered = true,
  background = false,
  glowEffect = false,
  children,
  className,
}) => {
  const { theme } = useTheme();
  
  return (
    <StyledContainer
      width={width}
      padding={padding}
      centered={centered}
      background={background}
      glowEffect={glowEffect}
      className={className}
    >
      {children}
    </StyledContainer>
  );
};

export default Container;
