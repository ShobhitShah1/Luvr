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
    width: 145,
    height: 50,
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
