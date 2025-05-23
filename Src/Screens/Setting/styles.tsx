import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../Common/Theme';

const styles = StyleSheet.create({
  AppVersionText: {
    ...GROUP_FONT.body4,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  AppVersionView: {
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  ContentView: {
    flex: 1,
    marginBottom: 10,
  },
  CustomMarkerStyle: {
    backgroundColor: COLORS.White,
    borderColor: COLORS.Primary,
    borderRadius: 500,
    borderWidth: 1.5,
    height: 22,
    width: 22,
  },
  DeleteAndLogoutButtonText: {
    ...GROUP_FONT.h4,
    color: COLORS.Black,
    fontFamily: FONTS.SemiBold,
    fontSize: 13.5,
    textAlign: 'center',
  },
  DeleteAndLogoutButtonView: {
    alignSelf: 'center',
    borderRadius: 25,
    height: 55,
    justifyContent: 'center',
    width: '48%',
  },
  DeleteAndLogoutContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  DetailContainerView: {
    marginTop: 15,
  },
  DistanceAndAgeRangeTitleText: {
    ...GROUP_FONT.h3,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
    fontSize: 14.5,
    lineHeight: 25,
    textAlign: 'center',
  },
  DistanceAndAgeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  GenderButton: {
    alignItems: 'center',
    borderRadius: SIZES.radius,
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  GenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 5,
    paddingTop: 15,
    paddingVertical: 10,
    // paddingHorizontal: 20,
  },
  GenderText: {
    color: COLORS.Gray,
    fontFamily: FONTS.Medium,
    fontSize: hp('1.7%'),
  },
  GenderView: {
    alignItems: 'center',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    height: hp('6.8%'),
    justifyContent: 'center',
    padding: 0,
    textAlign: 'center',
    width: wp('85%'),
  },
  ListSubView: {
    alignSelf: 'center',
    width: '90%',
  },
  NotificationFlexView: {
    marginVertical: 5,
  },
  PhoneNumberFlexStyle: {
    marginVertical: 5,
  },
  PhoneNumberView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  RightArrowIcon: {
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  RightIconView: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(234, 234, 234, 1)',
    borderRadius: 100,
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
  ShareFlexViewStyle: {
    marginVertical: 8,
  },
  SliderContainer: {
    // alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Gray,
    paddingVertical: 1.5,
  },
  SliderContainerStyle: {
    justifyContent: 'center',
    margin: 0,
    overflow: 'visible',
  },
  TitleViewStyle: {
    marginVertical: 0,
  },
  UserAgeText: {
    ...GROUP_FONT.h3,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
    fontSize: 14.5,
    lineHeight: 25,
    textAlign: 'center',
  },
  UserNumberStyle: {
    ...GROUP_FONT.body3,
    color: COLORS.Black,
    fontFamily: FONTS.Medium,
    fontSize: 15,
  },
  container: {
    flex: 1,
  },
  incognitoButton: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  incognitoText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
  },
  incognitoView: {
    alignItems: 'center',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
});

export default styles;
