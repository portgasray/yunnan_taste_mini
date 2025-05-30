/**
 * Search Page for Yunnan Taste Mini-Program
 * Find products through search and browse search history
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro from '@tarojs/taro';
import { useProductStore, useUIStore } from '@/store/StoreContext';

// Components
import { SearchBar } from '@/components/SearchBar';
import { ProductGrid } from '@/components/ProductGrid';
import { Loading } from '@/components/Loading';
import { Divider } from '@/components/Divider';
import { Button } from '@/components/Button';

// Styled components
const SearchPageContainer = styled(View)`
  min-height: 100vh;
  background-color: var(--color-background);
  padding-bottom: 98px; /* Space for tab bar */
`;

const SearchHeader = styled(View)`
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-backgroundAlt);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ContentContainer = styled(View)`
  padding: var(--spacing-md) var(--spacing-lg);
`;

const HistorySection = styled(View)`
  margin-bottom: var(--spacing-lg);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    
    .section-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
    }
    
    .clear-button {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
    }
  }
  
  .history-tags {
    display: flex;
    flex-wrap: wrap;
    
    .history-tag {
      margin-right: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-md);
      background-color: var(--color-backgroundAlt);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--color-textPrimary);
      border: 1px solid var(--color-border);
    }
  }
`;

const PopularSection = styled(View)`
  margin-bottom: var(--spacing-lg);
  
  .section-header {
    margin-bottom: var(--spacing-md);
    
    .section-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
    }
  }
  
  .popular-tags {
    display: flex;
    flex-wrap: wrap;
    
    .popular-tag {
      margin-right: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-md);
      background-color: var(--color-backgroundDark);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--color-accent1);
      
      &:nth-child(2n) {
        color: var(--color-accent2);
      }
      
      &:nth-child(3n) {
        color: var(--color-accent3);
      }
    }
  }
`;

const ResultsSection = styled(View)`
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    
    .results-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--color-textPrimary);
    }
    
    .results-count {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
    }
  }
  
  .filter-bar {
    display: flex;
    margin-bottom: var(--spacing-md);
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: var(--spacing-xs);
    
    .filter-option {
      padding: var(--spacing-xs) var(--spacing-md);
      margin-right: var(--spacing-sm);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      
      &.active {
        background-color: var(--color-primary);
        color: var(--color-textInverse);
      }
      
      &:not(.active) {
        background-color: var(--color-backgroundAlt);
        color: var(--color-textPrimary);
      }
    }
  }
`;

const EmptyState = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  .empty-text {
    font-size: var(--font-size-md);
    color: var(--color-textSecondary);
    margin-bottom: var(--spacing-lg);
  }
