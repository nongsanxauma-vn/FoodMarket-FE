/**
 * Theme Utilities for ChatBot
 * Handles theme detection and switching
 */

import React from 'react';

export type Theme = 'light' | 'dark' | 'auto';

/**
 * Detect user's preferred color scheme
 */
export function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  // Check localStorage first
  const stored = localStorage.getItem('chatbot-theme') as Theme;
  if (stored && ['light', 'dark', 'auto'].includes(stored)) {
    return stored;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  
  // Remove existing theme classes
  root.removeAttribute('data-theme');
  
  if (theme === 'auto') {
    // Use system preference
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Save theme preference
 */
export function saveThemePreference(theme: Theme): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  
  localStorage.setItem('chatbot-theme', theme);
}

/**
 * Initialize theme system
 */
export function initializeTheme(): Theme {
  const theme = getPreferredTheme();
  applyTheme(theme);
  
  // Listen for system theme changes
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const currentTheme = getPreferredTheme();
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange);
    }
  }
  
  return theme;
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const current = getPreferredTheme();
  const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
  
  applyTheme(newTheme);
  saveThemePreference(newTheme);
  
  return newTheme;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get current effective theme (resolves 'auto' to actual theme)
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') {
    return 'light';
  }
  
  const dataTheme = document.documentElement.getAttribute('data-theme');
  return dataTheme === 'dark' ? 'dark' : 'light';
}

/**
 * Theme hook for React components
 */
export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(() => getPreferredTheme());
  
  React.useEffect(() => {
    const currentTheme = initializeTheme();
    setTheme(currentTheme);
  }, []);
  
  const changeTheme = React.useCallback((newTheme: Theme) => {
    applyTheme(newTheme);
    saveThemePreference(newTheme);
    setTheme(newTheme);
  }, []);
  
  const toggle = React.useCallback(() => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
    return newTheme;
  }, []);
  
  return {
    theme,
    setTheme: changeTheme,
    toggleTheme: toggle,
    currentTheme: getCurrentTheme(),
    prefersReducedMotion: prefersReducedMotion(),
    prefersHighContrast: prefersHighContrast()
  };
}

// Import React for the hook
import React from 'react';