/**
 * ArticleCard component for Yunnan Taste Mini-Program
 * Implements the Bioluminescent Forest theme
 */

import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { styled } from 'styled-components';
import { useTheme } from '../theme';
import Icon from './Icon';

export interface ArticleCardProps {
  id: string;
  title: string;
  image: string;
  author?: string;
  date?: string;
  category?: string;
  summary?: string;
  readTime?: number;
  variant?: 'default' | 'horizontal' | 'featured';
  glowEffect?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

const StyledArticleCard = styled(View)<{
  variant: 'default' | 'horizontal' | 'featured';
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
  flex-direction: ${props => props.variant === 'horizontal' ? 'row' : 'column'};
  
  /* Box shadow and glow effect */
  box-shadow: ${props => props.glowEffect ? 'var(--glow-sm)' : 'var(--shadow-sm)'};
  
  /* Hover effect */
  &:active {
    transform: scale(0.98);
    box-shadow: ${props => props.glowEffect ? 'var(--glow-md)' : 'var(--shadow-md)'};
  }
  
  /* Image container */
  .article-image-container {
    position: relative;
    width: ${props => props.variant === 'horizontal' ? '120px' : '100%'};
    height: ${props => {
      switch (props.variant) {
        case 'horizontal':
          return '120px';
        case 'featured':
          return '200px';
        default:
          return '160px';
      }
    }};
    overflow: hidden;
    
    .article-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    /* Category badge */
    .article-category {
      position: absolute;
      top: var(--spacing-xs);
      left: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      background-color: var(--color-accent2);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--color-textInverse);
      z-index: 2;
      
      /* Glow effect for category badge */
      ${props => props.glowEffect && `
        box-shadow: 0 0 8px var(--color-accent2);
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
          rgba(var(--color-accent2-rgb), 0.1) 0%,
          rgba(var(--color-accent2-rgb), 0) 70%
        );
        mix-blend-mode: overlay;
        z-index: 1;
      }
    `}
  }
  
  /* Content */
  .article-content {
    flex: 1;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    
    .article-title {
      font-size: ${props => props.variant === 'featured' ? 'var(--font-size-lg)' : 'var(--font-size-md)'};
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
        text-shadow: 0 0 4px rgba(var(--color-accent2-rgb), 0.3);
      `}
    }
    
    /* Meta information */
    .article-meta {
      display: flex;
      align-items: center;
      margin-bottom: var(--spacing-sm);
      flex-wrap: wrap;
      
      .meta-item {
        display: flex;
        align-items: center;
        margin-right: var(--spacing-md);
        margin-bottom: var(--spacing-xs);
        
        .meta-icon {
          margin-right: var(--spacing-xs);
        }
        
        .meta-text {
          font-size: var(--font-size-xs);
          color: var(--color-textSecondary);
        }
      }
    }
    
    /* Summary */
    .article-summary {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      margin-top: ${props => props.variant === 'featured' ? 'var(--spacing-sm)' : 'var(--spacing-xs)'};
      
      /* Limit to 2 or 3 lines based on variant */
      display: -webkit-box;
      -webkit-line-clamp: ${props => props.variant === 'featured' ? 3 : 2};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      
      /* Hide summary in horizontal variant */
      display: ${props => props.variant === 'horizontal' ? 'none' : '-webkit-box'};
    }
    
    /* Read more link - only for featured variant */
    .read-more {
      display: ${props => props.variant === 'featured' ? 'flex' : 'none'};
      align-items: center;
      margin-top: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--color-accent2);
      font-weight: var(--font-weight-medium);
      
      .read-more-icon {
        margin-left: var(--spacing-xs);
      }
      
      /* Glow effect for read more link */
      ${props => props.glowEffect && `
        text-shadow: 0 0 4px rgba(var(--color-accent2-rgb), 0.5);
      `}
    }
  }
`;

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  image,
  author,
  date,
  category,
  summary,
  readTime,
  variant = 'default',
  glowEffect = true,
  onClick,
  className,
}) => {
  const { theme } = useTheme();
  
  const handleClick = () => {
    onClick && onClick(id);
  };
  
  // Format date if provided
  const formattedDate = date ? new Date(date).toLocaleDateString('zh-CN') : undefined;
  
  return (
    <StyledArticleCard
      variant={variant}
      glowEffect={glowEffect}
      className={className}
      onClick={handleClick}
    >
      <View className="article-image-container">
        <Image className="article-image" src={image} mode="aspectFill" />
        {category && (
          <View className="article-category">{category}</View>
        )}
      </View>
      
      <View className="article-content">
        <Text className="article-title">{title}</Text>
        
        <View className="article-meta">
          {author && (
            <View className="meta-item">
              <Icon name="user" size="xs" color="textSecondary" className="meta-icon" />
              <Text className="meta-text">{author}</Text>
            </View>
          )}
          
          {formattedDate && (
            <View className="meta-item">
              <Icon name="calendar" size="xs" color="textSecondary" className="meta-icon" />
              <Text className="meta-text">{formattedDate}</Text>
            </View>
          )}
          
          {readTime !== undefined && (
            <View className="meta-item">
              <Icon name="clock" size="xs" color="textSecondary" className="meta-icon" />
              <Text className="meta-text">{readTime} 分钟阅读</Text>
            </View>
          )}
        </View>
        
        {summary && (
          <Text className="article-summary">{summary}</Text>
        )}
        
        {variant === 'featured' && (
          <View className="read-more">
            <Text>阅读全文</Text>
            <Icon name="arrow-right" size="xs" color="accent2" className="read-more-icon" />
          </View>
        )}
      </View>
    </StyledArticleCard>
  );
};

export default ArticleCard;
