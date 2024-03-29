import {StyleSheet} from 'react-native';
import {COLORS} from '../../Common/Theme';

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
});

export default styles;
