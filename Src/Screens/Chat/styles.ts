import { StyleSheet } from 'react-native';

import { FONTS, GROUP_FONT } from '../../Common/Theme';

export const styles = StyleSheet.create({
  ChatContainer: {
    flex: 1,
    height: '100%',
  },
  Container: {
    flex: 1,
  },
  TimeStyle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 11.5,
    top: 5,
  },
  composerTextInput: {
    ...GROUP_FONT.h3,
    fontFamily: FONTS.SemiBold,
  },
  inputToolbarAccessory: {
    width: '10%',
  },
  inputToolbarContainer: {
    padding: 0,
  },
  inputToolbarPrimary: {
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  messagesContainer: {
    height: '100%',
    paddingBottom: 70,
  },
});
