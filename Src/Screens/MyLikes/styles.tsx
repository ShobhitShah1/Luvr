import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../Common/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  ContentView: {
    paddingVertical: 20,
  },
  TabBarButtonView: {
    width: '42%',
    height: 52,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 25,
  },
  TabBarButtonText: {
    textAlign: 'center',
    fontFamily: FONTS.SemiBold,
  },
});

export default styles;
