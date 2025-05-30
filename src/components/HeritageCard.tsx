/**
 * HeritageCard component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { styled } from 'styled-components';
import { useTheme } from '../theme';
import Icon from './Icon';

export interface HeritageCardProps {
  id: string;
  title: string;
  image: string;
  location?: string;
  category?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'featured';
  glowEffect?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

const StyledHeritageCard = styled(View)<{
  variant: 'default' | 'compact' | 'featured';
  glowEffect: boolean;
}>`
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  background-color: var(--color-backgroundAlt);
  overflow: hidden;
  transition: all var(--transition-default);
  
  /* Layout based on variant */
  display: flex;
  flex-direction: ${props => props.variant === 'compact' ? 'row' : 'column'};
  
  /* Box shadow and glow effect */
  box-shadow: ${props => props.glowEffect ? 'var(--glow-sm)' : 'var(--shadow-sm)'};
  
  /* Hover effect */
  &:active {
    transform: scale(0.98);
    box-shadow: ${props => props.glowEffect ? 'var(--glow-md)' : 'var(--shadow-md)'};
  }
  
  /* Image container */
  .heritage-image-container {
    position: relative;
    width: ${props => props.variant === 'compact' ? '120px' : '100%'};
    height: ${props => {
      switch (props.variant) {
        case 'compact':
          return '120px';
        case 'featured':
          return '200px';
        default:
          return '160px';
      }
    }};
    overflow: hidden;
    
    .heritage-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    /* Category badge */
    .heritage-category {
      position: absolute;
      top: var(--spacing-xs);
      left: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      background-color: var(--color-accent1);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--color-textInverse);
      z-index: 2;
      
      /* Glow effect for category badge */
      ${props => props.glowEffect && `
        box-shadow: 0 0 8px var(--color-accent1);
      `}
    }
    
    /* Bioluminescent overlay */
    ${props => props.glowEffect && `
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(var(--color-accent1-rgb), 0.1) 0%,
          rgba(var(--color-accent1-rgb), 0) 70%
        );
        mix-blend-mode: overlay;
        z-index: 1;
      }
    `}
  }
  
  /* Content */
  .heritage-content {
    flex: 1;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    
    .heritage-title {
      font-size: ${props => props.variant === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-md)'};
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
      margin-bottom: var(--spacing-xs);
      
      /* Limit to 2 lines */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      
      /* Glow effect for title */
      ${props => props.glowEffect && `
        text-shadow: 0 0 4px rgba(var(--color-accent1-rgb), 0.3);
      `}
    }
    
    /* Location */
    .heritage-location {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-xs);
      
      .location-icon {
        margin-right: var(--spacing-xs);
      }
      
      .location-text {
        font-size: var(--font-size-xs);
        color: var(--color-textSecondary);
      }
    }
    
    /* Description */
    .heritage-description {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      margin-top: ${props => props.variant === 'featured' ? 'var(--spacing-sm)' : 'var(--spacing-xs)'};
      
      /* Limit to 2 or 3 lines based on variant */
      display: -webkit-box;
      -webkit-line-clamp: ${props => props.variant === 'featured' ? 3 : 2};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      
      /* Hide description in compact variant */
      display: ${props => props.variant === 'compact' ? 'none' : '-webkit-box'};
    }
    
    /* Read more link - only for featured variant */
    .read-more {
      display: ${props => props.variant === 'featured' ? 'flex' : 'none'};
      align-items: center;
      margin-top: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--color-accent1);
      font-weight: var(--font-weight-medium);
      
      .read-more-icon {
        margin-left: var(--spacing-xs);
      }
      
      /* Glow effect for read more link */
      ${props => props.glowEffect && `
        text-shadow: 0 0 4px rgba(var(--color-accent1-rgb), 0.5);
      `}
    }
  }
`;

export const HeritageCard: React.FC<HeritageCardProps> = ({
  id,
  title,
  image,
  location,
  category,
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
    <StyledHeritageCard
      variant={variant}
      glowEffect={glowEffect}
      className={className}
      onClick={handleClick}
    >
      <View className="heritage-image-container">
        <Image className="heritage-image" src={image} mode="aspectFill" />
        {category && (
          <View className="heritage-category">{category}</View>
        )}
      </View>
      
      <View className="heritage-content">
        <Text className="heritage-title">{title}</Text>
        
        {location && (
          <View className="heritage-location">
            <Icon name="map-pin" size="xs" color="textSecondary" className="location-icon" />
            <Text className="location-text">{location}</Text>
          </View>
        )}
        
        {description && (
          <Text className="heritage-description">{description}</Text>
        )}
        
        {variant === 'featured' && (
          <View className="read-more">
            <Text>了解更多</Text>
            <Icon name="arrow-right" size="xs" color="accent1" className="read-more-icon" />
          </View>
        )}
      </View>
    </StyledHeritageCard>
  );
};

export default HeritageCard;
