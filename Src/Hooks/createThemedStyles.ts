import { ThemeColors } from '../Common/ThemeTypes';
import { ViewStyle, TextStyle, ImageStyle, StyleSheet } from 'react-native';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

const createThemedStyles = <T extends NamedStyles<T>>(styleFunction: (colors: ThemeColors, isDark: boolean) => T) => {
  return (colors: ThemeColors, isDark: boolean) => StyleSheet.create(styleFunction(colors, isDark));
};

export default createThemedStyles;
