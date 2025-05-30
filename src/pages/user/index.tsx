/**
 * User Center Page for Yunnan Taste Mini-Program
 * Manage user profile, orders, and preferences
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro from '@tarojs/taro';
import { useUserStore, useCartStore, useProductStore, useUIStore } from '@/store/StoreContext';

// Components
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Divider } from '@/components/Divider';
import { ProductCard } from '@/components/ProductCard';

// Styled components
const UserCenterContainer = styled(ScrollView)`
  min-height: 100vh;
  background-color: var(--color-background);
  padding-bottom: 98px; /* Space for tab bar */
`;

const ProfileHeader = styled(View)`
  position: relative;
  padding: var(--spacing-xl) var(--spacing-lg);
  background: linear-gradient(to bottom, var(--color-backgroundDark), var(--color-background));
  display: flex;
  align-items: center;
  
  .avatar-container {
    position: relative;
    margin-right: var(--spacing-lg);
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 2px solid var(--color-accent1);
      box-shadow: 0 0 10px var(--color-accent1);
    }
    
    .glow-effect {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        var(--color-accent1) 0%,
        transparent 70%
      );
      opacity: 0.3;
      filter: blur(8px);
      z-index: 0;
    }
  }
  
  .user-info {
    flex: 1;
    
    .username {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-textPrimary);
      margin-bottom: var(--spacing-xs);
    }
    
    .member-info {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      margin-bottom: var(--spacing-xs);
    }
    
    .points-container {
      display: flex;
      align-items: center;
      
      .points-label {
        font-size: var(--font-size-sm);
        color: var(--color-textSecondary);
        margin-right: var(--spacing-xs);
      }
      
      .points-value {
        font-size: var(--font-size-md);
        color: var(--color-accent1);
        font-weight: var(--font-weight-medium);
      }
    }
  }
  
  .settings-button {
    position: absolute;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .settings-icon {
      width: 24px;
      height: 24px;
    }
  }
`;

const LoginPrompt = styled(View)`
  padding: var(--spacing-xl) var(--spacing-lg);
  background: linear-gradient(to bottom, var(--color-backgroundDark), var(--color-background));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .login-icon {
    width: 80px;
    height: 80px;
    margin-bottom: var(--spacing-lg);
    opacity: 0.7;
  }
  
  .login-text {
    font-size: var(--font-size-md);
    color: var(--color-textSecondary);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
`;

const StatsBar = styled(View)`
  display: flex;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-backgroundAlt);
  
  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-textPrimary);
      margin-bottom: var(--spacing-xs);
    }
    
    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-textSecondary);
    }
  }
`;

const MenuSection = styled(View)`
  padding: var(--spacing-md) var(--spacing-lg);
  
  .section-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-md);
  }
`;

const MenuGrid = styled(View)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  
  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .menu-icon {
      width: 32px;
      height: 32px;
      margin-bottom: var(--spacing-xs);
    }
    
    .menu-label {
      font-size: var(--font-size-xs);
      color: var(--color-textSecondary);
      text-align: center;
    }
  }
`;

const OrderSection = styled(View)`
  padding: var(--spacing-md) var(--spacing-lg);
  
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
    
    .view-all {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
    }
  }
`;

const OrderCard = styled(View)`
  background-color: var(--color-backgroundAlt);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
    
    .order-id {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
    }
    
    .order-status {
      font-size: var(--font-size-sm);
      color: var(--color-accent1);
      font-weight: var(--font-weight-medium);
    }
  }
  
  .order-items {
    display: flex;
    margin-bottom: var(--spacing-md);
    
    .order-image {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-sm);
      margin-right: var(--spacing-sm);
      object-fit: cover;
    }
    
    .more-items {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-sm);
      background-color: var(--color-backgroundDark);
      display: flex;
      justify-content: center;
      align-items: center;
      
      .more-text {
        font-size: var(--font-size-sm);
        color: var(--color-textSecondary);
      }
    }
  }
  
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .order-total {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      
      .total-value {
        font-weight: var(--font-weight-medium);
        color: var(--color-textPrimary);
      }
    }
  }
`;

const ProductSection = styled(View)`
  padding: var(--spacing-md) var(--spacing-lg);
  
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
    
    .view-all {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
    }
  }
`;

const ProductRow = styled(ScrollView)`
  white-space: nowrap;
  
  .product-item {
    display: inline-block;
    width: 140px;
    margin-right: var(--spacing-md);
    vertical-align: top;
  }
`;

