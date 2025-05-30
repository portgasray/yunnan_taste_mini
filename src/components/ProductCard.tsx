/**
 * ProductCard component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useTheme } from '../theme';
import { styled } from 'styled-components';
import Icon from './Icon';
import Badge from './Badge';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  tags?: string[];
  rating?: number;
  sold?: number;
  isNew?: boolean;
  discount?: number;
  variant?: 'default' | 'horizontal' | 'compact';
  glowEffect?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

const StyledProductCard = styled(View)<{
  variant: 'default' | 'horizontal' | 'compact';
  glowEffect: boolean;
}>`
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  background-color: var(--color-backgroundAlt);
  overflow: hidden;
  transition: all var(--transition-default);
  box-shadow: ${props => (props.glowEffect ? 'var(--glow-sm)' : 'var(--shadow-sm)')};
  
  /* Layout based on variant */
  display: flex;
  flex-direction: ${props => (props.variant === 'horizontal' ? 'row' : 'column')};
  
  /* Hover effect */
  &:active {
    transform: scale(0.98);
    box-shadow: ${props => (props.glowEffect ? 'var(--glow-md)' : 'var(--shadow-md)')};
  }
  
  /* Image container */
  .product-image-container {
    position: relative;
    width: ${props => (props.variant === 'horizontal' ? '120px' : '100%')};
    height: ${props => {
      switch (props.variant) {
        case 'horizontal':
          return '120px';
        case 'compact':
          return '120px';
        default:
          return '180px';
      }
    }};
    overflow: hidden;
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    /* Badges */
    .product-badges {
      position: absolute;
      top: var(--spacing-xs);
      left: var(--spacing-xs);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      
      .product-badge {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--color-textInverse);
        
        &.new {
          background-color: var(--color-accent1);
          box-shadow: ${props => (props.glowEffect ? 'var(--glow-sm) var(--color-accent1)' : 'none')};
        }
        
        &.discount {
          background-color: var(--color-accent2);
          box-shadow: ${props => (props.glowEffect ? 'var(--glow-sm) var(--color-accent2)' : 'none')};
        }
      }
    }
  }
  
  /* Content */
  .product-content {
    flex: 1;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    
    .product-title {
      font-size: ${props => (props.variant === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-md)')};
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
      margin-bottom: var(--spacing-xs);
      
      /* Limit to 2 lines */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Tags */
    .product-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-xs);
      
      .product-tag {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        background-color: var(--color-backgroundDark);
        font-size: var(--font-size-xs);
        color: var(--color-textSecondary);
      }
    }
    
    /* Price */
    .product-price-container {
      display: flex;
      align-items: baseline;
      margin-top: auto;
      
      .product-price {
        font-size: ${props => (props.variant === 'compact' ? 'var(--font-size-md)' : 'var(--font-size-lg)')};
        font-weight: var(--font-weight-bold);
        color: var(--color-primary);
        margin-right: var(--spacing-xs);
      }
      
      .product-original-price {
        font-size: var(--font-size-sm);
        color: var(--color-textDisabled);
        text-decoration: line-through;
      }
    }
    
    /* Rating and sold */
    .product-stats {
      display: flex;
      align-items: center;
      margin-top: var(--spacing-xs);
      
      .product-rating {
        display: flex;
        align-items: center;
        margin-right: var(--spacing-md);
        
        .rating-value {
          font-size: var(--font-size-xs);
          color: var(--color-textSecondary);
          margin-left: var(--spacing-xs);
        }
      }
      
      .product-sold {
        font-size: var(--font-size-xs);
        color: var(--color-textSecondary);
      }
    }
  }
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  image,
  tags = [],
  rating,
  sold,
  isNew = false,
  discount = 0,
  variant = 'default',
  glowEffect = true,
  onClick,
  className,
}) => {
  const { theme } = useTheme();
  
  const handleClick = () => {
    onClick && onClick(id);
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };
  
  // Calculate discount percentage
  const discountPercentage = discount > 0 ? discount : originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  
  return (
    <StyledProductCard
      variant={variant}
      glowEffect={glowEffect}
      className={className}
      onClick={handleClick}
    >
      <View className="product-image-container">
        <Image className="product-image" src={image} mode="aspectFill" />
        
        <View className="product-badges">
          {isNew && (
            <View className="product-badge new">新品</View>
          )}
          
          {discountPercentage > 0 && (
            <View className="product-badge discount">{discountPercentage}% 折扣</View>
          )}
        </View>
      </View>
      
      <View className="product-content">
        <Text className="product-title">{title}</Text>
        
        {tags.length > 0 && variant !== 'compact' && (
          <View className="product-tags">
            {tags.map((tag, index) => (
              <View key={index} className="product-tag">{tag}</View>
            ))}
          </View>
        )}
        
        <View className="product-price-container">
          <Text className="product-price">{formatPrice(price)}</Text>
          {originalPrice && originalPrice > price && (
            <Text className="product-original-price">{formatPrice(originalPrice)}</Text>
          )}
        </View>
        
        {(rating !== undefined || sold !== undefined) && variant !== 'compact' && (
          <View className="product-stats">
            {rating !== undefined && (
              <View className="product-rating">
                <Icon name="star" size="xs" color="accent2" glow={glowEffect} />
                <Text className="rating-value">{rating.toFixed(1)}</Text>
              </View>
            )}
            
            {sold !== undefined && (
              <Text className="product-sold">已售 {sold}</Text>
            )}
          </View>
        )}
      </View>
    </StyledProductCard>
  );
};

export default ProductCard;
