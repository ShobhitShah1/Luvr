import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// import { setRootViewBackgroundColor } from '@pnthach95/react-native-root-view-background';
import { COLORS, DARK_COLORS } from '../Common/Theme';
import { ThemeOption } from '../Common/ThemeTypes';
import type { ThemeContextType } from '../Common/ThemeTypes';

const THEME_PREFERENCE_KEY = '@theme_preference';

const defaultContextValue: ThemeContextType = {
  colors: COLORS,
  isDark: false,
  themePreference: ThemeOption.SYSTEM,
  setThemePreference: () => {},
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = (): ThemeContextType => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeOption>(ThemeOption.SYSTEM);

  useEffect(() => {
    const loadThemePreference = async (): Promise<void> => {
      try {
        setThemePreference(systemColorScheme as ThemeOption);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  useEffect(() => {
    const saveThemePreference = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themePreference);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };

    saveThemePreference();
  }, [themePreference]);

  const isDark =
    themePreference === ThemeOption.DARK ||
    (themePreference === ThemeOption.SYSTEM && systemColorScheme === 'dark');

  const colors = isDark ? DARK_COLORS : COLORS;

  // useEffect(() => {
  //   setRootViewBackgroundColor(colors.Primary);
  // }, [colors.Primary]);

  const toggleTheme = (): void => {
    if (themePreference === ThemeOption.LIGHT) {
      setThemePreference(ThemeOption.DARK);
    } else if (themePreference === ThemeOption.DARK) {
      setThemePreference(ThemeOption.LIGHT);
    } else {
      // If system, switch to the opposite of current system mode
      setThemePreference(systemColorScheme === 'dark' ? ThemeOption.LIGHT : ThemeOption.DARK);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        isDark,
        themePreference,
        setThemePreference,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
