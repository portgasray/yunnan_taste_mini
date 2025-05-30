/**
 * Unit test for Button component
 * Tests rendering, interactions, and accessibility
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../../components/Button';

describe('Button Component', () => {
  // Test rendering with different variants
  test('renders with primary variant correctly', () => {
    const { getByText } = render(<Button variant="primary">Primary Button</Button>);
    const buttonElement = getByText('Primary Button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.className).toContain('primary');
  });

  test('renders with secondary variant correctly', () => {
    const { getByText } = render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = getByText('Secondary Button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.className).toContain('secondary');
  });

  test('renders with accent variant correctly', () => {
    const { getByText } = render(<Button variant="accent">Accent Button</Button>);
    const buttonElement = getByText('Accent Button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.className).toContain('accent');
  });

  test('renders with outline variant correctly', () => {
    const { getByText } = render(<Button variant="outline">Outline Button</Button>);
    const buttonElement = getByText('Outline Button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.className).toContain('outline');
  });

  test('renders with ghost variant correctly', () => {
    const { getByText } = render(<Button variant="ghost">Ghost Button</Button>);
    const buttonElement = getByText('Ghost Button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.className).toContain('ghost');
  });

  // Test size variations
  test('renders with different sizes correctly', () => {
    const { getByText, rerender } = render(<Button size="sm">Small Button</Button>);
    expect(getByText('Small Button').className).toContain('sm');
    
    rerender(<Button size="md">Medium Button</Button>);
    expect(getByText('Medium Button').className).toContain('md');
    
    rerender(<Button size="lg">Large Button</Button>);
    expect(getByText('Large Button').className).toContain('lg');
  });

  // Test disabled state
  test('renders disabled button correctly', () => {
    const { getByText } = render(<Button disabled>Disabled Button</Button>);
    const buttonElement = getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement.className).toContain('disabled');
  });

  // Test glow effect
  test('renders with glow effect when specified', () => {
    const { getByText } = render(<Button glow>Glowing Button</Button>);
    const buttonElement = getByText('Glowing Button');
    expect(buttonElement.className).toContain('glow');
  });

  // Test click handler
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick}>Clickable Button</Button>);
    fireEvent.click(getByText('Clickable Button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test that disabled button doesn't trigger click handler
  test('does not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    fireEvent.click(getByText('Disabled Button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Test loading state
  test('renders loading state correctly', () => {
    const { getByText, container } = render(<Button loading>Loading Button</Button>);
    const buttonElement = getByText('Loading Button');
    expect(buttonElement.className).toContain('loading');
    expect(container.querySelector('.loading-indicator')).toBeTruthy();
  });

  // Test with icon
  test('renders with icon correctly', () => {
    const { container } = render(
      <Button icon={<span data-testid="test-icon">Icon</span>}>
        Button with Icon
      </Button>
    );
    expect(container.querySelector('[data-testid="test-icon"]')).toBeTruthy();
  });

  // Test block display
  test('renders as block element when specified', () => {
    const { getByText } = render(<Button block>Block Button</Button>);
    const buttonElement = getByText('Block Button');
    expect(buttonElement.className).toContain('block');
  });

  // Test accessibility
  test('has appropriate ARIA attributes', () => {
    const { getByText, rerender } = render(<Button>Normal Button</Button>);
    expect(getByText('Normal Button')).not.toHaveAttribute('aria-disabled');
    
    rerender(<Button disabled>Disabled Button</Button>);
    expect(getByText('Disabled Button')).toHaveAttribute('aria-disabled', 'true');
    
    rerender(<Button loading>Loading Button</Button>);
    expect(getByText('Loading Button')).toHaveAttribute('aria-busy', 'true');
  });
});
