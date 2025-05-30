/**
 * ProductGrid component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View } from '@tarojs/components';
import { styled } from 'styled-components';
import ProductCard, { ProductCardProps } from './ProductCard';
import { useTheme } from '../theme';

export interface ProductGridProps {
  products: Omit<ProductCardProps, 'onClick'>[];
  columns?: 1 | 2 | 3;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  cardVariant?: 'default' | 'horizontal' | 'compact';
  glowEffect?: boolean;
  onProductClick?: (id: string) => void;
  className?: string;
  loading?: boolean;
  emptyText?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

const StyledProductGrid = styled(View)<{
  columns: number;
  gap: string;
  glowEffect: boolean;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: var(--spacing-${props => props.gap});
  width: 100%;
  
  /* Empty state */
  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-xl) 0;
    color: var(--color-textSecondary);
    font-size: var(--font-size-md);
    text-align: center;
    
    /* Subtle glow effect for empty state */
    ${props => props.glowEffect && `
      text-shadow: 0 0 8px var(--color-textSecondary);
    `}
  }
  
  /* Load more button */
  .load-more {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-md) 0;
    margin-top: var(--spacing-md);
    
    .load-more-button {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      background-color: var(--color-backgroundDark);
      color: var(--color-textSecondary);
      font-size: var(--font-size-sm);
      transition: all var(--transition-default);
      
      /* Glow effect for load more button */
      ${props => props.glowEffect && `
        box-shadow: var(--glow-sm);
      `}
      
      &:active {
        transform: scale(0.98);
        ${props => props.glowEffect && `
          box-shadow: var(--glow-md);
        `}
      }
    }
  }
  
  /* Loading skeleton */
  .product-skeleton {
    height: ${props => props.columns === 1 ? '120px' : '240px'};
    border-radius: var(--radius-lg);
    background-color: var(--color-backgroundAlt);
    overflow: hidden;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      animation: shimmer 1.5s infinite;
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    }
    
    /* Glow effect for skeleton */
    ${props => props.glowEffect && `
      box-shadow: var(--glow-sm);
    `}
  }
`;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  columns = 2,
  gap = 'md',
  cardVariant = 'default',
  glowEffect = true,
  onProductClick,
  className,
  loading = false,
  emptyText = '暂无商品',
  showLoadMore = false,
  onLoadMore,
}) => {
  const { theme } = useTheme();
  
  // Handle product click
  const handleProductClick = (id: string) => {
    onProductClick && onProductClick(id);
  };
  
  // Handle load more click
  const handleLoadMore = () => {
    onLoadMore && onLoadMore();
  };
  
  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(columns * 2).fill(0).map((_, index) => (
      <View key={`skeleton-${index}`} className="product-skeleton" />
    ));
  };
  
  return (
    <StyledProductGrid
      columns={columns}
      gap={gap}
      glowEffect={glowEffect}
      className={className}
    >
      {loading ? (
        renderSkeletons()
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            variant={cardVariant}
            glowEffect={glowEffect}
            onClick={handleProductClick}
          />
        ))
      ) : (
        <View className="empty-state">{emptyText}</View>
      )}
      
      {showLoadMore && products.length > 0 && (
        <View className="load-more">
          <View className="load-more-button" onClick={handleLoadMore}>
            加载更多
          </View>
        </View>
      )}
    </StyledProductGrid>
  );
};

export default ProductGrid;
