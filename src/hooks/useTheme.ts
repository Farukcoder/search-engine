import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // Function to get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  // Function to apply theme to document
  const applyTheme = (appliedTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    
    if (appliedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    setResolvedTheme(appliedTheme);
  };

  // Function to update theme
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    let appliedTheme: 'light' | 'dark';
    
    if (newTheme === 'system') {
      appliedTheme = getSystemTheme();
    } else {
      appliedTheme = newTheme;
    }
    
    applyTheme(appliedTheme);
  };

  // Toggle between light, dark, and system
  const toggleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    updateTheme(themeOrder[nextIndex]);
  };

  // Simple toggle between light and dark (for existing ThemeToggle component)
  const toggleLightDark = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  useEffect(() => {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || 'system';
    
    setTheme(initialTheme);
    
    let appliedTheme: 'light' | 'dark';
    
    if (initialTheme === 'system') {
      appliedTheme = getSystemTheme();
    } else {
      appliedTheme = initialTheme;
    }
    
    applyTheme(appliedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Update applied theme when theme preference changes
  useEffect(() => {
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
    toggleTheme,
    toggleLightDark,
    isSystemTheme: theme === 'system',
    isDark: resolvedTheme === 'dark'
  };
};