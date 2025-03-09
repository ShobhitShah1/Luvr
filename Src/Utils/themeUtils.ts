import {StyleProp, ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {COLORS, DARK_COLORS} from '../Common/Theme';
import {ThemeColors} from '../Common/ThemeTypes';

/**
 * Helper to create styles that depend on the theme
 * @param lightStyleFn Function to create light theme styles
 * @param darkStyleFn Function to create dark theme styles
 * @returns Function that returns appropriate styles based on theme
 */
export const createThemedStyles = <
  T extends Record<string, StyleProp<ViewStyle | TextStyle | ImageStyle>>,
>(
  lightStyleFn: (colors: ThemeColors) => T,
  darkStyleFn: (colors: ThemeColors) => T,
): ((isDark: boolean) => T) => {
  return (isDark: boolean) =>
    isDark ? darkStyleFn(DARK_COLORS) : lightStyleFn(COLORS);
};

/**
 * Helper function to get the appropriate color based on theme
 * @param colorName Color property name
 * @param isDark Whether dark mode is active
 * @returns Color value
 */
export const getColor = (
  colorName: keyof ThemeColors,
  isDark: boolean,
): string => {
  const color = isDark ? DARK_COLORS[colorName] : COLORS[colorName];
  return Array.isArray(color) ? color.join(', ') : color;
};

/**
 * Utility to quickly get themed colors in components without hooks
 * @param isDark Whether dark mode is active
 * @returns Theme colors object
 */
export const getThemedColors = (isDark: boolean): ThemeColors => {
  return isDark ? DARK_COLORS : COLORS;
};
