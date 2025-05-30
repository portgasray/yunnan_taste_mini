/**
 * Global styles for Yunnan Taste Mini-Program
 * Based on the Bioluminescent Forest theme
 */

import { createGlobalStyle } from 'styled-components';
import { Theme } from '../theme/types';
import { themeToCSSVariables } from '../theme/utils';

interface GlobalStyleProps {
  theme: Theme;
}

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  /* CSS Variables from theme */
  :root {
    ${({ theme }) => themeToCSSVariables(theme)}
  }

  /* Base styles */
  page {
    background-color: var(--color-background);
    color: var(--color-textPrimary);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-md);
    line-height: var(--line-height-normal);
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: var(--font-weight-bold);
    color: var(--color-textPrimary);
  }

  h1 {
    font-size: var(--font-size-display);
    line-height: var(--line-height-tight);
  }

  h2 {
    font-size: var(--font-size-xxl);
    line-height: var(--line-height-tight);
  }

  h3 {
    font-size: var(--font-size-xl);
    line-height: var(--line-height-tight);
  }

  h4 {
    font-size: var(--font-size-lg);
    line-height: var(--line-height-normal);
  }

  h5 {
    font-size: var(--font-size-md);
    line-height: var(--line-height-normal);
  }

  h6 {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
  }

  p {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-md);
    line-height: var(--line-height-relaxed);
    color: var(--color-textSecondary);
  }

  a {
    color: var(--color-secondary);
    text-decoration: none;
    transition: color var(--transition-default);
  }

  /* Utility classes */
  .text-primary {
    color: var(--color-textPrimary);
  }

  .text-secondary {
    color: var(--color-textSecondary);
  }

  .text-disabled {
    color: var(--color-textDisabled);
  }

  .text-inverse {
    color: var(--color-textInverse);
  }

  .bg-primary {
    background-color: var(--color-primary);
  }

  .bg-secondary {
    background-color: var(--color-secondary);
  }

  .bg-accent1 {
    background-color: var(--color-accent1);
  }

  .bg-accent2 {
    background-color: var(--color-accent2);
  }

  .bg-accent3 {
    background-color: var(--color-accent3);
  }

  /* Animations */
  @keyframes glow-pulse {
    0% {
      box-shadow: var(--glow-sm);
    }
    50% {
      box-shadow: var(--glow-lg);
    }
    100% {
      box-shadow: var(--glow-sm);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Animation utility classes */
  .animate-glow-pulse {
    animation: glow-pulse 2s infinite;
  }

  .animate-fade-in {
    animation: fade-in var(--duration-normal) var(--easing-easeOut);
  }

  .animate-slide-up {
    animation: slide-up var(--duration-normal) var(--easing-easeOut);
  }
`;

export default GlobalStyle;
