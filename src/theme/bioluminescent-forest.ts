/**
 * Bioluminescent Forest Theme Implementation
 * Based on the magical nighttime forest with glowing elements concept
 */

import { Theme } from './types';

export const bioluminescentForestTheme: Theme = {
  id: 'bioluminescent-forest',
  name: 'Bioluminescent Forest',
  
  colors: {
    // Primary colors - deep blue-green tones
    primary: '#0A3B3C',
    primaryLight: '#1A5859',
    primaryDark: '#052728',
    
    // Secondary colors - teal accents
    secondary: '#06D6A0',
    secondaryLight: '#39E8BC',
    secondaryDark: '#05B384',
    
    // Accent colors - bioluminescent glows
    accent1: '#26F7C7', // cyan glow
    accent2: '#4CC9F0', // blue glow
    accent3: '#F72585', // magenta glow (rare flower)
    
    // Functional colors
    success: '#06D6A0',
    warning: '#F9C846',
    error: '#F72585',
    info: '#4CC9F0',
    
    // Background colors - dark forest tones
    background: '#041F20',
    backgroundAlt: '#072F30',
    backgroundDark: '#031516',
    
    // Text colors
    textPrimary: '#E9F5F5',
    textSecondary: '#B7DBDB',
    textDisabled: '#6A9797',
    textInverse: '#041F20',
    
    // Border colors
    border: '#0A3B3C',
    borderLight: '#1A5859',
    divider: '#0D4546'
  },
  
  typography: {
    fontFamily: {
      primary: 'PingFang SC, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, Arial, Roboto, sans-serif',
      secondary: 'Georgia, serif'
    },
    
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      display: '32px'
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  borders: {
    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      full: '9999px'
    },
    
    width: {
      none: '0',
      thin: '1px',
      normal: '2px',
      thick: '4px'
    }
  },
  
  effects: {
    shadows: {
      none: 'none',
      sm: '0 2px 4px rgba(3, 21, 22, 0.3)',
      md: '0 4px 8px rgba(3, 21, 22, 0.4)',
      lg: '0 8px 16px rgba(3, 21, 22, 0.5)'
    },
    
    glows: {
      none: 'none',
      sm: '0 0 4px rgba(38, 247, 199, 0.4)',
      md: '0 0 8px rgba(38, 247, 199, 0.6)',
      lg: '0 0 16px rgba(38, 247, 199, 0.8)',
      pulse: '0 0 20px rgba(38, 247, 199, 0.8)'
    },
    
    gradients: {
      primary: 'linear-gradient(135deg, #0A3B3C 0%, #1A5859 100%)',
      secondary: 'linear-gradient(135deg, #05B384 0%, #06D6A0 100%)',
      accent: 'linear-gradient(135deg, #26F7C7 0%, #4CC9F0 100%)',
      background: 'linear-gradient(180deg, #041F20 0%, #031516 100%)'
    }
  },
  
  animations: {
    durations: {
      fast: '0.2s',
      normal: '0.4s',
      slow: '0.8s',
      verySlow: '2s'
    },
    
    easings: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
    },
    
    transitions: {
      default: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      fade: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      scale: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      slide: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      glow: '2s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

export default bioluminescentForestTheme;
