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
    backgroundColor: COLORS.White,
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
    fontSize: hp('2.7%'),
    fontFamily: FONTS.Bold,
    color: COLORS.Black,
  },
  NumberText: {
    marginVertical: hp('1.5%'),
    fontSize: hp('1.9%'),
    fontFamily: FONTS.Medium,
    color: COLORS.Silver,
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  VerifyOTPButtonView: {
    width: '90%',
    alignSelf: 'center',
    top: hp('4.1%'),
    justifyContent: 'center',
  },
});

export default styles;