const EmptyState = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  
  .empty-icon {
    width: 60px;
    height: 60px;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
  }
  
  .empty-text {
    font-size: var(--font-size-sm);
    color: var(--color-textSecondary);
    margin-bottom: var(--spacing-md);
  }
`;

// Mock order data
const MOCK_ORDERS = [
  {
    id: 'ORD123456',
    status: '待发货',
    date: '2025-05-20',
    total: 328,
    items: [
      { id: 'p1', image: 'https://example.com/product1.jpg' },
      { id: 'p2', image: 'https://example.com/product2.jpg' }
    ]
  },
  {
    id: 'ORD123455',
    status: '已完成',
    date: '2025-05-15',
    total: 199,
    items: [
      { id: 'p3', image: 'https://example.com/product3.jpg' }
    ]
  }
];

// User center page component
const UserCenterPage: React.FC = observer(() => {
  const userStore = useUserStore();
  const cartStore = useCartStore();
  const productStore = useProductStore();
  const uiStore = useUIStore();
  
  // Local state
  const [activeTab, setActiveTab] = useState('favorites');
  
  // Handle login
  const handleLogin = async () => {
    // In a real app, this would open a login modal or navigate to login page
    // For demo purposes, we'll use the mock login
    const success = await userStore.login('test_user', 'password123');
    
    if (success) {
      uiStore.showToast('登录成功', 'success');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    userStore.logout();
    uiStore.showToast('已退出登录', 'info');
  };
  
  // Handle settings
  const handleSettings = () => {
    Taro.navigateTo({ url: '/pages/user/settings' });
  };
  
  // Handle view all orders
  const handleViewAllOrders = () => {
    Taro.navigateTo({ url: '/pages/user/orders' });
  };
  
  // Handle view all favorites
  const handleViewAllFavorites = () => {
    Taro.navigateTo({ url: '/pages/user/favorites' });
  };
  
  // Handle view all history
  const handleViewAllHistory = () => {
    Taro.navigateTo({ url: '/pages/user/history' });
  };
  
  // Handle order click
  const handleOrderClick = (orderId: string) => {
    Taro.navigateTo({ url: `/pages/order/detail?id=${orderId}` });
  };
  
  // Get favorite products
  const favoriteProducts = userStore.favorites
    .map(id => productStore.getProduct(id))
    .filter(Boolean);
  
  // Get view history products
  const historyProducts = userStore.viewHistory
    .map(id => productStore.getProduct(id))
    .filter(Boolean);
  
  return (
    <UserCenterContainer scrollY>
      {/* User Profile Header or Login Prompt */}
      {userStore.isLoggedIn && userStore.profile ? (
        <ProfileHeader>
          <View className="avatar-container">
            <View className="glow-effect" />
            <Image 
              className="avatar" 
              src={userStore.profile.avatar || '/assets/images/default-avatar.png'} 
            />
          </View>
          <View className="user-info">
            <Text className="username">{userStore.profile.nickname}</Text>
            <Text className="member-info">
              {userStore.profile.level || '普通会员'} · 
              {userStore.profile.memberSince ? 
                `会员${new Date().getFullYear() - new Date(userStore.profile.memberSince).getFullYear()}年` : 
                '新会员'}
            </Text>
            <View className="points-container">
              <Text className="points-label">积分</Text>
              <Text className="points-value">{userStore.profile.points || 0}</Text>
            </View>
          </View>
          <View className="settings-button" onClick={handleSettings}>
            <Image 
              className="settings-icon" 
              src="/assets/icons/settings.png" 
            />
          </View>
        </ProfileHeader>
      ) : (
        <LoginPrompt>
          <Image 
            className="login-icon" 
            src="/assets/icons/user-large.png" 
          />
          <Text className="login-text">登录账号以获取更多功能</Text>
          <Button 
            variant="primary" 
            size="lg"
            glow
            onClick={handleLogin}
          >
            立即登录
          </Button>
        </LoginPrompt>
      )}
      
      {/* Stats Bar */}
      {userStore.isLoggedIn && (
        <StatsBar>
          <View className="stat-item">
            <Text className="stat-value">{userStore.favorites.length}</Text>
            <Text className="stat-label">收藏</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">{userStore.viewHistory.length}</Text>
            <Text className="stat-label">浏览</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">{MOCK_ORDERS.length}</Text>
            <Text className="stat-label">订单</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">{cartStore.items.length}</Text>
            <Text className="stat-label">购物车</Text>
          </View>
        </StatsBar>
      )}
      
      {/* Menu Section */}
      <MenuSection>
        <Text className="section-title">我的服务</Text>
        <MenuGrid>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/orders?status=pending' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/pending.png" 
            />
            <Text className="menu-label">待付款</Text>
          </View>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/orders?status=shipping' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/shipping.png" 
            />
            <Text className="menu-label">待发货</Text>
          </View>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/orders?status=delivered' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/delivered.png" 
            />
            <Text className="menu-label">待收货</Text>
          </View>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/orders?status=review' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/review.png" 
            />
            <Text className="menu-label">待评价</Text>
          </View>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/address' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/address.png" 
            />
            <Text className="menu-label">地址管理</Text>
          </View>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/customer-service' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/service.png" 
            />
            <Text className="menu-label">客户服务</Text>
          </View>
          <View className="menu-item" onClick={() => Taro.navigateTo({ url: '/pages/user/coupons' })}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/coupon.png" 
            />
            <Text className="menu-label">优惠券</Text>
          </View>
          <View className="menu-item" onClick={handleSettings}>
            <Image 
              className="menu-icon" 
              src="/assets/icons/settings-menu.png" 
            />
            <Text className="menu-label">设置</Text>
          </View>
        </MenuGrid>
      </MenuSection>
      
      <Divider />
      
      {/* Orders Section */}
      {userStore.isLoggedIn && (
        <OrderSection>
          <View className="section-header">
            <Text className="section-title">我的订单</Text>
            <Text className="view-all" onClick={handleViewAllOrders}>查看全部</Text>
          </View>
          
          {MOCK_ORDERS.length > 0 ? (
            MOCK_ORDERS.map(order => (
              <OrderCard key={order.id} onClick={() => handleOrderClick(order.id)}>
                <View className="order-header">
                  <Text className="order-id">订单号: {order.id}</Text>
                  <Text className="order-status">{order.status}</Text>
                </View>
                <View className="order-items">
                  {order.items.slice(0, 3).map((item, index) => (
                    <Image 
                      key={index}
                      className="order-image" 
                      src={item.image} 
                    />
                  ))}
                  {order.items.length > 3 && (
                    <View className="more-items">
                      <Text className="more-text">+{order.items.length - 3}</Text>
                    </View>
                  )}
                </View>
                <View className="order-footer">
                  <Text className="order-total">
                    共{order.items.length}件商品 合计: <Text className="total-value">¥{order.total.toFixed(2)}</Text>
                  </Text>
                  <Button 
                    variant="secondary" 
                    size="sm"
                  >
                    查看详情
                  </Button>
                </View>
              </OrderCard>
            ))
          ) : (
            <EmptyState>
              <View className="empty-icon">📦</View>
              <Text className="empty-text">暂无订单</Text>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
              >
                去购物
              </Button>
            </EmptyState>
          )}
        </OrderSection>
      )}
      
      <Divider />
      
      {/* Favorites Section */}
      <ProductSection>
        <View className="section-header">
          <Text className="section-title">我的收藏</Text>
          <Text className="view-all" onClick={handleViewAllFavorites}>查看全部</Text>
        </View>
        
        {favoriteProducts.length > 0 ? (
          <ProductRow scrollX scrollWithAnimation>
            {favoriteProducts.map(product => (
              <View key={product.id} className="product-item">
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  variant="compact"
                />
              </View>
            ))}
          </ProductRow>
        ) : (
          <EmptyState>
            <View className="empty-icon">❤️</View>
            <Text className="empty-text">暂无收藏商品</Text>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
            >
              去收藏
            </Button>
          </EmptyState>
        )}
      </ProductSection>
      
      <Divider />
      
      {/* View History Section */}
      <ProductSection>
        <View className="section-header">
          <Text className="section-title">最近浏览</Text>
          <Text className="view-all" onClick={handleViewAllHistory}>查看全部</Text>
        </View>
        
        {historyProducts.length > 0 ? (
          <ProductRow scrollX scrollWithAnimation>
            {historyProducts.map(product => (
              <View key={product.id} className="product-item">
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  variant="compact"
                />
              </View>
            ))}
          </ProductRow>
        ) : (
          <EmptyState>
            <View className="empty-icon">👁️</View>
            <Text className="empty-text">暂无浏览记录</Text>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
            >
              去浏览
            </Button>
          </EmptyState>
        )}
      </ProductSection>
      
      {/* Logout Button (only if logged in) */}
      {userStore.isLoggedIn && (
        <View style={{ padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleLogout}
            style={{ width: '100%' }}
          >
            退出登录
          </Button>
        </View>
      )}
    </UserCenterContainer>
  );
});

export default UserCenterPage;
