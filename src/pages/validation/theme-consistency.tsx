/**
 * Theme consistency validation utility for Yunnan Taste Mini-Program
 * Validates component theme integration and consistency
 */

import React from 'react';
import { View, Text } from '@tarojs/components';
import { styled } from 'styled-components';
import { useTheme } from '@/theme';

// Import all business components
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import CategoryCard from '@/components/CategoryCard';
import HeritageCard from '@/components/HeritageCard';
import ArticleCard from '@/components/ArticleCard';
import ProductFilter from '@/components/ProductFilter';
import SearchBar from '@/components/SearchBar';

// Sample data for testing
const sampleProducts = [
  {
    id: 'p1',
    title: '云南普洱茶 - 古树熟茶饼',
    price: 128,
    originalPrice: 168,
    image: 'https://example.com/puer-tea.jpg',
    tags: ['普洱', '熟茶', '古树'],
    rating: 4.8,
    sold: 1024,
    isNew: true
  },
  {
    id: 'p2',
    title: '野生松茸 - 新鲜直发',
    price: 299,
    originalPrice: 399,
    image: 'https://example.com/matsutake.jpg',
    tags: ['松茸', '野生', '鲜菌'],
    rating: 4.9,
    sold: 568
  }
];

const sampleCategories = [
  {
    id: 'c1',
    title: '云南茶叶',
    image: 'https://example.com/tea.jpg',
    productCount: 128,
    description: '包括普洱、滇红、白茶等云南特色茶品'
  },
  {
    id: 'c2',
    title: '野生菌菇',
    image: 'https://example.com/mushrooms.jpg',
    productCount: 56,
    description: '松茸、牛肝菌、鸡枞菌等云南名贵食用菌'
  }
];

const sampleHeritageItems = [
  {
    id: 'h1',
    title: '白族扎染工艺',
    image: 'https://example.com/tie-dye.jpg',
    location: '大理古城',
    category: '非遗技艺',
    description: '白族扎染是云南大理白族的传统手工艺，已有上千年历史，被列入国家非物质文化遗产名录。'
  },
  {
    id: 'h2',
    title: '纳西东巴文化',
    image: 'https://example.com/dongba.jpg',
    location: '丽江古城',
    category: '民族文化',
    description: '东巴文是世界上唯一仍在使用的象形文字，被誉为"活着的象形文字化石"。'
  }
];

const sampleArticles = [
  {
    id: 'a1',
    title: '探秘云南古茶树：千年茶韵的传承与保护',
    image: 'https://example.com/ancient-tea.jpg',
    author: '茶文化研究员',
    date: '2025-05-15',
    category: '茶文化',
    summary: '云南是世界茶树的发源地，拥有世界上最古老的栽培型大茶树和野生型古茶树资源。本文带您探访这些"活化石"，了解它们的历史价值与保护现状。',
    readTime: 8
  },
  {
    id: 'a2',
    title: '云南少数民族饮食文化：一场味蕾上的多元盛宴',
    image: 'https://example.com/ethnic-food.jpg',
    author: '美食作家',
    date: '2025-05-10',
    category: '饮食文化',
    summary: '云南有25个少数民族，每个民族都有其独特的饮食习惯和烹饪技艺。从傣族的酸辣，到白族的乳扇，再到彝族的烤乳猪，云南少数民族饮食文化丰富多彩。',
    readTime: 10
  }
];

const sampleFilters = [
  {
    id: 'category',
    title: '分类',
    options: [
      { id: 'tea', label: '茶叶', count: 128 },
      { id: 'mushroom', label: '菌菇', count: 56 },
      { id: 'fruit', label: '水果', count: 89 },
      { id: 'herb', label: '草药', count: 72 }
    ],
    multiSelect: false
  },
  {
    id: 'origin',
    title: '产地',
    options: [
      { id: 'xishuangbanna', label: '西双版纳', count: 95 },
      { id: 'dali', label: '大理', count: 87 },
      { id: 'lijiang', label: '丽江', count: 76 },
      { id: 'puer', label: '普洱', count: 68 }
    ],
    multiSelect: true
  }
];

const sampleSearchHistory = [
  '普洱茶',
  '松茸',
  '野生菌',
  '滇红茶',
  '鲜花饼'
];

// Styled container for the validation view
const StyledValidationContainer = styled(View)`
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  
  .validation-section {
    margin-bottom: var(--spacing-xl);
    
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-textPrimary);
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-xs);
      border-bottom: 1px solid var(--color-border);
    }
    
    .section-description {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      margin-bottom: var(--spacing-md);
    }
    
    .component-container {
      margin-bottom: var(--spacing-lg);
      
      .component-title {
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-medium);
        color: var(--color-textPrimary);
        margin-bottom: var(--spacing-sm);
      }
      
      .component-description {
        font-size: var(--font-size-sm);
        color: var(--color-textSecondary);
        margin-bottom: var(--spacing-md);
      }
      
      .component-variants {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }
    }
  }
`;

