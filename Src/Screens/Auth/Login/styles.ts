import {Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../../Common/Theme';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    zIndex: 9999,
    justifyContent: 'space-between',
  },
  BGImageStyle: {
    flex: 1,
  },
  ContentView: {
    flexGrow: 1,
  },
  ScrollViewContainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  AppNameTitleView: {
    paddingHorizontal: hp('3%'),
    marginVertical: Platform.OS === 'ios' ? hp('1%') : hp('3%'),
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
    paddingVertical: hp('1%'),
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
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  TermsViewText: {
    textAlign: 'left',
    fontFamily: FONTS.Medium,
    fontSize: hp('1.5%'),
    color: COLORS.White,
  },
  UnderLineText: {
    fontFamily: FONTS.Bold,
    textDecorationLine: 'underline',
  },
  FollowButtonView: {
    width: 23,
    height: 23,
    top: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: COLORS.White,
  },
  FollowTickMark: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: COLORS.White,
  },
});

export default styles;
