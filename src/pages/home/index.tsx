/**
 * Home Page for Yunnan Taste Mini-Program
 * Showcases featured products, categories, and content with Bioluminescent Forest theme
 */

import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { styled } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useProductStore, useUIStore } from '@/store/StoreContext';

// Components
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { ProductCard } from '@/components/ProductCard';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryCard } from '@/components/CategoryCard';
import { HeritageCard } from '@/components/HeritageCard';
import { ArticleCard } from '@/components/ArticleCard';
import { Divider } from '@/components/Divider';

// Styled components
const HomeContainer = styled(ScrollView)`
  min-height: 100vh;
  background-color: var(--color-background);
`;

const HeroBanner = styled(View)`
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden;
  
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.7)
    );
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: var(--spacing-xl);
  }
  
  .hero-title {
    color: var(--color-textInverse);
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-sm);
    text-shadow: var(--shadow-text);
  }
  
  .hero-subtitle {
    color: var(--color-textInverse);
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-lg);
    text-shadow: var(--shadow-text);
    opacity: 0.9;
  }
  
  .hero-button {
    align-self: flex-start;
  }
  
  .bioluminescent-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
`;

const SectionContainer = styled(View)`
  padding: var(--spacing-xl);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-textPrimary);
    }
    
    .section-action {
      font-size: var(--font-size-sm);
      color: var(--color-primary);
    }
  }
`;

const ProductCarousel = styled(ScrollView)`
  white-space: nowrap;
  margin: 0 calc(-1 * var(--spacing-md));
  padding: 0 var(--spacing-md);
  
  .carousel-item {
    display: inline-block;
    width: 200px;
    margin-right: var(--spacing-md);
    vertical-align: top;
  }
`;

