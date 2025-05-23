import { StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

import type { ThemeColors } from '../Common/ThemeTypes';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

const createThemedStyles = <T extends NamedStyles<T>>(
  styleFunction: (colors: ThemeColors, isDark: boolean) => T,
) => {
  return (colors: ThemeColors, isDark: boolean) => StyleSheet.create(styleFunction(colors, isDark));
};

export default createThemedStyles;
