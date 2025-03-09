// Define color theme structure
export interface ThemeColors {
  Primary: string;
  Secondary: string;
  Gradient: string[];
  ButtonGradient: string[];
  DisableButtonGradient: string[];
  DisableButtonBackground: string;
  White: string;
  Brown: string;
  DescriptionGray: string;
  Silver: string;
  Black: string;
  Blue: string;
  Gray: string;
  DisableText: string;
  Placeholder: string;
  LightGray: string;
  TabBarUnFocused: string;
  GradientViewForCards: string[];
  LoaderGradient: string[];
  Background: string;
  CardBackground: string;
  InputBackground: string;
  BorderColor: string;
  TextColor: string;
  SecondaryTextColor: string;
  ShadowColor: string;
}

// Theme preference options
export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

// Theme context state type
export interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themePreference: ThemeOption;
  setThemePreference: (preference: ThemeOption) => void;
  toggleTheme: () => void;
}
