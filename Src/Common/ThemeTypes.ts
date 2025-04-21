export interface ThemeColors {
  Primary: string;
  Secondary: string;
  Gradient: string[];
  UnselectedGradient: string[];
  ButtonGradient: string[];
  BackgroundGradient: string[];
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
  InputBorderColor: string;
  TitleText: string;
  TextColor: string;
  ButtonText: string;
  SecondaryTextColor: string;
  ShadowColor: string;
  sheetBackground: string[];
  lightBackground: string;
  editFiledBackground: string[];
  lightFiledBackground: string;
}

export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themePreference: ThemeOption;
  setThemePreference: (preference: ThemeOption) => void;
  toggleTheme: () => void;
}
