/**
 * Product Detail Page for Yunnan Taste Mini-Program
 * Displays comprehensive product information and enables purchase
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import Taro, { useRouter } from '@tarojs/taro';
import { useProductStore, useCartStore, useUserStore, useUIStore } from '@/store/StoreContext';

// Components
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { ProductCard } from '@/components/ProductCard';
import { Divider } from '@/components/Divider';

// Styled components
const ProductDetailContainer = styled(ScrollView)`
  min-height: 100vh;
  background-color: var(--color-background);
  padding-bottom: 80px; /* Space for action bar */
`;

const ImageGallery = styled(Swiper)`
  width: 100%;
  height: 400px;
  
  .swiper-item {
    width: 100%;
    height: 100%;
  }
  
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GalleryIndicator = styled(View)`
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs) var(--spacing-sm);
  z-index: 10;
  
  .indicator-text {
    color: var(--color-textInverse);
    font-size: var(--font-size-sm);
  }
`;

const BackButton = styled(View)`
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
  
  .back-icon {
    width: 20px;
    height: 20px;
  }
`;

const ShareButton = styled(View)`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  
  .share-icon {
    width: 20px;
    height: 20px;
  }
`;

const ProductInfo = styled(View)`
  padding: var(--spacing-lg);
  background-color: var(--color-backgroundAlt);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 5;
  
  .price-container {
    display: flex;
    align-items: baseline;
    margin-bottom: var(--spacing-sm);
    
    .current-price {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent1);
      margin-right: var(--spacing-sm);
    }
    
    .original-price {
      font-size: var(--font-size-md);
      color: var(--color-textSecondary);
      text-decoration: line-through;
    }
    
    .discount-tag {
      margin-left: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: var(--color-accent1);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--color-textInverse);
    }
  }
  
  .title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-sm);
  }
  
  .stats-container {
    display: flex;
    margin-bottom: var(--spacing-md);
    
    .stat {
      margin-right: var(--spacing-lg);
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      
      .stat-value {
        color: var(--color-textPrimary);
        font-weight: var(--font-weight-medium);
      }
    }
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-md);
    
    .tag {
      margin-right: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-xs) var(--spacing-sm);
      background-color: var(--color-backgroundDark);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--color-textSecondary);
    }
  }
`;

const SpecificationSection = styled(View)`
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  
  .section-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-md);
  }
  
  .spec-group {
    margin-bottom: var(--spacing-lg);
    
    .spec-name {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      margin-bottom: var(--spacing-sm);
    }
    
    .spec-options {
      display: flex;
      flex-wrap: wrap;
      
      .spec-option {
        margin-right: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        border: 1px solid var(--color-border);
        
        &.selected {
          background-color: var(--color-primary);
          color: var(--color-textInverse);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }
        
        &:not(.selected) {
          color: var(--color-textPrimary);
          background-color: var(--color-backgroundAlt);
        }
      }
    }
  }
  
  .quantity-selector {
    display: flex;
    align-items: center;
    margin-top: var(--spacing-md);
    
    .quantity-label {
      font-size: var(--font-size-sm);
      color: var(--color-textSecondary);
      margin-right: var(--spacing-md);
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      
      .quantity-button {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        background-color: var(--color-backgroundAlt);
        display: flex;
        justify-content: center;
        align-items: center;
        
        &.disabled {
          opacity: 0.5;
        }
      }
      
      .quantity-value {
        width: 50px;
        text-align: center;
        font-size: var(--font-size-md);
        color: var(--color-textPrimary);
      }
    }
  }
`;

const DescriptionSection = styled(View)`
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  
  .section-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-md);
  }
  
  .description-content {
    font-size: var(--font-size-sm);
    color: var(--color-textSecondary);
    line-height: 1.6;
  }
`;

const RelatedSection = styled(View)`
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  
  .section-title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-textPrimary);
    margin-bottom: var(--spacing-md);
  }
`;

const RelatedCarousel = styled(ScrollView)`
  white-space: nowrap;
  
  .carousel-item {
    display: inline-block;
    width: 160px;
    margin-right: var(--spacing-md);
    vertical-align: top;
  }
`;

