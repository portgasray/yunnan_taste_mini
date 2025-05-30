/**
 * Theme context provider for Yunnan Taste Mini-Program
 * Supports dynamic theme switching and multiple theme options
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theme, ThemeContextType } from './types';
import bioluminescentForestTheme from './bioluminescent-forest';

// Default theme is Bioluminescent Forest
const defaultTheme = bioluminescentForestTheme;

// Available themes registry
const themes: Record<string, Theme> = {
  [bioluminescentForestTheme.id]: bioluminescentForestTheme,
  // Additional themes can be registered here in the future
};

// Create theme context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  availableThemes: Object.keys(themes),
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to track current theme
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  // Theme switching function
  const handleThemeChange = (themeId: string) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
      // Save theme preference to storage
      try {
        Taro.setStorageSync('yunnan_taste_theme', themeId);
      } catch (e) {
        console.error('Failed to save theme preference', e);
      }
    } else {
      console.warn(`Theme "${themeId}" not found, using default theme`);
    }
  };

  // Load saved theme on initial render
  useEffect(() => {
    try {
      const savedThemeId = Taro.getStorageSync('yunnan_taste_theme');
      if (savedThemeId && themes[savedThemeId]) {
        setCurrentTheme(themes[savedThemeId]);
      }
    } catch (e) {
      console.error('Failed to load saved theme', e);
    }
  }, []);

  // Context value
  const contextValue: ThemeContextType = {
    theme: currentTheme,
    setTheme: handleThemeChange,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
