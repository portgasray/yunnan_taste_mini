/**
 * RootStore for Yunnan Taste Mini-Program
 * Implements global state management using MobX
 */

import { makeAutoObservable } from 'mobx';
import { ProductStore } from './ProductStore';
import { UserStore } from './UserStore';
import { CartStore } from './CartStore';
import { UIStore } from './UIStore';

export class RootStore {
  productStore: ProductStore;
  userStore: UserStore;
  cartStore: CartStore;
  uiStore: UIStore;

  constructor() {
    this.productStore = new ProductStore(this);
    this.userStore = new UserStore(this);
    this.cartStore = new CartStore(this);
    this.uiStore = new UIStore(this);
    
    makeAutoObservable(this);
  }

  /**
   * Hydrate all stores with persisted data
   */
  async hydrate() {
    await Promise.all([
      this.productStore.hydrate(),
      this.userStore.hydrate(),
      this.cartStore.hydrate(),
      this.uiStore.hydrate()
    ]);
  }
}

// Create a singleton instance of the root store
export const rootStore = new RootStore();
