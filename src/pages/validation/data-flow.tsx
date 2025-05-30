/**
 * Data flow validation utility for Yunnan Taste Mini-Program
 * Tests integration between stores and API services
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStore, useProductStore, useUserStore, useCartStore, useUIStore } from '@/store/StoreContext';

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
    
    .test-container {
      margin-bottom: var(--spacing-lg);
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      background-color: var(--color-backgroundAlt);
      
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
        margin-top: var(--spacing-md);
        padding: var(--spacing-md);
        border-radius: var(--radius-sm);
        background-color: var(--color-backgroundDark);
        font-family: monospace;
        font-size: var(--font-size-sm);
        white-space: pre-wrap;
        overflow-x: auto;
        
        &.success {
          border-left: 4px solid var(--color-success);
        }
        
        &.error {
          border-left: 4px solid var(--color-error);
        }
        
        &.info {
          border-left: 4px solid var(--color-primary);
        }
      }
    }
  }
`;

export const DataFlowValidation: React.FC = observer(() => {
  const rootStore = useStore();
  const productStore = useProductStore();
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const uiStore = useUIStore();
  
  // Test results state
  const [productResults, setProductResults] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '未执行测试'
  });
  
  const [userResults, setUserResults] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '未执行测试'
  });
  
  const [cartResults, setCartResults] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '未执行测试'
  });
  
  const [themeResults, setThemeResults] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '未执行测试'
  });
  
  // Product data flow test
  const testProductDataFlow = async () => {
    setProductResults({
      status: 'loading',
      message: '正在测试产品数据流...'
    });
    
    try {
      // Test fetching categories
      await productStore.fetchCategories();
      
      // Test fetching featured products
      await productStore.fetchFeaturedProducts();
      
      // Test product search
      await productStore.searchProducts('茶');
      
      // Test category filtering
      if (productStore.rootCategories.length > 0) {
        const categoryId = productStore.rootCategories[0];
        productStore.setCurrentCategory(categoryId);
        await productStore.fetchProductsByCategory();
      }
      
      setProductResults({
        status: 'success',
        message: JSON.stringify({
          categories: Object.keys(productStore.categories).length,
          featuredProducts: productStore.featuredProducts.length,
          searchResults: productStore.searchResults.length,
          filteredProducts: productStore.filteredProducts.length
        }, null, 2)
      });
    } catch (error) {
      setProductResults({
        status: 'error',
        message: `测试失败: ${error.message}`
      });
    }
  };
  
  // User data flow test
  const testUserDataFlow = async () => {
    setUserResults({
      status: 'loading',
      message: '正在测试用户数据流...'
    });
    
    try {
      // Test mock login
      const loginSuccess = await userStore.login('test_user', 'password123');
      
      // Test profile update if login successful
      let profileUpdateSuccess = false;
      if (loginSuccess && userStore.profile) {
        profileUpdateSuccess = await userStore.updateProfile({
          nickname: `测试用户_${Date.now()}`
        });
      }
      
      // Test adding address if login successful
      let addressSuccess = false;
      if (loginSuccess) {
        addressSuccess = await userStore.addAddress({
          name: '测试用户',
          phone: '13800138000',
          province: '云南省',
          city: '昆明市',
          district: '五华区',
          address: '测试地址123号',
          isDefault: true
        });
      }
      
      // Test logout
      userStore.logout();
      
      setUserResults({
        status: loginSuccess ? 'success' : 'error',
        message: JSON.stringify({
          loginSuccess,
          profileUpdateSuccess,
          addressSuccess,
          logoutSuccess: !userStore.isLoggedIn
        }, null, 2)
      });
    } catch (error) {
      setUserResults({
        status: 'error',
        message: `测试失败: ${error.message}`
      });
    }
  };
  
  // Cart data flow test
  const testCartDataFlow = async () => {
    setCartResults({
      status: 'loading',
      message: '正在测试购物车数据流...'
    });
    
    try {
      // Clear cart first
      await cartStore.clearCart();
      
      // Test adding item to cart
      let addSuccess = false;
      if (productStore.featuredProducts.length > 0) {
        const productId = productStore.featuredProducts[0];
        addSuccess = await cartStore.addItem(productId, 2);
      }
      
      // Test updating item quantity
      let updateSuccess = false;
      if (addSuccess && cartStore.items.length > 0) {
        const itemId = cartStore.items[0].id;
        updateSuccess = await cartStore.updateItemQuantity(itemId, 3);
      }
      
      // Test removing item
      let removeSuccess = false;
      if (cartStore.items.length > 0) {
        const itemId = cartStore.items[0].id;
        removeSuccess = await cartStore.removeItem(itemId);
      }
      
      setCartResults({
        status: 'success',
        message: JSON.stringify({
          addSuccess,
          updateSuccess,
          removeSuccess,
          finalCartItems: cartStore.items.length
        }, null, 2)
      });
    } catch (error) {
      setCartResults({
        status: 'error',
        message: `测试失败: ${error.message}`
      });
    }
  };
  
  // Theme integration test
  const testThemeIntegration = () => {
    setThemeResults({
      status: 'loading',
      message: '正在测试主题集成...'
    });
    
    try {
      // Get current theme
      const currentTheme = uiStore.currentTheme;
      
      // Test UI interactions
      uiStore.showToast('测试消息', 'info', 2000);
      
      // Test theme variables access
      const themeVariables = {
        colors: {
          primary: currentTheme.colors.primary,
          accent1: currentTheme.colors.accent1,
          accent2: currentTheme.colors.accent2,
          background: currentTheme.colors.background
        },
        typography: {
          fontSizes: currentTheme.typography.fontSizes,
          fontWeights: currentTheme.typography.fontWeights
        },
        spacing: currentTheme.spacing,
        effects: {
          glow: currentTheme.effects.glow
        }
      };
      
      setThemeResults({
        status: 'success',
        message: JSON.stringify(themeVariables, null, 2)
      });
    } catch (error) {
      setThemeResults({
        status: 'error',
        message: `测试失败: ${error.message}`
      });
    }
  };
  
  return (
    <StyledValidationContainer>
      <View className="validation-section">
        <Text className="section-title">数据流验证</Text>
        <Text className="section-description">
          本页面用于验证全局状态管理系统与后端API的集成，测试数据流的一致性和可靠性。
        </Text>
      </View>
      
      {/* Product Store Tests */}
      <View className="validation-section">
        <Text className="section-title">产品数据流测试</Text>
        
        <View className="test-container">
          <Text className="test-title">产品数据流测试</Text>
          <Text className="test-description">
            测试产品数据的获取、搜索和过滤功能，验证ProductStore与API的集成。
          </Text>
          
          <View className="test-actions">
            <Button 
              onClick={testProductDataFlow}
              disabled={productResults.status === 'loading'}
            >
              执行测试
            </Button>
          </View>
          
          <View className={`test-result ${productResults.status === 'success' ? 'success' : productResults.status === 'error' ? 'error' : 'info'}`}>
            {productResults.message}
          </View>
        </View>
      </View>
      
      {/* User Store Tests */}
      <View className="validation-section">
        <Text className="section-title">用户数据流测试</Text>
        
        <View className="test-container">
          <Text className="test-title">用户数据流测试</Text>
          <Text className="test-description">
            测试用户登录、资料更新和地址管理功能，验证UserStore与API的集成。
          </Text>
          
          <View className="test-actions">
            <Button 
              onClick={testUserDataFlow}
              disabled={userResults.status === 'loading'}
            >
              执行测试
            </Button>
          </View>
          
          <View className={`test-result ${userResults.status === 'success' ? 'success' : userResults.status === 'error' ? 'error' : 'info'}`}>
            {userResults.message}
          </View>
        </View>
      </View>
      
      {/* Cart Store Tests */}
      <View className="validation-section">
        <Text className="section-title">购物车数据流测试</Text>
        
        <View className="test-container">
          <Text className="test-title">购物车数据流测试</Text>
          <Text className="test-description">
            测试购物车的添加、更新和删除功能，验证CartStore与API的集成。
          </Text>
          
          <View className="test-actions">
            <Button 
              onClick={testCartDataFlow}
              disabled={cartResults.status === 'loading'}
            >
              执行测试
            </Button>
          </View>
          
          <View className={`test-result ${cartResults.status === 'success' ? 'success' : cartResults.status === 'error' ? 'error' : 'info'}`}>
            {cartResults.message}
          </View>
        </View>
      </View>
      
      {/* Theme Integration Tests */}
      <View className="validation-section">
        <Text className="section-title">主题集成测试</Text>
        
        <View className="test-container">
          <Text className="test-title">主题集成测试</Text>
          <Text className="test-description">
            测试生物发光森林主题与全局状态管理系统的集成。
          </Text>
          
          <View className="test-actions">
            <Button 
              onClick={testThemeIntegration}
              disabled={themeResults.status === 'loading'}
            >
              执行测试
            </Button>
          </View>
          
          <View className={`test-result ${themeResults.status === 'success' ? 'success' : themeResults.status === 'error' ? 'error' : 'info'}`}>
            {themeResults.message}
          </View>
        </View>
      </View>
    </StyledValidationContainer>
  );
});

export default DataFlowValidation;
