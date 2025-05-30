/**
 * CategoryCard component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { styled } from 'styled-components';
import { useTheme } from '../theme';
import Icon from './Icon';

export interface CategoryCardProps {
  id: string;
  title: string;
  image: string;
  productCount?: number;
  description?: string;
  variant?: 'default' | 'compact' | 'featured';
  glowEffect?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

const StyledCategoryCard = styled(View)<{
  variant: 'default' | 'compact' | 'featured';
  glowEffect: boolean;
}>`
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-default);
  
  /* Featured variant has a different height and layout */
  height: ${props => props.variant === 'featured' ? '180px' : '120px'};
  
  /* Box shadow and glow effect */
  box-shadow: ${props => props.glowEffect ? 'var(--glow-sm)' : 'var(--shadow-sm)'};
  
  /* Hover effect */
  &:active {
    transform: scale(0.98);
    box-shadow: ${props => props.glowEffect ? 'var(--glow-md)' : 'var(--shadow-md)'};
  }
  
  /* Background image */
  .category-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }
  
  /* Overlay gradient */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 2;
  }
  
  /* Content container */
  .category-content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    padding: var(--spacing-md);
    
    /* Title */
    .category-title {
      font-size: ${props => props.variant === 'compact' ? 'var(--font-size-md)' : 'var(--font-size-lg)'};
      font-weight: var(--font-weight-bold);
      color: var(--color-textInverse);
      margin-bottom: ${props => props.variant === 'featured' ? 'var(--spacing-xs)' : '0'};
      
      /* Text shadow for better readability */
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      
      /* Glow effect for title */
      ${props => props.glowEffect && `
        text-shadow: 0 0 8px var(--color-accent1), 0 2px 4px rgba(0, 0, 0, 0.5);
      `}
    }
    
    /* Description - only for featured variant */
    .category-description {
      display: ${props => props.variant === 'featured' ? 'block' : 'none'};
      font-size: var(--font-size-sm);
      color: var(--color-textInverse);
      margin-bottom: var(--spacing-xs);
      opacity: 0.9;
      
      /* Limit to 2 lines */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Product count */
    .category-product-count {
      display: flex;
      align-items: center;
      font-size: var(--font-size-xs);
      color: var(--color-textInverse);
      opacity: 0.8;
      
      .count-icon {
        margin-right: var(--spacing-xs);
      }
    }
  }
  
  /* Bioluminescent particles effect - only when glowEffect is true */
  ${props => props.glowEffect && `
    .bioluminescent-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      overflow: hidden;
      
      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--color-accent1);
        opacity: 0;
        z-index: 2;
        
        &:nth-child(1) {
          top: 20%;
          left: 10%;
          animation: glow 3s infinite 0.2s;
        }
        
        &:nth-child(2) {
          top: 30%;
          left: 20%;
          animation: glow 2.5s infinite 0.7s;
        }
        
        &:nth-child(3) {
          top: 70%;
          left: 30%;
          animation: glow 3.5s infinite 1.1s;
        }
        
        &:nth-child(4) {
          top: 40%;
          left: 70%;
          animation: glow 3s infinite 0.5s;
        }
        
        &:nth-child(5) {
          top: 60%;
          left: 80%;
          animation: glow 2.8s infinite 1.3s;
        }
        
        @keyframes glow {
          0% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
      }
    }
  `}
`;

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  image,
  productCount,
  description,
  variant = 'default',
  glowEffect = true,
  onClick,
  className,
}) => {
  const { theme } = useTheme();
  
  const handleClick = () => {
    onClick && onClick(id);
  };
  
  return (
    <StyledCategoryCard
      variant={variant}
      glowEffect={glowEffect}
      className={className}
      onClick={handleClick}
    >
      <Image className="category-image" src={image} mode="aspectFill" />
      
      {glowEffect && (
        <View className="bioluminescent-particles">
          <View className="particle"></View>
          <View className="particle"></View>
          <View className="particle"></View>
          <View className="particle"></View>
          <View className="particle"></View>
        </View>
      )}
      
      <View className="category-content">
        <Text className="category-title">{title}</Text>
        
        {description && variant === 'featured' && (
          <Text className="category-description">{description}</Text>
        )}
        
        {productCount !== undefined && (
          <View className="category-product-count">
            <Icon name="package" size="xs" color="textInverse" className="count-icon" />
            <Text>{productCount} 件商品</Text>
          </View>
        )}
      </View>
    </StyledCategoryCard>
  );
};

export default CategoryCard;
