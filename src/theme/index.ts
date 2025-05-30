/**
 * Theme index file for Yunnan Taste Mini-Program
 * Exports all theme-related components and utilities
 */

// Use 'export type' for TypeScript types
export type { Theme, ThemeContextType } from './types';

// Export components and utilities as values
import { ThemeProvider, useTheme } from './ThemeContext';
import bioluminescentForestTheme from './bioluminescent-forest';
import themeUtils from './utils';

export {
  ThemeProvider,
  useTheme,
  bioluminescentForestTheme,
  themeUtils
};

// Default export for convenience
export default {
  ThemeProvider,
  useTheme,
  bioluminescentForestTheme,
  themeUtils
};
