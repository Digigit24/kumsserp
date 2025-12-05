import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Font = 'inter' | 'roboto' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
}

interface ThemeContextType {
  theme: Theme;
  font: Font;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  setFont: (font: Font) => void;
  setColors: (colors: ThemeColors) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultColors: ThemeColors = {
  primary: '221.2 83.2% 53.3%',
  secondary: '210 40% 96.1%',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  const [font, setFontState] = useState<Font>(() => {
    const saved = localStorage.getItem('font') as Font;
    return saved || 'inter';
  });

  const [colors, setColorsState] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem('colors');
    return saved ? JSON.parse(saved) : defaultColors;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--font-family', font);
    localStorage.setItem('font', font);

    // Apply font class
    root.classList.remove('font-inter', 'font-roboto', 'font-system');
    root.classList.add(`font-${font}`);
  }, [font]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    localStorage.setItem('colors', JSON.stringify(colors));
  }, [colors]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setFont = (newFont: Font) => {
    setFontState(newFont);
  };

  const setColors = (newColors: ThemeColors) => {
    setColorsState(newColors);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, font, colors, setTheme, setFont, setColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
