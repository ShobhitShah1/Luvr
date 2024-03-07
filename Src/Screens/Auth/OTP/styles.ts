import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS} from '../../../Common/Theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
});

export default styles;
