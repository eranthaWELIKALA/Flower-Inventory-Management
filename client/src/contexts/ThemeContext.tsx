import { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

const defaultThemes: Theme[] = [
  {
    name: 'Green Garden',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#60a5fa',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#fffbeb',
      surface: '#ffffff',
      text: '#1c1917',
      textSecondary: '#78716c',
      border: '#f3f4f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Purple Dreams',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#1e1b4b',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Dark Mode',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
  updateTheme: (colors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes] = useState<Theme[]>(defaultThemes);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('flower-shop-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
        setCurrentTheme(defaultThemes[0]);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Save theme to localStorage
    localStorage.setItem('flower-shop-theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const updateTheme = (colors: Partial<ThemeColors>) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, ...colors }
    }));
  };

  const resetTheme = () => {
    setCurrentTheme(defaultThemes[0]);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      themes, 
      setTheme, 
      updateTheme, 
      resetTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

