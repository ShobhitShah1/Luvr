import {StyleSheet} from 'react-native';
import {CommonSize} from '../../../Common/CommonSize';
import {COLORS, FONTS, GROUP_FONT} from '../../../Common/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SubContainerView: {
    marginHorizontal: CommonSize(20),
    marginVertical: CommonSize(10),
  },
  ContentView: {},
  AppLogoView: {
    marginTop: CommonSize(20),
    justifyContent: 'center',
  },
  AppLogo: {
    width: CommonSize(30),
    height: CommonSize(30),
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
