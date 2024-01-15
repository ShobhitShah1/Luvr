import {StyleSheet} from 'react-native';
import {COLORS, FONTS, GROUP_FONT} from '../../Common/Theme';

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
});

export default styles;
