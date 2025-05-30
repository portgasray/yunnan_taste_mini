/**
 * Unit test for ProductCard component
 * Tests rendering, interactions, and state changes
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../components/ProductCard';

// Mock props
const mockProduct = {
  id: '1',
  title: 'Yunnan Black Tea',
  price: 68.00,
  originalPrice: 88.00,
  image: 'https://example.com/tea.jpg',
  tags: ['Organic', 'Premium'],
  rating: 4.8,
  sales: 1200,
  isNew: true,
  isFavorite: false
};

describe('ProductCard Component', () => {
  // Test basic rendering
  test('renders product information correctly', () => {
    const { getByText, getByAltText } = render(<ProductCard product={mockProduct} />);
    
    expect(getByText('Yunnan Black Tea')).toBeTruthy();
    expect(getByText('¥68.00')).toBeTruthy();
    expect(getByText('¥88.00')).toBeTruthy();
    expect(getByText('Organic')).toBeTruthy();
    expect(getByText('Premium')).toBeTruthy();
    expect(getByText('4.8')).toBeTruthy();
    expect(getByText('1200 sold')).toBeTruthy();
    expect(getByAltText('Yunnan Black Tea')).toBeTruthy();
  });

  // Test different variants
  test('renders different variants correctly', () => {
    const { getByTestId, rerender } = render(
      <ProductCard product={mockProduct} variant="default" data-testid="product-card" />
    );
    expect(getByTestId('product-card').className).toContain('default');
    
    rerender(<ProductCard product={mockProduct} variant="horizontal" data-testid="product-card" />);
    expect(getByTestId('product-card').className).toContain('horizontal');
    
    rerender(<ProductCard product={mockProduct} variant="compact" data-testid="product-card" />);
    expect(getByTestId('product-card').className).toContain('compact');
  });

  // Test discount calculation
  test('calculates and displays discount percentage correctly', () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    // 68 is ~23% off from 88
    expect(getByText('-23%')).toBeTruthy();
  });

  // Test new badge
  test('displays new badge when product is new', () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    expect(getByText('New')).toBeTruthy();
  });

  // Test without new badge
  test('does not display new badge when product is not new', () => {
    const product = { ...mockProduct, isNew: false };
    const { queryByText } = render(<ProductCard product={product} />);
    expect(queryByText('New')).toBeNull();
  });

  // Test favorite toggle
  test('calls onFavoriteToggle when favorite button is clicked', () => {
    const handleFavoriteToggle = jest.fn();
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        onFavoriteToggle={handleFavoriteToggle}
        data-testid="product-card"
      />
    );
    
    fireEvent.click(getByTestId('favorite-button'));
    expect(handleFavoriteToggle).toHaveBeenCalledWith('1', true);
  });

  // Test click handler
  test('calls onClick handler when card is clicked', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <ProductCard 
        product={mockProduct} 
        onClick={handleClick}
        data-testid="product-card"
      />
    );
    
    fireEvent.click(getByTestId('product-card'));
    expect(handleClick).toHaveBeenCalledWith(mockProduct);
  });

  // Test loading state
  test('renders skeleton loader when in loading state', () => {
    const { container } = render(<ProductCard loading />);
    expect(container.querySelector('.skeleton-loader')).toBeTruthy();
  });

  // Test error state
  test('renders error state correctly', () => {
    const { getByText } = render(<ProductCard error="Failed to load product" />);
    expect(getByText('Failed to load product')).toBeTruthy();
  });

  // Test with missing price
  test('handles missing price gracefully', () => {
    const product = { ...mockProduct, price: undefined, originalPrice: undefined };
    const { queryByText } = render(<ProductCard product={product} />);
    
    expect(queryByText('¥68.00')).toBeNull();
    expect(queryByText('¥88.00')).toBeNull();
    expect(queryByText('-23%')).toBeNull();
  });

  // Test with missing image
  test('displays placeholder when image is missing', () => {
    const product = { ...mockProduct, image: undefined };
    const { container } = render(<ProductCard product={product} />);
    
    expect(container.querySelector('.image-placeholder')).toBeTruthy();
  });

  // Test accessibility
  test('has appropriate ARIA attributes', () => {
    const { getByRole } = render(<ProductCard product={mockProduct} />);
    const card = getByRole('button');
    
    expect(card).toHaveAttribute('aria-label', 'Yunnan Black Tea, ¥68.00');
  });
});