export const ThemeConsistencyValidation: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({
    category: ['tea'],
    origin: ['xishuangbanna', 'puer']
  });
  const [searchValue, setSearchValue] = React.useState('');
  
  // Handle filter change
  const handleFilterChange = (groupId: string, selectedIds: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupId]: selectedIds
    }));
  };
  
  // Handle filter reset
  const handleFilterReset = () => {
    setSelectedFilters({});
  };
  
  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  
  // Handle search submit
  const handleSearch = (value: string) => {
    console.log('Search submitted:', value);
  };
  
  return (
    <StyledValidationContainer>
      <View className="validation-section">
        <Text className="section-title">主题一致性验证</Text>
        <Text className="section-description">
          本页面展示了所有业务组件在生物发光森林主题下的视觉效果和交互行为，用于验证主题系统的一致性和组件的可扩展性。
        </Text>
      </View>
      
      {/* ProductCard and ProductGrid */}
      <View className="validation-section">
        <Text className="section-title">产品展示组件</Text>
        
        <View className="component-container">
          <Text className="component-title">ProductCard 产品卡片</Text>
          <Text className="component-description">
            展示单个产品信息的卡片组件，支持多种布局变体和发光效果。
          </Text>
          
          <View className="component-variants">
            <ProductCard {...sampleProducts[0]} />
            <ProductCard {...sampleProducts[1]} variant="horizontal" />
            <ProductCard {...sampleProducts[0]} variant="compact" glowEffect={false} />
          </View>
        </View>
        
        <View className="component-container">
          <Text className="component-title">ProductGrid 产品网格</Text>
          <Text className="component-description">
            展示多个产品的网格布局组件，支持不同列数和间距设置。
          </Text>
          
          <View className="component-variants">
            <ProductGrid products={sampleProducts} columns={2} />
            <ProductGrid products={[]} emptyText="暂无匹配的产品" />
            <ProductGrid products={sampleProducts} columns={1} cardVariant="horizontal" showLoadMore onLoadMore={() => console.log('Load more')} />
          </View>
        </View>
      </View>
      
      {/* CategoryCard and HeritageCard */}
      <View className="validation-section">
        <Text className="section-title">分类与文化展示组件</Text>
        
        <View className="component-container">
          <Text className="component-title">CategoryCard 分类卡片</Text>
          <Text className="component-description">
            展示产品分类的卡片组件，带有生物发光粒子动画效果。
          </Text>
          
          <View className="component-variants">
            <CategoryCard {...sampleCategories[0]} />
            <CategoryCard {...sampleCategories[1]} variant="featured" />
            <CategoryCard {...sampleCategories[0]} variant="compact" glowEffect={false} />
          </View>
        </View>
        
        <View className="component-container">
          <Text className="component-title">HeritageCard 文化遗产卡片</Text>
          <Text className="component-description">
            展示云南文化遗产信息的卡片组件，支持位置信息和分类标签。
          </Text>
          
          <View className="component-variants">
            <HeritageCard {...sampleHeritageItems[0]} />
            <HeritageCard {...sampleHeritageItems[1]} variant="featured" />
            <HeritageCard {...sampleHeritageItems[0]} variant="compact" glowEffect={false} />
          </View>
        </View>
      </View>
      
      {/* ArticleCard */}
      <View className="validation-section">
        <Text className="section-title">内容展示组件</Text>
        
        <View className="component-container">
          <Text className="component-title">ArticleCard 文章卡片</Text>
          <Text className="component-description">
            展示文章或博客内容的卡片组件，支持作者、日期和阅读时间信息。
          </Text>
          
          <View className="component-variants">
            <ArticleCard {...sampleArticles[0]} />
            <ArticleCard {...sampleArticles[1]} variant="featured" />
            <ArticleCard {...sampleArticles[0]} variant="horizontal" glowEffect={false} />
          </View>
        </View>
      </View>
      
      {/* ProductFilter and SearchBar */}
      <View className="validation-section">
        <Text className="section-title">搜索与筛选组件</Text>
        
        <View className="component-container">
          <Text className="component-title">ProductFilter 产品筛选器</Text>
          <Text className="component-description">
            产品筛选组件，支持单选和多选筛选条件，带有发光效果。
          </Text>
          
          <View className="component-variants">
            <ProductFilter 
              filters={sampleFilters} 
              selectedFilters={selectedFilters} 
              onFilterChange={handleFilterChange} 
              onReset={handleFilterReset} 
            />
          </View>
        </View>
        
        <View className="component-container">
          <Text className="component-title">SearchBar 搜索栏</Text>
          <Text className="component-description">
            搜索组件，支持多种视觉样式和搜索历史记录功能。
          </Text>
          
          <View className="component-variants">
            <SearchBar 
              value={searchValue} 
              onChange={handleSearchChange} 
              onSearch={handleSearch} 
            />
            <SearchBar 
              variant="rounded" 
              showHistory 
              historyItems={sampleSearchHistory} 
              onHistoryItemClick={handleSearch} 
            />
            <SearchBar 
              variant="minimal" 
              glowEffect={false} 
            />
          </View>
        </View>
      </View>
    </StyledValidationContainer>
  );
};

export default ThemeConsistencyValidation;
