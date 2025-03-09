import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import {useColorScheme} from 'react-native';
import {setRootViewBackgroundColor} from '@pnthach95/react-native-root-view-background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, DARK_COLORS} from '../Common/Theme';
import {ThemeContextType, ThemeOption} from '../Common/ThemeTypes';

// Storage key for theme preference
const THEME_PREFERENCE_KEY = '@theme_preference';

// Default context value
const defaultContextValue: ThemeContextType = {
  colors: COLORS,
  isDark: false,
  themePreference: ThemeOption.SYSTEM,
  setThemePreference: () => {},
  toggleTheme: () => {},
};

// Create the context
export const ThemeContext =
  createContext<ThemeContextType>(defaultContextValue);

// Custom hook to use theme
export const useTheme = (): ThemeContextType => useContext(ThemeContext);

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeOption>(
    ThemeOption.SYSTEM,
  );

  // Initialize theme from storage
  useEffect(() => {
    const loadThemePreference = async (): Promise<void> => {
      try {
        const savedPreference = await AsyncStorage.getItem(
          THEME_PREFERENCE_KEY,
        );
        if (
          savedPreference &&
          Object.values(ThemeOption).includes(savedPreference as ThemeOption)
        ) {
          setThemePreference(savedPreference as ThemeOption);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
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

  // Determine if dark mode is active
  const isDark =
    themePreference === ThemeOption.DARK ||
    (themePreference === ThemeOption.SYSTEM && systemColorScheme === 'dark');

  // Get current theme colors
  const colors = isDark ? DARK_COLORS : COLORS;

  // Update root view background color when theme changes
  useEffect(() => {
    setRootViewBackgroundColor(colors.Secondary);
  }, [colors.Secondary]);

  // Toggle between light and dark themes
  const toggleTheme = (): void => {
    if (themePreference === ThemeOption.LIGHT) {
      setThemePreference(ThemeOption.DARK);
    } else if (themePreference === ThemeOption.DARK) {
      setThemePreference(ThemeOption.LIGHT);
    } else {
      // If system, switch to the opposite of current system mode
      setThemePreference(
        systemColorScheme === 'dark' ? ThemeOption.LIGHT : ThemeOption.DARK,
      );
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
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
