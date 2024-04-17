import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../Common/Theme';

let NO_NOTIFICATION_BACKGROUND = 160;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Secondary,
  },
  NotificationViewContainer: {
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  EmptyListView: {
    flex: 1,
    marginBottom: 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  NoChatIconBackground: {
    width: NO_NOTIFICATION_BACKGROUND,
    height: NO_NOTIFICATION_BACKGROUND,
    borderRadius: 100,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.White,
  },
  NoChatIcon: {
    width: NO_NOTIFICATION_BACKGROUND / 1.8,
    height: NO_NOTIFICATION_BACKGROUND / 1.8,
  },
  NoChatText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
    fontFamily: FONTS.Bold,
    fontSize: 23,
    color: COLORS.Primary,
  },
  NoChatDescription: {
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: FONTS.Regular,
    fontSize: 15,
    paddingHorizontal: 5,
    color: COLORS.Black,
  },
});

export default styles;
