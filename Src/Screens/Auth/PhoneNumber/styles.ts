import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, SIZES} from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  SubContainerView: {
    marginHorizontal: hp('2.7%'),
    marginVertical: hp('1.5%'),
  },
  NumberContainer: {
    justifyContent: 'center',

    marginHorizontal: hp('1.5%'),
    marginVertical: hp('1.5%'),
  },
  MyNumberTextView: {
    justifyContent: 'center',
  },
  MyNumberText: {
    color: COLORS.Primary,
    fontSize: hp('3%'),
    fontFamily: FONTS.Bold,
  },
  MyNumberSubText: {
    width: '95%',
    marginTop: hp('1%'),
    color: COLORS.Black,
    fontSize: hp('1.7%'),
    fontFamily: FONTS.Medium,
  },
  PhoneNumberView: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.9%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: hp('1.5%'),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
    justifyContent: 'space-between',
  },
  UserCountyAndCodeView: {
    width: '30%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: CommonSize(35),
  },
  UserNumberTextView: {
    width: '65%',
    justifyContent: 'center',
    alignSelf: 'center',
    top: CommonSize(-3.5),
    height: CommonSize(45),
    borderBottomWidth: CommonSize(2),
    borderBottomColor: COLORS.Black,
  },
  UserNumberTextStyle: {
    padding: 0,
    top: hp(0.8),
    fontSize: hp('2%'),
    color: COLORS.Black,
    alignContent: 'center',
    fontFamily: FONTS.SemiBold,
  },
  NumberChangesAlertText: {
    color: 'rgba(68, 65, 66, 1)',
    fontFamily: FONTS.Regular,
  },
  CountryCodeModalView: {
    width: '93%',
    height: hp('35%'),
    marginVertical: hp('4%'),
    backgroundColor: COLORS.White,
    alignSelf: 'center',
    borderRadius: SIZES.radius,
  },
  UpIcon: {
    width: hp('6%'),
    height: hp('6%'),
    padding: 0,
    position: 'absolute',
    left: hp('3.4%'),
    top: hp('-3.7%'),
  },
});

export default styles;
