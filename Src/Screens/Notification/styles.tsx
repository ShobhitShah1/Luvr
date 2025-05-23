import { StyleSheet } from 'react-native';

import { COLORS, FONTS } from '../../Common/Theme';

const NO_NOTIFICATION_BACKGROUND = 160;

const styles = StyleSheet.create({
  EmptyListView: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
  },
  NoChatDescription: {
    color: COLORS.Black,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    justifyContent: 'center',
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  NoChatIcon: {
    height: NO_NOTIFICATION_BACKGROUND / 1.8,
    width: NO_NOTIFICATION_BACKGROUND / 1.8,
  },
  NoChatIconBackground: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.White,
    borderRadius: 100,
    height: NO_NOTIFICATION_BACKGROUND,
    justifyContent: 'center',
    marginVertical: 10,
    width: NO_NOTIFICATION_BACKGROUND,
  },
  NoChatText: {
    color: COLORS.Primary,
    fontFamily: FONTS.Bold,
    fontSize: 23,
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
  },
  NotificationViewContainer: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '90%',
  },
  container: {
    flex: 1,
  },
});

export default styles;
