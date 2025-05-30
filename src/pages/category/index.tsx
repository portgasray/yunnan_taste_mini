/**
 * Category Page for Yunnan Taste Mini-Program
 * Browse and filter products by category with Bioluminescent Forest theme
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro, { useRouter } from '@tarojs/taro';
import { useProductStore, useUIStore } from '@/store/StoreContext';

// Components
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductFilter } from '@/components/ProductFilter';
import { Divider } from '@/components/Divider';

// Styled components
const CategoryContainer = styled(View)`
  min-height: 100vh;
  background-color: var(--color-background);
  padding-bottom: 98px; /* Space for tab bar */
`;

const CategoryHeader = styled(View)<{ hasImage: boolean }>`
  position: relative;
  height: ${props => props.hasImage ? '200px' : '120px'};
  width: 100%;
  overflow: hidden;
  
  .category-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.hasImage 
      ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7))'
      : 'var(--color-backgroundDark)'};
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: var(--spacing-xl);
  }
  
  .category-title {
    color: var(--color-textInverse);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-xs);
    text-shadow: var(--shadow-text);
  }
  
  .category-description {
    color: var(--color-textInverse);
    font-size: var(--font-size-sm);
    opacity: 0.9;
    text-shadow: var(--shadow-text);
  }
  
  .back-button {
    position: absolute;
    top: var(--spacing-md);
    left: var(--spacing-md);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .back-icon {
    width: 20px;
    height: 20px;
  }
`;

const SubcategoryScroll = styled(ScrollView)`
  white-space: nowrap;
  background-color: var(--color-backgroundAlt);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border);
`;

const SubcategoryItem = styled(View)<{ active: boolean }>`
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: 0 var(--spacing-xs);
  border-radius: var(--radius-lg);
  background-color: ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  
  .subcategory-text {
    color: ${props => props.active ? 'var(--color-textInverse)' : 'var(--color-textPrimary)'};
    font-size: var(--font-size-sm);
  }
  
  &:first-child {
    margin-left: var(--spacing-md);
  }
  
  &:last-child {
    margin-right: var(--spacing-md);
  }
`;

const FilterSortBar = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-backgroundAlt);
  
  .filter-button, .sort-button {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    background-color: var(--color-backgroundDark);
    
    .button-icon {
      width: 16px;
      height: 16px;
      margin-right: var(--spacing-xs);
    }
    
    .button-text {
      font-size: var(--font-size-sm);
      color: var(--color-textPrimary);
    }
  }
  
  .sort-options {
    display: flex;
    
    .sort-option {
      padding: var(--spacing-xs) var(--spacing-sm);
      margin-left: var(--spacing-xs);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-sm);
      
      &.active {
        background-color: var(--color-backgroundDark);
        color: var(--color-accent1);
      }
      
      &:not(.active) {
        color: var(--color-textSecondary);
      }
    }
  }
`;

const ContentContainer = styled(View)`
  padding: var(--spacing-md);
`;

