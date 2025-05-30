/**
 * Store context provider for Yunnan Taste Mini-Program
 * Provides global state access using MobX and React Context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore, RootStore } from './RootStore';
import { View } from '@tarojs/components';
import { Loading } from '../components/Loading';

// Create context
const StoreContext = createContext<RootStore | null>(null);

// Provider props
interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Store provider component
 * Wraps the application and provides access to all stores
 */
export const StoreProvider: React.FC<StoreProviderProps> = observer(({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Hydrate stores on mount
  useEffect(() => {
    const hydrateStores = async () => {
      await rootStore.hydrate();
      setIsHydrated(true);
    };
    
    hydrateStores();
  }, []);
  
  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <View style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Loading size="lg" variant="dots" text="初始化中..." />
      </View>
    );
  }
  
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
      
      {/* Global UI elements */}
      {rootStore.uiStore.isLoading && (
        <View style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }}>
          <Loading size="lg" variant="dots" text={rootStore.uiStore.loadingText} />
        </View>
      )}
      
      {rootStore.uiStore.toastVisible && (
        <View style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          borderRadius: '4px',
          backgroundColor: (() => {
            switch (rootStore.uiStore.toastType) {
              case 'success': return 'var(--color-success)';
              case 'warning': return 'var(--color-warning)';
              case 'error': return 'var(--color-error)';
              default: return 'var(--color-primary)';
            }
          })(),
          color: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 9999
        }}>
          {rootStore.uiStore.toastMessage}
        </View>
      )}
      
      {rootStore.uiStore.modalVisible && rootStore.uiStore.modalContent && (
        <View style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }}>
          <View style={{
            width: '80%',
            maxWidth: '600px',
            backgroundColor: 'var(--color-backgroundAlt)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {rootStore.uiStore.modalContent}
          </View>
        </View>
      )}
    </StoreContext.Provider>
  );
});

/**
 * Hook to use the store
 * Provides access to all stores
 */
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};

/**
 * Hooks for individual stores
 * Provide convenient access to specific stores
 */
export const useProductStore = () => useStore().productStore;
export const useUserStore = () => useStore().userStore;
export const useCartStore = () => useStore().cartStore;
export const useUIStore = () => useStore().uiStore;
