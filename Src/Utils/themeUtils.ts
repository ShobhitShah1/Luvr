import { COLORS, DARK_COLORS } from '../Common/Theme';
import type { ThemeColors } from '../Common/ThemeTypes';

/**
 * Helper function to get the appropriate color based on theme
 * @param colorName Color property name
 * @param isDark Whether dark mode is active
 * @returns Color value
 */
export const getColor = (colorName: keyof ThemeColors, isDark: boolean): string => {
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
