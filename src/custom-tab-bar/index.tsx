/**
 * Custom TabBar component for Yunnan Taste Mini-Program
 * Features bioluminescent glow effects and theme integration
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/StoreContext';

// Styled components
const TabBarContainer = styled(View)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 98px;
  background-color: var(--color-backgroundDark);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const TabItem = styled(View)<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 100%;
  position: relative;
  
  .tab-icon {
    width: 28px;
    height: 28px;
    margin-bottom: 4px;
    position: relative;
    z-index: 2;
  }
  
  .tab-text {
    font-size: 12px;
    color: ${props => props.active ? 'var(--color-accent1)' : 'var(--color-textSecondary)'};
    position: relative;
    z-index: 2;
  }
  
  .glow-effect {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      ${props => props.active ? 'var(--color-accent1)' : 'transparent'} 0%,
      transparent 70%
    );
    opacity: ${props => props.active ? 0.3 : 0};
    filter: blur(8px);
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  &:active .glow-effect {
    opacity: 0.5;
    transform: scale(1.2);
  }
`;

const CustomTabBar: React.FC = observer(() => {
  const [selected, setSelected] = useState(0);
  const [tabList, setTabList] = useState([]);
  const store = useStore();
  const uiStore = store.uiStore;
  
  // Get tab bar configuration from app.config.ts
  useEffect(() => {
    const tabInfo = Taro.getApp().config.tabBar;
    if (tabInfo && tabInfo.list) {
      setTabList(tabInfo.list);
    }
    
    // Get current page path to determine active tab
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPath = currentPage ? currentPage.route : '';
    
    // Find index of current path in tab list
    const index = tabInfo.list.findIndex(item => {
      return currentPath.includes(item.pagePath.replace('pages/', ''));
    });
    
    if (index !== -1) {
      setSelected(index);
    }
  }, []);
  
  // Handle tab click
  const handleTabClick = (index: number, pagePath: string) => {
    if (selected !== index) {
      setSelected(index);
      Taro.switchTab({ url: `/${pagePath}` });
    }
  };
  
  return (
    <TabBarContainer>
      {tabList.map((item, index) => (
        <TabItem 
          key={index} 
          active={selected === index}
          onClick={() => handleTabClick(index, item.pagePath)}
        >
          <View className="glow-effect" />
          <Image 
            className="tab-icon" 
            src={selected === index ? item.selectedIconPath : item.iconPath} 
          />
          <Text className="tab-text">{item.text}</Text>
        </TabItem>
      ))}
    </TabBarContainer>
  );
});

export default CustomTabBar;
