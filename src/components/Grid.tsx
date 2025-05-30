/**
 * Grid component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';

export interface GridProps {
  columns?: number;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  children: React.ReactNode;
  className?: string;
}

const StyledGrid = styled(View)<{
  columns: number;
  gap: string;
  rowGap: string;
  columnGap: string;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${props => props.gap};
  row-gap: ${props => props.rowGap};
  column-gap: ${props => props.columnGap};
  width: 100%;
`;

export const Grid: React.FC<GridProps> = ({
  columns = 2,
  gap = 'var(--spacing-md)',
  rowGap = gap,
  columnGap = gap,
  children,
  className,
}) => {
  const { theme } = useTheme();
  
  return (
    <StyledGrid
      columns={columns}
      gap={gap}
      rowGap={rowGap}
      columnGap={columnGap}
      className={className}
    >
      {children}
    </StyledGrid>
  );
};

export default Grid;