`;

// Popular search tags (mock data)
const POPULAR_TAGS = [
  '普洱茶', '松茸', '野生菌', '滇红茶', '云南咖啡',
  '坚果', '蜂蜜', '手工艺品', '民族服饰', '银饰'
];

// Search page component
const SearchPage: React.FC = observer(() => {
  const productStore = useProductStore();
  const uiStore = useUIStore();
  
  // Local state
  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>('popularity');
  
  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  // Handle search submit
  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    await productStore.searchProducts(searchValue);
    setShowResults(true);
  };
  
  // Handle history item click
  const handleHistoryClick = async (query: string) => {
    setSearchValue(query);
    await productStore.searchProducts(query);
    setShowResults(true);
  };
  
  // Handle popular tag click
  const handlePopularClick = async (tag: string) => {
    setSearchValue(tag);
    await productStore.searchProducts(tag);
    setShowResults(true);
  };
  
  // Handle clear history
  const handleClearHistory = () => {
    productStore.clearSearchHistory();
  };
  
  // Handle sort change
  const handleSortChange = (sort: 'popularity' | 'price-asc' | 'price-desc' | 'newest') => {
    setSortBy(sort);
    productStore.setSortBy(sort);
  };
  
  // Get search results
  const searchResults = productStore.searchResults.map(id => 
    productStore.getProduct(id)
  ).filter(Boolean);
  
  return (
    <SearchPageContainer>
      {/* Search Header */}
      <SearchHeader>
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="搜索云南特产..."
          showVoice
          autoFocus
        />
      </SearchHeader>
      
      {showResults ? (
        /* Search Results */
        <ContentContainer>
          <ResultsSection>
            <View className="results-header">
              <Text className="results-title">搜索结果</Text>
              <Text className="results-count">
                找到 {searchResults.length} 个商品
              </Text>
            </View>
            
            <ScrollView className="filter-bar" scrollX>
              <Text 
                className={`filter-option ${sortBy === 'popularity' ? 'active' : ''}`}
                onClick={() => handleSortChange('popularity')}
              >
                热门
              </Text>
              <Text 
                className={`filter-option ${sortBy === 'newest' ? 'active' : ''}`}
                onClick={() => handleSortChange('newest')}
              >
                最新
              </Text>
              <Text 
                className={`filter-option ${sortBy === 'price-asc' ? 'active' : ''}`}
                onClick={() => handleSortChange('price-asc')}
              >
                价格↑
              </Text>
              <Text 
                className={`filter-option ${sortBy === 'price-desc' ? 'active' : ''}`}
                onClick={() => handleSortChange('price-desc')}
              >
                价格↓
              </Text>
            </ScrollView>
            
            {productStore.isSearching ? (
              <Loading size="lg" text="搜索中..." />
            ) : searchResults.length > 0 ? (
              <ProductGrid 
                products={searchResults}
                columns={2}
                spacing="md"
              />
            ) : (
              <EmptyState>
                <View className="empty-icon">🔍</View>
                <Text className="empty-text">
                  没有找到与"{searchValue}"相关的商品
                </Text>
                <Button variant="secondary" size="md" onClick={() => setShowResults(false)}>
                  返回搜索
                </Button>
              </EmptyState>
            )}
          </ResultsSection>
        </ContentContainer>
      ) : (
        /* Search Home */
        <ContentContainer>
          {/* Search History Section */}
          {productStore.searchHistory.length > 0 && (
            <HistorySection>
              <View className="section-header">
                <Text className="section-title">搜索历史</Text>
                <Text className="clear-button" onClick={handleClearHistory}>
                  清除
                </Text>
              </View>
              <View className="history-tags">
                {productStore.searchHistory.map((query, index) => (
                  <Text 
                    key={index} 
                    className="history-tag"
                    onClick={() => handleHistoryClick(query)}
                  >
                    {query}
                  </Text>
                ))}
              </View>
            </HistorySection>
          )}
          
          <Divider />
          
          {/* Popular Searches Section */}
          <PopularSection>
            <View className="section-header">
              <Text className="section-title">热门搜索</Text>
            </View>
            <View className="popular-tags">
              {POPULAR_TAGS.map((tag, index) => (
                <Text 
                  key={index} 
                  className="popular-tag"
                  onClick={() => handlePopularClick(tag)}
                >
                  {tag}
                </Text>
              ))}
            </View>
          </PopularSection>
          
          {/* Animated Bioluminescent Forest Element */}
          <View style={{ 
            height: '200px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-backgroundDark)',
            marginTop: 'var(--spacing-xl)'
          }}>
            <canvas id="search-particles" style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }} />
            <Text style={{ 
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-textInverse)',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              textShadow: 'var(--shadow-text)'
            }}>
              探索云南原生态美食与文化
            </Text>
          </View>
        </ContentContainer>
      )}
    </SearchPageContainer>
  );
});

// Initialize particles animation when component mounts
React.useEffect(() => {
  const canvas = document.getElementById('search-particles') as HTMLCanvasElement;
  if (canvas) {
    initParticlesAnimation(canvas);
  }
  
  return () => {
    // Clean up animation if needed
  };
}, []);

// Initialize particles animation
const initParticlesAnimation = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
    
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = getRandomColor();
      this.alpha = Math.random() * 0.5 + 0.5;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.size > 0.2) this.size -= 0.01;
      if (this.alpha > 0) this.alpha -= 0.005;
      
      // Reset particle if it's too small or transparent
      if (this.size <= 0.2 || this.alpha <= 0) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.5 + 0.5;
        this.color = getRandomColor();
      }
      
      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      
      // Add glow effect
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 2
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = this.alpha * 0.5;
      ctx.fill();
      
      ctx.globalAlpha = 1;
    }
  }
  
  // Get random color from theme
  const getRandomColor = () => {
    const colors = [
      '#5CE0B8', // accent1
      '#3D88F2', // accent2
      '#A45EE5', // accent3
      '#00E5FF'  // primary
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Create particles
  const particles: Particle[] = [];
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    
    requestAnimationFrame(animate);
  };
  
  animate();
  
  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
};

export default SearchPage;