const ActionBar = styled(View)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: var(--color-backgroundAlt);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  
  .action-buttons {
    display: flex;
    flex: 1;
    
    .action-button {
      flex: 1;
      margin-left: var(--spacing-sm);
    }
  }
  
  .icon-buttons {
    display: flex;
    
    .icon-button {
      width: 50px;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: var(--spacing-md);
      
      .icon {
        width: 24px;
        height: 24px;
        margin-bottom: 4px;
      }
      
      .icon-text {
        font-size: var(--font-size-xs);
        color: var(--color-textSecondary);
      }
    }
  }
`;

// Product detail page component
const ProductDetailPage: React.FC = observer(() => {
  const router = useRouter();
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const uiStore = useUIStore();
  
  // Local state
  const [productId, setProductId] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  
  // Get product ID from route params
  useEffect(() => {
    const { id } = router.params;
    if (id) {
      setProductId(id);
      loadProduct(id);
    }
  }, [router.params]);
  
  // Load product data
  const loadProduct = async (id: string) => {
    const product = await productStore.fetchProduct(id);
    
    // Add to view history
    if (product) {
      userStore.addToViewHistory(id);
      
      // Initialize selected specs with first option of each specification
      if (product.specifications) {
        const initialSpecs: Record<string, string> = {};
        product.specifications.forEach(spec => {
          if (spec.options.length > 0) {
            initialSpecs[spec.name] = spec.options[0];
          }
        });
        setSelectedSpecs(initialSpecs);
      }
    }
  };
  
  // Get current product
  const product = productId ? productStore.getProduct(productId) : null;
  
  // Check if product is in favorites
  const isFavorite = productId ? userStore.isFavorite(productId) : false;
  
  // Handle image change
  const handleImageChange = (e) => {
    setCurrentImage(e.detail.current);
  };
  
  // Handle back button
  const handleBack = () => {
    Taro.navigateBack();
  };
  
  // Handle share button
  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true
    });
  };
  
  // Handle specification selection
  const handleSpecSelect = (specName: string, option: string) => {
    setSelectedSpecs({
      ...selectedSpecs,
      [specName]: option
    });
  };
  
  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    const success = await cartStore.addItem(product.id, quantity, selectedSpecs);
    
    if (success) {
      uiStore.showToast('已添加到购物车', 'success');
    }
  };
  
  // Handle buy now
  const handleBuyNow = async () => {
    if (!product) return;
    
    const success = await cartStore.addItem(product.id, quantity, selectedSpecs);
    
    if (success) {
      cartStore.startCheckout();
      Taro.navigateTo({ url: '/pages/order/checkout' });
    }
  };
  
  // Handle toggle favorite
  const handleToggleFavorite = () => {
    if (productId) {
      userStore.toggleFavorite(productId);
      
      if (!isFavorite) {
        uiStore.showToast('已添加到收藏', 'success');
      }
    }
  };
  
  // Loading state
  if (!product) {
    return (
      <View style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Loading size="lg" variant="dots" text="加载商品信息..." />
      </View>
    );
  }
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;
  
  return (
    <View>
      <ProductDetailContainer scrollY>
        {/* Image Gallery */}
        <ImageGallery
          indicatorDots
          autoplay
          interval={5000}
          duration={500}
          circular
          onChange={handleImageChange}
        >
          {(product.images || [product.image]).map((image, index) => (
            <SwiperItem key={index} className="swiper-item">
              <Image 
                className="product-image" 
                src={image} 
                mode="aspectFill"
              />
            </SwiperItem>
          ))}
        </ImageGallery>
        
        {/* Gallery Indicator */}
        <GalleryIndicator>
          <Text className="indicator-text">
            {currentImage + 1}/{(product.images || [product.image]).length}
          </Text>
        </GalleryIndicator>
        
        {/* Back Button */}
        <BackButton onClick={handleBack}>
          <Image 
            className="back-icon" 
            src="/assets/icons/back.png"
          />
        </BackButton>
        
        {/* Share Button */}
        <ShareButton onClick={handleShare}>
          <Image 
            className="share-icon" 
            src="/assets/icons/share.png"
          />
        </ShareButton>
        
        {/* Product Info */}
        <ProductInfo>
          <View className="price-container">
            <Text className="current-price">¥{product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text className="original-price">¥{product.originalPrice.toFixed(2)}</Text>
            )}
            {discountPercentage > 0 && (
              <Text className="discount-tag">{discountPercentage}% OFF</Text>
            )}
          </View>
          
          <Text className="title">{product.title}</Text>
          
          <View className="stats-container">
            {product.sold !== undefined && (
              <View className="stat">
                已售 <Text className="stat-value">{product.sold}</Text>
              </View>
            )}
            {product.rating !== undefined && (
              <View className="stat">
                评分 <Text className="stat-value">{product.rating}</Text>
              </View>
            )}
          </View>
          
          {product.tags && product.tags.length > 0 && (
            <View className="tags-container">
              {product.tags.map((tag, index) => (
                <Text key={index} className="tag">{tag}</Text>
              ))}
            </View>
          )}
        </ProductInfo>
        
        <Divider />
        
        {/* Specifications Section */}
        {product.specifications && product.specifications.length > 0 && (
          <SpecificationSection>
            <Text className="section-title">规格选择</Text>
            
            {product.specifications.map((spec, index) => (
              <View key={index} className="spec-group">
                <Text className="spec-name">{spec.name}</Text>
                <View className="spec-options">
                  {spec.options.map((option, optIndex) => (
                    <Text 
                      key={optIndex} 
                      className={`spec-option ${selectedSpecs[spec.name] === option ? 'selected' : ''}`}
                      onClick={() => handleSpecSelect(spec.name, option)}
                    >
                      {option}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
            
            <View className="quantity-selector">
              <Text className="quantity-label">数量</Text>
              <View className="quantity-controls">
                <View 
                  className={`quantity-button ${quantity <= 1 ? 'disabled' : ''}`}
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Text>-</Text>
                </View>
                <Text className="quantity-value">{quantity}</Text>
                <View 
                  className="quantity-button"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Text>+</Text>
                </View>
              </View>
            </View>
          </SpecificationSection>
        )}
        
        <Divider />
        
        {/* Description Section */}
        {product.description && (
          <DescriptionSection>
            <Text className="section-title">商品详情</Text>
            <Text className="description-content">{product.description}</Text>
          </DescriptionSection>
        )}
        
        <Divider />
        
        {/* Related Products Section */}
        <RelatedSection>
          <Text className="section-title">相关推荐</Text>
          <RelatedCarousel scrollX scrollWithAnimation>
            {productStore.featuredProducts
              .filter(id => id !== productId)
              .map(id => productStore.getProduct(id))
              .filter(Boolean)
              .slice(0, 6)
              .map(relatedProduct => (
                <View key={relatedProduct.id} className="carousel-item">
                  <ProductCard
                    id={relatedProduct.id}
                    title={relatedProduct.title}
                    price={relatedProduct.price}
                    originalPrice={relatedProduct.originalPrice}
                    image={relatedProduct.image}
                    variant="compact"
                  />
                </View>
              ))}
          </RelatedCarousel>
        </RelatedSection>
      </ProductDetailContainer>
      
      {/* Action Bar */}
      <ActionBar>
        <View className="icon-buttons">
          <View className="icon-button" onClick={handleToggleFavorite}>
            <Image 
              className="icon" 
              src={isFavorite ? '/assets/icons/favorite-filled.png' : '/assets/icons/favorite.png'}
            />
            <Text className="icon-text">收藏</Text>
          </View>
          <View className="icon-button" onClick={() => Taro.switchTab({ url: '/pages/cart/index' })}>
            <Image 
              className="icon" 
              src="/assets/icons/cart.png"
            />
            <Text className="icon-text">购物车</Text>
          </View>
        </View>
        <View className="action-buttons">
          <Button 
            className="action-button"
            variant="secondary" 
            size="lg"
            onClick={handleAddToCart}
          >
            加入购物车
          </Button>
          <Button 
            className="action-button"
            variant="primary" 
            size="lg"
            glow
            onClick={handleBuyNow}
          >
            立即购买
          </Button>
        </View>
      </ActionBar>
    </View>
  );
});

export default ProductDetailPage;
