import { StyleSheet } from 'react-native';
import { FONTS, GROUP_FONT } from '../../Common/Theme';

export const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 70,
    height: '100%',
  },
  ChatContainer: {
    flex: 1,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composerTextInput: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
  },
  inputToolbarPrimary: {
    justifyContent: 'center',
  },
  inputToolbarAccessory: {
    width: '10%',
  },
  inputToolbarContainer: {
    padding: 0,
  },
  TimeStyle: {
    top: 5,
    fontSize: 11.5,
    fontFamily: FONTS.SemiBold,
  },
});
