import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White
  },
  SubContainerView: {
    marginHorizontal: hp('2.7%'),
    marginVertical: hp('1.5%'),
  },
  ContentView: {},
  AppLogoView: {
    marginTop: hp('2.7%'),
    justifyContent: 'center',
  },
  AppLogo: {
    width: hp('4.1%'),
    height: hp('4.1%'),
  },
  WelcomeTitleView: {
    marginVertical: CommonSize(15),
  },
  WelcomeText: {
    ...GROUP_FONT.h2,
  },
  WelcomeSubText: {
    ...GROUP_FONT.h4,
    color: COLORS.Gray,
    marginTop: CommonSize(3),
  },
  RulesListView: {},
  RulesListTitleView: {
    marginVertical: CommonSize(10),
  },
  RulesListTitleText: {
    ...GROUP_FONT.h3,
  },
  RulesListSubTitleText: {
    ...GROUP_FONT.body4,
    color: COLORS.Gray,
    fontFamily: FONTS.Medium,
  },
  LinkText: {
    color: COLORS.Blue,
  },
  BottomButton: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: CommonSize(10),
  },
});

export default styles;