const FilterDrawer = styled(View)<{ visible: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background-color: var(--color-backgroundAlt);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transform: translateX(${props => props.visible ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  
  .drawer-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
    }
    
    .close-button {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
  }
  
  .drawer-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
  }
`;

const Overlay = styled(View)<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

// Category page component
const CategoryPage: React.FC = observer(() => {
  const router = useRouter();
  const productStore = useProductStore();
  const uiStore = useUIStore();
  
  // Local state
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>('popularity');
  
  // Get category ID from route params
  useEffect(() => {
    const { id } = router.params;
    if (id) {
      setCategoryId(id);
      productStore.setCurrentCategory(id);
    }
    
    // Fetch categories if not already loaded
    if (Object.keys(productStore.categories).length === 0) {
      productStore.fetchCategories();
    }
  }, [router.params]);
  
  // Get current category
  const currentCategory = categoryId ? productStore.getCategory(categoryId) : null;
  
  // Get subcategories
  const subcategories = categoryId ? 
    productStore.getChildCategories(categoryId) : [];
  
  // Handle subcategory selection
  const handleSubcategorySelect = (id: string | null) => {
    setSubcategoryId(id);
    productStore.setCurrentCategory(id || categoryId);
  };
  
  // Handle sort change
  const handleSortChange = (sort: 'popularity' | 'price-asc' | 'price-desc' | 'newest') => {
    setSortBy(sort);
    productStore.setSortBy(sort);
  };
  
  // Handle filter toggle
  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };
  
  // Handle filter apply
  const handleFilterApply = (filters: Record<string, string[]>) => {
    productStore.setFilters(filters);
    setFilterVisible(false);
  };
  
  // Handle filter reset
  const handleFilterReset = () => {
    productStore.setFilters({});
  };
  
  // Handle back button
  const handleBack = () => {
    Taro.navigateBack();
  };
  
  // Handle load more
  const handleLoadMore = () => {
    productStore.loadMoreProducts();
  };
  
  return (
    <CategoryContainer>
      {/* Category Header */}
      <CategoryHeader hasImage={!!currentCategory?.image}>
        {currentCategory?.image && (
          <Image 
            className="category-image" 
            src={currentCategory.image} 
            mode="aspectFill"
          />
        )}
        <View className="category-overlay">
          <Text className="category-title">
            {currentCategory?.title || '分类浏览'}
          </Text>
          {currentCategory?.description && (
            <Text className="category-description">
              {currentCategory.description}
            </Text>
          )}
        </View>
        <View className="back-button" onClick={handleBack}>
          <Image 
            className="back-icon" 
            src="/assets/icons/back.png"
          />
        </View>
      </CategoryHeader>
      
      {/* Subcategories */}
      {subcategories.length > 0 && (
        <SubcategoryScroll scrollX scrollWithAnimation>
          <SubcategoryItem 
            active={subcategoryId === null}
            onClick={() => handleSubcategorySelect(null)}
          >
            <Text className="subcategory-text">全部</Text>
          </SubcategoryItem>
          {subcategories.map(subcategory => (
            <SubcategoryItem 
              key={subcategory.id}
              active={subcategoryId === subcategory.id}
              onClick={() => handleSubcategorySelect(subcategory.id)}
            >
              <Text className="subcategory-text">{subcategory.title}</Text>
            </SubcategoryItem>
          ))}
        </SubcategoryScroll>
      )}
      
      {/* Filter and Sort Bar */}
      <FilterSortBar>
        <View className="filter-button" onClick={toggleFilter}>
          <Image 
            className="button-icon" 
            src="/assets/icons/filter.png"
          />
          <Text className="button-text">筛选</Text>
        </View>
        <View className="sort-options">
          <Text 
            className={`sort-option ${sortBy === 'popularity' ? 'active' : ''}`}
            onClick={() => handleSortChange('popularity')}
          >
            热门
          </Text>
          <Text 
            className={`sort-option ${sortBy === 'newest' ? 'active' : ''}`}
            onClick={() => handleSortChange('newest')}
          >
            最新
          </Text>
          <Text 
            className={`sort-option ${sortBy === 'price-asc' ? 'active' : ''}`}
            onClick={() => handleSortChange('price-asc')}
          >
            价格↑
          </Text>
          <Text 
            className={`sort-option ${sortBy === 'price-desc' ? 'active' : ''}`}
            onClick={() => handleSortChange('price-desc')}
          >
            价格↓
          </Text>
        </View>
      </FilterSortBar>
      
      {/* Product Grid */}
      <ContentContainer>
        <ProductGrid 
          products={productStore.filteredProducts}
          loading={productStore.isLoadingProducts}
          columns={2}
          onLoadMore={handleLoadMore}
          hasMore={productStore.hasMoreProducts}
        />
      </ContentContainer>
      
      {/* Filter Drawer */}
      <FilterDrawer visible={filterVisible}>
        <View className="drawer-header">
          <Text className="header-title">筛选</Text>
          <View className="close-button" onClick={toggleFilter}>
            <Image 
              src="/assets/icons/close.png"
              style="width: 16px; height: 16px;"
            />
          </View>
        </View>
        <View className="drawer-content">
          <ProductFilter 
            filters={productStore.currentFilters}
            onApply={handleFilterApply}
            onReset={handleFilterReset}
          />
        </View>
        <View className="drawer-footer">
          <Button 
            variant="secondary" 
            size="md"
            onClick={handleFilterReset}
          >
            重置
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => setFilterVisible(false)}
          >
            确定
          </Button>
        </View>
      </FilterDrawer>
      
      {/* Overlay */}
      <Overlay 
        visible={filterVisible}
        onClick={toggleFilter}
      />
    </CategoryContainer>
  );
});

export default CategoryPage;
