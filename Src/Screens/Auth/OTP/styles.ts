import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  SubContainerView: {
    marginHorizontal: hp('2.7%'),
    marginVertical: hp('1.5%'),
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  CodeAndNumberView: {
    marginVertical: CommonSize(5),
    marginHorizontal: hp('2.7%'),
  },
  MyCodeText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
    fontFamily: FONTS.Bold,
  },
  DescText: {
    marginVertical: hp('1.5%'),
    fontSize: hp('1.8%'),
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
  },
  NumberText: {
    marginVertical: hp('1.5%'),
    fontSize: hp('1.9%'),
    fontFamily: FONTS.Bold,
    color: COLORS.Primary,
    textDecorationLine: 'underline',
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  VerifyOTPButtonView: {
    width: '90%',
    alignSelf: 'center',
    top: hp('5.9%'),
    justifyContent: 'center',
  },
  ResendView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  NoCodeText: {
    fontSize: hp('1.7%'),
    fontFamily: FONTS.Medium,
    color: COLORS.Black,
  },
  ResendText: {
    fontSize: hp('1.6%'),
    fontFamily: FONTS.Bold,
    color: COLORS.Primary,
    textDecorationLine: 'underline',
    paddingTop: hp(0.5),
  },
  OTPContainerStyle: {
    zIndex: 9999,
    marginHorizontal: 20,
    marginVertical: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  OTPCellStyle: {
    width: hp(6.2),
    height: hp(6.2),
    marginLeft: hp(2),
    marginRight: hp(2),
    borderRadius: 500,
    backgroundColor: COLORS.White,
  },
  OTPCellStyleFocused: {
    borderWidth: 1,
    borderColor: COLORS.Primary,
  },
  OTPCellStyleFilled: {
    backgroundColor: COLORS.Primary,
    borderColor: COLORS.White,
    borderWidth: 1,
  },
  OTPTextStyle: {
    textAlign: 'center',
    ...GROUP_FONT.h4,
    fontSize: hp('2%'),
    color: COLORS.White,
  },
  OTPTextStyleFocused: {
    textAlign: 'center',
    ...GROUP_FONT.h4,
    fontSize: hp('2%'),
    color: COLORS.White,
  },
});

export default styles;
