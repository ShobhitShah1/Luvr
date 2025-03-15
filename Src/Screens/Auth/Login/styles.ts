import { Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS, FONTS, GROUP_FONT, SIZES } from '../../../Common/Theme';
import createThemedStyles from '../../../Hooks/createThemedStyles';

const styles = createThemedStyles((colors) => ({
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
    maxHeight: '20%',
    zIndex: 99999999999,
    justifyContent: 'center',
    paddingHorizontal: hp('3%'),
    marginVertical: Platform.OS === 'ios' ? hp('1%') : hp('6%'),
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
    // backgroundColor: colors.Background,
    marginHorizontal: hp('3%'),
    borderRadius: SIZES.radius,
    marginBottom: hp('5%'),
    paddingVertical: 0,
    paddingTop: hp('1%'),
    paddingBottom: hp('2%'),
    zIndex: 999999999999,
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
    // top: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 10,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: COLORS.White,
  },
  FollowTickMark: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
    tintColor: COLORS.White,
    justifyContent: 'center',
  },
}));

export default styles;
