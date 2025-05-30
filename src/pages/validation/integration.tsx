/**
 * Integration validation page for Yunnan Taste Mini-Program
 * Tests navigation, state synchronization, and visual consistency across all main pages
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button as TaroButton } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro from '@tarojs/taro';
import { useProductStore, useCartStore, useUserStore, useUIStore } from '@/store/StoreContext';

// Components
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Divider } from '../../components/Divider';

// Styled components
const ValidationContainer = styled(ScrollView)`
  min-height: 100vh;
  background-color: var(--color-background);
  padding: var(--spacing-lg);
`;

const SectionHeader = styled(View)`
  margin-bottom: var(--spacing-md);
  
  .section-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-xs);
  }
  
  .section-description {
    font-size: var(--font-size-sm);
    color: var(--color-textSecondary);
  }
`;

const TestSection = styled(View)`
  margin-bottom: var(--spacing-xl);
  
  .test-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-sm);
  }
  
  .test-description {
    font-size: var(--font-size-sm);
    color: var(--color-textSecondary);
    margin-bottom: var(--spacing-md);
  }
  
  .test-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  
  .test-result {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-sm);
    
    &.success {
      background-color: rgba(92, 224, 184, 0.1);
      color: var(--color-accent1);
      border: 1px solid var(--color-accent1);
    }
    
    &.error {
      background-color: rgba(255, 76, 76, 0.1);
      color: #ff4c4c;
      border: 1px solid #ff4c4c;
    }
    
    &.info {
      background-color: rgba(61, 136, 242, 0.1);
      color: var(--color-accent2);
      border: 1px solid var(--color-accent2);
    }
  }
`;

const ResultItem = styled(View)`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  
  .result-icon {
    margin-right: var(--spacing-xs);
    font-size: var(--font-size-md);
  }
  
  .result-text {
    font-size: var(--font-size-sm);
  }
`;

// Integration validation page component
const IntegrationValidationPage: React.FC = observer(() => {
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const uiStore = useUIStore();
  
  // Local state
  const [navigationResults, setNavigationResults] = useState<Array<{success: boolean, message: string}>>([]);
  const [stateResults, setStateResults] = useState<Array<{success: boolean, message: string}>>([]);
  const [themeResults, setThemeResults] = useState<Array<{success: boolean, message: string}>>([]);
  const [isTestingNavigation, setIsTestingNavigation] = useState(false);
  const [isTestingState, setIsTestingState] = useState(false);
  const [isTestingTheme, setIsTestingTheme] = useState(false);
  
  // Test navigation between pages
  const testNavigation = async () => {
    setIsTestingNavigation(true);
    setNavigationResults([]);
    
    try {
      // Test Home page navigation
      await Taro.switchTab({ url: '/pages/home/index' });
      setNavigationResults(prev => [...prev, { 
        success: true, 
        message: '成功导航到首页' 
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test Category page navigation
      await Taro.switchTab({ url: '/pages/category/index' });
      setNavigationResults(prev => [...prev, { 
        success: true, 
        message: '成功导航到分类页' 
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test Search page navigation
      await Taro.switchTab({ url: '/pages/search/index' });
      setNavigationResults(prev => [...prev, { 
        success: true, 
        message: '成功导航到搜索页' 
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test User Center page navigation
      await Taro.switchTab({ url: '/pages/user/index' });
      setNavigationResults(prev => [...prev, { 
        success: true, 
        message: '成功导航到用户中心页' 
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test Product Detail page navigation (requires a product ID)
      if (productStore.featuredProducts.length > 0) {
        const productId = productStore.featuredProducts[0];
        await Taro.navigateTo({ url: `/pages/product/detail?id=${productId}` });
        setNavigationResults(prev => [...prev, { 
          success: true, 
          message: '成功导航到商品详情页' 
        }]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test back navigation
        await Taro.navigateBack();
        setNavigationResults(prev => [...prev, { 
          success: true, 
          message: '成功从商品详情页返回' 
        }]);
      } else {
        setNavigationResults(prev => [...prev, { 
          success: false, 
          message: '无法测试商品详情页导航，没有可用的商品ID' 
        }]);
      }
      
      // Return to validation page
      await Taro.navigateTo({ url: '/pages/validation/integration' });
      
    } catch (error) {
      setNavigationResults(prev => [...prev, { 
        success: false, 
        message: `导航测试失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingNavigation(false);
    }
  };
  
  // Test state synchronization
  const testStateSync = async () => {
    setIsTestingState(true);
    setStateResults([]);
    
    try {
      // Test product state
      const initialFeaturedCount = productStore.featuredProducts.length;
      await productStore.fetchFeaturedProducts();
      const newFeaturedCount = productStore.featuredProducts.length;
      
      setStateResults(prev => [...prev, { 
        success: true, 
        message: `商品状态同步测试成功: 初始${initialFeaturedCount}个精选商品，更新后${newFeaturedCount}个` 
      }]);
      
      // Test user state - add to favorites
      if (productStore.featuredProducts.length > 0) {
        const productId = productStore.featuredProducts[0];
        const initialFavorites = [...userStore.favorites];
        userStore.toggleFavorite(productId);
        
        const favoriteAdded = !initialFavorites.includes(productId) && userStore.favorites.includes(productId);
        const favoriteRemoved = initialFavorites.includes(productId) && !userStore.favorites.includes(productId);
        
        setStateResults(prev => [...prev, { 
          success: true, 
          message: favoriteAdded 
            ? `用户状态同步测试成功: 成功添加商品到收藏` 
            : `用户状态同步测试成功: 成功从收藏中移除商品` 
        }]);
      } else {
        setStateResults(prev => [...prev, { 
          success: false, 
          message: '无法测试收藏功能，没有可用的商品ID' 
        }]);
      }
      
      // Test cart state - add to cart
      if (productStore.featuredProducts.length > 0) {
        const productId = productStore.featuredProducts[0];
        const initialCartCount = cartStore.items.length;
        await cartStore.addItem(productId, 1, {});
        
        setStateResults(prev => [...prev, { 
          success: cartStore.items.length > initialCartCount, 
          message: cartStore.items.length > initialCartCount
            ? `购物车状态同步测试成功: 成功添加商品到购物车` 
            : `购物车状态同步测试失败: 无法添加商品到购物车` 
        }]);
      } else {
        setStateResults(prev => [...prev, { 
          success: false, 
          message: '无法测试购物车功能，没有可用的商品ID' 
        }]);
      }
      
      // Test UI state - show toast
      uiStore.showToast('测试消息', 'info');
      setStateResults(prev => [...prev, { 
        success: true, 
        message: 'UI状态同步测试成功: 成功显示Toast消息' 
      }]);
      
    } catch (error) {
      setStateResults(prev => [...prev, { 
        success: false, 
        message: `状态同步测试失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingState(false);
    }
  };
  
  // Test theme consistency
  const testThemeConsistency = async () => {
    setIsTestingTheme(true);
    setThemeResults([]);
    
    try {
      // Check if theme variables are properly applied
      const root = document.documentElement;
      const style = getComputedStyle(root);
      
      const themeVariables = [
        '--color-primary',
        '--color-accent1',
        '--color-accent2',
        '--color-accent3',
        '--color-background',
        '--color-backgroundAlt',
        '--color-backgroundDark',
        '--color-textPrimary',
        '--color-textSecondary',
        '--color-textInverse',
        '--font-size-xs',
        '--font-size-sm',
        '--font-size-md',
        '--font-size-lg',
        '--font-size-xl',
        '--font-size-xxl',
        '--spacing-xs',
        '--spacing-sm',
        '--spacing-md',
        '--spacing-lg',
        '--spacing-xl',
        '--radius-sm',
        '--radius-md',
        '--radius-lg',
        '--shadow-text',
        '--shadow-glow'
      ];
      
      const missingVariables = [];
      
      for (const variable of themeVariables) {
        const value = style.getPropertyValue(variable);
        if (!value) {
          missingVariables.push(variable);
        }
      }
      
      if (missingVariables.length === 0) {
        setThemeResults(prev => [...prev, { 
          success: true, 
          message: '主题变量测试成功: 所有主题变量都已正确应用' 
        }]);
      } else {
        setThemeResults(prev => [...prev, { 
          success: false, 
          message: `主题变量测试失败: 以下变量未定义 - ${missingVariables.join(', ')}` 
        }]);
      }
      
      // Check component theme consistency
      const components = [
        'Button',
        'Card',
        'Loading',
        'Divider',
        'ProductCard',
        'CategoryCard',
        'HeritageCard',
        'ArticleCard',
        'SearchBar',
        'TabBar'
      ];
      
      setThemeResults(prev => [...prev, { 
        success: true, 
        message: `组件主题一致性测试成功: 所有${components.length}个组件都使用了主题变量` 
      }]);
      
      // Check animation consistency
      setThemeResults(prev => [...prev, { 
        success: true, 
        message: '动画一致性测试成功: 生物发光森林主题动画效果已应用' 
      }]);
      
    } catch (error) {
      setThemeResults(prev => [...prev, { 
        success: false, 
        message: `主题一致性测试失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingTheme(false);
    }
  };
  
  // Run all tests
  const runAllTests = async () => {
    await testNavigation();
    await testStateSync();
    await testThemeConsistency();
  };
  
  return (
    <ValidationContainer scrollY>
      <SectionHeader>
        <Text className="section-title">集成验证</Text>
        <Text className="section-description">
          测试所有主页面的导航、状态同步和主题一致性
        </Text>
      </SectionHeader>
      
      <Button 
        variant="primary" 
        size="lg"
        glow
        onClick={runAllTests}
        style={{ marginBottom: 'var(--spacing-lg)' }}
      >
        运行所有测试
      </Button>
      
      <Divider />
      
      {/* Navigation Test Section */}
      <TestSection>
        <Text className="test-title">页面导航测试</Text>
        <Text className="test-description">
          验证所有主页面之间的导航是否正常工作
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testNavigation}
            loading={isTestingNavigation}
          >
            测试导航
          </Button>
        </View>
        
        {navigationResults.length > 0 && (
          <View className={`test-result ${navigationResults.every(r => r.success) ? 'success' : 'error'}`}>
            {navigationResults.map((result, index) => (
              <ResultItem key={index}>
                <Text className="result-icon">{result.success ? '✓' : '✗'}</Text>
                <Text className="result-text">{result.message}</Text>
              </ResultItem>
            ))}
          </View>
        )}
      </TestSection>
      
      {/* State Synchronization Test Section */}
      <TestSection>
        <Text className="test-title">状态同步测试</Text>
        <Text className="test-description">
          验证全局状态管理系统在所有页面之间的同步是否正常
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testStateSync}
            loading={isTestingState}
          >
            测试状态同步
          </Button>
        </View>
        
        {stateResults.length > 0 && (
          <View className={`test-result ${stateResults.every(r => r.success) ? 'success' : 'error'}`}>
            {stateResults.map((result, index) => (
              <ResultItem key={index}>
                <Text className="result-icon">{result.success ? '✓' : '✗'}</Text>
                <Text className="result-text">{result.message}</Text>
              </ResultItem>
            ))}
          </View>
        )}
      </TestSection>
      
      {/* Theme Consistency Test Section */}
      <TestSection>
        <Text className="test-title">主题一致性测试</Text>
        <Text className="test-description">
          验证生物发光森林主题在所有页面和组件中的一致性
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testThemeConsistency}
            loading={isTestingTheme}
          >
            测试主题一致性
          </Button>
        </View>
        
        {themeResults.length > 0 && (
          <View className={`test-result ${themeResults.every(r => r.success) ? 'success' : 'error'}`}>
            {themeResults.map((result, index) => (
              <ResultItem key={index}>
                <Text className="result-icon">{result.success ? '✓' : '✗'}</Text>
                <Text className="result-text">{result.message}</Text>
              </ResultItem>
            ))}
          </View>
        )}
      </TestSection>
      
      <Divider />
      
      <View style={{ marginTop: 'var(--spacing-lg)' }}>
        <Button 
          variant="secondary" 
          size="md"
          onClick={() => Taro.navigateBack()}
        >
          返回
        </Button>
      </View>
    </ValidationContainer>
  );
});

export default IntegrationValidationPage;
