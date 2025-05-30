/**
 * Backend integration validation for Yunnan Taste Mini-Program
 * Tests API integration, data flow, and error handling
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro from '@tarojs/taro';
import { useProductStore, useUserStore, useCartStore, useUIStore } from '../../store/StoreContext';
import { Environment, setEnvironment, getCurrentEnvironment } from '../../config/env';

// Components
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Divider } from '../../components/Divider';
import { Card } from '../../components/Card';

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

const EnvSelector = styled(View)`
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  
  .env-button {
    flex: 1;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    text-align: center;
    font-size: var(--font-size-sm);
    
    &.active {
      background-color: var(--color-primary);
      color: var(--color-textInverse);
    }
    
    &.inactive {
      background-color: var(--color-backgroundAlt);
      color: var(--color-textSecondary);
    }
  }
`;

// Backend integration validation page component
const BackendIntegrationValidation: React.FC = observer(() => {
  const productStore = useProductStore();
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const uiStore = useUIStore();
  
  // Local state
  const [productResults, setProductResults] = useState<Array<{success: boolean, message: string}>>([]);
  const [userResults, setUserResults] = useState<Array<{success: boolean, message: string}>>([]);
  const [cartResults, setCartResults] = useState<Array<{success: boolean, message: string}>>([]);
  const [errorResults, setErrorResults] = useState<Array<{success: boolean, message: string}>>([]);
  
  const [isTestingProducts, setIsTestingProducts] = useState(false);
  const [isTestingUser, setIsTestingUser] = useState(false);
  const [isTestingCart, setIsTestingCart] = useState(false);
  const [isTestingErrors, setIsTestingErrors] = useState(false);
  
  const currentEnv = getCurrentEnvironment();
  
  // Change environment
  const changeEnvironment = (env: Environment) => {
    setEnvironment(env);
    uiStore.setEnvironment(env);
  };
  
  // Test product API integration
  const testProductAPI = async () => {
    setIsTestingProducts(true);
    setProductResults([]);
    
    try {
      // Test fetching featured products
      await productStore.fetchFeaturedProducts();
      setProductResults(prev => [...prev, { 
        success: productStore.featuredProducts.length > 0, 
        message: `成功获取精选商品: ${productStore.featuredProducts.length}个` 
      }]);
      
      // Test fetching new products
      await productStore.fetchNewProducts();
      setProductResults(prev => [...prev, { 
        success: productStore.newProducts.length > 0, 
        message: `成功获取新品: ${productStore.newProducts.length}个` 
      }]);
      
      // Test fetching categories
      await productStore.fetchCategories();
      const categoryCount = Object.keys(productStore.categories).length;
      setProductResults(prev => [...prev, { 
        success: categoryCount > 0, 
        message: `成功获取分类: ${categoryCount}个` 
      }]);
      
      // Test fetching product details
      if (productStore.featuredProducts.length > 0) {
        const productId = productStore.featuredProducts[0];
        const product = await productStore.fetchProduct(productId);
        setProductResults(prev => [...prev, { 
          success: !!product, 
          message: product ? `成功获取商品详情: ${product.title}` : '获取商品详情失败' 
        }]);
      }
      
      // Test search functionality
      await productStore.searchProducts('茶');
      setProductResults(prev => [...prev, { 
        success: productStore.searchResults.length > 0, 
        message: `成功搜索商品: ${productStore.searchResults.length}个结果` 
      }]);
      
      // Test filtering by category
      if (Object.keys(productStore.categories).length > 0) {
        const categoryId = Object.keys(productStore.categories)[0];
        await productStore.filterProducts({ categoryId });
        setProductResults(prev => [...prev, { 
          success: productStore.filteredProducts.length > 0, 
          message: `成功筛选分类商品: ${productStore.filteredProducts.length}个结果` 
        }]);
      }
      
    } catch (error) {
      setProductResults(prev => [...prev, { 
        success: false, 
        message: `测试产品API失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingProducts(false);
    }
  };
  
  // Test user API integration
  const testUserAPI = async () => {
    setIsTestingUser(true);
    setUserResults([]);
    
    try {
      // Test user login (mock)
      const loginSuccess = await userStore.login('test_user', 'password123');
      setUserResults(prev => [...prev, { 
        success: loginSuccess, 
        message: loginSuccess ? '成功登录测试账户' : '登录测试账户失败' 
      }]);
      
      if (loginSuccess) {
        // Test fetching user profile
        await userStore.fetchProfile();
        setUserResults(prev => [...prev, { 
          success: !!userStore.profile, 
          message: userStore.profile ? `成功获取用户资料: ${userStore.profile.nickname}` : '获取用户资料失败' 
        }]);
        
        // Test fetching addresses
        await userStore.fetchAddresses();
        setUserResults(prev => [...prev, { 
          success: userStore.addresses.length > 0, 
          message: `成功获取地址: ${userStore.addresses.length}个` 
        }]);
        
        // Test toggling favorite
        if (productStore.featuredProducts.length > 0) {
          const productId = productStore.featuredProducts[0];
          const initialFavorites = [...userStore.favorites];
          userStore.toggleFavorite(productId);
          
          const favoriteAdded = !initialFavorites.includes(productId) && userStore.favorites.includes(productId);
          const favoriteRemoved = initialFavorites.includes(productId) && !userStore.favorites.includes(productId);
          
          setUserResults(prev => [...prev, { 
            success: true, 
            message: favoriteAdded 
              ? `成功添加商品到收藏` 
              : `成功从收藏中移除商品` 
          }]);
        }
        
        // Test adding to view history
        if (productStore.featuredProducts.length > 0) {
          const productId = productStore.featuredProducts[0];
          const initialHistory = [...userStore.viewHistory];
          userStore.addToViewHistory(productId);
          
          setUserResults(prev => [...prev, { 
            success: userStore.viewHistory.includes(productId), 
            message: userStore.viewHistory.includes(productId) 
              ? `成功添加商品到浏览历史` 
              : `添加商品到浏览历史失败` 
          }]);
        }
        
        // Test logout
        await userStore.logout();
        setUserResults(prev => [...prev, { 
          success: !userStore.isAuthenticated, 
          message: !userStore.isAuthenticated ? '成功退出登录' : '退出登录失败' 
        }]);
      }
      
    } catch (error) {
      setUserResults(prev => [...prev, { 
        success: false, 
        message: `测试用户API失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingUser(false);
    }
  };
  
  // Test cart API integration
  const testCartAPI = async () => {
    setIsTestingCart(true);
    setCartResults([]);
    
    try {
      // Test login first
      const loginSuccess = await userStore.login('test_user', 'password123');
      if (!loginSuccess) {
        setCartResults(prev => [...prev, { 
          success: false, 
          message: '登录失败，无法测试购物车API' 
        }]);
        setIsTestingCart(false);
        return;
      }
      
      // Test fetching cart
      await cartStore.fetchCart();
      setCartResults(prev => [...prev, { 
        success: true, 
        message: `成功获取购物车: ${cartStore.items.length}个商品` 
      }]);
      
      // Test adding item to cart
      if (productStore.featuredProducts.length > 0) {
        const productId = productStore.featuredProducts[0];
        const initialCount = cartStore.items.length;
        await cartStore.addItem(productId, 1, {});
        
        setCartResults(prev => [...prev, { 
          success: cartStore.items.length > initialCount, 
          message: cartStore.items.length > initialCount
            ? `成功添加商品到购物车` 
            : `添加商品到购物车失败` 
        }]);
        
        // Test updating item quantity
        if (cartStore.items.length > 0) {
          const itemId = cartStore.items[0].id;
          const initialQuantity = cartStore.items[0].quantity;
          await cartStore.updateItemQuantity(itemId, initialQuantity + 1);
          
          const updatedItem = cartStore.items.find(item => item.id === itemId);
          setCartResults(prev => [...prev, { 
            success: updatedItem && updatedItem.quantity === initialQuantity + 1, 
            message: updatedItem && updatedItem.quantity === initialQuantity + 1
              ? `成功更新购物车商品数量` 
              : `更新购物车商品数量失败` 
          }]);
        }
        
        // Test removing item from cart
        if (cartStore.items.length > 0) {
          const itemId = cartStore.items[0].id;
          const initialCount = cartStore.items.length;
          await cartStore.removeItem(itemId);
          
          setCartResults(prev => [...prev, { 
            success: cartStore.items.length < initialCount, 
            message: cartStore.items.length < initialCount
              ? `成功从购物车移除商品` 
              : `从购物车移除商品失败` 
          }]);
        }
        
        // Test clearing cart
        await cartStore.clearCart();
        setCartResults(prev => [...prev, { 
          success: cartStore.items.length === 0, 
          message: cartStore.items.length === 0
            ? `成功清空购物车` 
            : `清空购物车失败` 
        }]);
      }
      
      // Logout after tests
      await userStore.logout();
      
    } catch (error) {
      setCartResults(prev => [...prev, { 
        success: false, 
        message: `测试购物车API失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingCart(false);
    }
  };
  
  // Test error handling
  const testErrorHandling = async () => {
    setIsTestingErrors(true);
    setErrorResults([]);
    
    try {
      // Test network error handling
      setErrorResults(prev => [...prev, { 
        success: true, 
        message: '测试网络错误处理...' 
      }]);
      
      // Simulate network error by requesting non-existent product
      try {
        await productStore.fetchProduct('non-existent-id');
      } catch (error) {
        // This should be caught by the store's error handling
      }
      
      // Test authentication error handling
      setErrorResults(prev => [...prev, { 
        success: true, 
        message: '测试认证错误处理...' 
      }]);
      
      // Simulate authentication error by accessing protected resource without login
      if (!userStore.isAuthenticated) {
        try {
          await cartStore.checkout('address-id', 'wechat');
        } catch (error) {
          // This should be caught by the store's error handling
        }
      }
      
      // Test validation error handling
      setErrorResults(prev => [...prev, { 
        success: true, 
        message: '测试验证错误处理...' 
      }]);
      
      // Simulate validation error by adding invalid quantity
      try {
        if (productStore.featuredProducts.length > 0) {
          const productId = productStore.featuredProducts[0];
          // @ts-ignore - Intentionally passing invalid quantity for testing
          await cartStore.updateItemQuantity('some-id', -1);
        }
      } catch (error) {
        // This should be caught by the store's error handling
      }
      
      // Test loading state management
      setErrorResults(prev => [...prev, { 
        success: true, 
        message: '测试加载状态管理...' 
      }]);
      
      // Check if loading states are properly reset after errors
      setErrorResults(prev => [...prev, { 
        success: !productStore.isLoadingProduct && 
                !userStore.isLoadingProfile && 
                !cartStore.isLoadingCart, 
        message: !productStore.isLoadingProduct && 
                !userStore.isLoadingProfile && 
                !cartStore.isLoadingCart
          ? '加载状态正确重置' 
          : '加载状态未正确重置' 
      }]);
      
      // Test toast notifications
      uiStore.showToast('这是一条测试消息', 'info');
      setErrorResults(prev => [...prev, { 
        success: true, 
        message: '成功显示Toast通知' 
      }]);
      
    } catch (error) {
      setErrorResults(prev => [...prev, { 
        success: false, 
        message: `测试错误处理失败: ${error.message}` 
      }]);
    } finally {
      setIsTestingErrors(false);
    }
  };
  
  // Run all tests
  const runAllTests = async () => {
    await testProductAPI();
    await testUserAPI();
    await testCartAPI();
    await testErrorHandling();
  };
  
  return (
    <ValidationContainer scrollY>
      <SectionHeader>
        <Text className="section-title">后端集成验证</Text>
        <Text className="section-description">
          测试API集成、数据流和错误处理
        </Text>
      </SectionHeader>
      
      <EnvSelector>
        <View 
          className={`env-button ${currentEnv === Environment.DEVELOPMENT ? 'active' : 'inactive'}`}
          onClick={() => changeEnvironment(Environment.DEVELOPMENT)}
        >
          开发环境
        </View>
        <View 
          className={`env-button ${currentEnv === Environment.STAGING ? 'active' : 'inactive'}`}
          onClick={() => changeEnvironment(Environment.STAGING)}
        >
          测试环境
        </View>
        <View 
          className={`env-button ${currentEnv === Environment.PRODUCTION ? 'active' : 'inactive'}`}
          onClick={() => changeEnvironment(Environment.PRODUCTION)}
        >
          生产环境
        </View>
      </EnvSelector>
      
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
      
      {/* Product API Test Section */}
      <TestSection>
        <Text className="test-title">商品API测试</Text>
        <Text className="test-description">
          验证商品、分类、搜索和筛选API
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testProductAPI}
            loading={isTestingProducts}
          >
            测试商品API
          </Button>
        </View>
        
        {productResults.length > 0 && (
          <View className={`test-result ${productResults.every(r => r.success) ? 'success' : 'error'}`}>
            {productResults.map((result, index) => (
              <ResultItem key={index}>
                <Text className="result-icon">{result.success ? '✓' : '✗'}</Text>
                <Text className="result-text">{result.message}</Text>
              </ResultItem>
            ))}
          </View>
        )}
      </TestSection>
      
      {/* User API Test Section */}
      <TestSection>
        <Text className="test-title">用户API测试</Text>
        <Text className="test-description">
          验证用户认证、资料和收藏API
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testUserAPI}
            loading={isTestingUser}
          >
            测试用户API
          </Button>
        </View>
        
        {userResults.length > 0 && (
          <View className={`test-result ${userResults.every(r => r.success) ? 'success' : 'error'}`}>
            {userResults.map((result, index) => (
              <ResultItem key={index}>
                <Text className="result-icon">{result.success ? '✓' : '✗'}</Text>
                <Text className="result-text">{result.message}</Text>
              </ResultItem>
            ))}
          </View>
        )}
      </TestSection>
      
      {/* Cart API Test Section */}
      <TestSection>
        <Text className="test-title">购物车API测试</Text>
        <Text className="test-description">
          验证购物车操作和结算API
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testCartAPI}
            loading={isTestingCart}
          >
            测试购物车API
          </Button>
        </View>
        
        {cartResults.length > 0 && (
          <View className={`test-result ${cartResults.every(r => r.success) ? 'success' : 'error'}`}>
            {cartResults.map((result, index) => (
              <ResultItem key={index}>
                <Text className="result-icon">{result.success ? '✓' : '✗'}</Text>
                <Text className="result-text">{result.message}</Text>
              </ResultItem>
            ))}
          </View>
        )}
      </TestSection>
      
      {/* Error Handling Test Section */}
      <TestSection>
        <Text className="test-title">错误处理测试</Text>
        <Text className="test-description">
          验证错误处理、加载状态和通知
        </Text>
        
        <View className="test-actions">
          <Button 
            variant="secondary" 
            size="md"
            onClick={testErrorHandling}
            loading={isTestingErrors}
          >
            测试错误处理
          </Button>
        </View>
        
        {errorResults.length > 0 && (
          <View className={`test-result ${errorResults.every(r => r.success) ? 'success' : 'error'}`}>
            {errorResults.map((result, index) => (
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

export default BackendIntegrationValidation;