const CategoryGrid = styled(View)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
`;

const ContentGrid = styled(View)`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
`;

// Bioluminescent particles component
const BioluminescentParticles = () => {
  return (
    <canvas className="bioluminescent-particles" id="particles-canvas" />
  );
};

// Home page component
const HomePage: React.FC = observer(() => {
  const productStore = useProductStore();
  const uiStore = useUIStore();
  
  // Initialize particles animation on mount
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (canvas) {
      initParticlesAnimation(canvas);
    }
    
    // Fetch data on mount
    productStore.fetchFeaturedProducts();
    productStore.fetchNewProducts();
    productStore.fetchCategories();
    
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
      canvas.width = window.innerWidth;
      canvas.height = 400; // Match hero banner height
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
        uiStore.currentTheme.colors.accent1,
        uiStore.currentTheme.colors.accent2,
        uiStore.currentTheme.colors.accent3,
        uiStore.currentTheme.colors.primary
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
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
  
  // Render featured products section
  const renderFeaturedProducts = () => {
    if (productStore.isLoadingFeatured) {
      return <Loading size="md" />;
    }
    
    const featuredProducts = productStore.featuredProducts.map(id => 
      productStore.getProduct(id)
    ).filter(Boolean);
    
    if (featuredProducts.length === 0) {
      return (
        <Card>
          <Text>暂无精选商品</Text>
        </Card>
      );
    }
    
    return (
      <ProductCarousel scrollX scrollWithAnimation>
        {featuredProducts.map(product => (
          <View key={product.id} className="carousel-item">
            <ProductCard
              id={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              tags={product.tags}
              rating={product.rating}
            />
          </View>
        ))}
      </ProductCarousel>
    );
  };
  
  // Render new products section
  const renderNewProducts = () => {
    if (productStore.isLoadingNew) {
      return <Loading size="md" />;
    }
    
    const newProducts = productStore.newProducts.map(id => 
      productStore.getProduct(id)
    ).filter(Boolean);
    
    if (newProducts.length === 0) {
      return (
        <Card>
          <Text>暂无新品上市</Text>
        </Card>
      );
    }
    
    return (
      <ProductCarousel scrollX scrollWithAnimation>
        {newProducts.map(product => (
          <View key={product.id} className="carousel-item">
            <ProductCard
              id={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              tags={product.tags}
              rating={product.rating}
              isNew
            />
          </View>
        ))}
      </ProductCarousel>
    );
  };
  
  // Render categories section
  const renderCategories = () => {
    if (productStore.isLoadingCategories) {
      return <Loading size="md" />;
    }
    
    const categories = productStore.rootCategories.map(id => 
      productStore.getCategory(id)
    ).filter(Boolean);
    
    if (categories.length === 0) {
      return (
        <Card>
          <Text>暂无分类</Text>
        </Card>
      );
    }
    
    return (
      <CategoryGrid>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            id={category.id}
            title={category.title}
            image={category.image}
            productCount={category.productCount}
          />
        ))}
      </CategoryGrid>
    );
  };
  
  // Mock heritage items for demo
  const mockHeritageItems = [
    {
      id: 'h1',
      title: '普洱茶制作工艺',
      image: 'https://example.com/heritage1.jpg',
      location: '云南省西双版纳',
      description: '千年传承的普洱茶制作技艺，融合了云南少数民族的智慧'
    },
    {
      id: 'h2',
      title: '傣族织锦技艺',
      image: 'https://example.com/heritage2.jpg',
      location: '云南省德宏州',
      description: '色彩绚丽的傣族织锦，记录着傣族人民的历史与文化'
    }
  ];
  
  // Mock articles for demo
  const mockArticles = [
    {
      id: 'a1',
      title: '云南高山茶的四季采摘指南',
      image: 'https://example.com/article1.jpg',
      author: '茶道专家',
      date: '2025-05-15',
      category: '茶文化',
      summary: '不同季节采摘的高山茶，风味各异，本文为您详解四季茶叶的特点',
      readTime: 5
    },
    {
      id: 'a2',
      title: '探访云南野生菌的秘密森林',
      image: 'https://example.com/article2.jpg',
      author: '美食探险家',
      date: '2025-05-10',
      category: '美食探索',
      summary: '深入云南原始森林，寻找珍稀野生菌的生长环境与采摘技巧',
      readTime: 8
    }
  ];
  
  return (
    <HomeContainer scrollY>
      {/* Hero Banner */}
      <HeroBanner>
        <Image 
          className="hero-image" 
          src="https://example.com/yunnan-hero.jpg" 
          mode="aspectFill"
        />
        <View className="hero-overlay">
          <Text className="hero-title">云南味道</Text>
          <Text className="hero-subtitle">探索云南原生态美食与文化</Text>
          <Button 
            className="hero-button" 
            variant="primary" 
            size="lg"
            glow
          >
            立即探索
          </Button>
        </View>
        <BioluminescentParticles />
      </HeroBanner>
      
      {/* Featured Products Section */}
      <SectionContainer>
        <View className="section-header">
          <Text className="section-title">精选好物</Text>
          <Text className="section-action">查看全部</Text>
        </View>
        {renderFeaturedProducts()}
      </SectionContainer>
      
      <Divider />
      
      {/* Categories Section */}
      <SectionContainer>
        <View className="section-header">
          <Text className="section-title">特色分类</Text>
          <Text className="section-action">全部分类</Text>
        </View>
        {renderCategories()}
      </SectionContainer>
      
      <Divider />
      
      {/* New Products Section */}
      <SectionContainer>
        <View className="section-header">
          <Text className="section-title">新品上市</Text>
          <Text className="section-action">查看全部</Text>
        </View>
        {renderNewProducts()}
      </SectionContainer>
      
      <Divider />
      
      {/* Heritage Section */}
      <SectionContainer>
        <View className="section-header">
          <Text className="section-title">云南非遗</Text>
          <Text className="section-action">探索更多</Text>
        </View>
        <ContentGrid>
          {mockHeritageItems.map(item => (
            <HeritageCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              location={item.location}
              description={item.description}
            />
          ))}
        </ContentGrid>
      </SectionContainer>
      
      <Divider />
      
      {/* Articles Section */}
      <SectionContainer>
        <View className="section-header">
          <Text className="section-title">云南风情</Text>
          <Text className="section-action">更多文章</Text>
        </View>
        <ContentGrid>
          {mockArticles.map(article => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              image={article.image}
              author={article.author}
              date={article.date}
              category={article.category}
              summary={article.summary}
              readTime={article.readTime}
            />
          ))}
        </ContentGrid>
      </SectionContainer>
    </HomeContainer>
  );
});

export default HomePage;
