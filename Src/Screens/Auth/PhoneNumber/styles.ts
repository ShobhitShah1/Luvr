import {GROUP_FONT} from './../../../Common/Theme';
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
    paddingBottom: hp('1%'),
    marginHorizontal: hp('2.7%'),
  },
  NumberContainer: {
    justifyContent: 'center',

    marginHorizontal: hp('1.5%'),
    marginVertical: hp('1%'),
  },
  MyNumberTextView: {
    justifyContent: 'center',
  },
  MyNumberText: {
    color: COLORS.Primary,
    fontSize: hp('3.3%'),
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
    alignSelf: 'center',
    top: CommonSize(-3.5),
    height: CommonSize(45),
    justifyContent: 'center',
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
    alignSelf: 'center',
    marginVertical: hp('4%'),
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.White,
  },
  UpIcon: {
    padding: 0,
    width: hp('6%'),
    top: hp('-3.7%'),
    left: hp('3.4%'),
    height: hp('6%'),
    position: 'absolute',
  },
  CountyListView: {
    height: '75%',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: hp('2%'),
  },
  SelectCountryView: {
    height: '25%',
    padding: hp('2%'),
  },
  SearchCountryView: {
    width: '95%',
    height: hp('5%'),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: hp('2%'),
    backgroundColor: 'rgba(234, 234, 234, 1)',
  },
  SearchCountryText: {
    padding: 0,
    width: '90%',
    ...GROUP_FONT.h4,
    color: COLORS.Black,
  },
  SearchIcon: {
    justifyContent: 'center',
    width: '10%',
  },
  ListEmptyView: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ListEmptyText: {
    ...GROUP_FONT.h3,
    color: COLORS.Black,
    textAlign: 'center',
  },
  SearchIconStyle: {
    width: 18,
    height: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default styles;
