/**
 * Theme utility functions for Yunnan Taste Mini-Program
 * Provides helper functions for working with themes
 */

import Taro from '@tarojs/taro';
import { Theme } from './types';

// Convert theme values to CSS variables
export const themeToVariables = (theme: Theme): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });
  
  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value;
  });
  
  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    variables[`--line-height-${key}`] = value.toString();
  });
  
  variables['--font-family-primary'] = theme.typography.fontFamily.primary;
  variables['--font-family-secondary'] = theme.typography.fontFamily.secondary;
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  // Borders
  Object.entries(theme.borders.radius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value;
  });
  
  Object.entries(theme.borders.width).forEach(([key, value]) => {
    variables[`--border-width-${key}`] = value;
  });
  
  // Effects
  Object.entries(theme.effects.shadows).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });
  
  Object.entries(theme.effects.glows).forEach(([key, value]) => {
    variables[`--glow-${key}`] = value;
  });
  
  Object.entries(theme.effects.gradients).forEach(([key, value]) => {
    variables[`--gradient-${key}`] = value;
  });
  
  // Animations
  Object.entries(theme.animations.durations).forEach(([key, value]) => {
    variables[`--duration-${key}`] = value;
  });
  
  Object.entries(theme.animations.easings).forEach(([key, value]) => {
    variables[`--easing-${key}`] = value;
  });
  
  Object.entries(theme.animations.transitions).forEach(([key, value]) => {
    variables[`--transition-${key}`] = value;
  });
  
  return variables;
};

// Generate CSS variable string for inline styles
export const themeToCSSVariables = (theme: Theme): string => {
  const variables = themeToVariables(theme);
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
};

// Apply theme to root element
export const applyThemeToRoot = (theme: Theme): void => {
  const variables = themeToVariables(theme);
  
  // For mini-program, we need to use inline styles
  // This is a limitation of the mini-program environment
  const page = Taro.getCurrentInstance().page;
  if (page) {
    const root = page.root;
    if (root) {
      const style = Object.entries(variables)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ');
      
      root.setAttribute('style', style);
    }
  }
};

// Get theme-based style object for components
export const getThemeStyle = (theme: Theme, componentName: string): Record<string, string> => {
  // Component-specific styling based on theme
  const componentStyles: Record<string, Record<string, string>> = {
    button: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textInverse,
      borderRadius: theme.borders.radius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.md,
      transition: theme.animations.transitions.default,
    },
    card: {
      backgroundColor: theme.colors.backgroundAlt,
      borderRadius: theme.borders.radius.lg,
      padding: theme.spacing.md,
      boxShadow: theme.effects.shadows.md,
    },
    // Add more component styles as needed
  };
  
  return componentStyles[componentName] || {};
};

export default {
  themeToVariables,
  themeToCSSVariables,
  applyThemeToRoot,
  getThemeStyle,
};
