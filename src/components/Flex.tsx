/**
 * Flex component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type FlexGap = string;

export interface FlexProps {
  direction?: FlexDirection;
  wrap?: FlexWrap;
  justify?: FlexJustify;
  align?: FlexAlign;
  gap?: FlexGap;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StyledFlex = styled(View)<{
  direction: FlexDirection;
  wrap: FlexWrap;
  justify: FlexJustify;
  align: FlexAlign;
  gap: FlexGap;
}>`
  display: flex;
  flex-direction: ${props => props.direction};
  flex-wrap: ${props => props.wrap};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  gap: ${props => props.gap};
  width: 100%;
`;

export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  wrap = 'nowrap',
  justify = 'flex-start',
  align = 'center',
  gap = 'var(--spacing-md)',
  children,
  className,
  onClick,
}) => {
  const { theme } = useTheme();
  
  return (
    <StyledFlex
      direction={direction}
      wrap={wrap}
      justify={justify}
      align={align}
      gap={gap}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledFlex>
  );
};

export default Flex;
