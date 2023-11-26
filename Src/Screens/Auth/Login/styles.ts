import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    zIndex: 9999,
    justifyContent: 'space-between',
  },
  ContentView: {
    flexGrow: 1,
  },
  AppNameTitleView: {
    paddingHorizontal: hp('3%'),
    marginVertical: hp('3%'),
    justifyContent: 'center',
    maxHeight: '20%',
  },
  AppNameTitle: {
    ...GROUP_FONT.h1,
    color: COLORS.White,
  },
  LoginAndSignInTitleTextView: {
    alignSelf: 'center',
  },
  ButtonView: {
    paddingVertical: hp('1%')
  },
  LoginBoxContainer: {
    overflow: 'hidden',
    padding: hp('3%'),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: hp('3%'),
    borderRadius: SIZES.radius,
    marginBottom: hp('3%'),
    paddingVertical: 0,
    paddingTop: hp('1%'),
    paddingBottom: hp('2%'),
  },
  LoginTitleText: {
    textAlign: 'center',
    ...GROUP_FONT.h2,
    color: COLORS.White,
  },
  SignInTitleText: {
    textAlign: 'center',
    ...GROUP_FONT.body3,
    color: COLORS.White,
  },
  TermsView: {
    marginTop: hp('1.5%'),
  },
  TermsViewText: {
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: hp('1.5%'),
    color: COLORS.White,
  },
  UnderLineText: {
    fontFamily: FONTS.Bold,
    textDecorationLine: 'underline',
  },
});

export default styles;
