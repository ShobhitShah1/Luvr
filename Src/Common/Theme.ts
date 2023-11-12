import {CommonSize} from './CommonSize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const COLORS = {
  Primary: 'rgba(244, 68, 135, 1)',
  Secondary: 'rgba(238, 128, 95, 1)',
  Gradient: ['rgba(238, 128, 95, 1)', 'rgba(244, 68, 135, 1)'],
  ButtonGradient: ['rgba(234, 64, 128, 1)', 'rgba(238, 128, 95, 1)'],
  DisableButtonGradient: ['rgba(233, 235, 240, 1)', 'rgba(233, 235, 240, 1)'], 
  White: 'rgba(255, 255, 255, 1)',
  Brown: 'rgba(68, 65, 66, 1)',
  Silver: 'rgba(130, 134, 147, 1)',
  Black: 'rgba(0, 0, 0, 0.9)',
  Blue: 'rgba(26,120,221,255)', //* Use For UnderLine And Link Text's
  Gray: 'rgba(117,124,133,255)',
  DisableText: 'rgb(109, 114, 120)',
  Placeholder: 'rgba(97,106,118,255)',
};

export const FONTS = {
  // Light: 'GothamRounded-Light',
  // Regular: 'GothamRoundedBook_21018',
  // Medium: 'GothamRounded-Medium',
  // Bold: 'GothamRounded-Bold',
  // SemiBold: 'OpenSans-SemiBold',
  // ExtraBold: null,

  Light: 'OpenSans-Light',
  Regular: 'OpenSans-Regular',
  Medium: 'OpenSans-Medium',
  Bold: 'OpenSans-Bold',
  SemiBold: 'OpenSans-SemiBold',
  ExtraBold: 'OpenSans-ExtraBold',
};

export const SIZES = {
  base: CommonSize(8),
  font: hp('1.8%'),
  radius: CommonSize(12),
  subRadius: CommonSize(20),
  padding: CommonSize(24),

  // font sizes
  h1: hp('3.5%'),
  h2: hp('2.5%'),
  h3: hp('1.8%'),
  h4: hp('1.6%'),
  body1: hp('3.5%'),
  body2: hp('2.5%'),
  body3: 16,
  body4: hp('1.6%'),
  body5: 12,
};

export const GROUP_FONT = {
  h1: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h1,
    lineHeight: 36,
    color: COLORS.Black,
  },
  h2: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h2,
    lineHeight: hp('3.5%'),
    color: COLORS.Black,
  },
  h3: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h3,
    lineHeight: hp('2.5%'),
    color: COLORS.Black,
  },
  h4: {
    fontFamily: 'OpenSans-Bold',
    fontSize: SIZES.h4,
    lineHeight: hp('2.5%'),

    color: COLORS.Black,
  },
  body1: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
    color: COLORS.Black,
  },
  body2: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body2,
    lineHeight: hp('3.5%'),
    color: COLORS.Black,
  },
  body3: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body3,
    lineHeight: hp('2.5%'),
    color: COLORS.Black,
  },
  body4: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body4,
    lineHeight: hp('2.5%'),
    color: COLORS.Black,
  },
  body5: {
    fontFamily: 'OpenSans-Regular',
    fontSize: SIZES.body5,
    lineHeight: hp('2.5%'),
    color: COLORS.Black,
  },
};

export const ActiveOpacity = 0.8;

export default {
  COLORS,
  FONTS,
  ActiveOpacity,
  SIZES,
  GROUP_FONT,
};
