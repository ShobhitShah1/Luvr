import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import type { ThemeColors } from '../Common/ThemeTypes';
import { useTheme } from '../Contexts/ThemeContext';

// Define the style creator function type
type StyleCreator<T> = (colors: ThemeColors, isDark: boolean) => T;

// Define possible style types
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * A hook to create themed styles
 * @param styleCreator Function that creates styles using theme colors
 * @returns StyleSheet styles
 */
export function useThemedStyles<T extends NamedStyles<T> | NamedStyles<any>>(
  styleCreator: StyleCreator<T>,
): T {
  const { colors, isDark } = useTheme();

  // Memoize the styles to avoid unnecessary re-renders
  return useMemo(() => {
    // Create styles with theme colors available
    const styles = styleCreator(colors, isDark);

    // Create StyleSheet from the styles
    return StyleSheet.create(styles);
  }, [styleCreator, colors, isDark]);
}
