import { Dimensions, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { CommonSize } from './CommonSize';
import type { ThemeColors } from './ThemeTypes';

export const LIGHT_COLORS: ThemeColors = {
  Primary: 'rgba(157, 133, 240, 1)', // #ff4165 - Pink
  Secondary: 'rgba(255, 229, 234, 1)', // #ffe5ea - Light Pink
  Gradient: ['rgba(255, 229, 234, 1)', 'rgba(255, 65, 101, 1)'],
  UnselectedGradient: ['rgba(245, 245, 245, 1)', 'rgba(245, 245, 245, 1)'],
  BackgroundGradient: ['rgba(240, 236, 255, 1)', 'rgba(240, 236, 255, 1)'],
  ButtonGradient: ['rgba(157, 133, 240, 1)', 'rgba(157, 133, 240, 1)'],
  DisableButtonGradient: ['rgba(233, 235, 240, 1)', 'rgba(233, 235, 240, 1)'],
  DisableButtonBackground: 'rgba(184, 184, 184, 1)',
  White: 'rgba(255, 255, 255, 1)',
  Brown: 'rgba(68, 65, 66, 1)',
  DescriptionGray: 'rgba(108, 108, 108, 1)',
  Silver: 'rgba(130, 134, 147, 1)',
  Black: 'rgba(0, 0, 0, 0.9)',
  Blue: 'rgba(26, 120, 221, 1)',
  Gray: 'rgba(117, 124, 133, 1)',
  DisableText: 'rgb(109, 114, 120)',
  Placeholder: 'rgba(97, 106, 118, 1)',
  LightGray: 'rgb(218, 218, 218)',
  TabBarUnFocused: 'rgba(198, 198, 198, 1)',
  GradientViewForCards: ['rgba(217, 217, 217, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)'],
  LoaderGradient: [
    'rgba(161, 80, 255, 0.7)',
    'rgba(80, 80, 100, 0.3)',
    'rgba(161, 80, 255, 0.7)',
    'rgba(80, 80, 100, 0.3)',
    'rgba(180, 100, 255, 1)',
  ],
  Background: 'rgba(157, 133, 240, 1)',
  CardBackground: 'rgba(255, 255, 255, 1)',
  InputBackground: 'rgba(245, 245, 245, 1)',
  BorderColor: 'rgba(230, 230, 230, 1)',
  InputBorderColor: 'rgba(255, 255, 255, 0.2)',
  TitleText: 'rgba(157, 133, 240, 1)',
  TextColor: 'rgba(0, 0, 0, 0.9)',
  ButtonText: 'rgba(255,255,255,1)',
  SecondaryTextColor: 'rgba(108, 108, 108, 1)',
  ShadowColor: 'rgba(0, 0, 0, 0.1)',
  sheetBackground: ['rgba(255,255,255,1)', 'rgba(255,255,255,1)'],
  lightBackground: 'rgba(255,255,255,1)',
  editFiledBackground: ['rgba(255,255,255,1)', 'rgba(255,255,255,1)'],
  lightFiledBackground: 'rgba(240, 236, 255, 1)',
};

export const DARK_COLORS: ThemeColors = {
  Primary: 'rgba(161, 80, 255, 1)', // Purple from the dark theme images
  Secondary: 'rgba(74, 20, 140, 1)', // Darker purple
  Gradient: ['rgba(74, 20, 140, 1)', 'rgba(161, 80, 255, 1)'],
  UnselectedGradient: ['rgba(245, 245, 245, 1)', 'rgba(245, 245, 245, 1)'],
  BackgroundGradient: ['#1A0933', '#170729', '#230D45'],
  ButtonGradient: ['rgba(183, 34, 97, 1)', 'rgba(141, 71, 242, 1)'],
  DisableButtonGradient: ['rgba(60, 60, 70, 1)', 'rgba(60, 60, 70, 1)'],
  DisableButtonBackground: 'rgba(70, 70, 80, 1)',
  White: 'rgba(255, 255, 255, 1)',
  Brown: 'rgba(200, 200, 200, 1)', // Lighter in dark mode
  DescriptionGray: 'rgba(180, 180, 180, 1)',
  Silver: 'rgba(180, 184, 197, 1)',
  Black: 'rgba(0, 0, 0, 0.9)',
  Blue: 'rgba(86, 180, 255, 1)', // Brighter blue for dark mode
  Gray: 'rgba(170, 177, 186, 1)',
  DisableText: 'rgb(150, 155, 160)',
  Placeholder: 'rgba(150, 159, 171, 1)',
  LightGray: 'rgb(80, 80, 90)',
  TabBarUnFocused: 'rgba(120, 120, 120, 1)',
  GradientViewForCards: ['rgba(20, 20, 30, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)'],
  LoaderGradient: [
    'rgba(161, 80, 255, 0.7)',
    'rgba(80, 80, 100, 0.3)',
    'rgba(161, 80, 255, 0.7)',
    'rgba(80, 80, 100, 0.3)',
    'rgba(180, 100, 255, 1)',
  ],
  Background: 'transparent', // Dark background from images
  CardBackground: 'rgba(36, 36, 48, 1)',
  InputBackground: 'rgba(45, 45, 58, 1)',
  BorderColor: 'rgba(60, 60, 75, 1)',
  InputBorderColor: 'rgba(255, 255, 255, 0.2)',
  TitleText: 'rgb(255, 255, 255)',
  TextColor: 'rgb(255, 255, 255)',
  ButtonText: 'rgba(255,255,255,1)',
  SecondaryTextColor: 'rgba(180, 180, 180, 1)',
  ShadowColor: 'rgba(0, 0, 0, 0.3)',
  sheetBackground: ['rgba(18, 18, 19, 0.5)', 'rgba(18, 18, 19, 0.5)'],
  lightBackground: 'rgba(255, 255, 255, 0.1)',
  editFiledBackground: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'],
  lightFiledBackground: 'rgba(240, 236, 255, 1)',
};

export const FONTS = {
  Regular: 'OpenSans-Regular',
  Medium: 'OpenSans-Medium',
  Bold: 'OpenSans-Bold',
  SemiBold: 'OpenSans-SemiBold',
  ExtraBold: 'OpenSans-ExtraBold',
  Pacifico_Regular: 'Pacifico-Regular',
};

export const SIZES = {
  base: CommonSize(8),
  font: hp('1.8%'),
  radius: 25,
  subRadius: CommonSize(20),
  padding: CommonSize(24),

  // font sizes
  h1: hp('3.5%'),
  h2: hp('2.5%'),
  h3: hp('1.8%'),
  h4: 13,
  body1: hp('3.5%'),
  body2: hp('2.5%'),
  body3: 16,
  body4: 13,
  body5: 12,
};

export const COLORS: ThemeColors = LIGHT_COLORS;

export const GROUP_FONT = {
  h1: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h1,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h2,
    lineHeight: hp('3.5%'),
  },
  h3: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h3,
    lineHeight: hp('2.5%'),
  },
  h4: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h4,
    lineHeight: hp('2.5%'),
  },
  body1: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body2,
    lineHeight: hp('3.5%'),
  },
  body3: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body3,
    lineHeight: hp('2.5%'),
  },
  body4: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body4,
    lineHeight: hp('2.5%'),
  },
  body5: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body5,
    lineHeight: hp('2.5%'),
  },
};

export const deviceHeightWithStatusbar =
  Dimensions.get('window').height + (StatusBar?.currentHeight || 10);

export const BOTTOM_TAB_HEIGHT = hp('10%');

export default {
  COLORS,
  FONTS,
  SIZES,
  GROUP_FONT,
  LIGHT_COLORS,
  BOTTOM_TAB_HEIGHT,
  DARK_COLORS,
};
