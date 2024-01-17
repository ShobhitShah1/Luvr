import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS, FONTS, GROUP_FONT, SIZES} from '../../Common/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  ContentView: {
    flex: 1,
    marginBottom: 10,
  },
  ListSubView: {
    width: '90%',
    alignSelf: 'center',
  },
  DetailContainerView: {
    marginTop: 15,
  },
  UserNumberStyle: {
    ...GROUP_FONT.body3,
    color: COLORS.Black,
    fontSize: 15,
    fontFamily: FONTS.Medium,
  },
  TitleViewStyle: {
    marginVertical: 0,
  },
  PhoneNumberView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  PhoneNumberFlexStyle: {
    marginVertical: 0,
  },
  NotificationFlexView: {
    marginVertical: 5,
  },
  RightIconView: {
    width: 35,
    height: 35,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234, 234, 234, 1)',
  },
  RightArrowIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
  },
  ShareFlexViewStyle: {
    marginVertical: 10,
  },
  GenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 5,
    paddingVertical: 10,
    // paddingHorizontal: 20,
  },
  GenderView: {
    padding: 0,
    backgroundColor: COLORS.White,
    height: hp('6.8%'),
    width: wp('85%'),
    borderRadius: SIZES.radius,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderColor: COLORS.White,
  },
  GenderText: {
    fontFamily: FONTS.Medium,
    color: COLORS.Gray,
    fontSize: hp('1.7%'),
  },
  DeleteAndLogoutContainerView: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DeleteAndLogoutButtonView: {
    width: '48%',
    height: 55,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.White,
  },
  DeleteAndLogoutButtonText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    color: COLORS.Black,
  },
  AppVersionView: {
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  AppVersionText: {
    ...GROUP_FONT.body4,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    color: COLORS.Black,
  },
});

export default styles;
