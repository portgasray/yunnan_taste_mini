/**
 * Theme system type definitions for Yunnan Taste Mini-Program
 * Supports the Bioluminescent Forest theme and future theme expansion
 */

// Color palette types
export interface ColorPalette {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent1: string;
  accent2: string;
  accent3: string;
  
  // Functional colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Background colors
  background: string;
  backgroundAlt: string;
  backgroundDark: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  
  // Border colors
  border: string;
  borderLight: string;
  divider: string;
}

// Typography types
export interface Typography {
  fontFamily: {
    primary: string;
    secondary: string;
  };
  
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    display: string;
  };
  
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

// Spacing types
export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

// Border types
export interface Borders {
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  
  width: {
    none: string;
    thin: string;
    normal: string;
    thick: string;
  };
}

// Shadow and glow effects
export interface Effects {
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
  };
  
  glows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    pulse: string;
  };
  
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

// Animation types
export interface Animations {
  durations: {
    fast: string;
    normal: string;
    slow: string;
    verySlow: string;
  };
  
  easings: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
  };
  
  transitions: {
    default: string;
    fade: string;
    scale: string;
    slide: string;
    glow: string;
  };
}

// Complete theme type
export type Theme = {
  id: string;
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borders: Borders;
  effects: Effects;
  animations: Animations;
}

// Theme context type
export type ThemeContextType = {
  theme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: string[];
}
